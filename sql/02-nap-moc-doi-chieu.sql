-- ══════════════════════════════════════════════════════════════════════════
--  CKV — 02. NẠP MỐC ĐỐI CHIẾU 28/08/2026 06:26
--  ─────────────────────────────────────────────────────────────────────────
--  ⚠️ FILE NÀY GHI ĐÈ SỐ DƯ ĐANG CÓ. Chỉ chạy khi:
--     - Dựng dự án lần đầu (bảng còn rỗng), HOẶC
--     - Muốn đưa số dư về đúng mốc đã đối chiếu với app DNSE.
--  Nếu số dư hiện tại đang đúng thì ĐỪNG chạy file này.
--
--  Số liệu dưới đây khớp 100% ảnh chụp app DNSE lúc 28/08/2026 06:26:
--     Tiền mặt 171 · Cổ phiếu 14,700,000 · Nợ 7,006,776 · NAV 7,693,395
--     Lãi chưa chốt -1,223,158 (-7.75%) · Giá hòa vốn 15.923
--
--  Sau khi nạp, app tự tính lại theo frontend/src/services/dealModel.ts mỗi
--  lần đồng bộ — các con số ở đây chỉ là điểm khởi đầu, không phải nguồn sự thật.
-- ══════════════════════════════════════════════════════════════════════════

INSERT INTO public.portfolios (
    id, account_name, account_number, sub_account,
    cash, receiving_cash, margin_debt, total_equity, total_profit_loss, current_simulated_date
)
VALUES ('default', 'VIP Trader', '001C888999', '06', 171, 0, 7006776, 7693395, -1223158, DATE '2026-08-28')
ON CONFLICT (id) DO UPDATE SET
    cash = EXCLUDED.cash,
    receiving_cash = EXCLUDED.receiving_cash,
    margin_debt = EXCLUDED.margin_debt,
    total_equity = EXCLUDED.total_equity,
    total_profit_loss = EXCLUDED.total_profit_loss,
    current_simulated_date = EXCLUDED.current_simulated_date,
    updated_at = NOW();

INSERT INTO public.positions (
    symbol, total_quantity, available_quantity, t1_quantity, t2_quantity,
    avg_price, breakeven_price, market_price, market_value,
    unrealized_pnl, unrealized_pnl_pct, target_price, stop_loss
)
VALUES ('TPB', 1000, 1000, 0, 0, 15803, 15923, 14700, 14700000, -1223158, -7.75, 16500, 13800)
ON CONFLICT (symbol) DO UPDATE SET
    total_quantity = EXCLUDED.total_quantity,
    available_quantity = EXCLUDED.available_quantity,
    t1_quantity = EXCLUDED.t1_quantity,
    t2_quantity = EXCLUDED.t2_quantity,
    avg_price = EXCLUDED.avg_price,
    breakeven_price = EXCLUDED.breakeven_price,
    market_price = EXCLUDED.market_price,
    market_value = EXCLUDED.market_value,
    unrealized_pnl = EXCLUDED.unrealized_pnl,
    unrealized_pnl_pct = EXCLUDED.unrealized_pnl_pct,
    target_price = EXCLUDED.target_price,
    stop_loss = EXCLUDED.stop_loss,
    updated_at = NOW();
