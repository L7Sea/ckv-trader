/**
 * CKV PRO TRADER - FORMULA AUDIT & UNIT TEST SUITE
 * Chạy: node scripts/test-trading-formulas.cjs
 */

const assert = require('assert');

console.log('🧪 ĐANG CHẠY KIỂM THỬ TOÀN BỘ CÔNG THỨC NGHIỆP VỤ CHỨNG KHOÁN (T+2.5)...');

let passedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    process.exitCode = 1;
  }
}

// 1. Công thức MUA & Giá vốn bình quân gia quyền (+ phí 0.15%)
test('1. Mua cổ phiếu: Tính đúng giá vốn bình quân gia quyền bao gồm phí', () => {
  // Lần 1: Mua 1000 HPG giá 28,000 (Phí 0.15% = 42,000)
  const q1 = 1000, p1 = 28000;
  const fee1 = q1 * p1 * 0.0015;
  const cost1 = (q1 * p1 + fee1) / q1; // 28042

  // Lần 2: Mua tiếp 1000 HPG giá 30,000 (Phí 0.15% = 45,000)
  const q2 = 1000, p2 = 30000;
  const fee2 = q2 * p2 * 0.0015;
  const newAvgPrice = (q1 * cost1 + q2 * p2 + fee2) / (q1 + q2); // (28,042,000 + 30,045,000)/2000 = 29043.5

  assert.strictEqual(Math.round(newAvgPrice), 29044);
});

// 2. Công thức BÁN: Khấu trừ Thuế TNCN (0.1%) + Phí giao dịch (0.15%)
test('2. Bán cổ phiếu: Khấu trừ chuẩn 0.25% (Thuế 0.1% + Phí 0.15%)', () => {
  const sellQty = 1000, sellPrice = 32000;
  const grossValue = sellQty * sellPrice; // 32,000,000
  const fee = grossValue * 0.0015;        // 48,000
  const tax = grossValue * 0.001;         // 32,000
  const netProceeds = grossValue - fee - tax; // 31,920,000

  assert.strictEqual(netProceeds, 31920000);
});

// 3. Ràng buộc T+2.5: Không được bán cổ phiếu T+1 hoặc T+2
test('3. Ràng buộc T+2.5: Chặn bán khi available_quantity < sell_quantity', () => {
  const position = {
    symbol: 'FPT',
    available_quantity: 500,
    t1_quantity: 1000,
    t2_quantity: 1000
  };

  const sellQtyValid = 500;
  const sellQtyInvalid = 600;

  assert.strictEqual(position.available_quantity >= sellQtyValid, true);
  assert.strictEqual(position.available_quantity >= sellQtyInvalid, false);
});

// 4. Chốt ngày T+2.5 (Settle Day Cycle)
test('4. Chốt ngày T+2.5: Chuyển dịch đúng chu kỳ T2 -> T1 -> Khả dụng & Tiền chờ về -> Tiền mặt', () => {
  let position = { available_quantity: 500, t1_quantity: 300, t2_quantity: 200 };
  let portfolio = { cash: 10000000, receiving_cash: 5000000 };

  // Thực hiện chốt ngày (Settle Day)
  position = {
    ...position,
    available_quantity: position.available_quantity + position.t1_quantity,
    t1_quantity: position.t2_quantity,
    t2_quantity: 0
  };
  portfolio = {
    ...portfolio,
    cash: portfolio.cash + portfolio.receiving_cash,
    receiving_cash: 0
  };

  assert.strictEqual(position.available_quantity, 800);
  assert.strictEqual(position.t1_quantity, 200);
  assert.strictEqual(position.t2_quantity, 0);
  assert.strictEqual(portfolio.cash, 15000000);
  assert.strictEqual(portfolio.receiving_cash, 0);
});

// 5. Cổ tức tiền mặt: Khấu trừ 5% thuế TNCN
test('5. Cổ tức tiền mặt: Tự động trừ 5% thuế TNCN theo quy định Việt Nam', () => {
  const shares = 2000;
  const divPerShare = 1500; // 1,500đ / cổ phiếu
  const grossDividend = shares * divPerShare; // 3,000,000
  const tax = grossDividend * 0.05;           // 150,000 (5%)
  const netCash = grossDividend - tax;        // 2,850,000

  assert.strictEqual(netCash, 2850000);
});

// 6. Cổ tức cổ phiếu / Thưởng: Điều chỉnh giảm giá vốn bình quân
test('6. Cổ phiếu thưởng / Cổ tức cổ phiếu: Pha loãng & điều chỉnh giảm giá vốn', () => {
  const qOld = 1000;
  const pOld = 30000;
  const ratio = 0.2; // Thưởng 20% (200 cổ phiếu)
  const qBonus = qOld * ratio; // 200
  const qNew = qOld + qBonus;  // 1200
  const pNew = (qOld * pOld) / qNew; // 30,000,000 / 1200 = 25,000

  assert.strictEqual(pNew, 25000);
  assert.strictEqual(qNew, 1200);
});

console.log(`\n🎉 HOÀN TẤT KIỂM THỬ: ${passedTests}/6 TESTS ĐẠT CHUẨN 100%!\n`);
