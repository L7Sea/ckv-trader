-- ══════════════════════════════════════════════════════════════════════════
--  CKV — 03. TỰ KIỂM CHỨNG SAU KHI CHẠY
--  ─────────────────────────────────────────────────────────────────────────
--  CHẠY KHI NÀO: sau 01 (và 02 nếu có), hoặc bất cứ lúc nào nghi ngờ số lệch.
--  File này CHỈ ĐỌC, không thay đổi gì.
-- ══════════════════════════════════════════════════════════════════════════

-- ── A. Đủ cột chưa? Thiếu cột nào là app không ghi được cột đó ──────────────
SELECT
    t.tbl AS "Bảng",
    t.col AS "Cột bắt buộc",
    CASE WHEN c.column_name IS NULL THEN '❌ THIẾU — chạy lại 01-cau-truc.sql' ELSE '✅ có' END AS "Trạng thái"
FROM (
    VALUES
        ('portfolios', 'current_simulated_date'),
        ('positions', 'breakeven_price'),
        ('positions', 'target_price'),
        ('positions', 'stop_loss'),
        ('transactions', 'net_amount'),
        ('transactions', 'realized_pnl'),
        ('transactions', 'strategy'),
        ('transactions', 'target_price'),
        ('transactions', 'stop_loss')
) AS t(tbl, col)
LEFT JOIN information_schema.columns c
       ON c.table_schema = 'public' AND c.table_name = t.tbl AND c.column_name = t.col
ORDER BY t.tbl, t.col;

-- ── B. Số dư có tự nhất quán không? ────────────────────────────────────────
--     Bất biến kế toán: NAV = Tiền mặt + Tiền chờ về + Giá trị cổ phiếu − Nợ
SELECT
    p.cash                                                        AS "Tiền mặt",
    p.receiving_cash                                              AS "Tiền chờ về",
    COALESCE(SUM(pos.market_value), 0)                            AS "Giá trị cổ phiếu",
    p.margin_debt                                                 AS "Nợ Margin",
    p.cash + p.receiving_cash + COALESCE(SUM(pos.market_value), 0) - p.margin_debt AS "NAV tính lại",
    p.total_equity                                                AS "NAV đang lưu",
    p.total_profit_loss                                           AS "Lãi/Lỗ",
    p.updated_at                                                  AS "Cập nhật lúc",
    CASE
      WHEN p.cash + p.receiving_cash + COALESCE(SUM(pos.market_value), 0) - p.margin_debt = p.total_equity
      THEN '✅ KHỚP'
      ELSE '❌ LỆCH — bấm Đồng Bộ trong app để tính lại'
    END                                                           AS "Kiểm tra"
FROM public.portfolios p
LEFT JOIN public.positions pos ON pos.total_quantity > 0
WHERE p.id = 'default'
GROUP BY p.id, p.cash, p.receiving_cash, p.margin_debt, p.total_equity, p.total_profit_loss, p.updated_at;

-- ── C. Từng vị thế có tự nhất quán không? ──────────────────────────────────
SELECT
    symbol                                        AS "Mã",
    total_quantity                                AS "Khối lượng",
    market_price                                  AS "Thị giá",
    market_value                                  AS "Giá trị",
    breakeven_price                               AS "Giá hòa vốn",
    unrealized_pnl                                AS "Lãi/Lỗ",
    CASE
      WHEN total_quantity * market_price = market_value THEN '✅ KHỚP'
      ELSE '❌ LỆCH giá trị'
    END                                           AS "Kiểm tra"
FROM public.positions
ORDER BY symbol;
