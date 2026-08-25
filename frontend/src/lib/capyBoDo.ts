import type { GreetingStyle } from './greeting';
import type { TuThe } from './capyTuThe';
import type { TenPhuKien } from './capyPhuKien';
import { bocBieuCam, type BieuCam, type Nhom } from './capyBieuCam';

/* ═══════════════════════════════════════════════════════════════
   BỘ ĐỒ — ghép 3 lớp (tư thế + khuôn mặt + phụ kiện) thành một "bộ".

   Đây là chỗ quyết định bé mặc gì lúc nào. Tách khỏi phần VẼ để:
     · Test được bằng Node (không đụng DOM, không đụng React).
     · Thêm một bộ đồ mới = thêm một dòng, không sửa component.
   ═══════════════════════════════════════════════════════════════ */

export interface BoDo {
  tuThe: TuThe;
  phuKien: TenPhuKien[];
  /** Nhóm cảm xúc để bốc khuôn mặt cho khớp */
  nhomMat: Nhom[];
}

/* ── Ngữ cảnh: app đang làm gì thì bé mặc theo ── */
export type NguCanh =
  | 'thuong'        // không có gì đặc biệt — bé nghỉ ngơi lang thang
  | 'xuatBaoCao'    // đang xuất Excel → dân văn phòng, mệt mỏi
  | 'datKpi'        // đạt chỉ tiêu → ăn mừng
  | 'khachBoQuen'   // có khách lâu chưa liên hệ → buồn, giục nhẹ
  | 'nhapPhoi'      // đang nạp phôi → đồ bảo hộ
  | 'nghiTrua';     // giờ nghỉ → ngâm nước, ăn uống

/* Mỗi ngữ cảnh có vài bộ; bốc ngẫu nhiên để không lặp mãi một hình. */
const TU_DO: Record<NguCanh, BoDo[]> = {
  thuong: [
    { tuThe: 'dung', phuKien: [], nhomMat: ['vui', 'toMo', 'chan'] },
    { tuThe: 'ngoi', phuKien: ['cam'], nhomMat: ['vui', 'yeu'] },
    { tuThe: 'nam', phuKien: [], nhomMat: ['chan', 'buonNgu'] },
    { tuThe: 'ngoi', phuKien: ['chim'], nhomMat: ['vui', 'nguong'] },
    { tuThe: 'dung', phuKien: ['no'], nhomMat: ['tuHao', 'vui'] },
    { tuThe: 'nam', phuKien: ['hoa'], nhomMat: ['buonNgu', 'yeu'] },
  ],

  /* Xuất báo cáo Excel: bé thành dân văn phòng, mắt thâm quầng */
  xuatBaoCao: [
    { tuThe: 'ngoi', phuKien: ['kinhCan', 'laptop'], nhomMat: ['lamViec'] },
    { tuThe: 'dung', phuKien: ['caVat', 'capTap'], nhomMat: ['lamViec', 'tuHao'] },
    { tuThe: 'ngoi', phuKien: ['kinhCan', 'traSua'], nhomMat: ['lamViec', 'buonNgu'] },
  ],

  /* Đạt chỉ tiêu: kính râm + pháo giấy */
  datKpi: [
    { tuThe: 'dung', phuKien: ['kinhRam', 'phaoGiay'], nhomMat: ['tuHao'] },
    { tuThe: 'ngoi', phuKien: ['phaoGiay', 'cam'], nhomMat: ['vui', 'tuHao'] },
    { tuThe: 'dung', phuKien: ['kinhRam', 'no', 'phaoGiay'], nhomMat: ['tuHao', 'vui'] },
  ],

  /* Khách bị bỏ quên: bé đứng dưới mưa — giục nhẹ, KHÔNG trách móc.
     Vai `boss` dùng chung app nên không được ra giọng đổ lỗi. */
  khachBoQuen: [
    { tuThe: 'ngoi', phuKien: ['mua'], nhomMat: ['dau', 'chan'] },
    { tuThe: 'dung', phuKien: ['mua', 'khanQuang'], nhomMat: ['dau', 'buonNgu'] },
  ],

  /* Nạp phôi: đồ bảo hộ + tấm đá mẫu */
  nhapPhoi: [
    { tuThe: 'dung', phuKien: ['nonBaoHo', 'tamDa'], nhomMat: ['lamViec'] },
    { tuThe: 'ngoi', phuKien: ['nonBaoHo'], nhomMat: ['lamViec', 'toMo'] },
  ],

  /* Nghỉ trưa: ngâm nước, ăn uống */
  nghiTrua: [
    { tuThe: 'tamBon', phuKien: ['cam'], nhomMat: ['vui', 'buonNgu'] },
    { tuThe: 'boi', phuKien: ['vitVang'], nhomMat: ['vui', 'yeu'] },
    { tuThe: 'phao', phuKien: ['kinhRam', 'traSua'], nhomMat: ['vui', 'tuHao'] },
    { tuThe: 'ngoi', phuKien: ['duaHau'], nhomMat: ['doi', 'vui'] },
    { tuThe: 'tamBon', phuKien: ['vitVang'], nhomMat: ['vui'] },
  ],
};

/* Phong cách "kháy đểu" thì bé lười hơn hẳn: hay nằm ườn, hay lườm.
   Đây là tính cách người dùng TỰ CHỌN cho mình nên hợp lệ. */
const NGHIENG_THEO_GIONG: Partial<Record<GreetingStyle, { tuThe: TuThe[]; nhom: Nhom[] }>> = {
  troll: { tuThe: ['nam', 'ngoi'], nhom: ['chan', 'gian', 'tuHao'] },
  pro: { tuThe: ['dung', 'ngoi'], nhom: ['lamViec', 'tuHao'] },
};

function boc<T>(ds: readonly T[]): T {
  return ds[Math.floor(Math.random() * ds.length)] as T;
}

/**
 * Chọn một bộ đồ + khuôn mặt.
 * `rnd` cho phép test cắm số cố định thay vì Math.random.
 */
export function chonBoDo(
  nc: NguCanh = 'thuong',
  giong: GreetingStyle = 'vui',
): { bo: BoDo; mat: BieuCam } {
  const ds = TU_DO[nc] ?? TU_DO.thuong;
  const bo = boc(ds);

  /* Giọng riêng thì nắn lại tư thế + tâm trạng, nhưng CHỈ ở ngữ cảnh
     thường — lúc đang báo cáo hay ăn mừng thì bộ đồ đã có ý nghĩa rõ,
     không nên đè lên. */
  if (nc === 'thuong') {
    const nghieng = NGHIENG_THEO_GIONG[giong];
    if (nghieng) {
      return {
        bo: { ...bo, tuThe: boc(nghieng.tuThe) },
        mat: bocBieuCam(nghieng.nhom),
      };
    }
  }
  return { bo, mat: bocBieuCam(bo.nhomMat) };
}

/** Cho chỗ khác trong app báo "đang làm việc X" để bé thay đồ theo */
export function capyNguCanh(nc: NguCanh, giay = 8): void {
  window.dispatchEvent(new CustomEvent('tl-capy-ngucanh', { detail: { nc, giay } }));
}

export const DS_NGU_CANH = Object.keys(TU_DO) as NguCanh[];
export { TU_DO };
