import { vnDateString } from '../services/dealModel.ts';

/* ═══════════════════════════════════════════════════════════════════════════
   LỊCH TỰ ĐỘNG ĐỒNG BỘ — LOGIC THUẦN, KHÔNG PHỤ THUỘC REACT
   ───────────────────────────────────────────────────────────────────────────
   Tách riêng khỏi useAutoSync.ts để kiểm thử được bằng Node với thời điểm giả
   lập. Quy tắc: mọi thứ liên quan đến giờ giấc phải tính theo MÚI GIỜ VIỆT NAM,
   không theo giờ máy của người dùng.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SyncSlot {
  id: string;
  label: string;
  /** Số phút kể từ 00:00 giờ Việt Nam */
  minutes: number;
}

export const SYNC_SLOTS: SyncSlot[] = [
  { id: 'sang', label: 'Sáng (mở cửa)', minutes: 9 * 60 + 20 },
  { id: 'trua', label: 'Trưa (nghỉ giữa phiên)', minutes: 11 * 60 + 40 },
  { id: 'chieu', label: 'Chiều (sau ATC)', minutes: 15 * 60 + 5 },
  { id: 'toi', label: 'Tối (chốt ngày)', minutes: 20 * 60 }
];

/** Giờ:phút hiện tại theo múi giờ Việt Nam, quy về số phút kể từ 00:00. */
export function vnMinutesOfDay(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value || 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value || 0);
  return hour * 60 + minute;
}

/** Đang trong phiên giao dịch HOSE (Thứ 2 - Thứ 6, 09:00 - 15:00 giờ VN)? */
export function isTradingSession(now: Date = new Date()): boolean {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'short'
  }).format(now);
  if (weekday === 'Sat' || weekday === 'Sun') return false;

  const minutes = vnMinutesOfDay(now);
  return minutes >= 9 * 60 && minutes <= 15 * 60;
}

/**
 * Dấu vết `YYYY-MM-DD|mốc` của mốc cần chạy, hoặc null nếu không có mốc nào nợ.
 *
 * Chỉ trả về mốc MUỘN NHẤT đã qua, nên mở app lúc 21h sau khi tắt máy cả ngày
 * chỉ đồng bộ một lần chứ không dồn đủ bốn lần.
 */
export function dueSlot(now: Date = new Date(), lastRun: string | null = null): string | null {
  const today = vnDateString(now);
  const minutes = vnMinutesOfDay(now);

  const passed = SYNC_SLOTS.filter((slot) => minutes >= slot.minutes);
  if (passed.length === 0) return null;

  const marker = `${today}|${passed[passed.length - 1].id}`;
  return lastRun === marker ? null : marker;
}
