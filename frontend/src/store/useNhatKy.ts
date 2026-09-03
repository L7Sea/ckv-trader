import { create } from 'zustand';
import { LuanDiem, moiNhatTruoc } from '../services/luanDiem';
import { marketDataService } from '../services/marketDataService';

/* ═══════════════════════════════════════════════════════════════════════════
   KHO NHẬT KÝ LUẬN ĐIỂM
   ───────────────────────────────────────────────────────────────────────────
   Lưu theo TỪNG tài khoản trong localStorage, đúng như cách localTradingEngine
   tách dữ liệu người dùng. Nhật ký của người này không lẫn sang người kia.

   Chưa đồng bộ Supabase — cố tình. Bài học từ trước: đẩy lên Supabase mà thiếu
   cột thì hỏng im lặng. Làm chạy được trên máy trước, đồng bộ là bước sau khi
   đã có bảng riêng.
   ═══════════════════════════════════════════════════════════════════════════ */

const KHOA_GOC = 'ckv_nhat_ky_luan_diem';

const khoaCho = (userId: string) => `${KHOA_GOC}_${userId || 'guest'}`;

function doc(userId: string): LuanDiem[] {
  try {
    const raw = localStorage.getItem(khoaCho(userId));
    if (!raw) return [];
    const ds = JSON.parse(raw);
    return Array.isArray(ds) ? ds : [];
  } catch {
    return [];
  }
}

function ghi(userId: string, ds: LuanDiem[]) {
  try {
    localStorage.setItem(khoaCho(userId), JSON.stringify(ds));
  } catch {
    // localStorage đầy hoặc bị chặn — không làm sập app
  }
}

interface TrangThai {
  userId: string;
  danhSach: LuanDiem[];

  /** Nạp nhật ký của một tài khoản. Gọi khi đăng nhập / đổi user. */
  napCho: (userId: string) => void;
  them: (ld: Omit<LuanDiem, 'id' | 'ngayGhi'>) => void;
  capNhat: (id: string, thayDoi: Partial<LuanDiem>) => void;
  xoa: (id: string) => void;
  /** Giá thị trường mới nhất đã biết của một mã, để gợi ý khi đối chiếu. */
  giaHienTai: (ma?: string) => number | undefined;
}

export const useNhatKy = create<TrangThai>((set, get) => ({
  userId: 'guest',
  danhSach: [],

  napCho: (userId) => set({ userId, danhSach: moiNhatTruoc(doc(userId)) }),

  them: (ld) => {
    const moi: LuanDiem = {
      ...ld,
      id: 'ld_' + Date.now(),
      ngayGhi: new Date().toISOString().slice(0, 10),
      ketQua: null
    };
    const ds = moiNhatTruoc([moi, ...get().danhSach]);
    ghi(get().userId, ds);
    set({ danhSach: ds });
  },

  capNhat: (id, thayDoi) => {
    const ds = get().danhSach.map((l) => (l.id === id ? { ...l, ...thayDoi } : l));
    ghi(get().userId, ds);
    set({ danhSach: ds });
  },

  xoa: (id) => {
    const ds = get().danhSach.filter((l) => l.id !== id);
    ghi(get().userId, ds);
    set({ danhSach: ds });
  },

  giaHienTai: (ma) => {
    if (!ma) return undefined;
    const s = marketDataService.getWatchlist().find((w) => w.symbol === ma);
    return s?.price;
  }
}));
