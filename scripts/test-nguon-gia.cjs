#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   test-nguon-gia.cjs — CANH THAM SỐ GỌI NGUỒN GIÁ

   Ngày 03/09/2026 anh Hải báo: DNSE hiện TPB 14.60 mà bấm "Đồng Bộ" vẫn ra
   14.45. Đào ra: app **chưa bao giờ** lấy được giá thật.

   Đo trực tiếp trên nguồn Entrade, cùng mã TPB:
     resolution=1 (nến 1 phút) → RỖNG      ← app đang dùng cái này
     resolution=1D, cửa sổ 5 ngày → RỖNG
     resolution=1D, cửa sổ 45 ngày → có nến ✓

   Nhận mảng rỗng → bỏ qua mã → rơi về hằng số 14450 viết cứng trong
   top300Stocks.ts, MÀ VẪN đóng dấu giờ hiện tại. Nhìn như vừa đồng bộ xong.

   Bài test này canh 3 tham số đó bằng cách ĐỌC MÃ NGUỒN — không gọi mạng,
   nên chạy được cả khi mất mạng.
   ═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const goc = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (t, d, v = '') => { if (d) { pass++; console.log(`  ✓ ${t}`); } else { fail++; console.log(`  ✗ ${t}${v ? '\n      → ' + v : ''}`); } };

const src = fs.readFileSync(path.join(goc, 'frontend/src/services/marketDataService.ts'), 'utf8');
const khoi = src.slice(src.indexOf('fetchLiveStockPrice'));

console.log('\n💹 NGUỒN GIÁ THỊ TRƯỜNG\n');

ok('Dùng resolution=1D (resolution=1 luôn trả RỖNG)',
  /resolution=1D/.test(khoi) && !/resolution=1&/.test(khoi),
  'nến 1 phút không có dữ liệu → app rơi về giá viết cứng mà vẫn báo "đã đồng bộ"');

const m = khoi.match(/86400\s*\*\s*(\d+)/);
ok(`Cửa sổ thời gian ≥ 30 ngày (đang là ${m ? m[1] : '?'})`,
  m && Number(m[1]) >= 30,
  'nến cuối của Entrade là 28/08 — cửa sổ hẹp không chạm tới nến nào, trả rỗng');

ok('Có lấy giá tham chiếu THẬT (fetchThongTinMa)',
  /fetchThongTinMa/.test(src) && /basicPrice/.test(src),
  'không có thì refPrice = price × 0.995 là số BỊA, và % tăng/giảm tính từ mốc bịa');

ok('Chỉ đóng dấu giờ khi THẬT SỰ lấy được giá mới',
  /lastUpdated:\s*layDuoc/.test(src),
  'luôn đóng dấu giờ mới = người dùng tưởng số vừa cập nhật trong khi nó cũ hàng tháng');

ok('Biên độ trần/sàn lấy từ nguồn, không tính cứng 7%',
  /ceilingPrice/.test(src),
  'HOSE 7% · HNX 10% · UPCOM 15% — công thức cứng 7% sai cho 2 sàn');

console.log(`\n💹 NGUỒN GIÁ: ${pass} PASSED, ${fail} FAILED.\n`);
process.exit(fail > 0 ? 1 : 0);
