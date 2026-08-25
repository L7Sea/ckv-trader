export type NeoVao = 'dau' | 'canh';

export interface PhuKien {
  ten: string;
  neo: NeoVao;
  hinh: string;
  tren?: boolean;
}

const NET = '#231F20';

const _PK = {
  /* ── 1 Quả cam trên đầu ── */
  cam: {
    ten: 'Quả cam trên đầu', neo: 'dau',
    hinh: `<circle cx="100" cy="27" r="14" fill="#FF8A00" stroke="${NET}" stroke-width="4.5"/>
           <path d="M100 13 Q102 7 106 6" stroke="#5D4037" stroke-width="3" fill="none" stroke-linecap="round"/>
           <path d="M102 9 Q112 7 111 15 Q104 14 102 9 Z" fill="#4CAF50" stroke="${NET}" stroke-width="2.2"/>
           <ellipse cx="96" cy="23" rx="4" ry="2.2" fill="#FFA726" transform="rotate(-30 96 23)"/>`,
  },

  /* ── Tháp 3 quả cam chồng lên đầu (như ảnh 4/5) ── */
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

  /* ── Khăn tắm gấp vuông đắp đầu (Onsen) ── */
  khanTam: {
    ten: 'Khăn tắm trên đầu', neo: 'dau',
    hinh: `<rect x="76" y="24" width="48" height="16" rx="5" fill="#F8FAFC" stroke="${NET}" stroke-width="4"/>
           <line x1="76" y1="32" x2="124" y2="32" stroke="#CBD5E1" stroke-width="2"/>`,
  },

  /* ── Vịt vàng trên đầu ── */
  vitVang: {
    ten: 'Vịt vàng trên đầu', neo: 'dau',
    hinh: `<ellipse cx="100" cy="30" rx="16" ry="12" fill="#f7d046" stroke="${NET}" stroke-width="3.5"/>
           <circle cx="110" cy="21" r="9" fill="#f7d046" stroke="${NET}" stroke-width="3.5"/>
           <path d="M118 20 l9 3 -9 4 z" fill="#f0912e" stroke="${NET}" stroke-width="2.4" stroke-linejoin="round"/>
           <circle cx="112" cy="19" r="2" fill="${NET}"/>`,
  },

  /* ── Chim nhỏ ── */
  chim: {
    ten: 'Chim nhỏ', neo: 'dau',
    hinh: `<ellipse cx="100" cy="28" rx="13" ry="11" fill="#f7d046" stroke="${NET}" stroke-width="3"/>
           <path d="M112 26 l8 3 -8 3 z" fill="#f0912e" stroke="${NET}" stroke-width="2.2" stroke-linejoin="round"/>
           <circle cx="105" cy="24" r="2" fill="${NET}"/>`,
  },

  /* ── Cài hoa ── */
  hoa: {
    ten: 'Cài hoa', neo: 'dau',
    hinh: `<g transform="translate(64 30)">
             ${[0, 72, 144, 216, 288].map((d) => `<ellipse cx="${13 * Math.cos(d * Math.PI / 180)}" cy="${13 * Math.sin(d * Math.PI / 180)}" rx="8" ry="6" fill="#fff" stroke="${NET}" stroke-width="2.6" transform="rotate(${d})"/>`).join('')}
             <circle cx="0" cy="0" r="6" fill="#f5c542" stroke="${NET}" stroke-width="2.6"/>
           </g>`,
  },

  /* ── Nơ đỏ ── */
  no: {
    ten: 'Nơ đỏ', neo: 'dau',
    hinh: `<path d="M100 36 L78 24 L78 48 Z M100 36 L122 24 L122 48 Z" fill="#e0455f" stroke="${NET}" stroke-width="3" stroke-linejoin="round"/>
           <circle cx="100" cy="36" r="6" fill="#e0455f" stroke="${NET}" stroke-width="3"/>`,
  },

  /* ── Kính râm cực ngầu ── */
  kinhRam: {
    ten: 'Kính râm cực ngầu', neo: 'dau', tren: true,
    hinh: `<path d="M50 92 h34 v18 h-34 z M116 92 h34 v18 h-34 z M84 99 h32" stroke="${NET}" stroke-width="5" fill="#1E293B" stroke-linejoin="round"/>
           <line x1="58" y1="96" x2="72" y2="106" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
           <line x1="124" y1="96" x2="138" y2="106" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`,
  },

  /* ── Kính cận trí thức ── */
  kinhCan: {
    ten: 'Kính cận', neo: 'dau', tren: true,
    hinh: `<circle cx="68" cy="98" r="15" fill="none" stroke="${NET}" stroke-width="4.5"/>
           <circle cx="132" cy="98" r="15" fill="none" stroke="${NET}" stroke-width="4.5"/>
           <line x1="83" y1="98" x2="117" y2="98" stroke="${NET}" stroke-width="4.5"/>`,
  },

  /* ── Nón bảo hộ ── */
  nonBaoHo: {
    ten: 'Nón bảo hộ', neo: 'dau',
    hinh: `<path d="M38 52 C38 20 162 20 162 52 Z" fill="#f5c542" stroke="${NET}" stroke-width="4.5" stroke-linejoin="round"/>
           <path d="M26 52 h148 v8 h-148 z" fill="#f5c542" stroke="${NET}" stroke-width="4.5"/>`,
  },

  /* ── Cà vạt ── */
  caVat: {
    ten: 'Cà vạt', neo: 'canh',
    hinh: `<path d="M96 172 l8 0 l4 24 l-8 12 l-8 -12 z" fill="#e0455f" stroke="${NET}" stroke-width="3.5" stroke-linejoin="round"/>`,
  },

  /* ── Miếng dưa hấu ── */
  duaHau: {
    ten: 'Miếng dưa hấu', neo: 'canh',
    hinh: `<path d="M30 186 A 22 22 0 0 0 74 186 Z" fill="#e0455f" stroke="${NET}" stroke-width="3.5"/>
           <path d="M30 186 A 22 22 0 0 0 74 186" stroke="#4c8b3a" stroke-width="5" fill="none"/>
           <circle cx="46" cy="194" r="1.8" fill="${NET}"/><circle cx="58" cy="194" r="1.8" fill="${NET}"/>`,
  },

  /* ── Ly trà sữa ── */
  traSua: {
    ten: 'Ly trà sữa', neo: 'canh',
    hinh: `<path d="M26 190 L32 230 L52 230 L58 190 Z" fill="#f3d5b5" stroke="${NET}" stroke-width="3"/>
           <line x1="42" y1="176" x2="42" y2="200" stroke="#52525b" stroke-width="4" stroke-linecap="round"/>
           <circle cx="38" cy="222" r="2.5" fill="${NET}"/><circle cx="46" cy="222" r="2.5" fill="${NET}"/>`,
  },

  /* ── Pháo giấy ăn mừng ── */
  phaoGiay: {
    ten: 'Pháo giấy', neo: 'canh',
    hinh: `<g>
             <circle cx="28" cy="170" r="3.5" fill="#e0455f"/>
             <circle cx="40" cy="158" r="3" fill="#f5c542"/>
             <circle cx="160" cy="164" r="3.5" fill="#3b82f6"/>
             <circle cx="172" cy="176" r="3" fill="#10b981"/>
           </g>`,
  },

  /* ── Mưa ── */
  mua: {
    ten: 'Mưa buồn', neo: 'canh',
    hinh: `<g stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round">
             <line x1="26" y1="20" x2="20" y2="40"/>
             <line x1="56" y1="10" x2="50" y2="30"/>
             <line x1="150" y1="16" x2="144" y2="36"/>
             <line x1="178" y1="30" x2="172" y2="50"/>
           </g>`,
  },
} as const;

export type TenPhuKien = keyof typeof _PK;
export const PHU_KIEN: Record<TenPhuKien, PhuKien> = _PK;
export const DS_PHU_KIEN = Object.keys(PHU_KIEN) as TenPhuKien[];
