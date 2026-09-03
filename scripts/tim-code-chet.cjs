#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   tim-code-chet.cjs — TÌM MÃ KHÔNG AI DÙNG (chỉ BÁO, không xoá)

   ⚠ VÌ SAO LÀ FILE RIÊNG CHỨ KHÔNG PHẢI `node -e "..."`:
   Chạy inline qua shell làm mất dấu gạch chéo trong biểu thức chính quy.
   Lần chạy inline đầu tiên gắn cờ CẢ `useAuth`, `fetchCustomers`, `loiText`
   là "chết" — những hàm được gọi khắp app. Suýt xoá nhầm.

   Bài học: công cụ dùng để QUYẾT ĐỊNH XOÁ thì phải nằm trong file, chạy
   lại được, đọc lại được. Không bao giờ gõ inline.

   Chạy: node scripts/tim-code-chet.cjs
   KHÔNG XOÁ GÌ. Chỉ in danh sách để người đọc tự quyết.
   ═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const goc = path.join(__dirname, '..');

/* Thư mục mã nguồn — DÒ chứ không giả định, để dùng được cho app khác.
   Vicostone để mã ở src/; CKV để ở frontend/src/. */
const src = [
  path.join(goc, 'src'),
  path.join(goc, 'frontend', 'src'),
].find((d) => fs.existsSync(d)) ?? path.join(goc, 'src');

function quet(d, ds = []) {
  for (const t of fs.readdirSync(d, { withFileTypes: true })) {
    if (t.name === 'node_modules') continue;
    const p = path.join(d, t.name);
    if (t.isDirectory()) quet(p, ds);
    else if (/\.(tsx?|cjs)$/.test(t.name)) ds.push(p);
  }
  return ds;
}

const fileSrc = quet(src);
const fileTest = fs.readdirSync(path.join(goc, 'scripts'))
  .filter((f) => /\.cjs$/.test(f))
  .map((f) => path.join(goc, 'scripts', f));

/* Đọc TẤT CẢ nội dung một lần. Đếm trên toàn bộ, kể cả file test —
   một hàm chỉ được test gọi thì vẫn KHÔNG phải code chết. */
const noiDung = new Map();
for (const f of [...fileSrc, ...fileTest]) noiDung.set(f, fs.readFileSync(f, 'utf8'));
const tatCa = [...noiDung.values()].join('\n');

/* Bỏ chú thích trước khi đếm: tên hàm nhắc trong chú thích không phải lượt gọi */
const tatCaSach = tatCa.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/* ── MIỄN TRỪ CÓ LÝ DO ──
   Không phải thứ nào "không ai gọi" cũng nên xoá. Ghi rõ lý do ở đây thay vì
   xoá cho đẹp con số — con số đẹp mà mất thứ cần giữ là đánh đổi sai. */
const MIEN_TRU = {
  locSvg: 'Bộ lọc an toàn cho SVG. Hiện không ai gọi vì CKV chưa gắn bảng meme '
        + 'Capy — nhưng nếu gắn lại thì CHÍNH nó là thứ chặn SVG độc. Giữ.',
};

const nghi = [];
for (const [f, s] of noiDung) {
  if (!f.startsWith(src)) continue;
  const sSach = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const re = /^export\s+(?:async\s+)?(?:function|const|class)\s+([A-Za-z_$][\w$]*)/gm;
  let m;
  while ((m = re.exec(sSach))) {
    const ten = m[1];
    /* Đếm mọi lần TÊN xuất hiện như một định danh trọn vẹn.
       1 lần = chỉ chỗ khai báo → không ai dùng. */
    const dem = (tatCaSach.match(new RegExp(`\\b${ten}\\b`, 'g')) || []).length;
    if (dem <= 1 && !MIEN_TRU[ten]) nghi.push({ file: path.relative(goc, f), ten });
  }
}

console.log(`\n╔═══ MÃ KHÔNG AI DÙNG — ${path.basename(goc)} ═══`);
console.log(`  Đã quét ${fileSrc.length} file nguồn + ${fileTest.length} file test\n`);

const soMienTru = Object.keys(MIEN_TRU).length;
if (soMienTru) console.log(`  (${soMienTru} thứ được miễn trừ có lý do — xem MIEN_TRU trong file này)
`);

if (!nghi.length) {
  console.log('  ✓ Mọi hàm/hằng `export` đều có ít nhất một chỗ gọi.\n');
} else {
  console.log(`  ${nghi.length} thứ không thấy chỗ nào gọi:\n`);
  for (const x of nghi) console.log(`     ${x.file.padEnd(42)} ${x.ten}`);
  console.log('\n  ⚠ ĐỌC KỸ TRƯỚC KHI XOÁ. Ba trường hợp KHÔNG phải code chết:');
  console.log('     · gọi qua chuỗi động  — VD new Worker(new URL("./x.worker.ts", …))');
  console.log('     · là điểm vào của app — main.tsx, App.tsx');
  console.log('     · để dành có chủ ý    — API công khai của một module\n');
}

/* File nào không ai import — kể cả bằng chuỗi động */
const moCoi = [];
for (const f of fileSrc) {
  const b = path.basename(f).replace(/\.(tsx?)$/, '');
  if (['main', 'App', 'vite-env'].includes(b)) continue;
  const dem = [...noiDung.entries()]
    .filter(([k]) => k !== f)
    .filter(([, s]) => s.includes(`/${b}'`) || s.includes(`/${b}"`) || s.includes(`${b}.worker`) || s.includes(`'${b}'`))
    .length;
  if (dem === 0) moCoi.push(path.relative(goc, f));
}
if (moCoi.length) {
  console.log(`  ${moCoi.length} FILE không file nào nhắc tới:`);
  for (const f of moCoi) console.log(`     ${f}`);
  console.log('');
}
