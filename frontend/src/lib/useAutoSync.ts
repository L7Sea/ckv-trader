import { useEffect, useRef } from 'react';
import { useTradingStore } from '../store/useTradingStore';
import { dueSlot, isTradingSession } from './syncSchedule';

/* ═══════════════════════════════════════════════════════════════════════════
   TỰ ĐỘNG ĐỒNG BỘ THEO KHUNG GIỜ
   ───────────────────────────────────────────────────────────────────────────
   Trước đây app chỉ cập nhật khi người dùng tự bấm nút "Đồng Bộ" — mở app buổi
   sáng là thấy số của hôm qua. Hook này chạy đồng bộ tự động tại 4 mốc trong
   ngày (sáng/trưa/chiều/tối), cộng một nhịp làm tươi giá trong phiên giao dịch.

   Mỗi mốc chỉ chạy ĐÚNG MỘT LẦN mỗi ngày nhờ dấu vết trong localStorage, nên mở
   app nhiều lần không đồng bộ nhiều lần; ngược lại tắt máy cả ngày rồi mở lại
   thì mốc đã lỡ được chạy bù ngay.

   Lịch giờ giấc nằm ở syncSchedule.ts (logic thuần, có test riêng).
   ═══════════════════════════════════════════════════════════════════════════ */

const LAST_RUN_KEY = 'ckv_auto_sync_last_run';
const SLOT_CHECK_MS = 60_000;
const LIVE_REFRESH_MS = 120_000;

/** Bật tự động đồng bộ. Chỉ gọi một lần ở gốc ứng dụng. */
export function useAutoSync(enabled: boolean) {
  const syncAllUnifiedData = useTradingStore((s) => s.syncAllUnifiedData);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const runIfDue = async () => {
      if (isSyncingRef.current) return;

      let lastRun: string | null = null;
      try {
        lastRun = localStorage.getItem(LAST_RUN_KEY);
      } catch {
        // Trình duyệt chặn localStorage: bỏ tự động, nút bấm tay vẫn dùng được
        return;
      }

      const marker = dueSlot(new Date(), lastRun);
      if (!marker) return;

      isSyncingRef.current = true;
      try {
        // Ghi dấu TRƯỚC khi chạy để hai tab mở song song không cùng đồng bộ một mốc
        localStorage.setItem(LAST_RUN_KEY, marker);
        await syncAllUnifiedData();
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Chạy bù ngay khi mở app nếu có mốc đã lỡ
    void runIfDue();

    const slotTimer = window.setInterval(runIfDue, SLOT_CHECK_MS);

    /* Trong phiên giao dịch thì làm tươi giá định kỳ để bảng giá không đứng yên.
       Nhịp này KHÔNG ghi dấu mốc, và bỏ qua khi tab đang ẩn. */
    const liveTimer = window.setInterval(() => {
      if (!isTradingSession() || isSyncingRef.current || document.hidden) return;
      isSyncingRef.current = true;
      void syncAllUnifiedData().finally(() => {
        isSyncingRef.current = false;
      });
    }, LIVE_REFRESH_MS);

    // Quay lại tab sau khi máy ngủ đông thì kiểm tra lại ngay
    const onVisible = () => {
      if (!document.hidden) void runIfDue();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearInterval(slotTimer);
      window.clearInterval(liveTimer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled, syncAllUnifiedData]);
}
