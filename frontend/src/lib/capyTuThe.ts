export type TuThe = 'dung' | 'ngoi' | 'nam' | 'boi' | 'tamBon' | 'tamBonGo' | 'phao' | 'tayOK' | 'soiLaptop';

export interface HinhTuThe {
  ten: string;
  than: string;
  chan: string[];
  tay: [string, string] | null;
  dauDich: [number, number];
  sau?: string;
  truoc?: string;
  mauSau?: string;
  mauTruoc?: string;
  coAo: boolean;
}

export const TU_THE: Record<TuThe, HinhTuThe> = {
  /* ── Dấu OK: Bàn tay giơ lên làm dấu OK tròn trịa (Ảnh 1 chuẩn gốc) ── */
  tayOK: {
    ten: 'Giơ tay OK',
    than: 'M 44 158 L 156 158 C 160 158 162 162 162 168 L 162 230 C 162 238 152 242 140 242 L 60 242 C 48 242 38 238 38 230 L 38 168 C 38 162 40 158 44 158 Z',
    chan: [
      'M 68 232 C 80 228 90 233 90 240 C 90 247 78 250 68 247 C 58 243 58 236 68 232 Z',
      'M 132 232 C 120 228 110 233 110 240 C 110 247 122 250 132 247 C 142 243 142 236 132 232 Z',
    ],
    tay: [
      // Tay trái giơ lên làm dấu OK: Ngón trỏ và ngón cái chạm tạo vòng tròn, 3 ngón còn lại xòe
      'M 42 186 C 26 160 16 120 28 96 C 36 82 46 94 40 110 C 44 100 54 106 48 120 C 52 112 60 118 54 130 C 50 138 38 142 34 148 C 30 156 42 168 50 178 Z',
      'M 158 178 C 168 184 172 196 166 208 C 161 217 150 214 149 204 Z',
    ],
    dauDich: [0, -6],
    coAo: true,
  },

  /* ── Đứng: Thấy trọn người ── */
  dung: {
    ten: 'Đứng',
    than: 'M 46 158 L 154 158 C 158 158 160 162 160 168 L 160 226 C 160 236 150 240 138 240 L 62 240 C 50 240 40 236 40 226 L 40 168 C 40 162 42 158 46 158 Z',
    chan: [
      'M 68 232 C 80 228 90 233 90 240 C 90 247 78 250 68 247 C 58 243 58 236 68 232 Z',
      'M 132 232 C 120 228 110 233 110 240 C 110 247 122 250 132 247 C 142 243 142 236 132 232 Z',
    ],
    tay: [
      'M 44 178 C 32 180 28 196 34 208 C 39 217 50 214 51 204 C 52 192 52 180 44 178 Z',
      'M 156 178 C 168 180 172 196 166 208 C 161 217 150 214 149 204 C 148 192 148 180 156 178 Z',
    ],
    dauDich: [0, -6],
    coAo: true,
  },

  /* ── Ngồi: Thân bè ra, dáng ổ bánh mì ── */
  ngoi: {
    ten: 'Ngồi',
    than: 'M 54 154 L 146 154 C 162 154 174 168 174 190 C 174 212 160 226 142 226 L 58 226 C 40 226 26 212 26 190 C 26 168 38 154 54 154 Z',
    chan: [
      'M 58 214 C 70 210 78 216 78 224 C 78 231 68 234 58 231 C 48 227 48 220 58 214 Z',
      'M 142 214 C 130 210 122 216 122 224 C 122 231 132 234 142 231 C 152 227 152 220 142 214 Z',
    ],
    tay: [
      'M 58 174 C 48 176 44 190 48 200 C 52 208 62 206 63 198 Z',
      'M 142 174 C 152 176 156 190 152 200 C 148 208 138 206 137 198 Z',
    ],
    dauDich: [0, 4],
    coAo: true,
  },

  /* ── Soi Laptop: Cày cuốc chứng khoán ── */
  soiLaptop: {
    ten: 'Soi Laptop',
    than: 'M 50 156 L 150 156 C 164 156 172 170 172 195 L 172 230 L 28 230 L 28 195 C 28 170 36 156 50 156 Z',
    chan: [
      'M 60 224 C 72 220 80 226 80 234 C 80 240 70 244 60 240 Z',
      'M 140 224 C 128 220 120 226 120 234 C 120 240 130 244 140 240 Z',
    ],
    tay: [
      'M 52 174 L 84 198 L 76 206 L 46 182 Z',
      'M 148 174 L 116 198 L 124 206 L 154 182 Z',
    ],
    dauDich: [0, 2],
    truoc: 'M 72 216 L 128 216 L 136 226 L 64 226 Z M 76 190 L 124 190 L 128 214 L 72 214 Z',
    mauTruoc: '#334155',
    coAo: true,
  },

  /* ── Nằm ngủ: Lười biếng ── */
  nam: {
    ten: 'Nằm ngủ',
    than: 'M 32 170 C 32 152 50 142 80 142 L 150 142 C 176 142 190 156 190 174 C 190 196 172 208 144 208 L 68 208 C 44 208 32 194 32 170 Z',
    chan: [
      'M 166 194 C 178 190 186 196 186 202 C 186 208 176 212 166 208 Z',
    ],
    tay: null,
    dauDich: [-24, 18],
    coAo: false,
  },

  /* ── Bơi lội ── */
  boi: {
    ten: 'Bơi lội',
    than: 'M 44 150 L 156 150 C 170 150 180 164 180 186 L 180 200 L 20 200 L 20 186 C 20 164 30 150 44 150 Z',
    chan: [],
    tay: null,
    dauDich: [0, 8],
    truoc: 'M 0 196 Q 50 188 100 196 Q 150 204 200 196 L 200 240 L 0 240 Z',
    mauTruoc: '#38bdf8',
    coAo: false,
  },

  /* ── Tắm bồn gỗ Onsen ── */
  tamBon: {
    ten: 'Tắm bồn',
    than: 'M 54 150 L 146 150 C 158 150 164 162 164 176 L 164 190 L 36 190 L 36 176 C 36 162 42 150 54 150 Z',
    chan: [],
    tay: null,
    dauDich: [0, 10],
    sau: 'M 22 176 C 22 150 178 150 178 176 L 178 226 C 178 240 22 240 22 226 Z',
    truoc: 'M 18 180 C 18 168 182 168 182 180 L 174 234 C 174 246 26 246 26 234 Z',
    mauSau: '#854d0e',
    mauTruoc: '#a16207',
    coAo: false,
  },

  tamBonGo: {
    ten: 'Tắm bồn gỗ',
    than: 'M 54 150 L 146 150 C 158 150 164 162 164 176 L 164 190 L 36 190 L 36 176 C 36 162 42 150 54 150 Z',
    chan: [],
    tay: null,
    dauDich: [0, 10],
    sau: 'M 22 176 C 22 150 178 150 178 176 L 178 226 C 178 240 22 240 22 226 Z',
    truoc: 'M 18 180 C 18 168 182 168 182 180 L 174 234 C 174 246 26 246 26 234 Z',
    mauSau: '#78350f',
    mauTruoc: '#92400e',
    coAo: false,
  },

  /* ── Phao hồng ── */
  phao: {
    ten: 'Phao bơi',
    than: 'M 54 150 L 146 150 C 160 150 170 164 170 184 L 170 196 L 30 196 L 30 184 C 30 164 40 150 54 150 Z',
    chan: [],
    tay: null,
    dauDich: [0, 6],
    sau: 'M 20 180 C 20 148 180 148 180 180 Z',
    truoc: 'M 14 186 C 14 164 186 164 186 186 C 186 216 14 216 14 186 Z',
    mauSau: '#f43f5e',
    mauTruoc: '#fb7185',
    coAo: false,
  },
};

export const DS_TU_THE = Object.keys(TU_THE) as TuThe[];
