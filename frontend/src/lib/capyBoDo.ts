import type { GreetingStyle } from './greeting';
import type { TuThe } from './capyTuThe';
import type { TenPhuKien } from './capyPhuKien';
import { bocBieuCam, type BieuCam, type Nhom } from './capyBieuCam';

/* ═══════════════════════════════════════════════════════════════
   QUY ĐỊNH BỘ ĐỒ THEO BUỔI (1 BUỔI = 1 DẠNG MẶC ĐỒ DUY NHẤT).
   
   Theo yêu cầu của anh Hải (VIP Trader):
     - Mỗi buổi trong ngày (Sáng, Trưa, Chiều, Tối, Đêm, Rạng sáng)
       chỉ được mặc DUY NHẤT 1 kiểu áo.
     - Nếu sáng mặc áo đỏ thì phải sang phiên chiều mới đổi áo khác.
     - Có buổi không mặc đồ (tắm onsen, ngủ cuộn tròn, phơi nắng).
   ═══════════════════════════════════════════════════════════════ */

export type KieuAo = 'poloXanh' | 'aoDoTim' | 'vestTrader' | 'hoodie' | 'khongMac';

export type BuoiTrongNgay = 'rang' | 'sang' | 'trua' | 'chieu' | 'toi' | 'dem';

export function layBuoiHienTai(gio = new Date().getHours()): BuoiTrongNgay {
  if (gio < 5) return 'rang';
  if (gio < 11) return 'sang';
  if (gio < 14) return 'trua';
  if (gio < 18) return 'chieu';
  if (gio < 22) return 'toi';
  return 'dem';
}

/* Bảng trang phục ổn định cho từng buổi trong ngày */
const TRANG_PHUC_BUOI: Record<BuoiTrongNgay, KieuAo[]> = {
  rang: ['khongMac', 'hoodie'],          // Rạng sáng: ngủ ấm hoặc lông tự nhiên
  sang: ['poloXanh', 'aoDoTim'],         // Phiên sáng ATO: Polo xanh hoặc Áo Đỏ may mắn
  trua: ['khongMac', 'poloXanh'],        // Nghỉ trưa: Ngâm bồn không mặc đồ hoặc ăn dưa hấu
  chieu: ['vestTrader', 'aoDoTim'],      // Phiên chiều ATC: Vest Trader hoặc Áo Tím đón trần
  toi: ['poloXanh', 'hoodie'],           // Buổi tối: Tổng kết lệnh, hoodie ấm áp
  dem: ['khongMac', 'hoodie'],           // Đêm muộn: Không mặc đồ ngâm nước hoặc ngủ
};

const LS_OUTFIT_KEY = 'ckv_capy_session_outfit';

/** Lấy kiểu áo cố định của buổi hiện tại (1 buổi chỉ 1 dạng đồ) */
export function layKieuAoTheoBuoi(): KieuAo {
  const homNay = new Date().toISOString().slice(0, 10);
  const buoi = layBuoiHienTai();
  const sessionKey = `${homNay}_${buoi}`;

  try {
    const saved = localStorage.getItem(LS_OUTFIT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.session === sessionKey && parsed.kieuAo) {
        return parsed.kieuAo as KieuAo;
      }
    }
  } catch {}

  // Chọn 1 kiểu áo cho buổi này và khoá lại
  const dsAo = TRANG_PHUC_BUOI[buoi];
  const dayNum = new Date().getDate() + new Date().getMonth() * 31;
  const picked = dsAo[dayNum % dsAo.length];

  try {
    localStorage.setItem(LS_OUTFIT_KEY, JSON.stringify({ session: sessionKey, kieuAo: picked }));
  } catch {}

  return picked;
}

export interface BoDo {
  tuThe: TuThe;
  phuKien: TenPhuKien[];
  nhomMat: Nhom[];
  kieuAo: KieuAo;
}

export type NguCanh = 'thuong' | 'xuatBaoCao' | 'datKpi' | 'khachBoQuen' | 'nhapPhoi' | 'nghiTrua';

const TU_DO: Record<NguCanh, Array<Omit<BoDo, 'kieuAo'>>> = {
  thuong: [
    { tuThe: 'tayOK', phuKien: ['cam'], nhomMat: ['vui', 'yeu'] },
    { tuThe: 'dung', phuKien: ['cam'], nhomMat: ['vui', 'toMo'] },
    { tuThe: 'ngoi', phuKien: ['thap3Cam'], nhomMat: ['vui', 'yeu'] },
    { tuThe: 'nam', phuKien: [], nhomMat: ['chan', 'buonNgu'] },
    { tuThe: 'soiLaptop', phuKien: [], nhomMat: ['lamViec', 'vui'] },
  ],
  xuatBaoCao: [
    { tuThe: 'soiLaptop', phuKien: ['kinhCan'], nhomMat: ['lamViec'] },
    { tuThe: 'dung', phuKien: ['caVat'], nhomMat: ['lamViec', 'tuHao'] },
  ],
  datKpi: [
    { tuThe: 'tayOK', phuKien: ['kinhRam', 'phaoGiay'], nhomMat: ['tuHao', 'vui'] },
    { tuThe: 'dung', phuKien: ['kinhRam', 'phaoGiay'], nhomMat: ['tuHao'] },
  ],
  khachBoQuen: [
    { tuThe: 'ngoi', phuKien: ['mua'], nhomMat: ['dau', 'chan'] },
  ],
  nhapPhoi: [
    { tuThe: 'dung', phuKien: ['nonBaoHo'], nhomMat: ['lamViec'] },
  ],
  nghiTrua: [
    { tuThe: 'tamBonGo', phuKien: ['cam', 'vitVang'], nhomMat: ['vui', 'buonNgu'] },
    { tuThe: 'ngoi', phuKien: ['duaHau'], nhomMat: ['doi', 'vui'] },
    { tuThe: 'ngoi', phuKien: ['traSua'], nhomMat: ['vui'] },
  ],
};

function boc<T>(ds: readonly T[]): T {
  return ds[Math.floor(Math.random() * ds.length)] as T;
}

export function chonBoDo(
  nc: NguCanh = 'thuong',
  giong: GreetingStyle = 'vui',
): { bo: BoDo; mat: BieuCam } {
  const ds = TU_DO[nc] ?? TU_DO.thuong;
  const rawBo = boc(ds);
  const kieuAo = layKieuAoTheoBuoi();

  const bo: BoDo = {
    ...rawBo,
    kieuAo
  };

  return { bo, mat: bocBieuCam(bo.nhomMat) };
}

export const DS_NGU_CANH = Object.keys(TU_DO) as NguCanh[];
export { TU_DO };
