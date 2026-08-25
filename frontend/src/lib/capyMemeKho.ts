import { loadUserSettings, saveUserSetting } from './settingsService';
import { kiemCongThuc, timTrung, vanTay, type CongThucMeme } from './capyMemeSpec';

/* ═══════════════════════════════════════════════════════════════
   KHO CÔNG THỨC MEME.

   Lưu localStorage để hiện ngay lúc mở app (không chờ mạng), đồng thời
   đẩy lên tài khoản để đổi máy vẫn còn — đúng nếp themeService/capyService.
   ═══════════════════════════════════════════════════════════════ */

const KHOA = 'tl_capy_meme';
const TRAN = 200;   // tối đa bao nhiêu công thức, tránh phình localStorage

export function docKho(): CongThucMeme[] {
  try {
    const s = localStorage.getItem(KHOA);
    if (!s) return [];
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

function ghiKho(ds: CongThucMeme[]): void {
  try { localStorage.setItem(KHOA, JSON.stringify(ds)); } catch { /* hết quota */ }
  window.dispatchEvent(new CustomEvent('tl-capy-meme', { detail: ds.length }));
  saveUserSetting('capy_meme', ds);
}

export interface KetQuaThem {
  ok: boolean;
  /** Lý do không thêm được */
  loi?: string[];
  canhBao?: string[];
  /** Nếu trùng thì đây là công thức đã có */
  trungVoi?: CongThucMeme;
  spec?: CongThucMeme;
}

/**
 * Thêm 1 công thức. Từ chối nếu sai định dạng HOẶC trùng hình với
 * công thức đã có — báo rõ trùng với cái nào để anh khỏi đoán.
 */
export function themCongThuc(raw: unknown): KetQuaThem {
  const kiem = kiemCongThuc(raw);
  if (!kiem.ok || !kiem.spec) return { ok: false, loi: kiem.loi, canhBao: kiem.canhBao };

  const kho = docKho();
  const trung = timTrung(kiem.spec, kho);
  if (trung) return { ok: false, trungVoi: trung, canhBao: kiem.canhBao };

  if (kho.length >= TRAN) {
    return { ok: false, loi: [`Kho đã đủ ${TRAN} công thức — xoá bớt cái không dùng rồi thêm tiếp`] };
  }

  ghiKho([...kho, kiem.spec]);
  return { ok: true, spec: kiem.spec, canhBao: kiem.canhBao };
}

/** Thêm nhiều công thức một lượt (dán cả mảng JSON) */
export function themNhieu(ds: unknown[]): { them: number; trung: number; hong: number; chiTiet: string[] } {
  let them = 0, trung = 0, hong = 0;
  const chiTiet: string[] = [];
  for (const [i, raw] of ds.entries()) {
    const r = themCongThuc(raw);
    if (r.ok) { them++; continue; }
    if (r.trungVoi) { trung++; chiTiet.push(`#${i + 1} trùng với "${r.trungVoi.ten}"`); continue; }
    hong++;
    chiTiet.push(`#${i + 1}: ${(r.loi ?? []).join(' · ')}`);
  }
  return { them, trung, hong, chiTiet };
}

export function xoaCongThuc(ten: string): void {
  ghiKho(docKho().filter((x) => x.ten !== ten));
}

export function xoaHet(): void {
  ghiKho([]);
}

/** Sau khi đăng nhập: kéo kho từ tài khoản về (đồng bộ đa máy) */
export function syncKhoTuTaiKhoan(): void {
  loadUserSettings().then((s) => {
    const v = s.capy_meme;
    if (!Array.isArray(v) || v.length === 0) return;
    /* Gộp: giữ cái đang có ở máy này, thêm cái từ tài khoản nếu chưa trùng */
    const kho = docKho();
    const co = new Set(kho.map(vanTay));
    const them = (v as CongThucMeme[]).filter((x) => {
      const k = kiemCongThuc(x);
      return k.ok && k.spec && !co.has(vanTay(k.spec));
    });
    if (them.length) {
      try { localStorage.setItem(KHOA, JSON.stringify([...kho, ...them])); } catch { /* quota */ }
      window.dispatchEvent(new CustomEvent('tl-capy-meme', { detail: kho.length + them.length }));
    }
  }).catch(() => { /* hỏng mạng thì dùng kho ở máy */ });
}
