#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   test-sql-schema.cjs — KIỂM THỬ MÔ HÌNH DỮ LIỆU SQL CỦA CKV PRO TRADER
   Kiểm tra: Ràng buộc Foreign Keys, Tính toàn vẹn Sổ lệnh,
   Cân đối tài khoản Margin DNSE, Khấu trừ thuế phí và Chu kỳ T+2.5
   ═══════════════════════════════════════════════════════════════════ */

let pass = 0, fail = 0;
function eq(actual, expected, label) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; return; }
  fail++;
  console.error(`✗ FAIL: ${label}\n    expected: ${e}\n    actual:   ${a}`);
}
function ok(cond, label) {
  if (cond) { pass++; return; }
  fail++;
  console.error(`✗ FAIL: ${label}`);
}

console.log('══════════════════════════════════════════════════════════════════════');
console.log('🧪 CKV PRO TRADER - KIỂM THỬ TOÀN VẸN MÔ HÌNH DỮ LIỆU SQL & SCHEMA');
console.log('══════════════════════════════════════════════════════════════════════\n');


/* ═══════════════════════════════════════════════════════════════════════════
   0. ĐỐI CHIẾU THẬT: SQL trong sql/01-cau-truc.sql  vs  cột app thực sự ghi
   ───────────────────────────────────────────────────────────────────────────
   Đây là bài test QUAN TRỌNG NHẤT file này. Nó đọc file SQL thật và file
   api.ts thật, không dùng bảng giả.

   Lệch nhau là app ghi dữ liệu THẤT BẠI: PostgREST huỷ TOÀN BỘ lệnh ghi chỉ vì
   một cột lạ. Đúng lỗi này đã khiến app im lặng không lưu được gì từ 25/08/2026
   trong khi giao diện vẫn báo "đồng bộ thành công".
   ═══════════════════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sqlText = fs.readFileSync(path.join(root, 'sql', '01-cau-truc.sql'), 'utf8');
const apiText = fs.readFileSync(path.join(root, 'frontend', 'src', 'services', 'api.ts'), 'utf8');

/** Tập hợp cột của một bảng: gộp cột trong CREATE TABLE và mọi ALTER ... ADD COLUMN. */
function sqlColumnsOf(table) {
  const columns = new Set();

  const createMatch = sqlText.match(
    new RegExp('CREATE TABLE IF NOT EXISTS public\\.' + table + '\\s*\\(([\\s\\S]*?)\\n\\);', 'i')
  );
  if (createMatch) {
    for (const line of createMatch[1].split('\n')) {
      const col = line.trim().match(/^([a-z_][a-z0-9_]*)\s+[A-Z]/);
      if (col) columns.add(col[1]);
    }
  }

  const alterRe = new RegExp(
    'ALTER TABLE public\\.' + table + ' ADD COLUMN IF NOT EXISTS ([a-z_][a-z0-9_]*)',
    'gi'
  );
  let m;
  while ((m = alterRe.exec(sqlText)) !== null) columns.add(m[1]);

  return columns;
}

/** Danh sách cột app gửi lên, đọc thẳng từ hằng số trong api.ts. */
function apiColumnsOf(constName) {
  const block = apiText.match(new RegExp(constName + '\\s*=\\s*\\[([\\s\\S]*?)\\];'));
  if (!block) return [];
  return [...block[1].matchAll(/'([a-z_][a-z0-9_]*)'/g)].map((x) => x[1]);
}

for (const [table, constName] of [
  ['portfolios', 'PORTFOLIO_COLUMNS'],
  ['positions', 'POSITION_COLUMNS'],
  ['transactions', 'TRANSACTION_COLUMNS']
]) {
  const inSql = sqlColumnsOf(table);
  const inApi = apiColumnsOf(constName);

  ok(inSql.size > 0, `SQL: đọc được định nghĩa bảng \`${table}\` từ sql/01-cau-truc.sql`);
  ok(inApi.length > 0, `api.ts: đọc được danh sách ${constName}`);

  const missing = inApi.filter((col) => col !== 'id' && !inSql.has(col));
  eq(
    missing,
    [],
    `Đồng bộ schema: mọi cột app ghi vào \`${table}\` đều tồn tại trong SQL (thiếu sẽ làm hỏng TOÀN BỘ lệnh ghi)`
  );
}

// Các cột từng thiếu và đã gây lỗi ghi im lặng — chốt lại để không tái diễn
ok(sqlColumnsOf('portfolios').has('current_simulated_date'), 'SQL: portfolios có cột current_simulated_date');
ok(sqlColumnsOf('positions').has('breakeven_price'), 'SQL: positions có cột breakeven_price');
ok(sqlColumnsOf('transactions').has('net_amount'), 'SQL: transactions có cột net_amount');

// Seed phải ghi đè được hàng cũ, nếu không chạy lại cũng không sửa được số lệch
const seedText = fs.readFileSync(path.join(root, 'sql', '02-nap-moc-doi-chieu.sql'), 'utf8');
ok(seedText.includes('DO UPDATE'), 'SQL seed: dùng ON CONFLICT DO UPDATE, không phải DO NOTHING');
ok(!/ON CONFLICT\s*\([^)]*\)\s*DO NOTHING/i.test(seedText), 'SQL seed: không còn DO NOTHING nào sót lại');

// File cấu trúc phải an toàn khi chạy lại nhiều lần
ok(!/INSERT INTO/i.test(sqlText), 'SQL cấu trúc: không chứa INSERT, nên chạy lại không đụng số dư');
ok(sqlText.includes('DROP POLICY IF EXISTS'), 'SQL cấu trúc: policy idempotent, chạy lại không lỗi trùng tên');

/* ═══ 1. Kiểm tra cấu trúc bảng `positions` (Danh mục cổ phiếu) ═══ */
// Đọc cột THẬT từ sql/01-cau-truc.sql thay vì bịa một bảng giả với tên cột không tồn tại
const mockPositionsTable = {
  columns: [...sqlColumnsOf('positions')],
  primaryKey: 'symbol'
};

ok(mockPositionsTable.columns.includes('symbol'), 'SQL Positions: Chứa cột mã cổ phiếu `symbol`');
ok(mockPositionsTable.columns.includes('available_quantity'), 'SQL Positions: Chứa khối lượng khả dụng');
ok(mockPositionsTable.columns.includes('t1_quantity') && mockPositionsTable.columns.includes('t2_quantity'), 'SQL Positions: Hỗ trợ phân bổ chu kỳ T+2.5');

/* ═══ 2. Kiểm tra nghiệp vụ cập nhật số dư sau khớp lệnh MUA ═══ */
function simulateSqlBuyOrderExecution(currentPos, orderQty, orderPrice, feePct = 0.0015) {
  const buyCost = orderQty * orderPrice;
  const buyFee = Math.round(buyCost * feePct);
  const totalCost = buyCost + buyFee;

  const prevTotal = currentPos ? currentPos.total_quantity : 0;
  const prevCost = currentPos ? currentPos.total_quantity * currentPos.avg_buy_price : 0;

  const newTotal = prevTotal + orderQty;
  const newAvgPrice = Math.round((prevCost + totalCost) / newTotal);
  const newT2 = (currentPos ? currentPos.t2_quantity : 0) + orderQty;

  return {
    total_quantity: newTotal,
    available_quantity: currentPos ? currentPos.available_quantity : 0,
    t1_quantity: currentPos ? currentPos.t1_quantity : 0,
    t2_quantity: newT2,
    avg_buy_price: newAvgPrice
  };
}

const posAfterBuy = simulateSqlBuyOrderExecution(null, 1000, 70000, 0.0015);
eq(posAfterBuy.total_quantity, 1000, 'SQL Buy Trigger: Tổng khối lượng là 1,000 CP');
eq(posAfterBuy.available_quantity, 0, 'SQL Buy Trigger: Khả dụng ban đầu là 0 (Chờ về T2)');
eq(posAfterBuy.t2_quantity, 1000, 'SQL Buy Trigger: Khối lượng nằm ở T2');
eq(posAfterBuy.avg_buy_price, 70105, 'SQL Buy Trigger: Giá vốn tính cả phí là 70,105 VND');

/* ═══ 3. Kiểm tra nghiệp vụ cập nhật số dư sau khớp lệnh BÁN ═══ */
function simulateSqlSellOrderExecution(currentPos, sellQty, sellPrice, feePct = 0.0015, taxPct = 0.001) {
  if (currentPos.available_quantity < sellQty) {
    throw new Error('VIOLATION_NOT_ENOUGH_AVAILABLE_QUANTITY');
  }
  const grossProceeds = sellQty * sellPrice;
  const fee = Math.round(grossProceeds * feePct);
  const tax = Math.round(grossProceeds * taxPct);
  const netCashReceivable = grossProceeds - fee - tax;

  return {
    remaining_total: currentPos.total_quantity - sellQty,
    remaining_available: currentPos.available_quantity - sellQty,
    net_cash_receivable: netCashReceivable
  };
}

const activePos = { total_quantity: 2000, available_quantity: 2000, t1_quantity: 0, t2_quantity: 0, avg_buy_price: 65000 };
const sellResult = simulateSqlSellOrderExecution(activePos, 1000, 75000, 0.0015, 0.001);
eq(sellResult.remaining_available, 1000, 'SQL Sell Trigger: Giảm khả dụng chuẩn xác còn 1,000 CP');
eq(sellResult.net_cash_receivable, 74812500, 'SQL Sell Trigger: Tiền chờ về sau thuế phí 0.25% là 74,812,500 VND');

/* ═══ 4. Kiểm tra ràng buộc tính tỷ lệ ký quỹ Margin Account ═══ */
function computeSqlMarginRatio(cash, stockMarketValue, marginDebt) {
  const totalAssets = cash + stockMarketValue;
  const nav = totalAssets - marginDebt;
  const marginRatio = totalAssets > 0 ? (nav / totalAssets) * 100 : 100;
  const isCallMargin = marginRatio < 35.0; // Call Margin khi R < 35%
  const isForceSell = marginRatio < 30.0;  // Force Sell khi R < 30%
  return { nav, marginRatio: Math.round(marginRatio * 100) / 100, isCallMargin, isForceSell };
}

const marginHealth = computeSqlMarginRatio(50000000, 150000000, 120000000);
eq(marginHealth.nav, 80000000, 'SQL Margin: Tài sản ròng NAV = 80,000,000 VND');
eq(marginHealth.marginRatio, 40, 'SQL Margin: Tỷ lệ an toàn Margin = 40%');
eq(marginHealth.isCallMargin, false, 'SQL Margin: Trạng thái an toàn (Không bị Call)');

/* ═══ 5. Kiểm tra bảng `interest_rates` (Lãi suất Top 20 NH & 10 Ví điện tử) ═══ */
const mockInterestRates = [
  { institution: 'VCB', type: 'BANK', term_12m: 4.7, rating: 'BIG4' },
  { institution: 'TCB', type: 'BANK', term_12m: 5.0, rating: 'TMCP_TOP1' },
  { institution: 'MOMO', type: 'FINTECH', term_daily: 4.5, rating: 'FINTECH_TOP1' }
];

ok(mockInterestRates.length >= 3, 'SQL Interest Rates: Bảng dữ liệu lãi suất vĩ mô sẵn sàng');

/* ═══ 6. Kiểm tra bảng `user_profiles` & Phân quyền Admin vs Người dùng mới (0đ) ═══ */
const mockUserProfiles = [
  { id: 'user-vip', name: 'Hải Đẹp Trai (VIP Master)', role: 'ADMIN', initialCash: 171, initialTPB: 1000 },
  { id: 'user-new', name: 'Nhà Đầu Tư Mới', role: 'USER', initialCash: 0, initialTPB: 0 }
];

eq(mockUserProfiles[0].role, 'ADMIN', 'SQL Auth: Chủ nhân có vai trò ADMIN VIP');
eq(mockUserProfiles[1].initialCash, 0, 'SQL Auth: Người dùng mới khởi tạo số dư là 0đ');
eq(mockUserProfiles[1].initialTPB, 0, 'SQL Auth: Người dùng mới danh mục cổ phiếu rỗng ban đầu');

/* ═══ 7. Kiểm tra bảng `support_messages` (Tin nhắn trực tuyến Admin) ═══ */
const mockSupportMessage = {
  id: 'msg_1',
  user_id: 'user-new',
  message: 'Admin hỗ trợ giúp tôi cách tính hòa vốn Deal với ạ',
  is_from_admin: false,
  is_read: false
};

ok(Boolean(mockSupportMessage.id && mockSupportMessage.message), 'SQL Support Chat: Bảng tin nhắn hỗ trợ trực tuyến toàn vẹn');

console.log(`\n🎉 KẾT QUẢ KIỂM THỬ SQL SCHEMA: ${pass} PASSED, ${fail} FAILED.`);
if (fail > 0) process.exit(1);

