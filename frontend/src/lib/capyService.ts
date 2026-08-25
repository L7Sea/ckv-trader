import { loadUserSettings, saveUserSetting } from './settingsService';

/* ═══════════════════════════════════════════════════════════════
   BÉ CAPY — linh vật chuột lang nước của app.

   Theo đúng nếp themeService: lưu localStorage để hiện ngay lúc mở
   app (không chờ mạng), rồi đồng bộ lên tài khoản để đổi máy vẫn giữ.

   NGUYÊN TẮC LỜI THOẠI — quan trọng, đừng bỏ:
   App này vai `boss` DÙNG CHUNG. Mọi câu Capy nói phải là câu anh sẵn
   sàng để sếp đọc qua vai. Không kháy, không mỉa, không giục kiểu
   "ơ chưa làm à?". Chỉ báo việc + khen thật.
   ═══════════════════════════════════════════════════════════════ */

export type CapyMode = 'on' | 'off';
const KEY = 'tl_capy';

export function getCapy(): CapyMode {
  try { return localStorage.getItem(KEY) === 'off' ? 'off' : 'on'; }
  catch { return 'on'; }
}

export function setCapy(m: CapyMode, sync = true): void {
  try { localStorage.setItem(KEY, m); } catch { /* hết quota */ }
  window.dispatchEvent(new CustomEvent('tl-capy-mode', { detail: m }));
  if (sync) saveUserSetting('capy', m);
}

/* Sau khi đăng nhập: kéo tuỳ chọn từ tài khoản (đồng bộ đa máy) */
export function syncCapyFromAccount(): void {
  loadUserSettings().then((s) => {
    if (s.capy === 'on' || s.capy === 'off') setCapy(s.capy, false);
  }).catch(() => {});
}

/* ── Cho chỗ khác trong app sai Capy nói ──
   Dùng CustomEvent thay vì context/store: bất kỳ file nào cũng gọi được
   1 dòng, không phải bọc provider hay truyền prop xuyên 5 tầng. Nếu
   người dùng tắt Capy thì sự kiện rơi vào hư không — vô hại. */
export function capyNoi(loi: string, giay = 4): void {
  window.dispatchEvent(new CustomEvent('tl-capy-noi', { detail: { loi, giay } }));
}
