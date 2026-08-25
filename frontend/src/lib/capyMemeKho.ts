import { loadUserSettings, saveUserSetting } from './settingsService';
import { kiemCongThuc, timTrung, vanTay, type CongThucMeme } from './capyMemeSpec';
import { DS_100_MEMES } from './capy100Memes';

/* ═══════════════════════════════════════════════════════════════
   KHO 100+ CÔNG THỨC MEME CAPYBARA.
   Lưu localStorage và khởi tạo sẵn 105 dáng sticker đặc sắc.
   ═══════════════════════════════════════════════════════════════ */

const KHOA = 'ckv_capy_meme_100';
const TRAN = 300;

export function docKho(): CongThucMeme[] {
  try {
    const s = localStorage.getItem(KHOA);
    if (!s) {
      localStorage.setItem(KHOA, JSON.stringify(DS_100_MEMES));
      return DS_100_MEMES;
    }
    const v = JSON.parse(s);
    if (Array.isArray(v) && v.length > 0) return v;
    localStorage.setItem(KHOA, JSON.stringify(DS_100_MEMES));
    return DS_100_MEMES;
  } catch {
    return DS_100_MEMES;
  }
}

function ghiKho(ds: CongThucMeme[]): void {
  try { localStorage.setItem(KHOA, JSON.stringify(ds)); } catch {}
  window.dispatchEvent(new CustomEvent('tl-capy-meme', { detail: ds.length }));
  saveUserSetting('capy_meme', ds);
}

export interface KetQuaThem {
  ok: boolean;
  loi?: string[];
  canhBao?: string[];
  trungVoi?: CongThucMeme;
  spec?: CongThucMeme;
}

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
  ghiKho(DS_100_MEMES);
}

export function syncKhoTuTaiKhoan(): void {
  loadUserSettings().then((s) => {
    const v = s.capy_meme;
    if (!Array.isArray(v) || v.length === 0) return;
    const kho = docKho();
    const co = new Set(kho.map(vanTay));
    const them = (v as CongThucMeme[]).filter((x) => {
      const k = kiemCongThuc(x);
      return k.ok && k.spec && !co.has(vanTay(k.spec));
    });
    if (them.length) {
      try { localStorage.setItem(KHOA, JSON.stringify([...kho, ...them])); } catch {}
      window.dispatchEvent(new CustomEvent('tl-capy-meme', { detail: kho.length + them.length }));
    }
  }).catch(() => {});
}
