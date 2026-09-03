/* ═══════════════════════════════════════════════════════════════════════════
   ĐỔI window.alert / confirm SANG THÔNG BÁO CỦA APP
   ───────────────────────────────────────────────────────────────────────────
   Đo được 23 alert + 3 confirm + 1 prompt trên 10 file. Ba tác hại: đóng băng
   luồng JavaScript, không theo bảng màu app, và `alert` chỉ có một sắc thái nên
   không nói được "đã ghi rồi, nhưng số liệu chưa khớp".

   Quy tắc phân mức theo NỘI DUNG câu, không theo chỗ gọi:
     có "không đủ / thất bại / lỗi / sai"  -> loi
     có "thành công / đã "                  -> tot
     còn lại (thiếu thông tin nhập)         -> canh-bao

   `prompt` KHÔNG đổi tự động — nó cần một hộp nhập liệu thật, xử lý riêng.

   Chạy thử:  node scripts/doi-alert-sang-thong-bao.mjs
   Ghi thật:  node scripts/doi-alert-sang-thong-bao.mjs --ghi
   ═══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const GHI = process.argv.includes('--ghi');

const quet = (thuMuc) => {
  const ra = [];
  for (const ten of readdirSync(thuMuc)) {
    if (['node_modules', 'dist'].includes(ten)) continue;
    const duong = join(thuMuc, ten);
    if (statSync(duong).isDirectory()) ra.push(...quet(duong));
    else if (/\.tsx$/.test(ten)) ra.push(duong);
  }
  return ra;
};

/** Đoán mức từ chính nội dung câu thông báo. */
function docMuc(cau) {
  const t = cau.toLowerCase();
  if (/không đủ|thất bại|lỗi |sai |không thể|chưa được/.test(t)) return 'loi';
  if (/thành công|đã /.test(t)) return 'tot';
  return 'canhBao';
}

let tongAlert = 0;
let tongConfirm = 0;
let conPrompt = 0;
const theoFile = [];

for (const duong of quet('frontend/src')) {
  let noiDung = readFileSync(duong, 'utf8').replace(/\r\n/g, '\n');
  const truoc = noiDung;
  let demA = 0;
  let demC = 0;

  /* `return alert(...)` -> `return thongBao.x(...)`.
     Giữ nguyên `return` để luồng thoát y như cũ. */
  noiDung = noiDung.replace(
    /\b(?:window\.)?alert\(((?:[^()]|\([^()]*\))*)\)/g,
    (nguyen, thamSo) => {
      demA++;
      return `thongBao.${docMuc(thamSo)}(${thamSo})`;
    }
  );

  /* `if (!confirm(x)) return;` -> `if (!(await thongBao.hoi({...}))) return;`
     Hàm chứa nó phải là async — kiểm và báo nếu chưa. */
  noiDung = noiDung.replace(
    /\b(?:window\.)?confirm\(((?:[^()]|\([^()]*\))*)\)/g,
    (nguyen, thamSo) => {
      demC++;
      return `await thongBao.hoi({ loi: ${thamSo}, nhanDong: 'Đồng ý', nhanHuy: 'Huỷ', nguyHiem: true })`;
    }
  );

  const soPrompt = (noiDung.match(/\b(?:window\.)?prompt\(/g) || []).length;
  conPrompt += soPrompt;

  if (noiDung !== truoc) {
    // Bổ sung import nếu chưa có
    if (!noiDung.includes("from '../lib/thongBao'") && !noiDung.includes("from '../../lib/thongBao'")) {
      const sau = duong.includes(join('src', 'components')) || duong.includes(join('src', 'pages'))
        ? "../lib/thongBao"
        : "./lib/thongBao";
      noiDung = noiDung.replace(/^(import [^\n]*\n)/, `$1import { thongBao } from '${sau}';\n`);
    }

    tongAlert += demA;
    tongConfirm += demC;
    theoFile.push(`${duong.replace(/^frontend[\\/]src[\\/]/, '')} → ${demA} alert, ${demC} confirm${soPrompt ? `, ${soPrompt} prompt CÒN LẠI` : ''}`);
    if (GHI) writeFileSync(duong, noiDung);
  }
}

theoFile.forEach((d) => console.log(`${GHI ? '✏️ ' : '👁 '} ${d}`));
console.log(`\n${GHI ? 'ĐÃ ĐỔI' : 'SẼ ĐỔI'}: ${tongAlert} alert + ${tongConfirm} confirm`);
if (conPrompt > 0) console.log(`⚠ Còn ${conPrompt} prompt — cần hộp nhập liệu riêng, không đổi tự động.`);
if (!GHI) console.log('\n(chạy thử — thêm --ghi để ghi thật)');
