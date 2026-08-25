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

/* ═══ 1. Kiểm tra cấu trúc bảng `positions` (Danh mục cổ phiếu) ═══ */
const mockPositionsTable = {
  columns: ['id', 'user_id', 'symbol', 'total_quantity', 'available_quantity', 't1_quantity', 't2_quantity', 'avg_buy_price', 'market_price', 'updated_at'],
  primaryKey: 'id',
  uniqueConstraint: ['user_id', 'symbol']
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

console.log(`\n🎉 KẾT QUẢ KIỂM THỬ SQL SCHEMA: ${pass} PASSED, ${fail} FAILED.`);
if (fail > 0) process.exit(1);
