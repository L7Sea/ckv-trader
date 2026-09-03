/* ═══════════════════════════════════════════════════════════════════════════
   ĐỔI MÀU VIẾT CỨNG SANG TOKEN
   ───────────────────────────────────────────────────────────────────────────
   Nguyên tắc: màu NGỮ NGHĨA ánh xạ theo mã hex; màu NỀN/VIỀN/CHỮ ánh xạ theo
   VAI TRÒ CSS. Cùng một mã hex dùng làm nền hay làm viền là hai token khác nhau
   — đó là lý do không thể tìm-thay mù.

   Chạy thử (không ghi):  node scripts/doi-mau-sang-token.mjs
   Ghi thật:              node scripts/doi-mau-sang-token.mjs --ghi

   Sau khi ghi, BẮT BUỘC:
     npm --prefix frontend run build
     node scripts/test-mau-giao-dien.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { MIEN_TRU } from '../frontend/src/theme/bang-mau.js';

const GHI = process.argv.includes('--ghi');

/** Màu ngữ nghĩa: ánh xạ theo MÃ, vì ý nghĩa nằm ở màu chứ không ở vị trí. */
const THEO_MA = {
  '#0ecb81': 'tot', '#10b981': 'tot', '#34d399': 'tot', '#3dd68c': 'tot',
  '#f6465d': 'loi', '#ef4444': 'loi', '#fb7185': 'loi', '#e11d48': 'loi',
  '#f59e0b': 'canh-bao', '#fbbf24': 'canh-bao', '#d97706': 'canh-bao',
  '#64748b': 'chu-mo', '#94a3b8': 'chu-mo',
  '#fff': 'the', '#ffffff': 'the'
};

/** Màu cấu trúc: ánh xạ theo VAI TRÒ CSS. Mọi sắc xanh-đen đều rơi vào đây. */
const THEO_VAI_TRO = {
  bg: 'the',
  border: 'vien',
  text: 'chu',
  from: 'the',
  to: 'the',
  via: 'the',
  ring: 'vien-ro',
  outline: 'vien-ro',
  divide: 'vien',
  shadow: 'vien'
};


/* ═══ CLASS TAILWIND MẶC ĐỊNH → TOKEN ═══
   Đây là phần LỚN nhất: 2.587 lượt. Mọi class dưới đây được viết cho nền TỐI,
   nên khi bảng màu chuyển sang sáng thì chúng hỏng hết — đo thật: text-white
   trên nền trắng = 1,00 (chữ tàng hình), text-slate-400 = 2,56 (cần ≥4,5).

   Ánh xạ theo VAI TRÒ, không theo sắc: slate nhạt từng là "chữ sáng trên nền
   tối" nên vai trò của nó là CHỮ CHÍNH, chứ không phải "màu xám nhạt". */
const SAC_NGU_NGHIA = {
  emerald: 'tot', green: 'tot', lime: 'tot', teal: 'tot',
  rose: 'loi', red: 'loi', pink: 'loi',
  amber: 'canh-bao', yellow: 'canh-bao', orange: 'canh-bao',
  cyan: 'nhan-chu', sky: 'nhan-chu', blue: 'nhan-chu', indigo: 'nhan-chu',
  violet: 'nhan-chu', purple: 'nhan-chu', fuchsia: 'nhan-chu'
};

/** slate/gray/zinc: nấc số quyết định vai trò, vì bảng cũ là nền tối. */
const XAM_THEO_NAC = {
  text: { 50: 'chu', 100: 'chu', 200: 'chu', 300: 'chu-phu', 400: 'chu-phu', 500: 'chu-mo', 600: 'chu-mo', 700: 'chu-mo', 800: 'chu', 900: 'chu', 950: 'chu' },
  bg:   { 50: 'the2', 100: 'the2', 200: 'the2', 300: 'the2', 400: 'the2', 500: 'the2', 600: 'the2', 700: 'the2', 800: 'the2', 900: 'the', 950: 'nen' },
  border: { 50: 'vien', 100: 'vien', 200: 'vien', 300: 'vien', 400: 'vien-ro', 500: 'vien-ro', 600: 'vien-ro', 700: 'vien', 800: 'vien', 900: 'vien', 950: 'vien' }
};

const XAM = ['slate', 'gray', 'zinc', 'neutral', 'stone'];

/** Đổi một class màu Tailwind sang token, hoặc null nếu không nhận ra. */
function doiClassTailwind(vaiTro, sac, nac, doMo) {
  // Trắng / đen: vai trò phụ thuộc chỗ dùng
  if (sac === 'white') return vaiTro === 'text' ? 'chu' : vaiTro === 'border' ? 'vien' : 'the';
  if (sac === 'black') return vaiTro === 'text' ? 'chu' : 'nen';

  if (XAM.includes(sac)) {
    const bang = XAM_THEO_NAC[vaiTro] || XAM_THEO_NAC.bg;
    return bang[Number(nac)] || (vaiTro === 'text' ? 'chu-phu' : vaiTro === 'border' ? 'vien' : 'the');
  }

  const token = SAC_NGU_NGHIA[sac];
  if (!token) return null;

  /* Màu ngữ nghĩa có độ mờ (bg-emerald-500/10) là NỀN NHẠT, không phải màu đặc.
     Dùng token nền riêng để tương phản vẫn tính được. */
  if (vaiTro === 'bg') {
    if (doMo) return token === 'nhan-chu' ? 'the2' : token + '-nen';
    return token === 'nhan-chu' ? 'nhan' : token;
  }
  if (vaiTro === 'border') return doMo ? 'vien' : token;
  return token;
}

const laMienTru = (ma) => MIEN_TRU.thuongHieu.some((m) => m.toLowerCase() === ma.toLowerCase());

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

let tongDoi = 0;
let tongBoQua = 0;
const chuaXuLy = new Map();

for (const duong of quet('frontend/src')) {
  if (MIEN_TRU.fileTranh.includes(basename(duong))) {
    console.log(`⏭  bỏ qua (tranh minh hoạ): ${basename(duong)}`);
    continue;
  }

  let noiDung = readFileSync(duong, 'utf8');
  const truoc = noiDung;
  let doiTrongFile = 0;

  /* 1. Class Tailwind dạng `bg-[#212636]` → `bg-the`.
        Ngữ nghĩa thắng vai trò: `text-[#0ecb81]` thành `text-tot` chứ không phải `text-chu`. */
  noiDung = noiDung.replace(
    /\b(bg|border|text|from|to|via|ring|outline|divide|shadow)-\[(#[0-9a-fA-F]{3,8})\]/g,
    (nguyen, vaiTro, ma) => {
      if (laMienTru(ma)) { tongBoQua++; return nguyen; }
      const token = THEO_MA[ma.toLowerCase()] || THEO_VAI_TRO[vaiTro];
      if (!token) { chuaXuLy.set(nguyen, (chuaXuLy.get(nguyen) || 0) + 1); return nguyen; }
      doiTrongFile++;
      return `${vaiTro}-${token}`;
    }
  );

  /* 2. Thuộc tính SVG `fill="#0ecb81"` → `fill="var(--tot)"`.
        Biến CSS dùng được trong thuộc tính SVG của inline SVG. */
  noiDung = noiDung.replace(
    /\b(fill|stroke|stopColor|color)="(#[0-9a-fA-F]{3,8})"/g,
    (nguyen, thuocTinh, ma) => {
      if (laMienTru(ma)) { tongBoQua++; return nguyen; }
      const token = THEO_MA[ma.toLowerCase()] || (thuocTinh === 'stroke' ? 'vien' : 'the');
      doiTrongFile++;
      return `${thuocTinh}="var(--${token})"`;
    }
  );

  /* 4. Class Tailwind mặc định: `text-slate-400` → `text-chu-phu`.
        Giữ nguyên phần độ mờ nếu có, ví dụ `bg-emerald-500/10` → `bg-tot-nen`. */
  noiDung = noiDung.replace(
    /\b(bg|text|border|ring|divide|from|to|via|placeholder|decoration|outline)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-(\d{2,3}))?(\/\d{1,3})?\b/g,
    (nguyen, vaiTro, sac, nac, doMo) => {
      const token = doiClassTailwind(vaiTro, sac, nac, Boolean(doMo));
      if (!token) { chuaXuLy.set(nguyen, (chuaXuLy.get(nguyen) || 0) + 1); return nguyen; }
      doiTrongFile++;
      return `${vaiTro}-${token}`;
    }
  );

  /* 3. Chuỗi JS `'#0ecb81'` → `'var(--tot)'`. Chỉ đổi màu NGỮ NGHĨA;
        chuỗi màu khác để lại cho người đọc quyết định, không đoán. */
  noiDung = noiDung.replace(/'(#[0-9a-fA-F]{3,8})'/g, (nguyen, ma) => {
    if (laMienTru(ma)) { tongBoQua++; return nguyen; }
    const token = THEO_MA[ma.toLowerCase()];
    if (!token) { chuaXuLy.set(nguyen, (chuaXuLy.get(nguyen) || 0) + 1); return nguyen; }
    doiTrongFile++;
    return `'var(--${token})'`;
  });

  if (noiDung !== truoc) {
    tongDoi += doiTrongFile;
    if (GHI) writeFileSync(duong, noiDung);
    console.log(`${GHI ? '✏️ ' : '👁 '} ${duong.replace(/^frontend[\\/]src[\\/]/, '')}  → ${doiTrongFile} chỗ`);
  }
}

console.log(`\n${GHI ? 'ĐÃ ĐỔI' : 'SẼ ĐỔI'}: ${tongDoi} chỗ · bỏ qua thương hiệu: ${tongBoQua}`);

if (chuaXuLy.size > 0) {
  console.log(`\n⚠ CÒN ${chuaXuLy.size} dạng CHƯA ánh xạ được — phải xử lý bằng tay:`);
  [...chuaXuLy.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`   ${String(v).padStart(3)}×  ${k}`));
}

if (!GHI) console.log('\n(Chạy thử. Thêm --ghi để ghi thật.)');
