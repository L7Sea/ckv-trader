import { create } from 'zustand';

/* ═══════════════════════════════════════════════════════════════════════════
   THÔNG BÁO & HỎI XÁC NHẬN CỦA CHÍNH APP
   ───────────────────────────────────────────────────────────────────────────
   Thay cho `window.alert` / `confirm` / `prompt`. Đo được 27 chỗ đang dùng
   chúng trên 10 file. Ba tác hại thật:

   1. Đóng băng luồng JavaScript — app treo cho tới khi người dùng bấm OK.
   2. Hộp thoại hệ điều hành không theo bảng màu app, không đổi theo chế độ
      sáng/tối, không đo được tương phản. Trên điện thoại nó trông như trang
      web lừa đảo.
   3. `alert` không nói được "cái này chỉ là cảnh báo, việc vẫn xong rồi" —
      nó chỉ có một sắc thái duy nhất. Mà sổ ghi chép cần đúng sắc thái đó:
      "đã ghi, nhưng số liệu chưa khớp".

   Bốn mức, khác nhau về Ý NGHĨA chứ không chỉ màu:
     'tot'      việc đã xong, không có vấn đề
     'canh-bao' việc ĐÃ XONG nhưng có chỗ cần để ý  ← mức quan trọng nhất
     'loi'      việc KHÔNG xong
     'tin'      thông tin thuần
   ═══════════════════════════════════════════════════════════════════════════ */

export type MucThongBao = 'tot' | 'canh-bao' | 'loi' | 'tin';

export interface ThongBao {
  id: string;
  muc: MucThongBao;
  loi: string;
  /** Dòng phụ, ví dụ từng chỗ số liệu không khớp. */
  chiTiet?: string[];
  /** Tự tắt sau bao nhiêu ms. 0 = phải tự bấm tắt. */
  tuTat: number;
}

/** Hỏi xác nhận — thay `window.confirm`. Trả về Promise<boolean>. */
export interface CauHoi {
  loi: string;
  chiTiet?: string;
  nhanDong: string;
  nhanHuy: string;
  /** Việc khó hoàn tác thì nút chính mang màu cảnh báo. */
  nguyHiem: boolean;
  traLoi: (dong: boolean) => void;
}

/** Hỏi nhập một con số — thay `window.prompt`. Trả về Promise<number|null>. */
export interface CauHoiNhap {
  loi: string;
  chiTiet?: string;
  nhan: string;
  giaTriDau: string;
  goiY?: string;
  nhanDong: string;
  traLoi: (giaTri: number | null) => void;
}

interface TrangThai {
  danhSach: ThongBao[];
  cauHoi: CauHoi | null;
  cauHoiNhap: CauHoiNhap | null;

  bao: (muc: MucThongBao, loi: string, chiTiet?: string[]) => void;
  tot: (loi: string) => void;
  loi: (loi: string) => void;
  canhBao: (loi: string, chiTiet?: string[]) => void;
  tat: (id: string) => void;
  tatHet: () => void;

  hoi: (tuyChon: Omit<CauHoi, 'traLoi'>) => Promise<boolean>;
  traLoiCauHoi: (dong: boolean) => void;

  hoiNhap: (tuyChon: Omit<CauHoiNhap, 'traLoi'>) => Promise<number | null>;
  traLoiNhap: (giaTri: number | null) => void;
}

/* Thời gian tự tắt theo mức: lỗi và cảnh báo phải đọc được nên KHÔNG tự tắt.
   Việc xong xuôi thì tắt nhanh, không bắt người dùng dọn. */
const TU_TAT: Record<MucThongBao, number> = {
  tot: 4000,
  tin: 5000,
  'canh-bao': 0,
  loi: 0
};

let dem = 0;

export const useThongBao = create<TrangThai>((set, get) => ({
  danhSach: [],
  cauHoi: null,
  cauHoiNhap: null,

  bao: (muc, loi, chiTiet) => {
    const id = `tb_${++dem}`;
    set((s) => ({ danhSach: [...s.danhSach, { id, muc, loi, chiTiet, tuTat: TU_TAT[muc] }] }));
    if (TU_TAT[muc] > 0) {
      window.setTimeout(() => get().tat(id), TU_TAT[muc]);
    }
  },

  tot: (loi) => get().bao('tot', loi),
  loi: (loi) => get().bao('loi', loi),
  canhBao: (loi, chiTiet) => get().bao('canh-bao', loi, chiTiet),

  tat: (id) => set((s) => ({ danhSach: s.danhSach.filter((t) => t.id !== id) })),
  tatHet: () => set({ danhSach: [] }),

  hoi: (tuyChon) =>
    new Promise<boolean>((giaiQuyet) => {
      set({ cauHoi: { ...tuyChon, traLoi: giaiQuyet } });
    }),

  traLoiCauHoi: (dong) => {
    const ch = get().cauHoi;
    set({ cauHoi: null });
    ch?.traLoi(dong);
  },

  hoiNhap: (tuyChon) =>
    new Promise<number | null>((giaiQuyet) => {
      set({ cauHoiNhap: { ...tuyChon, traLoi: giaiQuyet } });
    }),

  traLoiNhap: (giaTri) => {
    const ch = get().cauHoiNhap;
    set({ cauHoiNhap: null });
    ch?.traLoi(giaTri);
  }
}));

/* Dùng được ngoài component React (trong service, store khác).
   Giữ nguyên tên ngắn để chỗ gọi đọc như câu tiếng Việt. */
export const thongBao = {
  tot: (loi: string) => useThongBao.getState().tot(loi),
  loi: (loi: string) => useThongBao.getState().loi(loi),
  canhBao: (loi: string, chiTiet?: string[]) => useThongBao.getState().canhBao(loi, chiTiet),
  tin: (loi: string) => useThongBao.getState().bao('tin', loi),
  hoi: (tuyChon: Omit<CauHoi, 'traLoi'>) => useThongBao.getState().hoi(tuyChon),
  hoiNhap: (tuyChon: Omit<CauHoiNhap, 'traLoi'>) => useThongBao.getState().hoiNhap(tuyChon)
};
