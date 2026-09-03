/* ═══════════════════════════════════════════════════════════════════════════
   BỎ CHUYỂN SẮC TRONG GIAO DIỆN
   ───────────────────────────────────────────────────────────────────────────
   Diện mạo "giấy tài chính" là mặt phẳng đặc. Chuyển sắc còn nguy hiểm hơn là
   xấu: `bg-gradient-to-br from-the via-nhan-chu to-nen` khiến chữ vắt ngang dải
   xanh đậm ở giữa — và máy đo nền đặc KHÔNG bắt được vì nền không phải một màu.

   Chỉ đụng vào các class chuyển sắc, TUYỆT ĐỐI không chạm khoảng trắng khác.
   (Bản nháp đầu tiên có `replace(/ {2,}/g,' ')` để dọn khoảng trống thừa — nó
   nuốt luôn thụt lề của 44 file. Bài học: đừng bao giờ dọn khoảng trắng chung
   với việc khác.)

   Chạy thử:  node scripts/bo-chuyen-sac.mjs
   Ghi thật:  node scripts/bo-chuyen-sac.mjs --ghi
   ═══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { MIEN_TRU } from '../frontend/src/theme/bang-mau.js';

const GHI = process.argv.includes('--ghi');

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

/** Các class chỉ có nghĩa khi đi cùng chuyển sắc — bỏ chuyển sắc thì bỏ luôn. */
const DIEM_DUNG = /\b(?:from|via|to)-(?:[a-z0-9-]+)(?:\/\d{1,3})?\b/g;

let tong = 0;
const theoFile = [];

for (const duong of quet('frontend/src')) {
  if (MIEN_TRU.fileTranh.includes(basename(duong))) continue;

  const truoc = readFileSync(duong, 'utf8');
  let sau = truoc;
  let dem = 0;

  /* Xử lý trong từng cụm class để không đụng chữ ở nơi khác. `to-` cũng xuất
     hiện trong văn bản tiếng Anh nên bắt buộc phải giới hạn phạm vi. */
  sau = sau.replace(/(['"`])([^'"`\n]*?bg-gradient-to-[a-z]{1,2}[^'"`\n]*?)\1/g, (nguyen, nhay, cum) => {
    dem++;
    const moi = cum
      .replace(/\bbg-gradient-to-[a-z]{1,2}\b/g, 'bg-the')
      .replace(DIEM_DUNG, '')
      // Chỉ gộp khoảng trắng SINH RA do vừa xoá class, trong phạm vi cụm này
      .replace(/\s{2,}/g, ' ')
      .trim();
    return nhay + moi + nhay;
  });

  if (sau !== truoc) {
    tong += dem;
    theoFile.push(`${duong.replace(/^frontend[\\/]src[\\/]/, '')} → ${dem} cụm`);
    if (GHI) writeFileSync(duong, sau);
  }
}

theoFile.forEach((d) => console.log(`${GHI ? '✏️ ' : '👁 '} ${d}`));
console.log(`\n${GHI ? 'ĐÃ BỎ' : 'SẼ BỎ'}: ${tong} cụm chuyển sắc`);
if (!GHI) console.log('(chạy thử — thêm --ghi để ghi thật)');
