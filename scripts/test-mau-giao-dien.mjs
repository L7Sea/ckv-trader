/* ═══════════════════════════════════════════════════════════════════════════
   KIỂM THỬ BẢNG MÀU GIAO DIỆN
   ───────────────────────────────────────────────────────────────────────────
   Import ĐÚNG bảng màu app đang chạy (frontend/src/theme/bang-mau.js) và đo
   tương phản WCAG của mọi cặp chữ/nền — cả chế độ sáng lẫn tối.

   Vì sao cần: mắt người KHÔNG đo được tương phản. Hai lỗi có thật từng nằm im
   nhiều tháng vì "nhìn cũng được": chữ trắng trên nền vàng = 2,00 và màu cảnh
   báo dùng làm chữ = 2,64. Chuẩn tối thiểu là 4,5.

   Chạy: node scripts/test-mau-giao-dien.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import {
  BO_GOC,
  CAP_PHAI_DAT,
  CHU_TREN_NHAN,
  MIEN_TRU,
  PHONG,
  SANG,
  THANG_CHU,
  TOI,
  tuongPhan
} from '../frontend/src/theme/bang-mau.js';

for (const [tenBang, bang, chuTrenNhan] of [
  ['SÁNG', SANG, CHU_TREN_NHAN.sang],
  ['TỐI', TOI, CHU_TREN_NHAN.toi]
]) {
  test(`Bảng ${tenBang}: mọi cặp chữ/nền đạt ngưỡng WCAG`, () => {
    const hong = [];
    for (const [nhan, khoaChu, khoaNen, nguong] of CAP_PHAI_DAT) {
      const ty = tuongPhan(bang[khoaChu], bang[khoaNen]);
      if (ty < nguong) {
        hong.push(`${nhan}: ${bang[khoaChu]}/${bang[khoaNen]} = ${ty.toFixed(2)} < ${nguong}`);
      }
    }
    assert.deepEqual(hong, [], `Cặp màu không đạt:\n  ${hong.join('\n  ')}`);
  });

  test(`Bảng ${tenBang}: chữ trên nút bấm đọc được`, () => {
    const ty = tuongPhan(chuTrenNhan, bang.nhan);
    assert.ok(ty >= 4.5, `Chữ nút ${chuTrenNhan} trên nền ${bang.nhan} = ${ty.toFixed(2)}, cần ≥4.5`);
  });
}

test('Hai bảng có ĐÚNG cùng bộ vai trò màu', () => {
  /* Thiếu một vai trò ở bảng nào là màu đó "không tồn tại" ở chế độ ấy —
     chữ chế độ này nằm trên nền chế độ kia. Đây là lỗi giao diện phổ biến nhất. */
  assert.deepEqual(Object.keys(SANG).sort(), Object.keys(TOI).sort());
});

test('Lãi và lỗ phải khác nhau rõ rệt, không chỉ khác sắc', () => {
  // Người mù màu đỏ-lục chiếm ~8% nam giới. Hai màu phải khác cả ĐỘ SÁNG.
  for (const [ten, bang] of [['SÁNG', SANG], ['TỐI', TOI]]) {
    const ty = tuongPhan(bang.tot, bang.loi);
    assert.ok(ty >= 1.3, `${ten}: lãi ${bang.tot} vs lỗ ${bang.loi} = ${ty.toFixed(2)}, quá giống nhau`);
  }
});

test('Thang chữ 6 nấc, tăng dần, tỉ lệ hẹp cho app nhiều dữ liệu', () => {
  const nac = Object.values(THANG_CHU).map((v) => parseInt(v));
  assert.equal(nac.length, 6);
  assert.deepEqual([...nac].sort((a, b) => a - b), nac, 'Các nấc phải tăng dần');
  for (let i = 1; i < nac.length; i++) {
    const tyLe = nac[i] / nac[i - 1];
    assert.ok(tyLe >= 1.08 && tyLe <= 1.32, `Nấc ${nac[i - 1]}→${nac[i]} tỉ lệ ${tyLe.toFixed(2)} ngoài khoảng 1,08–1,32`);
  }
});

test('Bo góc đúng 4 nấc, không hơn', () => {
  assert.equal(Object.keys(BO_GOC).length, 4);
});

test('Phông có bộ dấu tiếng Việt, và KHÔNG dùng phông bị cấm', () => {
  const CAM = ['Inter', 'Space Grotesk'];
  const tatCa = [...PHONG.tieuDe, ...PHONG.than];
  for (const c of CAM) {
    assert.ok(!tatCa.includes(c), `Phông "${c}" nằm trong danh sách cấm của skill`);
  }
  const CO_DAU_VIET = ['Be Vietnam Pro', 'Archivo', 'Noto Sans', 'Lora'];
  assert.ok(PHONG.tieuDe.some((f) => CO_DAU_VIET.includes(f)), 'Phông tiêu đề phải có dấu tiếng Việt thật');
  assert.ok(PHONG.than.some((f) => CO_DAU_VIET.includes(f)), 'Phông thân bài phải có dấu tiếng Việt thật');
  assert.notEqual(PHONG.tieuDe[0], PHONG.than[0], 'Phải GHÉP HAI bộ phông, không dùng một bộ cho tất cả');
});

test('Không giữ lại diện mạo bị cấm: nền gần đen + một màu xanh lá chói', () => {
  // Diện mạo cũ: body bg #0B0F19 + emerald áp đảo 445 lượt.
  const nenCu = ['#0b0f19', '#0f172a', '#020617'];
  assert.ok(!nenCu.includes(SANG.nen.toLowerCase()), 'Bảng sáng không được dùng lại nền gần đen cũ');
  // Màu nhấn không được là xanh lá — xanh lá ở app này CHỈ để chỉ lãi
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(SANG.nhan.slice(i, i + 2), 16));
  assert.ok(!(g > r + 30 && g > b + 30), `Màu nhấn ${SANG.nhan} là xanh lá — trùng vai với màu báo lãi`);
});

test('Không còn màu hex viết cứng trong mã giao diện', () => {
  /* Ngưỡng giảm dần theo từng đợt dọn. Lỗi thật đã xảy ra: đổi bảng màu nhưng
     12 chỗ viết thẳng rgba() vẫn sơn màu cũ giữa một app đã đổi màu. */
  const NGUONG = 0; // đích cuối: không còn chỗ nào

  const quet = (thuMuc) => {
    const ra = [];
    for (const ten of readdirSync(thuMuc)) {
      if (['node_modules', 'dist', '.git', 'theme'].includes(ten)) continue;
      const duong = join(thuMuc, ten);
      if (statSync(duong).isDirectory()) ra.push(...quet(duong));
      else if (/\.tsx$/.test(ten)) ra.push(duong);
    }
    return ra;
  };

  const thuongHieu = new Set(MIEN_TRU.thuongHieu.map((m) => m.toLowerCase()));
  const viPham = [];
  let tong = 0;

  for (const f of quet('frontend/src')) {
    // File tranh minh hoạ có bảng màu riêng như một cái logo — không theo chế độ sáng/tối
    if (MIEN_TRU.fileTranh.some((ten) => f.endsWith(ten))) continue;

    const noiDung = readFileSync(f, 'utf8');
    const hex = (noiDung.match(/#[0-9a-fA-F]{3,8}\b/g) || []).filter(
      (m) => !thuongHieu.has(m.toLowerCase())
    );
    /* Chỉ tính là vi phạm khi style inline gán màu THẬT. `style={{color:'var(--chu)'}}`
       vẫn là token nên chấp nhận được — cái cấm là màu cứng mà @media không với tới. */
    const inline = (noiDung.match(/style=\{\{[^}]*\}\}/g) || []).filter((khoi) =>
      /(color|background|fill|stroke)\s*:\s*['"`]?(#|rgb|hsl)/i.test(khoi)
    );

    if (hex.length + inline.length > 0) {
      viPham.push(`${f}: ${hex.length} hex, ${inline.length} inline`);
      tong += hex.length + inline.length;
    }
  }
  assert.ok(
    tong <= NGUONG,
    `Còn ${tong} chỗ viết màu cứng (ngưỡng ${NGUONG}). Phải chuyển sang token:\n  ${viPham.slice(0, 25).join('\n  ')}`
  );
});
