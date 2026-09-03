#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   xoa-code-chet.cjs — XOÁ một export đã xác định là chết, AN TOÀN.

   Vì sao cần file này thay vì sed/awk:
   Đoán điểm kết thúc khối bằng biểu thức chính quy KHÔNG đáng tin — thử
   trên chính kho này ra kết quả "-1971 dòng", tức là dò sai hoàn toàn.
   Xoá nhầm dựa trên con số đó là hỏng app.

   Cách làm ở đây:
     1. Khớp NGOẶC THẬT ({} và []) để tìm đúng điểm kết thúc.
     2. Xoá.
     3. CHẠY BUILD.
     4. Build hỏng → KHÔI PHỤC NGUYÊN VẸN, báo tên cái vừa thử.

   Dùng: node scripts/xoa-code-chet.cjs <file> <tênExport> [<file> <tên> …]
   ═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const goc = path.join(__dirname, '..');
const doi = process.argv.slice(2);
if (doi.length < 2 || doi.length % 2 !== 0) {
  console.error('Dùng: node scripts/xoa-code-chet.cjs <file> <tênExport> [...]');
  process.exit(1);
}

/* Tìm khối của một export bằng cách ĐẾM NGOẶC — không đoán. */
function timKhoi(src, ten) {
  const re = new RegExp(`^export\\s+(?:async\\s+)?(?:function|const|class)\\s+${ten}\\b`, 'm');
  const m = re.exec(src);
  if (!m) return null;

  const batDau = m.index;

  /* ⚠ PHẢI BỎ QUA PHẦN CHÚ THÍCH KIỂU trước dấu `=`.
     `export const DS_TU_THE: TuThe[] = [ … ]` có cặp `[]` nằm ngay trong KIỂU
     (`TuThe[]`). Bản đầu đếm cặp đó là ngoặc thật → cân bằng về 0 ngay lập tức
     → tưởng khối chỉ dài 1 dòng, cắt cụt file, build nổ.

     Với `const`/`class` thì bắt đầu đếm từ sau dấu `=` (hoặc `{` đầu tiên với
     class). Với `function` thì đếm từ `{` của thân hàm — nhưng tham số có thể
     chứa `{}` nên phải bỏ qua cặp ngoặc tròn của danh sách tham số trước. */
  let batDauDem = batDau;
  const dongKhaiBao = src.slice(batDau, src.indexOf('\n', batDau) + 1 || src.length);
  if (/^export\s+(?:async\s+)?function/.test(dongKhaiBao)) {
    /* Nhảy qua danh sách tham số: tìm `(` rồi khớp tới `)` tương ứng */
    let p = src.indexOf('(', batDau), sau = 0;
    for (let q = p; q < src.length; q++) {
      if (src[q] === '(') sau++;
      else if (src[q] === ')') { sau--; if (sau === 0) { batDauDem = q + 1; break; } }
    }
  } else {
    const dau = src.indexOf('=', batDau);
    batDauDem = dau > 0 ? dau + 1 : batDau;
  }

  let i = batDauDem, sauNgoac = 0, daMo = false;
  let trongChuoi = null, trongChuThich = null;
  for (; i < src.length; i++) {
    const c = src[i], truoc = src[i - 1];

    if (trongChuThich) {
      if (trongChuThich === 'dong' && c === '\n') trongChuThich = null;
      else if (trongChuThich === 'khoi' && c === '/' && truoc === '*') trongChuThich = null;
      continue;
    }
    if (trongChuoi) {
      if (c === trongChuoi && truoc !== '\\') trongChuoi = null;
      continue;
    }
    if (c === '/' && src[i + 1] === '/') { trongChuThich = 'dong'; continue; }
    if (c === '/' && src[i + 1] === '*') { trongChuThich = 'khoi'; i++; continue; }
    if (c === "'" || c === '"' || c === '`') { trongChuoi = c; continue; }

    if (c === '{' || c === '[') { sauNgoac++; daMo = true; }
    else if (c === '}' || c === ']') {
      sauNgoac--;
      if (daMo && sauNgoac === 0) {
        /* Nuốt luôn dấu `;` và xuống dòng ngay sau */
        let j = i + 1;
        while (j < src.length && (src[j] === ';' || src[j] === '\n' || src[j] === '\r')) j++;
        return { batDau, ketThuc: j };
      }
    }
    /* Hằng một dòng: `export const X = 5;` — không có ngoặc nào */
    else if (c === ';' && !daMo) return { batDau, ketThuc: i + 1 };
  }
  return null;
}

const luu = new Map();
const daXoa = [];
for (let k = 0; k < doi.length; k += 2) {
  const fRel = doi[k], ten = doi[k + 1];
  const f = path.join(goc, fRel);
  if (!fs.existsSync(f)) { console.log(`  ✗ không thấy file ${fRel}`); continue; }
  const src = fs.readFileSync(f, 'utf8');
  if (!luu.has(f)) luu.set(f, src);

  const k2 = timKhoi(src, ten);
  if (!k2) { console.log(`  ✗ không khớp được khối của ${ten} trong ${fRel}`); continue; }
  const so = src.slice(k2.batDau, k2.ketThuc).split('\n').length - 1;
  fs.writeFileSync(f, src.slice(0, k2.batDau) + src.slice(k2.ketThuc));
  daXoa.push({ fRel, ten, so });
  console.log(`  · xoá ${String(so).padStart(4)} dòng — ${ten} (${fRel})`);
}

console.log('\n  Đang dựng lại để kiểm…');
try {
  execSync('npm --prefix frontend run build', { cwd: goc, stdio: 'pipe' });
  const tong = daXoa.reduce((s, x) => s + x.so, 0);
  console.log(`  ✓ BUILD SẠCH. Đã xoá ${daXoa.length} thứ / ${tong} dòng.\n`);
} catch (e) {
  for (const [f, s] of luu) fs.writeFileSync(f, s);
  console.log('  ✗ BUILD HỎNG → đã KHÔI PHỤC nguyên vẹn mọi file. Không xoá gì.');
  console.log('    Nghĩa là một trong số đó KHÔNG phải mã chết. Lỗi build:\n');
  console.log(String(e.stdout ?? e.message).split('\n').filter((l) => /error/i.test(l)).slice(0, 6).join('\n'));
  process.exit(1);
}
