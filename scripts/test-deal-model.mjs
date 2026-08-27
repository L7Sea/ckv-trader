/* ═══════════════════════════════════════════════════════════════════════════
   KIỂM THỬ MÔ HÌNH TIỀN — ĐỐI CHIẾU VỚI SỐ DƯ THẬT TRÊN APP DNSE
   ───────────────────────────────────────────────────────────────────────────
   Khác với bộ test cũ (khai báo hằng số rồi assert lại chính hằng số đó — luôn
   PASS kể cả khi app sai), bộ test này IMPORT ĐÚNG MODULE mà app đang chạy
   (frontend/src/services/dealModel.ts) và đối chiếu output với ảnh chụp số dư
   thật do chủ tài khoản cung cấp.

   Chạy: node scripts/test-deal-model.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEAL_CONFIG,
  accruedInterest,
  breakevenPriceAt,
  computeDealSnapshot,
  computePositionPnL,
  daysSinceOpen,
  dealCostAt,
  disbursedCapital,
  marginDebtAt
} from '../frontend/src/services/dealModel.ts';

/* Ba mốc số dư THẬT chụp từ app DNSE. Đây là chuẩn đối chiếu duy nhất.
   Trường nào không đọc được từ ảnh thì để null và không kiểm tra. */
const REAL_SNAPSHOTS = [
  { label: '26/08/2026 13:53', date: '2026-08-26', price: 14600, debt: 7002051, nav: 7598120, pnl: null, pnlPct: null },
  { label: '27/08/2026 15:43', date: '2026-08-27', price: 14700, debt: 7004413, nav: 7695758, pnl: -1220541, pnlPct: -7.73 },
  { label: '28/08/2026 06:26', date: '2026-08-28', price: 14700, debt: 7006776, nav: 7693395, pnl: -1223158, pnlPct: -7.75 }
];

test('1. Cấu hình Deal khớp cơ cấu nguồn vốn thật (8,891,893 tự có + 6,898,107 vay = 15,790,000)', () => {
  assert.equal(DEAL_CONFIG.ownCapital, 8891893);
  assert.equal(DEAL_CONFIG.principalLoan, 6898107);
  assert.equal(disbursedCapital(), 15790000);
  assert.equal(DEAL_CONFIG.quantity, 1000);
  assert.equal(DEAL_CONFIG.symbol, 'TPB');
});

test('2. Mốc gốc tính lãi là 13/07/2026 — ngày khớp 3 lệnh DCA cuối cùng của Deal', () => {
  assert.equal(DEAL_CONFIG.openDate, '2026-07-13');
  assert.equal(daysSinceOpen('2026-07-13'), 0);
  assert.equal(daysSinceOpen('2026-08-26'), 44);
  assert.equal(daysSinceOpen('2026-08-27'), 45);
  assert.equal(daysSinceOpen('2026-08-28'), 46);
});

test('3. Lãi suất vay thật là 12.5%/năm (2,362đ/ngày), KHÔNG phải 11.5% (2,173đ/ngày) như bản cũ', () => {
  assert.equal(DEAL_CONFIG.marginRateAnnual, 12.5);
  // Lãi 1 ngày suy ra từ 2 mốc liền kề của số dư nợ thật
  assert.equal(REAL_SNAPSHOTS[1].debt - REAL_SNAPSHOTS[0].debt, 2362);
  assert.equal(REAL_SNAPSHOTS[2].debt - REAL_SNAPSHOTS[1].debt, 2363);
  // Mô hình tái tạo đúng các mốc lãi tích luỹ
  assert.equal(accruedInterest(44), 103944);
  assert.equal(accruedInterest(45), 106306);
  assert.equal(accruedInterest(46), 108669);
  // Lãi ĐƠN trên dư nợ gốc: 2N ngày phải đúng gấp đôi N ngày (sai số làm tròn ≤ 1đ)
  assert.ok(Math.abs(accruedInterest(92) - 2 * accruedInterest(46)) <= 1);
});

test('4. Lãi vay chỉ phụ thuộc SỐ NGÀY, không phụ thuộc số lần bấm nút "Chốt ngày"', () => {
  const once = marginDebtAt(daysSinceOpen('2026-08-28'));
  const again = marginDebtAt(daysSinceOpen('2026-08-28'));
  assert.equal(once, again, 'Gọi nhiều lần trong cùng một ngày phải cho cùng một dư nợ');
  // Lãi/ngày dao động 2362-2363đ do làm tròn đồng trên lãi tích luỹ chính xác
  const nextDay = marginDebtAt(daysSinceOpen('2026-08-29')) - once;
  assert.ok(nextDay === 2362 || nextDay === 2363, `Lãi 1 ngày phải là 2362 hoặc 2363, nhận ${nextDay}`);
});

test('5. Ngày trước khi mở Deal không phát sinh lãi (không cho số ngày âm)', () => {
  assert.equal(daysSinceOpen('2026-06-01'), 0);
  assert.equal(accruedInterest(-10), 0);
  assert.equal(marginDebtAt(daysSinceOpen('2026-06-01')), DEAL_CONFIG.principalLoan);
});

test('5b. Đếm ngày theo giờ Việt Nam, không theo UTC (sáng sớm ở VN vẫn là ngày hôm nay)', async () => {
  const { vnDateString } = await import('../frontend/src/services/dealModel.ts');

  // 06:26 sáng 28/08 giờ VN = 23:26 ngày 27/08 giờ UTC.
  // Đếm theo UTC sẽ ra N=45 và thiếu đúng 1 ngày lãi vay (2,363đ).
  const sangSom28 = new Date('2026-08-27T23:26:00Z');
  assert.equal(vnDateString(sangSom28), '2026-08-28');
  assert.equal(daysSinceOpen(sangSom28), 46);
  assert.equal(marginDebtAt(daysSinceOpen(sangSom28)), 7006776);

  // Nửa đêm vừa qua ở VN (00:30 ngày 28/08 = 17:30 ngày 27/08 UTC)
  assert.equal(vnDateString(new Date('2026-08-27T17:30:00Z')), '2026-08-28');
  // Còn 23:30 ngày 27/08 giờ VN thì vẫn phải là ngày 27
  assert.equal(vnDateString(new Date('2026-08-27T16:29:00Z')), '2026-08-27');
});

for (const snap of REAL_SNAPSHOTS) {
  test(`6. Đối chiếu số dư THẬT DNSE ${snap.label} — Nợ, NAV, Lãi/Lỗ`, () => {
    const got = computeDealSnapshot(snap.price, snap.date);

    assert.equal(got.marginDebt, snap.debt, 'Dư nợ Margin lệch so với app DNSE');
    assert.equal(got.netAssetValue, snap.nav, 'Tài sản ròng lệch so với app DNSE');
    if (snap.pnl !== null) {
      assert.equal(got.unrealizedPnL, snap.pnl, 'Lãi chưa chốt lệch so với app DNSE');
      assert.equal(got.unrealizedPnLPct, snap.pnlPct, 'Phần trăm lãi/lỗ lệch so với app DNSE');
    }

    // Bất biến kế toán: NAV = tiền mặt + giá trị cổ phiếu − nợ
    assert.equal(got.netAssetValue, got.cash + got.stockValue - got.marginDebt);
    // Bất biến: dư nợ = gốc vay + lãi tích luỹ
    assert.equal(got.marginDebt, DEAL_CONFIG.principalLoan + got.accruedInterest);
  });
}

test('7. Chỉ MỘT công thức lãi/lỗ — mọi nơi trong app phải ra cùng một con số', () => {
  const date = '2026-08-28';
  const price = 14700;
  const snap = computeDealSnapshot(price, date);
  const viaPosition = computePositionPnL(
    DEAL_CONFIG.symbol,
    DEAL_CONFIG.quantity,
    Math.round(DEAL_CONFIG.costBasisAtOpen / DEAL_CONFIG.quantity),
    price,
    date
  );

  assert.equal(viaPosition.pnl, snap.unrealizedPnL, 'Bảng vị thế và thẻ tổng quan phải cùng số lãi/lỗ');
  assert.equal(viaPosition.pnlPct, snap.unrealizedPnLPct, 'Header và bảng phải cùng phần trăm (lỗi cũ: -7.16% vs -7.22%)');
  assert.equal(viaPosition.breakevenPrice, snap.breakevenPrice);
  assert.equal(viaPosition.costBasis, dealCostAt(daysSinceOpen(date)));
});

test('8. Phần trăm lãi/lỗ lấy mẫu số là vốn giải ngân 15,790,000 (đúng quy ước DNSE)', () => {
  const snap = computeDealSnapshot(14700, '2026-08-28');
  const expected = Number(((snap.unrealizedPnL / 15790000) * 100).toFixed(2));
  assert.equal(snap.unrealizedPnLPct, expected);
  assert.equal(expected, -7.75);
});

test('9. Giá hòa vốn tăng dần theo chi phí Deal, không đứng yên và không dùng hệ số ước lượng', () => {
  assert.equal(breakevenPriceAt(45), 15921);
  assert.equal(breakevenPriceAt(46), 15923);
  assert.ok(breakevenPriceAt(46) > breakevenPriceAt(45), 'Giữ càng lâu thì giá hòa vốn càng cao');
  // Hệ số chữa cháy cũ (avg × 1.004016) cho 15,982 — sai lệch gần 60đ/CP
  const legacyGuess = Math.round((DEAL_CONFIG.costBasisAtOpen / DEAL_CONFIG.quantity) * 1.004016);
  assert.notEqual(legacyGuess, breakevenPriceAt(46));
});

test('10. Chi phí Deal đội vào giá vốn 2,617đ/ngày = 2,362 lãi vay + 255 phí Deal', () => {
  assert.equal(DEAL_CONFIG.dailyDealCost, 2617);
  assert.equal(dealCostAt(46) - dealCostAt(45), 2617);
  const interestPerDay = accruedInterest(46) - accruedInterest(45);
  assert.equal(interestPerDay, 2363);
  assert.equal(DEAL_CONFIG.dailyDealCost - interestPerDay, 254);
});

test('11. Giá đứng yên nhưng qua một ngày thì lỗ vẫn tăng đúng bằng chi phí Deal', () => {
  const d27 = computeDealSnapshot(14700, '2026-08-27');
  const d28 = computeDealSnapshot(14700, '2026-08-28');
  assert.equal(d27.unrealizedPnL - d28.unrealizedPnL, 2617);
  assert.equal(d28.netAssetValue - d27.netAssetValue, -2363, 'NAV giảm đúng bằng lãi vay phát sinh');
});

test('12. Mã KHÁC ngoài Deal dùng giá vốn bình quân, không dính hằng số của TPB', () => {
  const r = computePositionPnL('HPG', 500, 20000, 22000, '2026-08-28');
  assert.equal(r.costBasis, 10000000);
  assert.equal(r.pnl, 1000000);
  assert.equal(r.pnlPct, 10);
  assert.equal(r.breakevenPrice, 20000);
});

test('13. Không còn hằng số ảnh chụp số dư nào sót lại trong mã nguồn', async () => {
  const { readFileSync, readdirSync, statSync } = await import('node:fs');
  const { join } = await import('node:path');

  const banned = [
    ['7551893', 'NAV chụp ngày 25/8'],
    ['1465943', 'Lãi/lỗ chụp ngày 25/8'],
    ['1418116', 'Lãi/lỗ chụp ngày 26/8'],
    ['128116', 'Chi phí Deal đóng băng ngày 26/8'],
    ['7498120', 'NAV sai trong fallback api.ts'],
    ['1.004016', 'Hệ số ước lượng giá hòa vốn']
  ];

  const walk = (dir) => {
    const out = [];
    for (const name of readdirSync(dir)) {
      if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) out.push(...walk(full));
      else if (/\.(ts|tsx)$/.test(name)) out.push(full);
    }
    return out;
  };

  const offenders = [];
  for (const file of walk('frontend/src')) {
    const body = readFileSync(file, 'utf8');
    for (const [needle, why] of banned) {
      if (body.includes(needle)) offenders.push(`${file}: ${needle} (${why})`);
    }
  }

  assert.deepEqual(offenders, [], 'Còn hằng số ảnh chụp số dư trong mã nguồn:\n' + offenders.join('\n'));
});
