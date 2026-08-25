/* ═══════════════════════════════════════════════════════════════
   TỦ ĐỒ CỦA BÉ CAPY — lớp PHỤ KIỆN trong kiến trúc búp bê giấy.

   Mỗi món chỉ là một mẩu SVG + cho biết nó BÁM VÀO ĐÂU:
     'dau'  — nằm trong nhóm đầu, đầu dời thì món dời theo (cam, mũ,
              kính, nơ...). Toạ độ tính theo đầu chuẩn quanh (100, 96).
     'canh' — nằm ở toạ độ tuyệt đối trên khung 200×250 (cặp táp đặt
              cạnh chân, ly trà sữa để bên hông...).

   Thêm một món mới = thêm ĐÚNG MỘT dòng vào bảng dưới. Không phải sửa
   component, không phải sửa test, không phải upload file lên đâu cả.

   Đây là thiết kế gốc — không cắt từ bộ sticker nào.
   ═══════════════════════════════════════════════════════════════ */

export type NeoVao = 'dau' | 'canh';

export interface PhuKien {
  ten: string;
  neo: NeoVao;
  /** Mẩu SVG. Dùng chuỗi để bảng này là DỮ LIỆU THUẦN — test được bằng Node. */
  hinh: string;
  /** Món này che mắt (kính) → vẽ SAU khuôn mặt */
  tren?: boolean;
}

const NET = '#1c1c1c';   // nét viền ĐEN, khớp với thân bé trong CapyMat

const _PK = {
  /* ── Đội trên đầu ── */
  cam: {
    ten: 'Quả cam trên đầu', neo: 'dau',
    hinh: `<circle cx="100" cy="26" r="15" fill="#f59331" stroke="${NET}" stroke-width="3.5"/>
           <path d="M100 12 q7 -7 13 -3" stroke="#4c8b3a" stroke-width="4" fill="none" stroke-linecap="round"/>
           <ellipse cx="94" cy="21" rx="4" ry="3" fill="#fff" opacity=".45"/>`,
  },
  hoa: {
    ten: 'Cài hoa', neo: 'dau',
    hinh: `<g transform="translate(64 30)">
             ${[0, 72, 144, 216, 288].map((d) => `<ellipse cx="${13 * Math.cos(d * Math.PI / 180)}" cy="${13 * Math.sin(d * Math.PI / 180)}" rx="8" ry="6" fill="#fff" stroke="${NET}" stroke-width="2.6" transform="rotate(${d})"/>`).join('')}
             <circle cx="0" cy="0" r="6" fill="#f5c542" stroke="${NET}" stroke-width="2.6"/>
           </g>`,
  },
  vitVang: {
    ten: 'Vịt vàng trên đầu', neo: 'dau',
    hinh: `<ellipse cx="100" cy="30" rx="16" ry="12" fill="#f7d046" stroke="${NET}" stroke-width="3"/>
           <circle cx="110" cy="21" r="9" fill="#f7d046" stroke="${NET}" stroke-width="3"/>
           <path d="M118 20 l9 3 -9 4 z" fill="#f0912e" stroke="${NET}" stroke-width="2.4" stroke-linejoin="round"/>
           <circle cx="112" cy="19" r="2" fill="${NET}"/>`,
  },
  chim: {
    ten: 'Chim nhỏ trên đầu', neo: 'dau',
    hinh: `<ellipse cx="100" cy="28" rx="13" ry="11" fill="#f7d046" stroke="${NET}" stroke-width="3"/>
           <path d="M112 26 l8 3 -8 3 z" fill="#f0912e" stroke="${NET}" stroke-width="2.2" stroke-linejoin="round"/>
           <circle cx="105" cy="24" r="2" fill="${NET}"/>
           <path d="M92 28 q7 -6 13 0" stroke="${NET}" stroke-width="2.2" fill="none"/>`,
  },
  muLen: {
    ten: 'Mũ len mùa đông', neo: 'dau',
    hinh: `<path d="M52 48 C 52 20 148 20 148 48 Z" fill="#c0455f" stroke="${NET}" stroke-width="3.6" stroke-linejoin="round"/>
           <rect x="46" y="44" width="108" height="14" rx="7" fill="#e8e2d8" stroke="${NET}" stroke-width="3.4"/>
           <circle cx="100" cy="16" r="10" fill="#e8e2d8" stroke="${NET}" stroke-width="3.2"/>`,
  },
  nonBaoHo: {
    ten: 'Nón bảo hộ công trường', neo: 'dau',
    hinh: `<path d="M54 50 C 54 20 146 20 146 50 Z" fill="#f2b21c" stroke="${NET}" stroke-width="3.6" stroke-linejoin="round"/>
           <rect x="44" y="46" width="112" height="10" rx="5" fill="#f2b21c" stroke="${NET}" stroke-width="3.4"/>
           <path d="M100 22 L100 48" stroke="${NET}" stroke-width="2.6"/>`,
  },
  muDauBep: {
    ten: 'Mũ đầu bếp', neo: 'dau',
    hinh: `<path d="M64 46 C 50 46 48 22 66 22 C 68 8 132 8 134 22 C 152 22 150 46 136 46 Z" fill="#fff" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>
           <rect x="64" y="42" width="72" height="12" rx="4" fill="#fff" stroke="${NET}" stroke-width="3.2"/>`,
  },

  /* ── Đeo trên mặt (vẽ ĐÈ lên mắt) ── */
  kinhRam: {
    ten: 'Kính râm', neo: 'dau', tren: true,
    hinh: `<path d="M52 78 L148 78" stroke="${NET}" stroke-width="4"/>
           <rect x="52" y="70" width="42" height="30" rx="12" fill="#22303f" stroke="${NET}" stroke-width="4"/>
           <rect x="106" y="70" width="42" height="30" rx="12" fill="#22303f" stroke="${NET}" stroke-width="4"/>
           <path d="M60 78 l10 12" stroke="#fff" stroke-width="3" opacity=".45"/>`,
  },
  kinhCan: {
    ten: 'Kính cận', neo: 'dau', tren: true,
    hinh: `<circle cx="74" cy="84" r="21" fill="#fff" fill-opacity=".2" stroke="${NET}" stroke-width="4"/>
           <circle cx="126" cy="84" r="21" fill="#fff" fill-opacity=".2" stroke="${NET}" stroke-width="4"/>
           <path d="M95 84 L105 84" stroke="${NET}" stroke-width="4"/>`,
  },

  /* ── Quàng / đeo ở cổ ── */
  khanQuang: {
    ten: 'Khăn quàng cổ', neo: 'canh',
    hinh: `<path d="M56 148 C 80 164 120 164 144 148 L 148 166 C 120 182 80 182 52 166 Z" fill="#c0455f" stroke="${NET}" stroke-width="3.6" stroke-linejoin="round"/>
           <path d="M138 166 L 152 210 L 132 214 L 124 172 Z" fill="#c0455f" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>`,
  },
  caVat: {
    ten: 'Cà vạt', neo: 'canh',
    hinh: `<path d="M92 156 L108 156 L104 168 L96 168 Z" fill="#c0455f" stroke="${NET}" stroke-width="3" stroke-linejoin="round"/>
           <path d="M96 168 L104 168 L110 200 L100 208 L90 200 Z" fill="#c0455f" stroke="${NET}" stroke-width="3.2" stroke-linejoin="round"/>`,
  },
  no: {
    ten: 'Nơ cổ', neo: 'canh',
    hinh: `<path d="M100 162 L76 150 L76 176 Z" fill="#e0455f" stroke="${NET}" stroke-width="3.2" stroke-linejoin="round"/>
           <path d="M100 162 L124 150 L124 176 Z" fill="#e0455f" stroke="${NET}" stroke-width="3.2" stroke-linejoin="round"/>
           <circle cx="100" cy="163" r="7" fill="#c0344c" stroke="${NET}" stroke-width="3"/>`,
  },

  /* ── Cầm / để bên cạnh ── */
  traSua: {
    ten: 'Ly trà sữa', neo: 'canh',
    hinh: `<path d="M158 178 L 186 178 L 181 232 L 163 232 Z" fill="#e6c9a8" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>
           <rect x="156" y="172" width="32" height="8" rx="3" fill="#fff" stroke="${NET}" stroke-width="3"/>
           <path d="M176 172 L 182 142" stroke="${NET}" stroke-width="5" stroke-linecap="round"/>
           ${[[168, 218], [178, 220], [172, 226]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${NET}"/>`).join('')}`,
  },
  capTap: {
    ten: 'Cặp táp đi làm', neo: 'canh',
    hinh: `<rect x="150" y="196" width="44" height="34" rx="5" fill="#8a5a34" stroke="${NET}" stroke-width="3.6"/>
           <path d="M164 196 q8 -12 16 0" stroke="${NET}" stroke-width="3.4" fill="none"/>
           <rect x="166" y="208" width="12" height="8" rx="2" fill="#e0b060" stroke="${NET}" stroke-width="2.6"/>`,
  },
  tamDa: {
    ten: 'Tấm đá mẫu', neo: 'canh',
    hinh: `<rect x="8" y="180" width="40" height="52" rx="3" fill="#e8e2d8" stroke="${NET}" stroke-width="3.6"/>
           <path d="M12 198 q10 -6 18 2 q8 8 14 2 M12 216 q12 6 20 -2 q8 -8 14 -1" stroke="#9aa3ad" stroke-width="2.6" fill="none"/>`,
  },
  laptop: {
    ten: 'Máy tính xách tay', neo: 'canh',
    hinh: `<path d="M62 208 L 138 208 L 146 232 L 54 232 Z" fill="#8f9aa8" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>
           <rect x="70" y="164" width="60" height="46" rx="4" fill="#22303f" stroke="${NET}" stroke-width="3.6"/>
           <rect x="76" y="170" width="48" height="34" rx="2" fill="#4d94ff"/>`,
  },
  duaHau: {
    ten: 'Miếng dưa hấu', neo: 'canh',
    hinh: `<path d="M150 226 A 40 40 0 0 1 194 190 L 194 226 Z" fill="#e8455f" stroke="${NET}" stroke-width="3.4" stroke-linejoin="round"/>
           <path d="M152 228 A 42 42 0 0 1 194 188" stroke="#4c8b3a" stroke-width="7" fill="none"/>
           ${[[172, 214], [182, 206], [176, 200]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="4" fill="${NET}"/>`).join('')}`,
  },

  /* ── Hiệu ứng quanh bé ── */
  phaoGiay: {
    ten: 'Pháo giấy ăn mừng', neo: 'canh',
    hinh: `${[['#f5c542', 22, 40], ['#e0455f', 172, 34], ['#4d94ff', 40, 96], ['#4c8b3a', 176, 104], ['#f07f9c', 14, 150], ['#f2b21c', 188, 156]]
      .map(([m, x, y]) => `<rect x="${x}" y="${y}" width="11" height="11" rx="2" fill="${m}" transform="rotate(${(Number(x) * 7) % 90} ${x} ${y})"/>`).join('')}`,
  },
  mua: {
    ten: 'Mưa buồn', neo: 'canh',
    hinh: `<path d="M46 22 C 46 6 96 2 104 18 C 130 12 146 28 138 44 L 52 44 C 38 44 38 26 46 22 Z" fill="#9aa9bb" stroke="${NET}" stroke-width="3.2" stroke-linejoin="round"/>
           ${[[62, 54], [86, 60], [110, 54], [132, 60]].map(([x, y]) => `<path d="M${x} ${y} l-4 16" stroke="#6ec5f0" stroke-width="4" stroke-linecap="round"/>`).join('')}`,
  },
} satisfies Record<string, PhuKien>;

/* Khai báo 2 bước: `satisfies` giữ được TÊN từng món (gõ sai tên là TS
   báo lỗi ngay), còn kiểu Record bên dưới cho mỗi món đủ mọi trường của
   PhuKien — kể cả trường tuỳ chọn `tren` mà không phải món nào cũng có.
   Viết gộp một dòng `as const satisfies` thì TS thu hẹp quá tay: món nào
   không khai `tren` sẽ bị coi như KHÔNG CÓ trường đó. */
export const PHU_KIEN: Record<TenPhuKien, PhuKien> = _PK;
export type TenPhuKien = keyof typeof _PK;
export const DS_PHU_KIEN = Object.keys(_PK) as TenPhuKien[];
