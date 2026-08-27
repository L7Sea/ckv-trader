-- ══════════════════════════════════════════════════════════════════════
-- CKV PRO TRADER - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Dán và chạy toàn bộ mã SQL này trong Supabase SQL Editor (supabase.com)
-- ══════════════════════════════════════════════════════════════════════

-- 1. BẢNG TỔNG QUAN TÀI SẢN (PORTFOLIO)
CREATE TABLE IF NOT EXISTS public.portfolios (
    id TEXT PRIMARY KEY DEFAULT 'default',
    account_name TEXT DEFAULT 'VIP Trader',
    account_number TEXT DEFAULT '001C888999',
    sub_account TEXT DEFAULT '06',
    cash NUMERIC DEFAULT 0,
    receiving_cash NUMERIC DEFAULT 0,
    margin_debt NUMERIC DEFAULT 0,
    total_equity NUMERIC DEFAULT 0,
    total_profit_loss NUMERIC DEFAULT 0,
    current_simulated_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bổ sung cột cho cơ sở dữ liệu đã tạo từ trước (chạy lại an toàn):
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS current_simulated_date DATE DEFAULT CURRENT_DATE;

-- 2. BẢNG DANH MỤC VỊ THẾ NẮM GIỮ (POSITIONS)
CREATE TABLE IF NOT EXISTS public.positions (
    symbol TEXT PRIMARY KEY,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    t1_quantity INTEGER NOT NULL DEFAULT 0,
    t2_quantity INTEGER NOT NULL DEFAULT 0,
    avg_price NUMERIC NOT NULL DEFAULT 0,
    breakeven_price NUMERIC,
    market_price NUMERIC NOT NULL DEFAULT 0,
    market_value NUMERIC NOT NULL DEFAULT 0,
    unrealized_pnl NUMERIC NOT NULL DEFAULT 0,
    unrealized_pnl_pct NUMERIC NOT NULL DEFAULT 0,
    target_price NUMERIC,
    stop_loss NUMERIC,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bổ sung cột cho cơ sở dữ liệu đã tạo từ trước (chạy lại an toàn):
ALTER TABLE public.positions ADD COLUMN IF NOT EXISTS breakeven_price NUMERIC;
ALTER TABLE public.positions ADD COLUMN IF NOT EXISTS target_price NUMERIC;
ALTER TABLE public.positions ADD COLUMN IF NOT EXISTS stop_loss NUMERIC;

-- 3. BẢNG LỊCH SỬ GIAO DỊCH & SỔ LỆNH (TRANSACTIONS)
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL', 'DIVIDEND_CASH', 'DIVIDEND_SHARE')),
    symbol TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    fee NUMERIC NOT NULL DEFAULT 0,
    tax NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    net_amount NUMERIC,
    realized_pnl NUMERIC,
    strategy TEXT,
    target_price NUMERIC,
    stop_loss NUMERIC,
    trade_date DATE DEFAULT CURRENT_DATE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bổ sung cột cho cơ sở dữ liệu đã tạo từ trước (chạy lại an toàn):
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS net_amount NUMERIC;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS realized_pnl NUMERIC;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS strategy TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS target_price NUMERIC;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS stop_loss NUMERIC;

-- 4. BẢNG DANH MỤC THEO DÕI TÙY BIẾN (WATCHLIST)
CREATE TABLE IF NOT EXISTS public.watchlist (
    symbol TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sector TEXT DEFAULT '',
    exchange TEXT DEFAULT 'HOSE',
    price NUMERIC NOT NULL DEFAULT 0,
    pe NUMERIC DEFAULT 0,
    pb NUMERIC DEFAULT 0,
    roe NUMERIC DEFAULT 0,
    eps NUMERIC DEFAULT 0,
    dividend_yield NUMERIC DEFAULT 0,
    is_custom BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẬT ROW LEVEL SECURITY (RLS) & CHO PHÉP TRUY CẬP AN TOÀN
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- CẢNH BÁO BẢO MẬT: chính sách USING(true) cho phép BẤT KỲ ai có anon key (key này
-- nằm công khai trong bundle JS) đọc và ghi toàn bộ danh mục tài sản. Cần siết lại
-- theo auth.uid() khi bật đăng nhập thật.
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen positions" ON public.positions;
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen transactions" ON public.transactions;
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen watchlist" ON public.watchlist;

-- CẢNH BÁO BẢO MẬT: chính sách USING(true) cho phép BẤT KỲ ai có anon key (key này
-- nằm công khai trong bundle JS) đọc và ghi toàn bộ danh mục tài sản. Cần siết lại
-- theo auth.uid() khi bật đăng nhập thật.
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen positions" ON public.positions;
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen transactions" ON public.transactions;
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen watchlist" ON public.watchlist;

CREATE POLICY "Cho phep truy cap toan quyen portfolios" ON public.portfolios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phep truy cap toan quyen positions" ON public.positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phep truy cap toan quyen transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phep truy cap toan quyen watchlist" ON public.watchlist FOR ALL USING (true) WITH CHECK (true);

-- 6. NẠP MỐC ĐỐI CHIẾU 28/08/2026 06:26 (khớp 100% ảnh DNSE)
--    DO UPDATE (không phải DO NOTHING) để chạy lại là sửa được hàng cũ đã lệch.
--    Sau khi nạp, app tự tính lại theo tài liệu/dealModel.ts mỗi lần đồng bộ.
INSERT INTO public.portfolios (id, account_name, account_number, sub_account, cash, receiving_cash, margin_debt, total_equity, total_profit_loss, current_simulated_date)
VALUES ('default', 'VIP Trader', '001C888999', '06', 171, 0, 7006776, 7693395, -1223158, DATE '2026-08-28')
ON CONFLICT (id) DO UPDATE SET
    cash = EXCLUDED.cash,
    receiving_cash = EXCLUDED.receiving_cash,
    margin_debt = EXCLUDED.margin_debt,
    total_equity = EXCLUDED.total_equity,
    total_profit_loss = EXCLUDED.total_profit_loss,
    current_simulated_date = EXCLUDED.current_simulated_date,
    updated_at = NOW();

INSERT INTO public.positions (symbol, total_quantity, available_quantity, t1_quantity, t2_quantity, avg_price, breakeven_price, market_price, market_value, unrealized_pnl, unrealized_pnl_pct, target_price, stop_loss)
VALUES ('TPB', 1000, 1000, 0, 0, 15803, 15923, 14700, 14700000, -1223158, -7.75, 16500, 13800)
ON CONFLICT (symbol) DO UPDATE SET
    total_quantity = EXCLUDED.total_quantity,
    available_quantity = EXCLUDED.available_quantity,
    avg_price = EXCLUDED.avg_price,
    breakeven_price = EXCLUDED.breakeven_price,
    market_price = EXCLUDED.market_price,
    market_value = EXCLUDED.market_value,
    unrealized_pnl = EXCLUDED.unrealized_pnl,
    unrealized_pnl_pct = EXCLUDED.unrealized_pnl_pct,
    updated_at = NOW();
