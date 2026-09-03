/* ═══════════════════════════════════════════════════════════════════════════
   BẢNG MÀU CKV — NGUỒN SỰ THẬT DUY NHẤT VỀ MÀU
   ───────────────────────────────────────────────────────────────────────────
   Cả `tailwind.config.js` lẫn bài test `scripts/test-mau-giao-dien.mjs` đều
   đọc từ file này. Đổi màu ở đây là đổi cả app, và test tự kiểm lại ngay.

   DIỆN MẠO: "giấy tài chính" — nền sáng lạnh trung tính, mực đậm, xanh mực làm
   màu nhấn. Đỏ/xanh CHỈ dành cho lãi–lỗ, không dùng trang trí.

   Vì sao KHÔNG giữ diện mạo cũ: nền #0B0F19 (gần đen) + emerald (445 lượt, áp
   đảo) khớp đúng kiểu bị cấm trong skill `giao-dien-ui-design` — "nền gần đen +
   đúng một màu xanh lá chói". Đó là lý do đo được cho nhận xét "trông như đồ chơi".

   Vì sao không phải nền kem: skill cũng cấm "nền kem #F4F1EA + serif + đất nung".
   Nền ở đây là xám-lạnh #F5F6F8, chữ sans, không có màu đất nung.

   ═══ LUẬT 2 TOKEN ═══
   Mỗi vai trò màu có HAI giá trị: một làm NỀN, một làm CHỮ. Một màu không gánh
   được hai vai — đủ sẫm để chữ trắng đọc được trên nút thì quá sẫm để tự nó làm
   chữ trên nền sáng.

   ═══ MÀU KHÔNG BAO GIỜ LÀ DẤU HIỆU DUY NHẤT ═══
   Khoảng 8% nam giới mù màu đỏ-lục. Lãi và lỗ vì vậy phải khác nhau CẢ ĐỘ SÁNG
   (bài test bắt buộc ≥1,3 lần), VÀ mọi chỗ hiển thị lãi/lỗ phải kèm dấu ▲ ▼
   hoặc + − — không được chỉ đổi màu.

   Viền cũng theo luật đó:
     `vien`   — đường kẻ trang trí, không có ngưỡng tương phản
     `vienRo` — viền Ô NHẬP và NÚT, bắt buộc ≥3.0 (WCAG 1.4.11)

   Mọi cặp dưới đây ĐÃ ĐO, không phải chọn bằng mắt. Chạy:
     node scripts/test-mau-giao-dien.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

/** Bảng SÁNG — mặc định. Mọi vai trò màu PHẢI có đủ ở đây. */
export const SANG = {
  nen: '#F5F6F8',
  the: '#FFFFFF',
  the2: '#EEF0F4',
  vien: '#DCE0E7',
  vienRo: '#818A99',
  chu: '#0F1520',
  chuPhu: '#414A59',
  chuMo: '#646D7C',
  nhan: '#12386E',
  nhanChu: '#12386E',
  tot: '#0A7A45',
  totNen: '#E4F5EC',
  loi: '#A00F24',
  loiNen: '#FCE9EC',
  canhBao: '#8A5A00',
  canhBaoNen: '#FBF0DC'
};

/** Bảng TỐI — CHỈ định nghĩa lại giá trị, không thêm vai trò mới. */
export const TOI = {
  nen: '#0E1218',
  the: '#161C25',
  the2: '#1E2733',
  vien: '#2A3441',
  vienRo: '#697585',
  chu: '#EEF1F5',
  chuPhu: '#B3BCC9',
  chuMo: '#8B95A3',
  nhan: '#5B9BF0',
  nhanChu: '#7FB4F5',
  tot: '#3DD68C',
  totNen: '#12301F',
  loi: '#F2596D',
  loiNen: '#3A1620',
  canhBao: '#F2B950',
  canhBaoNen: '#332506'
};

/** Chữ nằm TRÊN màu nhấn (nút bấm). Khác nhau giữa hai chế độ. */
export const CHU_TREN_NHAN = { sang: '#FFFFFF', toi: '#0E1218' };

/* ═══ MÀU ĐƯỜNG BIỂU ĐỒ ═══
   Biểu đồ nhiều đường thì bắt buộc phải phân biệt được nhau, nên đây là nhóm
   màu DUY NHẤT được phép nhiều sắc. Xếp theo thứ tự dùng: đường thứ nhất lấy
   phần tử đầu. Đã chọn để phân biệt được cả với mắt mù màu (khác cả độ sáng).

   KHÔNG dùng nhóm này cho nền, chữ hay viền — chỉ cho nét vẽ trên biểu đồ. */
export const MAU_BIEU_DO = ['#12386E', '#B8860B', '#8E44AD', '#0E7C86', '#C2560F'];

/* ═══ MIỄN TRỪ — được phép viết cứng, có lý do ═══
   Bài test màu bỏ qua đúng những chỗ này, không bỏ qua chỗ khác. */
export const MIEN_TRU = {
  /* Màu thương hiệu Google trên nút đăng nhập. Hướng dẫn nhận diện của Google
     bắt buộc dùng đúng mã màu — đổi là dùng sai thương hiệu người khác. */
  thuongHieu: ['#4285F4', '#EA4335', '#FBBC05', '#34A853'],
  /* Tranh minh hoạ linh vật Capy. Một bức tranh có bảng màu riêng, giống như
     logo — nó không phải giao diện nên không theo chế độ sáng/tối. */
  fileTranh: ['CapyMat.tsx', 'Capy.tsx']
};

/** Thang chữ — 6 nấc, thang HẸP vì đây là app nhiều dữ liệu. */
export const THANG_CHU = {
  xs: '12px',
  sm: '13px',
  base: '15px',
  lg: '18px',
  xl: '22px',
  '2xl': '28px'
};

/** Bo góc — đúng 4 nấc, không hơn. */
export const BO_GOC = { sm: '4px', md: '8px', lg: '14px', full: '9999px' };

/* Phông: ghép hai bộ, cả hai đều có bộ dấu tiếng Việt thật.
   - Archivo   : tiêu đề, có cá tính
   - Be Vietnam Pro : thân bài và SỐ (bật tnum cho số thẳng cột)
   Skill cấm Inter và Space Grotesk vì là lựa chọn "an toàn" mặc định. */
export const PHONG = {
  tieuDe: ['Archivo', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
  than: ['Be Vietnam Pro', 'system-ui', '-apple-system', 'sans-serif']
};

/** Mọi cặp chữ/nền phải đạt. Bài test đọc đúng danh sách này. */
export const CAP_PHAI_DAT = [
  ['chữ chính / nền trang', 'chu', 'nen', 4.5],
  ['chữ chính / nền thẻ', 'chu', 'the', 4.5],
  ['chữ chính / nền thẻ chìm', 'chu', 'the2', 4.5],
  ['chữ phụ / nền thẻ', 'chuPhu', 'the', 4.5],
  ['chữ phụ / nền trang', 'chuPhu', 'nen', 4.5],
  ['chữ mờ / nền thẻ', 'chuMo', 'the', 4.5],
  ['chữ mờ / nền trang', 'chuMo', 'nen', 4.5],
  ['màu nhấn làm chữ / nền thẻ', 'nhanChu', 'the', 4.5],
  ['màu nhấn làm chữ / nền trang', 'nhanChu', 'nen', 4.5],
  ['lãi làm chữ / nền thẻ', 'tot', 'the', 4.5],
  ['lãi làm chữ / nền lãi', 'tot', 'totNen', 4.5],
  ['lỗ làm chữ / nền thẻ', 'loi', 'the', 4.5],
  ['lỗ làm chữ / nền lỗ', 'loi', 'loiNen', 4.5],
  ['cảnh báo làm chữ / nền thẻ', 'canhBao', 'the', 4.5],
  ['cảnh báo làm chữ / nền cảnh báo', 'canhBao', 'canhBaoNen', 4.5],
  ['viền ô nhập / nền thẻ', 'vienRo', 'the', 3.0],
  ['viền ô nhập / nền trang', 'vienRo', 'nen', 3.0]
];

/** Tỉ lệ tương phản WCAG giữa hai màu hex. */
export function tuongPhan(mauA, mauB) {
  const doSang = (h) => {
    let s = h.replace('#', '');
    if (s.length === 3) s = s.split('').map((c) => c + c).join('');
    const [r, g, b] = [0, 2, 4]
      .map((i) => parseInt(s.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [cao, thap] = [doSang(mauA), doSang(mauB)].sort((a, b) => b - a);
  return (cao + 0.05) / (thap + 0.05);
}
