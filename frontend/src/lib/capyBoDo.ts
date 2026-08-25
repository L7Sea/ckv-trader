import type { GreetingStyle } from './greeting';
import type { TuThe } from './capyTuThe';
import type { TenPhuKien } from './capyPhuKien';
import { bocBieuCam, type BieuCam, type Nhom } from './capyBieuCam';

/* ═══════════════════════════════════════════════════════════════
   QUY ĐỊNH BỘ ĐỒ THEO BUỔI & NGỮ CẢNH TRADING (CKV PRO)
   Giữ nguyên ngoại hình chuẩn gốc CKV, mở rộng đa dạng bối cảnh:
     - Thường ngày: Chill, quả cam, tháp 3 cam, dáng OK
     - Xuất báo cáo / Soi thuật toán: Laptop + Kính cận / Cà vạt
     - Chốt lời / Đạt KPI: Kính râm + Pháo giấy ăn mừng
     - Cắt lỗ / Rung lắc: Đứng dưới mây mưa buồn
     - Bắt đáy / Vào lệnh lớn: Nón bảo hộ công trường
     - Nghỉ trưa / Sau 15h ATC: Tắm bồn Onsen, bơi nổi, ngồi phao, dưa hấu, trà sữa
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
    { tuThe: 'nam', phuKien: ['hoa'], nhomMat: ['chan', 'buonNgu'] },
    { tuThe: 'dung', phuKien: ['no'], nhomMat: ['tuHao', 'vui'] },
    { tuThe: 'soiLaptop', phuKien: [], nhomMat: ['lamViec', 'vui'] },
  ],
  xuatBaoCao: [
    { tuThe: 'soiLaptop', phuKien: ['kinhCan', 'laptop'], nhomMat: ['lamViec'] },
    { tuThe: 'dung', phuKien: ['caVat', 'capTap'], nhomMat: ['lamViec', 'tuHao'] },
    { tuThe: 'ngoi', phuKien: ['kinhCan', 'traSua'], nhomMat: ['lamViec', 'buonNgu'] },
  ],
  datKpi: [
    { tuThe: 'tayOK', phuKien: ['kinhRam', 'phaoGiay'], nhomMat: ['tuHao', 'vui'] },
    { tuThe: 'dung', phuKien: ['kinhRam', 'phaoGiay'], nhomMat: ['tuHao'] },
    { tuThe: 'ngoi', phuKien: ['phaoGiay', 'cam'], nhomMat: ['vui', 'tuHao'] },
  ],
  khachBoQuen: [
    { tuThe: 'ngoi', phuKien: ['mua'], nhomMat: ['dau', 'chan'] },
    { tuThe: 'dung', phuKien: ['mua', 'khanQuang'], nhomMat: ['dau', 'buonNgu'] },
  ],
  nhapPhoi: [
    { tuThe: 'dung', phuKien: ['nonBaoHo'], nhomMat: ['lamViec'] },
    { tuThe: 'ngoi', phuKien: ['nonBaoHo'], nhomMat: ['lamViec', 'toMo'] },
  ],
  nghiTrua: [
    { tuThe: 'tamBon', phuKien: ['cam', 'khanTam'], nhomMat: ['vui', 'buonNgu'] },
    { tuThe: 'boi', phuKien: ['vitVang'], nhomMat: ['vui', 'yeu'] },
    { tuThe: 'phao', phuKien: ['kinhRam', 'traSua'], nhomMat: ['vui', 'tuHao'] },
    { tuThe: 'ngoi', phuKien: ['duaHau'], nhomMat: ['doi', 'vui'] },
    { tuThe: 'tamBon', phuKien: ['vitVang'], nhomMat: ['vui'] },
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
