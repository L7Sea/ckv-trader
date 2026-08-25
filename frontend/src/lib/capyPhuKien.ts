/* ═══════════════════════════════════════════════════════════════
   TỦ PHỤ KIỆN BÉ CAPY CKV PRO TRADER
   Các món đồ trang trí, phụ kiện đội đầu, cầm tay và hiệu ứng
   Được thiết kế đồng bộ nét than đen #231F20 chuẩn CKV.
   ═══════════════════════════════════════════════════════════════ */

export type NeoVao = 'dau' | 'canh';

export interface PhuKien {
  ten: string;
  neo: NeoVao;
  hinh: string;
  tren?: boolean;
}

const NET = '#231F20';

const _PK = {
  /* ── 1. Quả cam đơn trên đầu (Gốc CKV) ── */
  cam: {
    ten: 'Quả cam trên đầu', neo: 'dau',
    hinh: `<circle cx="100" cy="27" r="14" fill="#FF8A00" stroke="${NET}" stroke-width="4.5"/>
           <path d="M100 13 Q102 7 106 6" stroke="#5D4037" stroke-width="3" fill="none" stroke-linecap="round"/>
           <path d="M102 9 Q112 7 111 15 Q104 14 102 9 Z" fill="#4CAF50" stroke="${NET}" stroke-width="2.2"/>
           <ellipse cx="96" cy="23" rx="4" ry="2.2" fill="#FFA726" transform="rotate(-30 96 23)"/>`,
  },

  /* ── 2. Tháp 3 quả cam chồng lên đầu ── */
  thap3Cam: {
    ten: 'Tháp 3 quả cam', neo: 'dau',
    hinh: `<g>
      <circle cx="92" cy="30" r="11" fill="#FF8A00" stroke="${NET}" stroke-width="3.8"/>
      <circle cx="108" cy="30" r="11" fill="#FF8A00" stroke="${NET}" stroke-width="3.8"/>
      <circle cx="100" cy="14" r="10" fill="#FF8A00" stroke="${NET}" stroke-width="3.8"/>
      <path d="M100 4 Q102 0 105 0" stroke="#5D4037" stroke-width="2.5" fill="none"/>
      <path d="M101 2 Q108 1 107 7 Z" fill="#4CAF50" stroke="${NET}" stroke-width="1.8"/>
    </g>`,
  },

  /* ── 3. Khăn tắm Onsen gấp vuông ── */
  khanTam: {
    ten: 'Khăn tắm Onsen', neo: 'dau',
    hinh: `<rect x="76" y="24" width="48" height="16" rx="5" fill="#F8FAFC" stroke="${NET}" stroke-width="4"/>
           <line x1="76" y1="32" x2="124" y2="32" stroke="#CBD5E1" stroke-width="2"/>`,
  },

  /* ── 4. Vịt vàng trên đầu ── */
  vitVang: {
    ten: 'Vịt vàng trên đầu', neo: 'dau',
    hinh: `<ellipse cx="100" cy="30" rx="16" ry="12" fill="#f7d046" stroke="${NET}" stroke-width="3.5"/>
           <circle cx="110" cy="21" r="9" fill="#f7d046" stroke="${NET}" stroke-width="3.5"/>
           <path d="M118 20 l9 3 -9 4 z" fill="#f0912e" stroke="${NET}" stroke-width="2.4" stroke-linejoin="round"/>
           <circle cx="112" cy="19" r="2" fill="${NET}"/>`,
  },

  /* ── 5. Chim nhỏ ── */
  chim: {
    ten: 'Chim nhỏ', neo: 'dau',
    hinh: `<ellipse cx="100" cy="28" rx="13" ry="11" fill="#f7d046" stroke="${NET}" stroke-width="3"/>
           <path d="M112 26 l8 3 -8 3 z" fill="#f0912e" stroke="${NET}" stroke-width="2.2" stroke-linejoin="round"/>
           <circle cx="105" cy="24" r="2" fill="${NET}"/>`,
  },

  /* ── 6. Cài hoa ── */
  hoa: {
    ten: 'Cài hoa', neo: 'dau',
    hinh: `<g transform="translate(64 30)">
             ${[0, 72, 144, 216, 288].map((d) => `<ellipse cx="${13 * Math.cos(d * Math.PI / 180)}" cy="${13 * Math.sin(d * Math.PI / 180)}" rx="8" ry="6" fill="#fff" stroke="${NET}" stroke-width="2.6" transform="rotate(${d})"/>`).join('')}
             <circle cx="0" cy="0" r="6" fill="#f5c542" stroke="${NET}" stroke-width="2.6"/>
           </g>`,
  },

  /* ── 7. Nơ đỏ ── */
  no: {
    ten: 'Nơ đỏ', neo: 'dau',
    hinh: `<path d="M100 36 L78 24 L78 48 Z M100 36 L122 24 L122 48 Z" fill="#e0455f" stroke="${NET}" stroke-width="3" stroke-linejoin="round"/>
           <circle cx="100" cy="36" r="6" fill="#e0455f" stroke="${NET}" stroke-width="3"/>`,
  },

  /* ── 8. Mũ len mùa đông ── */
  muLen: {
    ten: 'Mũ len mùa đông', neo: 'dau',
    hinh: `<path d="M52 48 C 52 20 148 20 148 48 Z" fill="#c0455f" stroke="${NET}" stroke-width="3.6" stroke-linejoin="round"/>
           <rect x="46" y="44" width="108" height="14" rx="7" fill="#e8e2d8" stroke="${NET}" stroke-width="3.4"/>
           <circle cx="100" cy="16" r="10" fill="#e8e2d8" stroke="${NET}" stroke-width="3.2"/>`,
  },

  /* ── 9. Nón bảo hộ công trường (bắt đáy) ── */
  nonBaoHo: {
    ten: 'Nón bảo hộ', neo: 'dau',
    hinh: `<path d="M38 52 C38 20 162 20 162 52 Z" fill="#f5c542" stroke="${NET}" stroke-width="4.5" stroke-linejoin="round"/>
           <path d="M26 52 h148 v8 h-148 z" fill="#f5c542" stroke="${NET}" stroke-width="4.5"/>`,
  },

  /* ── 10. Mũ đầu bếp ── */
  muDauBep: {
    ten: 'Mũ đầu bếp', neo: 'dau',
    hinh: `<path d="M64 46 C 50 46 48 22 66 22 C 68 8 132 8 134 22 C 152 22 150 46 136 46 Z" fill="#fff" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>
           <rect x="64" y="42" width="72" height="12" rx="4" fill="#fff" stroke="${NET}" stroke-width="3.2"/>`,
  },

  /* ── 11. Kính râm tài phiệt (Vẽ đè lên mắt) ── */
  kinhRam: {
    ten: 'Kính râm cực ngầu', neo: 'dau', tren: true,
    hinh: `<path d="M50 92 h34 v18 h-34 z M116 92 h34 v18 h-34 z M84 99 h32" stroke="${NET}" stroke-width="5" fill="#1E293B" stroke-linejoin="round"/>
           <line x1="58" y1="96" x2="72" y2="106" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
           <line x1="124" y1="96" x2="138" y2="106" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`,
  },

  /* ── 12. Kính cận học giả ── */
  kinhCan: {
    ten: 'Kính cận', neo: 'dau', tren: true,
    hinh: `<circle cx="68" cy="98" r="15" fill="none" stroke="${NET}" stroke-width="4.5"/>
           <circle cx="132" cy="98" r="15" fill="none" stroke="${NET}" stroke-width="4.5"/>
           <line x1="83" y1="98" x2="117" y2="98" stroke="${NET}" stroke-width="4.5"/>`,
  },

  /* ── 13. Khăn quàng cổ ── */
  khanQuang: {
    ten: 'Khăn quàng cổ', neo: 'canh',
    hinh: `<path d="M56 148 C 80 164 120 164 144 148 L 148 166 C 120 182 80 182 52 166 Z" fill="#c0455f" stroke="${NET}" stroke-width="3.6" stroke-linejoin="round"/>
           <path d="M138 166 L 152 210 L 132 214 L 124 172 Z" fill="#c0455f" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>`,
  },

  /* ── 14. Cà vạt Pro Trader ── */
  caVat: {
    ten: 'Cà vạt Pro Trader', neo: 'canh',
    hinh: `<path d="M96 160 l8 0 l4 24 l-8 12 l-8 -12 z" fill="#e0455f" stroke="${NET}" stroke-width="3.5" stroke-linejoin="round"/>`,
  },

  /* ── 15. Ly trà sữa ── */
  traSua: {
    ten: 'Ly trà sữa', neo: 'canh',
    hinh: `<path d="M158 178 L 186 178 L 181 232 L 163 232 Z" fill="#e6c9a8" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>
           <rect x="156" y="172" width="32" height="8" rx="3" fill="#fff" stroke="${NET}" stroke-width="3"/>
           <path d="M176 172 L 182 142" stroke="${NET}" stroke-width="5" stroke-linecap="round"/>
           <circle cx="168" cy="218" r="4" fill="${NET}"/>
           <circle cx="178" cy="220" r="4" fill="${NET}"/>
           <circle cx="172" cy="226" r="4" fill="${NET}"/>`,
  },

  /* ── 16. Cặp táp ── */
  capTap: {
    ten: 'Cặp táp', neo: 'canh',
    hinh: `<rect x="150" y="196" width="44" height="34" rx="5" fill="#8a5a34" stroke="${NET}" stroke-width="3.6"/>
           <path d="M164 196 q8 -12 16 0" stroke="${NET}" stroke-width="3.4" fill="none"/>
           <rect x="166" y="208" width="12" height="8" rx="2" fill="#e0b060" stroke="${NET}" stroke-width="2.6"/>`,
  },

  /* ── 17. Laptop bảng điện tử ── */
  laptop: {
    ten: 'Laptop', neo: 'canh',
    hinh: `<path d="M62 208 L 138 208 L 146 232 L 54 232 Z" fill="#8f9aa8" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>
           <rect x="70" y="164" width="60" height="46" rx="4" fill="#22303f" stroke="${NET}" stroke-width="3.6"/>
           <rect x="76" y="170" width="48" height="34" rx="2" fill="#10b981"/>`,
  },

  /* ── 18. Miếng dưa hấu ── */
  duaHau: {
    ten: 'Miếng dưa hấu', neo: 'canh',
    hinh: `<path d="M150 226 A 40 40 0 0 1 194 190 L 194 226 Z" fill="#e8455f" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>
           <path d="M152 228 A 42 42 0 0 1 194 188" stroke="#4c8b3a" stroke-width="7" fill="none"/>
           <ellipse cx="172" cy="214" rx="2.6" ry="4" fill="${NET}"/>
           <ellipse cx="182" cy="206" rx="2.6" ry="4" fill="${NET}"/>`,
  },

  /* ── 19. Pháo giấy ăn mừng tím sàn ── */
  phaoGiay: {
    ten: 'Pháo giấy ăn mừng', neo: 'canh',
    hinh: `${[['#f5c542', 22, 40], ['#e0455f', 172, 34], ['#4d94ff', 40, 96], ['#4c8b3a', 176, 104], ['#f07f9c', 14, 150], ['#f2b21c', 188, 156]]
      .map(([m, x, y]) => `<rect x="${x}" y="${y}" width="11" height="11" rx="2" fill="${m}" transform="rotate(${(Number(x) * 7) % 90} ${x} ${y})"/>`).join('')}`,
  },

  /* ── 20. Mây mưa buồn cắt lỗ ── */
  mua: {
    ten: 'Mưa buồn', neo: 'canh',
    hinh: `<path d="M46 22 C 46 6 96 2 104 18 C 130 12 146 28 138 44 L 52 44 C 38 44 38 26 46 22 Z" fill="#9aa9bb" stroke="${NET}" stroke-width="3.2" stroke-linejoin="round"/>
           ${[[62, 54], [86, 60], [110, 54], [132, 60]].map(([x, y]) => `<path d="M${x} ${y} l-4 16" stroke="#6ec5f0" stroke-width="4" stroke-linecap="round"/>`).join('')}`,
  },
} satisfies Record<string, PhuKien>;

export const PHU_KIEN: Record<TenPhuKien, PhuKien> = _PK;
export type TenPhuKien = keyof typeof _PK;
export const DS_PHU_KIEN = Object.keys(_PK) as TenPhuKien[];
