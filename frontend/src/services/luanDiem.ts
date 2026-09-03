/* ═══════════════════════════════════════════════════════════════════════════
   NHẬT KÝ LUẬN ĐIỂM — LOGIC THUẦN
   ───────────────────────────────────────────────────────────────────────────
   Đây là thứ biến CKV từ một CUỐN NHẬT KÝ thành một HỆ THỐNG HỌC HỎI: không chỉ
   ghi nhận định, mà ĐỐI CHIẾU nhận định với kết quả thực tế rồi thống kê xem
   mình đúng bao nhiêu phần.

   Không có thứ này, người dùng ghi "không cắt lỗ vì biên an toàn còn nguyên" rồi
   ba tháng sau không ai biết nhận định đó đúng hay sai. Có nó, mỗi nhận định
   thành một bài học đo được.

   File này KHÔNG import React, không đụng localStorage — để `scripts/test-luan-diem.mjs`
   chạy được thẳng bằng Node và đối chiếu output với input đã biết.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Nhận định về một mã cụ thể, hay về thị trường chung. */
export type PhamVi = 'MA' | 'THI_TRUONG';

/** Hướng kỳ vọng. Giữ/Cắt là quyết định hành động, không chỉ dự báo giá. */
export type Huong = 'TANG' | 'GIAM' | 'DI_NGANG' | 'GIU' | 'CAT';

/** Kết quả sau khi đối chiếu. null = chưa chấm. */
export type KetQua = 'DUNG' | 'SAI' | 'MOT_PHAN';

export interface LuanDiem {
  id: string;
  ngayGhi: string; // ISO date, giờ Việt Nam
  phamVi: PhamVi;
  ma?: string; // chỉ khi phamVi === 'MA'
  huong: Huong;
  noiDung: string;
  doTuTin: 1 | 2 | 3 | 4 | 5;

  /** Giá tại thời điểm ghi — mốc để tính biến động khi đối chiếu. Chỉ với mã. */
  giaLucGhi?: number;
  /** Đích giá kỳ vọng, nếu có. Không bắt buộc — nhận định định tính vẫn ghi được. */
  giaMucTieu?: number;
  /** Ngày dự kiến đánh giá. Không bắt buộc. */
  hanDanhGia?: string;

  // ── Phần đối chiếu, điền sau ──
  ketQua?: KetQua | null;
  giaLucDoiChieu?: number;
  ngayDoiChieu?: string;
  baiHoc?: string;
}

export const NHAN_HUONG: Record<Huong, string> = {
  TANG: 'Tăng',
  GIAM: 'Giảm',
  DI_NGANG: 'Đi ngang',
  GIU: 'Giữ / không bán',
  CAT: 'Cắt / bán'
};

export const NHAN_KET_QUA: Record<KetQua, string> = {
  DUNG: 'Đúng',
  SAI: 'Sai',
  MOT_PHAN: 'Một phần'
};

/** Một nhận định đã đối chiếu chưa? */
export function daDoiChieu(ld: LuanDiem): boolean {
  return ld.ketQua === 'DUNG' || ld.ketQua === 'SAI' || ld.ketQua === 'MOT_PHAN';
}

/**
 * Phần trăm biến động giá từ lúc ghi tới một giá tham chiếu.
 * Trả về null nếu thiếu dữ liệu — KHÔNG bịa 0 để tránh gợi ý sai.
 */
export function bienDongGia(giaLucGhi?: number, giaHienTai?: number): number | null {
  if (!giaLucGhi || giaLucGhi <= 0 || !giaHienTai || giaHienTai <= 0) return null;
  return Number((((giaHienTai - giaLucGhi) / giaLucGhi) * 100).toFixed(2));
}

/**
 * Gợi ý kết quả DỰA TRÊN GIÁ — chỉ là gợi ý để người dùng có căn cứ, KHÔNG tự
 * chấm thay. Trả về null cho hướng định tính (Giữ/Cắt) hoặc khi thiếu giá, vì
 * biến động giá không phán được đúng/sai cho những hướng đó.
 */
export function goiYKetQua(ld: LuanDiem, giaHienTai?: number): KetQua | null {
  const bd = bienDongGia(ld.giaLucGhi, giaHienTai);
  if (bd === null) return null;

  // Ngưỡng "đáng kể" 1% — dưới mức này coi như đi ngang
  const NGUONG = 1;
  if (ld.huong === 'TANG') return bd >= NGUONG ? 'DUNG' : bd <= -NGUONG ? 'SAI' : 'MOT_PHAN';
  if (ld.huong === 'GIAM') return bd <= -NGUONG ? 'DUNG' : bd >= NGUONG ? 'SAI' : 'MOT_PHAN';
  if (ld.huong === 'DI_NGANG') return Math.abs(bd) < NGUONG ? 'DUNG' : 'SAI';
  // GIU / CAT là quyết định hành động — giá một chiều không phán được, để người dùng chấm
  return null;
}

export interface ThongKe {
  tong: number;
  daCham: number;
  chuaCham: number;
  dung: number;
  sai: number;
  motPhan: number;
  /** Điểm chính xác 0–100. Một phần tính nửa điểm. null khi chưa chấm cái nào. */
  tyLeDung: number | null;
  /** Tỉ lệ đúng tách theo từng hướng, để thấy mình mạnh/yếu ở kiểu nhận định nào. */
  theoHuong: Record<Huong, { daCham: number; tyLeDung: number | null }>;
  /** Tỉ lệ đúng tách theo độ tự tin — để biết lúc tự tin có thật sự đúng hơn không. */
  theoDoTuTin: Record<number, { daCham: number; tyLeDung: number | null }>;
}

/** Điểm chính xác của một nhóm: đúng = 1, một phần = 0.5, sai = 0. */
function tinhTyLe(dung: number, motPhan: number, daCham: number): number | null {
  if (daCham === 0) return null;
  return Number((((dung + motPhan * 0.5) / daCham) * 100).toFixed(1));
}

/** Toàn bộ thống kê của một danh sách luận điểm. */
export function thongKe(danhSach: LuanDiem[]): ThongKe {
  const daChamDs = danhSach.filter(daDoiChieu);
  const dung = daChamDs.filter((l) => l.ketQua === 'DUNG').length;
  const sai = daChamDs.filter((l) => l.ketQua === 'SAI').length;
  const motPhan = daChamDs.filter((l) => l.ketQua === 'MOT_PHAN').length;

  const huongs: Huong[] = ['TANG', 'GIAM', 'DI_NGANG', 'GIU', 'CAT'];
  const theoHuong = {} as ThongKe['theoHuong'];
  for (const h of huongs) {
    const nhom = daChamDs.filter((l) => l.huong === h);
    theoHuong[h] = {
      daCham: nhom.length,
      tyLeDung: tinhTyLe(
        nhom.filter((l) => l.ketQua === 'DUNG').length,
        nhom.filter((l) => l.ketQua === 'MOT_PHAN').length,
        nhom.length
      )
    };
  }

  const theoDoTuTin = {} as ThongKe['theoDoTuTin'];
  for (let muc = 1; muc <= 5; muc++) {
    const nhom = daChamDs.filter((l) => l.doTuTin === muc);
    theoDoTuTin[muc] = {
      daCham: nhom.length,
      tyLeDung: tinhTyLe(
        nhom.filter((l) => l.ketQua === 'DUNG').length,
        nhom.filter((l) => l.ketQua === 'MOT_PHAN').length,
        nhom.length
      )
    };
  }

  return {
    tong: danhSach.length,
    daCham: daChamDs.length,
    chuaCham: danhSach.length - daChamDs.length,
    dung,
    sai,
    motPhan,
    tyLeDung: tinhTyLe(dung, motPhan, daChamDs.length),
    theoHuong,
    theoDoTuTin
  };
}

/** Luận điểm quá hạn đánh giá mà chưa chấm — để nhắc người dùng đối chiếu. */
export function quaHanChuaCham(danhSach: LuanDiem[], homNay: string): LuanDiem[] {
  return danhSach.filter(
    (l) => !daDoiChieu(l) && l.hanDanhGia && l.hanDanhGia <= homNay
  );
}

/** Sắp xếp mới nhất lên đầu. */
export function moiNhatTruoc(danhSach: LuanDiem[]): LuanDiem[] {
  return [...danhSach].sort((a, b) => (a.ngayGhi < b.ngayGhi ? 1 : -1));
}
