import { BO_GOC, PHONG, THANG_CHU } from './src/theme/bang-mau.js';

/* ═══════════════════════════════════════════════════════════════════════════
   Màu KHÔNG viết trực tiếp ở đây mà trỏ vào biến CSS, để chỉ cần đổi biến là
   cả app đổi chế độ sáng/tối. Giá trị thật của biến nằm ở `src/index.css`,
   và cả hai đều lấy từ nguồn duy nhất `src/theme/bang-mau.js`.

   Nhờ vậy `bg-the`, `text-chu`, `border-vien` tự đúng ở CẢ hai chế độ mà không
   cần viết `dark:` ở từng chỗ.
   ═══════════════════════════════════════════════════════════════════════════ */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Nền — 3 nấc
        nen: 'var(--nen)',
        the: 'var(--the)',
        the2: 'var(--the-2)',
        // Viền — 2 vai trò
        vien: 'var(--vien)',
        'vien-ro': 'var(--vien-ro)',
        // Chữ — 3 nấc
        chu: 'var(--chu)',
        'chu-phu': 'var(--chu-phu)',
        'chu-mo': 'var(--chu-mo)',
        // Nhấn — 2 token
        nhan: 'var(--nhan)',
        'nhan-chu': 'var(--nhan-chu)',
        'tren-nhan': 'var(--tren-nhan)',
        // Ngữ nghĩa — mỗi màu 2 token
        tot: 'var(--tot)',
        'tot-nen': 'var(--tot-nen)',
        loi: 'var(--loi)',
        'loi-nen': 'var(--loi-nen)',
        'canh-bao': 'var(--canh-bao)',
        'canh-bao-nen': 'var(--canh-bao-nen)'
      },
      fontFamily: {
        'tieu-de': PHONG.tieuDe,
        than: PHONG.than
      },
      fontSize: Object.fromEntries(Object.entries(THANG_CHU).map(([k, v]) => [k, v])),
      borderRadius: BO_GOC
    }
  },
  plugins: []
};
