/* ═══════════════════════════════════════════════════════════════════════════
   ĐO TƯƠNG PHẢN Ở MỨC COMPONENT
   ───────────────────────────────────────────────────────────────────────────
   Bài `test-mau-giao-dien.mjs` chỉ chứng minh BẢNG MÀU đúng. Nó không biết
   component ghép sai cặp — ví dụ `bg-tot text-chu` là nút xanh đậm với chữ mực
   đen, cả hai token đều hợp lệ nhưng ghép lại thì không đọc được.

   File này quét MỌI chuỗi className, tìm cặp nền–chữ đứng chung, rồi đo thật.

   Chạy: node scripts/do-tuong-phan-component.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { CHU_TREN_NHAN, MIEN_TRU, SANG, TOI, tuongPhan } from '../frontend/src/theme/bang-mau.js';

/** Tên token trong class → khoá trong bảng màu. */
const TOKEN = {
  nen: 'nen', the: 'the', the2: 'the2',
  chu: 'chu', 'chu-phu': 'chuPhu', 'chu-mo': 'chuMo',
  nhan: 'nhan', 'nhan-chu': 'nhanChu',
  'tren-nhan': 'trenNhan',
  tot: 'tot', 'tot-nen': 'totNen',
  loi: 'loi', 'loi-nen': 'loiNen',
  'canh-bao': 'canhBao', 'canh-bao-nen': 'canhBaoNen',
  vien: 'vien', 'vien-ro': 'vienRo'
};

/* `--tren-nhan` không nằm trong SANG/TOI mà ở CHU_TREN_NHAN. Ghép vào đây để
   máy đo nhận ra `text-tren-nhan` — thiếu nó thì trạng thái hover bị coi là
   "không có chữ" rồi mượn nhầm chữ của trạng thái thường, sinh báo lỗi giả. */
const BANG = {
  sáng: { ...SANG, trenNhan: CHU_TREN_NHAN.sang },
  tối: { ...TOI, trenNhan: CHU_TREN_NHAN.toi }
};

const quet = (thuMuc) => {
  const ra = [];
  for (const ten of readdirSync(thuMuc)) {
    if (['node_modules', 'dist', 'theme'].includes(ten)) continue;
    const duong = join(thuMuc, ten);
    if (statSync(duong).isDirectory()) ra.push(...quet(duong));
    else if (/\.tsx$/.test(ten)) ra.push(duong);
  }
  return ra;
};

/* Lấy mọi cụm class nằm giữa dấu nháy — đủ để bắt cả className tĩnh lẫn
   nhánh của biểu thức điều kiện. */
const CUM_CLASS = /['"`]([^'"`\n]{0,400})['"`]/g;

const loi = [];
let soCapDaDo = 0;

for (const duong of quet('frontend/src')) {
  if (MIEN_TRU.fileTranh.includes(basename(duong))) continue;
  const noiDung = readFileSync(duong, 'utf8');
  const dong = noiDung.split('\n');

  dong.forEach((noiDungDong, i) => {
    for (const khop of noiDungDong.matchAll(CUM_CLASS)) {
      const cum = khop[1];
      if (!/\b(bg|text)-/.test(cum)) continue;

      /* Ghép theo TRẠNG THÁI. `bg-tot-nen text-tot hover:bg-tot hover:text-tren-nhan`
         là đúng: lúc thường dùng cặp thứ nhất, lúc rê chuột dùng cặp thứ hai. Ghép
         chéo base với hover sẽ báo lỗi giả — chúng không bao giờ hiện cùng lúc. */
      const theoTrangThai = new Map();
      const nhat = (kieu, re) => {
        for (const m of cum.matchAll(re)) {
          const trangThai = m[1] || '';
          const token = m[2];
          if (!TOKEN[token]) continue;
          if (!theoTrangThai.has(trangThai)) theoTrangThai.set(trangThai, { bg: [], text: [] });
          theoTrangThai.get(trangThai)[kieu].push(token);
        }
      };
      nhat('bg', /(?:^|\s)((?:[a-z-]+:)*)bg-([a-z0-9-]+)(?=\s|$)/g);
      nhat('text', /(?:^|\s)((?:[a-z-]+:)*)text-([a-z0-9-]+)(?=\s|$)/g);

      const nenGoc = theoTrangThai.get('')?.bg || [];
      const chuGoc = theoTrangThai.get('')?.text || [];

      for (const [trangThai, cap] of theoTrangThai) {
        // Trạng thái biến thể kế thừa màu còn lại từ trạng thái gốc
        const nen = cap.bg.length ? cap.bg : trangThai === '' ? [] : nenGoc;
        const chu = cap.text.length ? cap.text : trangThai === '' ? [] : chuGoc;
        if (nen.length === 0 || chu.length === 0) continue;

      for (const n of nen) {
        for (const c of chu) {
          soCapDaDo++;
          for (const [tenBang, bang] of Object.entries(BANG)) {
            const ty = tuongPhan(bang[TOKEN[c]], bang[TOKEN[n]]);
            if (ty < 4.5) {
              loi.push({
                duong: duong.replace(/^frontend[\\/]src[\\/]/, ''),
                dong: i + 1,
                cap: `bg-${n} + text-${c}`,
                bang: tenBang,
                ty: ty.toFixed(2)
              });
            }
          }
        }
      }
      }
    }
  });
}

// Gộp theo cặp để báo cáo ngắn, kèm ví dụ nơi xuất hiện
const theoCap = new Map();
for (const l of loi) {
  const khoa = `${l.cap} [${l.bang}] = ${l.ty}`;
  if (!theoCap.has(khoa)) theoCap.set(khoa, []);
  theoCap.get(khoa).push(`${l.duong}:${l.dong}`);
}

console.log(`Đã đo ${soCapDaDo} cặp nền–chữ trong component.\n`);

if (theoCap.size === 0) {
  console.log('✅ Không cặp nào dưới 4,5 ở cả hai chế độ.');
  process.exitCode = 0;
} else {
  console.log(`❌ ${theoCap.size} kiểu ghép hỏng, ${loi.length} lượt:\n`);
  [...theoCap.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([cap, noi]) => {
      console.log(`  ${cap}   (${noi.length} chỗ)`);
      console.log(`     vd: ${noi.slice(0, 3).join(' · ')}`);
    });
  process.exitCode = 1;
}
