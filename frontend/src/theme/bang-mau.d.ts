/* Khai báo kiểu cho `bang-mau.js`.
   Bảng màu viết bằng JS thuần (không phải .ts) để Node chạy được thẳng trong
   bài test mà không cần biên dịch — `scripts/test-mau-giao-dien.mjs` và
   `scripts/do-tuong-phan-component.mjs` đều import trực tiếp file đó. */

export interface BangMau {
  nen: string;
  the: string;
  the2: string;
  vien: string;
  vienRo: string;
  chu: string;
  chuPhu: string;
  chuMo: string;
  nhan: string;
  nhanChu: string;
  tot: string;
  totNen: string;
  loi: string;
  loiNen: string;
  canhBao: string;
  canhBaoNen: string;
}

export declare const SANG: BangMau;
export declare const TOI: BangMau;
export declare const CHU_TREN_NHAN: { sang: string; toi: string };
export declare const MAU_BIEU_DO: string[];
export declare const MIEN_TRU: { thuongHieu: string[]; fileTranh: string[] };
export declare const THANG_CHU: Record<string, string>;
export declare const BO_GOC: Record<string, string>;
export declare const PHONG: { tieuDe: string[]; than: string[] };
export declare const CAP_PHAI_DAT: [string, keyof BangMau, keyof BangMau, number][];
export declare function tuongPhan(mauA: string, mauB: string): number;
