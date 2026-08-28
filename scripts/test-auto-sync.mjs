/* ═══════════════════════════════════════════════════════════════════════════
   KIỂM THỬ BỘ HẸN GIỜ TỰ ĐỘNG ĐỒNG BỘ
   Import đúng module app đang chạy (frontend/src/lib/useAutoSync.ts).
   Chạy: node scripts/test-auto-sync.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

import assert from 'node:assert/strict';
import test from 'node:test';

import { SYNC_SLOTS, dueSlot, isTradingSession, vnMinutesOfDay } from '../frontend/src/lib/syncSchedule.ts';

/** Dựng thời điểm từ giờ Việt Nam (UTC+7) cho dễ đọc. */
const vn = (iso) => new Date(`${iso}+07:00`);

test('1. Bốn mốc trong ngày đúng thứ tự sáng - trưa - chiều - tối', () => {
  assert.equal(SYNC_SLOTS.length, 4);
  const minutes = SYNC_SLOTS.map((s) => s.minutes);
  assert.deepEqual([...minutes].sort((a, b) => a - b), minutes, 'Các mốc phải tăng dần');
  assert.deepEqual(SYNC_SLOTS.map((s) => s.id), ['sang', 'trua', 'chieu', 'toi']);
});

test('2. Đọc giờ theo múi giờ Việt Nam, không theo giờ máy', () => {
  // 02:20 UTC = 09:20 giờ VN
  assert.equal(vnMinutesOfDay(new Date('2026-08-28T02:20:00Z')), 9 * 60 + 20);
  // 23:26 UTC ngày 27 = 06:26 sáng ngày 28 giờ VN
  assert.equal(vnMinutesOfDay(new Date('2026-08-27T23:26:00Z')), 6 * 60 + 26);
});

test('3. Trước mốc đầu tiên thì không đồng bộ', () => {
  assert.equal(dueSlot(vn('2026-08-28T06:26:00'), null), null);
  assert.equal(dueSlot(vn('2026-08-28T09:19:00'), null), null);
});

test('4. Tới mốc thì trả về đúng mốc đó', () => {
  assert.equal(dueSlot(vn('2026-08-28T09:20:00'), null), '2026-08-28|sang');
  assert.equal(dueSlot(vn('2026-08-28T11:41:00'), null), '2026-08-28|trua');
  assert.equal(dueSlot(vn('2026-08-28T15:05:00'), null), '2026-08-28|chieu');
  assert.equal(dueSlot(vn('2026-08-28T20:00:00'), null), '2026-08-28|toi');
});

test('5. Mốc đã chạy rồi thì KHÔNG chạy lại — mở app 10 lần vẫn chỉ đồng bộ 1 lần', () => {
  const marker = '2026-08-28|sang';
  assert.equal(dueSlot(vn('2026-08-28T09:20:00'), marker), null);
  assert.equal(dueSlot(vn('2026-08-28T10:30:00'), marker), null);
  assert.equal(dueSlot(vn('2026-08-28T11:39:00'), marker), null);
  // Sang mốc kế tiếp thì lại chạy
  assert.equal(dueSlot(vn('2026-08-28T11:40:00'), marker), '2026-08-28|trua');
});

test('6. Mở app buổi tối sau khi tắt máy cả ngày: chỉ chạy MỐC MỚI NHẤT, không dồn 4 lần', () => {
  const marker = dueSlot(vn('2026-08-28T21:00:00'), null);
  assert.equal(marker, '2026-08-28|toi');
  // Sau khi chạy xong thì không còn mốc nào nợ lại
  assert.equal(dueSlot(vn('2026-08-28T21:05:00'), marker), null);
});

test('7. Sang ngày mới thì mốc được làm mới', () => {
  const homQua = '2026-08-28|toi';
  assert.equal(dueSlot(vn('2026-08-29T09:20:00'), homQua), '2026-08-29|sang');
});

test('8. Nhận đúng phiên giao dịch: T2-T6 09:00-15:00, nghỉ cuối tuần', () => {
  // 28/08/2026 là thứ Sáu
  assert.equal(isTradingSession(vn('2026-08-28T10:00:00')), true);
  assert.equal(isTradingSession(vn('2026-08-28T08:59:00')), false);
  assert.equal(isTradingSession(vn('2026-08-28T15:01:00')), false);
  // 29/08 thứ Bảy, 30/08 Chủ nhật
  assert.equal(isTradingSession(vn('2026-08-29T10:00:00')), false);
  assert.equal(isTradingSession(vn('2026-08-30T10:00:00')), false);
});
