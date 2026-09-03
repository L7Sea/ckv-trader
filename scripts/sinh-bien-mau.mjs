/* ═══════════════════════════════════════════════════════════════════════════
   SINH BIẾN MÀU CSS TỪ BẢNG MÀU
   ───────────────────────────────────────────────────────────────────────────
   Đọc `frontend/src/theme/bang-mau.js` rồi ghi khối biến vào
   `frontend/src/index.css`. Gõ tay hai nơi là kiểu gì cũng lệch — lỗi thật đã
   xảy ra: đổi bảng màu nhưng 12 chỗ viết cứng vẫn giữ màu cũ.

   Chạy: node scripts/sinh-bien-mau.mjs
   Sau đó: node scripts/test-mau-giao-dien.mjs   (kiểm lại tương phản)
   ═══════════════════════════════════════════════════════════════════════════ */

import { writeFileSync } from 'node:fs';
import { CHU_TREN_NHAN, SANG, TOI } from '../frontend/src/theme/bang-mau.js';

/** Tên khoá trong bảng màu → tên biến CSS. */
const KHOA_CSS = {
  nen: '--nen',
  the: '--the',
  the2: '--the-2',
  vien: '--vien',
  vienRo: '--vien-ro',
  chu: '--chu',
  chuPhu: '--chu-phu',
  chuMo: '--chu-mo',
  nhan: '--nhan',
  nhanChu: '--nhan-chu',
  tot: '--tot',
  totNen: '--tot-nen',
  loi: '--loi',
  loiNen: '--loi-nen',
  canhBao: '--canh-bao',
  canhBaoNen: '--canh-bao-nen'
};

const bien = (bang, trenNhan, thut) =>
  Object.entries(KHOA_CSS)
    .map(([khoa, ten]) => `${thut}${ten}: ${bang[khoa]};`)
    .join('\n') + `\n${thut}--tren-nhan: ${trenNhan};`;

const css = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ═══════════════════════════════════════════════════════════════════════════
   BIẾN MÀU — SINH TỰ ĐỘNG, ĐỪNG SỬA TAY
   Nguồn: frontend/src/theme/bang-mau.js
   Sinh lại: node scripts/sinh-bien-mau.mjs

   Luật: bảng SÁNG định nghĩa ĐẦY ĐỦ mọi biến ở \`:root\` trần. Hai khối tối CHỈ
   định nghĩa lại giá trị, không thêm biến mới. Biến nào chỉ tồn tại trong khối
   tối thì ở chế độ mặc định nó không tồn tại — chữ chế độ này sẽ nằm trên nền
   chế độ kia. Đó là lỗi giao diện phổ biến nhất.
   ═══════════════════════════════════════════════════════════════════════════ */
:root {
  color-scheme: light dark;

${bien(SANG, CHU_TREN_NHAN.sang, '  ')}
}

/* Máy để chế độ tối, và người dùng CHƯA tự chọn sáng */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${bien(TOI, CHU_TREN_NHAN.toi, '    ')}
  }
}

/* Người dùng tự gạt sang tối — thắng cả cài đặt của máy */
:root[data-theme='dark'] {
${bien(TOI, CHU_TREN_NHAN.toi, '  ')}
}

@layer base {
  body {
    @apply bg-nen text-chu font-than;
    -webkit-font-smoothing: antialiased;
    /* Số thẳng cột — bắt buộc với app tài chính để mắt so sánh được theo hàng */
    font-variant-numeric: tabular-nums;
  }

  h1, h2, h3, h4 {
    @apply font-tieu-de;
  }

  /* Đi bằng bàn phím phải NHÌN THẤY mình đang ở đâu (sàn chất lượng mục 5) */
  :focus-visible {
    outline: 2px solid var(--nhan-chu);
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Vùng chạm tối thiểu 44px trên điện thoại (sàn chất lượng mục 4).
     Đặt một luật chung ở đây thay vì sửa tay từng nút: đo được 26 nút chỉ cao
     34px, và cứ thêm nút mới là lại sót. Luật này bắt cả nút thêm sau này. */
  @media (max-width: 767px) {
    button,
    [role='button'],
    input[type='submit'],
    input[type='button'] {
      min-height: 44px;
    }

    /* Nút chỉ có biểu tượng thì cũng cần đủ rộng, không riêng chiều cao */
    button:not(:has(span)):not(:has(p)) {
      min-width: 44px;
    }
  }
}

/* Tôn trọng người đã tắt hiệu ứng chuyển động (sàn chất lượng mục 8) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@layer components {
  /* Thẻ nội dung. Thay cho .glass cũ — .glass viết cứng rgba() nên không đổi
     được theo chế độ sáng/tối. */
  .the {
    @apply bg-the border border-vien rounded-lg;
  }

  .the-chim {
    @apply bg-the2 border border-vien rounded-md;
  }

  /* Nút bấm cao ≥44px cho ngón tay trên điện thoại (sàn chất lượng mục 4) */
  .nut {
    @apply inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-md
           font-semibold text-sm transition-colors duration-150;
  }

  .nut-chinh {
    @apply nut bg-nhan text-tren-nhan hover:opacity-90;
  }

  .nut-phu {
    @apply nut bg-the border border-vien-ro text-chu hover:bg-the2;
  }

  /* Ô nhập dùng vien-ro (≥3.0) chứ không phải vien trang trí */
  .o-nhap {
    @apply w-full min-h-[44px] px-3 rounded-md bg-the border border-vien-ro
           text-chu placeholder:text-chu-mo;
  }

  /* Số tiền: luôn thẳng cột */
  .so {
    font-variant-numeric: tabular-nums;
    @apply font-semibold;
  }
}

/* ═══ CHUYỂN ĐỘNG CÓ CHỦ ĐÍCH ═══
   Skill cấm hoạt hình dài quá 250ms ở app dùng hằng ngày, và cấm chuyển động
   lặp vô tận không do người dùng gây ra. Bốn thứ dưới đây đều có lý do:
   vào/ra để mắt bắt được thứ vừa xuất hiện, số đổi để biết nó vừa đổi,
   khung xương để biết đang chờ chứ không phải treo. */

@keyframes hienLen {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes soDoi {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes khungXuong {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
}

/* Giữ tên .animate-in vì đang dùng ở 19 chỗ — đổi tên là hỏng hết một lượt */
.animate-in {
  animation: hienLen 200ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

.so-doi {
  animation: soDoi 200ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

.khung-xuong {
  animation: khungXuong 1.4s ease-in-out infinite;
  @apply bg-the2 rounded-md;
}
`;

writeFileSync(new URL('../frontend/src/index.css', import.meta.url), css);
console.log('✅ Đã sinh frontend/src/index.css từ bang-mau.js');
console.log('   Tiếp theo: node scripts/test-mau-giao-dien.mjs');
