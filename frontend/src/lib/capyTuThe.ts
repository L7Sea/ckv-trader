/* ═══════════════════════════════════════════════════════════════
   TỦ TƯ THẾ CỦA BÉ CAPY — lớp CƠ THỂ trong kiến trúc búp bê giấy.

   Mỗi tư thế chỉ khai báo hình dáng thân/tay/chân + ĐẦU DỜI ĐI ĐÂU.
   Khuôn mặt và phụ kiện là 2 lớp riêng, xếp chồng lên trên. Nhờ vậy:
     6 tư thế × 52 khuôn mặt × 16 phụ kiện = hơn 5.000 biến thể
   mà mã nguồn chỉ phình thêm đúng phần đường nét, không nhân bản.

   VÌ SAO KHÔNG DÙNG ẢNH WebP TRÊN SUPABASE STORAGE như đề xuất:
   mỗi lần vẽ bé sẽ là một loạt request mạng — chớp hình lúc tải, hỏng
   khi rớt mạng, tốn dung lượng bucket, và bé là thứ TRANG TRÍ nên
   không đáng đánh đổi. SVG nội tuyến: 0 request, luôn nét, đổi màu
   theo chế độ sáng/tối được.

   Khung vẽ 200×250. Đầu chuẩn nằm quanh (100, 96) — `dauDich` là độ
   dời so với vị trí chuẩn đó.
   ═══════════════════════════════════════════════════════════════ */

export type TuThe = 'dung' | 'ngoi' | 'nam' | 'boi' | 'tamBon' | 'phao';

export interface HinhTuThe {
  ten: string;
  /** Thân */
  than: string;
  /** Chân (0–2 hình) */
  chan: string[];
  /** Tay — để rỗng nếu tư thế này giấu tay (nằm ườn, ngâm nước) */
  tay: [string, string] | null;
  /** Đầu dời đi đâu so với vị trí chuẩn (100, 96) */
  dauDich: [number, number];
  /** Cảnh vẽ SAU lưng bé (thành bồn phía trong, phao...) */
  sau?: string;
  /** Cảnh vẽ TRƯỚC mặt bé (mặt nước, thành bồn phía ngoài...) */
  truoc?: string;
  /** Màu tô cho phần cảnh */
  mauSau?: string;
  mauTruoc?: string;
  /** Có áo không — ngâm nước / tắm bồn thì cởi áo */
  coAo: boolean;
}

export const TU_THE: Record<TuThe, HinhTuThe> = {
  /* ── Đứng: dáng mặc định, thấy trọn người ── */
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

  /* ── Ngồi: thân bè ra, thấp xuống — dáng "ổ bánh mì" kinh điển ── */
  ngoi: {
    ten: 'Ngồi',
    than: 'M 40 172 L 160 172 C 165 172 168 177 168 184 L 168 226 C 168 238 152 244 100 244 C 48 244 32 238 32 226 L 32 184 C 32 177 35 172 40 172 Z',
    chan: [
      'M 70 234 C 83 230 93 235 93 243 C 93 250 79 253 69 249 C 59 245 60 238 70 234 Z',
      'M 130 234 C 117 230 107 235 107 243 C 107 250 121 253 131 249 C 141 245 140 238 130 234 Z',
    ],
    tay: [
      'M 38 194 C 27 197 24 211 30 220 C 35 227 45 224 46 214 C 47 204 46 196 38 194 Z',
      'M 162 194 C 173 197 176 211 170 220 C 165 227 155 224 154 214 C 153 204 154 196 162 194 Z',
    ],
    dauDich: [0, 6],
    coAo: true,
  },

  /* ── Nằm ườn: thân dẹt và rộng, tay giấu dưới bụng ── */
  nam: {
    ten: 'Nằm ườn',
    than: 'M 26 190 L 174 190 C 179 190 182 194 182 200 L 182 224 C 182 236 152 242 100 242 C 48 242 18 236 18 224 L 18 200 C 18 194 21 190 26 190 Z',
    chan: [
      'M 58 230 C 71 226 81 231 81 239 C 81 246 67 249 57 245 C 47 241 48 234 58 230 Z',
      'M 142 230 C 129 226 119 231 119 239 C 119 246 133 249 143 245 C 153 241 152 234 142 230 Z',
    ],
    tay: null,                       // hai tay xếp dưới bụng, không thấy
    dauDich: [0, 32],
    coAo: false,                     // nằm ườn ở nhà thì cởi áo
  },

  /* ── Bơi: nửa dưới chìm, chỉ thấy đầu và lưng nhô trên mặt nước ── */
  boi: {
    ten: 'Bơi',
    than: 'M 30 182 L 170 182 C 175 182 178 186 178 192 L 178 216 C 178 228 148 234 100 234 C 52 234 22 228 22 216 L 22 192 C 22 186 25 182 30 182 Z',
    chan: [],
    tay: null,
    dauDich: [0, 20],
    truoc: 'M 8 206 C 40 198 62 212 96 206 C 130 200 156 214 192 206 L 192 250 L 8 250 Z',
    mauTruoc: '#7cc4e8',
    coAo: false,
  },

  /* ── Tắm bồn gỗ ── */
  tamBon: {
    ten: 'Tắm bồn',
    than: 'M 44 184 L 156 184 C 161 184 164 188 164 194 L 164 212 C 164 222 138 228 100 228 C 62 228 36 222 36 212 L 36 194 C 36 188 39 184 44 184 Z',
    chan: [],
    tay: [
      'M 40 194 C 29 197 26 210 32 219 C 37 226 47 223 48 213 C 49 204 48 196 40 194 Z',
      'M 160 194 C 171 197 174 210 168 219 C 163 226 153 223 152 213 C 151 204 152 196 160 194 Z',
    ],
    dauDich: [0, 22],
    sau: 'M 30 186 L 36 240 C 36 248 164 248 164 240 L 170 186 Z',
    mauSau: '#b3763c',
    truoc: 'M 30 200 L 35 240 C 35 249 165 249 165 240 L 170 200 C 140 210 60 210 30 200 Z',
    mauTruoc: '#c98a4c',
    coAo: false,
  },

  /* ── Ngồi phao tròn ── */
  phao: {
    ten: 'Ngồi phao',
    than: 'M 46 178 L 154 178 C 159 178 162 182 162 188 L 162 208 C 162 218 136 224 100 224 C 64 224 38 218 38 208 L 38 188 C 38 182 41 178 46 178 Z',
    chan: [],
    tay: [
      'M 42 190 C 31 193 28 206 34 215 C 39 222 49 219 50 209 C 51 200 50 192 42 190 Z',
      'M 158 190 C 169 193 172 206 166 215 C 161 222 151 219 150 209 C 149 200 150 192 158 190 Z',
    ],
    dauDich: [0, 16],
    truoc: 'M 100 186 C 148 186 180 198 180 214 C 180 230 148 242 100 242 C 52 242 20 230 20 214 C 20 198 52 186 100 186 Z M 100 202 C 76 202 58 208 58 214 C 58 220 76 226 100 226 C 124 226 142 220 142 214 C 142 208 124 202 100 202 Z',
    mauTruoc: '#f07f9c',
    coAo: false,
  },
};

export const DS_TU_THE = Object.keys(TU_THE) as TuThe[];

/** Tư thế hợp với việc bé đang làm gì */
export function tuTheNgauNhien(loai: 'nghi' | 'nuoc' | 'lamViec' = 'nghi'): TuThe {
  const ds: TuThe[] =
    loai === 'nuoc' ? ['boi', 'tamBon', 'phao']
      : loai === 'lamViec' ? ['dung', 'ngoi']
        : ['dung', 'ngoi', 'nam'];
  return ds[Math.floor(Math.random() * ds.length)] ?? 'dung';
}
