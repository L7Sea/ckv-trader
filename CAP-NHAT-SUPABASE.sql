-- ══════════════════════════════════════════════════════════════════════════
--  CKV — CẬP NHẬT CƠ SỞ DỮ LIỆU SUPABASE (chạy 1 lần, an toàn khi chạy lại)
--  ─────────────────────────────────────────────────────────────────────────
--  CÁCH DÙNG: mở supabase.com > dự án srgdawqqwogkyncqvqta > SQL Editor >
--  dán toàn bộ file này > bấm RUN.
--
--  VÌ SAO PHẢI CHẠY: bảng cũ thiếu 7 cột mà app cần ghi. Khi app gửi lên,
--  PostgREST trả lỗi 400 và TOÀN BỘ lệnh ghi bị huỷ — đó là lý do app báo
--  "đồng bộ thành công" nhưng tải lại trang là số cũ ngày 25/8 quay về.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. BỔ SUNG CỘT CÒN THIẾU ────────────────────────────────────────────────
ALTER TABLE public.portfolios   ADD COLUMN IF NOT EXISTS current_simulated_date DATE DEFAULT CURRENT_DATE;

ALTER TABLE public.positions    ADD COLUMN IF NOT EXISTS breakeven_price NUMERIC;
ALTER TABLE public.positions    ADD COLUMN IF NOT EXISTS target_price    NUMERIC;
ALTER TABLE public.positions    ADD COLUMN IF NOT EXISTS stop_loss       NUMERIC;

ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS net_amount   NUMERIC;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS realized_pnl NUMERIC;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS strategy     TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS target_price NUMERIC;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS stop_loss    NUMERIC;

-- ── 2. SỬA HÀNG DỮ LIỆU CŨ ĐANG LỆCH ────────────────────────────────────────
--     Nạp đúng mốc 28/08/2026 06:26 (khớp 100% ảnh app DNSE).
--     Sau bước này app sẽ tự tính lại theo dealModel.ts mỗi lần đồng bộ.
UPDATE public.portfolios SET
    cash                   = 171,
    receiving_cash         = 0,
    margin_debt            = 7006776,
    total_equity           = 7693395,
    total_profit_loss      = -1223158,
    current_simulated_date = DATE '2026-08-28',
    updated_at             = NOW()
WHERE id = 'default';

UPDATE public.positions SET
    total_quantity     = 1000,
    available_quantity = 1000,
    t1_quantity        = 0,
    t2_quantity        = 0,
    avg_price          = 15803,
    breakeven_price    = 15923,
    market_price       = 14700,
    market_value       = 14700000,
    unrealized_pnl     = -1223158,
    unrealized_pnl_pct = -7.75,
    target_price       = 16500,
    stop_loss          = 13800,
    updated_at         = NOW()
WHERE symbol = 'TPB';

-- ── 3. KIỂM CHỨNG NGAY SAU KHI CHẠY ─────────────────────────────────────────
--     Kết quả phải khớp: Nợ 7,006,776 · NAV 7,693,395 · Lãi/Lỗ -1,223,158
SELECT
    p.cash                                   AS "Tiền mặt",
    pos.market_value                         AS "Giá trị cổ phiếu",
    p.margin_debt                            AS "Nợ Margin",
    p.cash + pos.market_value - p.margin_debt AS "NAV tính lại",
    p.total_equity                           AS "NAV đang lưu",
    p.total_profit_loss                      AS "Lãi/Lỗ",
    CASE
      WHEN p.cash + pos.market_value - p.margin_debt = p.total_equity
      THEN '✅ KHỚP'
      ELSE '❌ LỆCH'
    END                                      AS "Kiểm tra"
FROM public.portfolios p
CROSS JOIN public.positions pos
WHERE p.id = 'default' AND pos.symbol = 'TPB';
