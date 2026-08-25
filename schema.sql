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
    margin_debt NUMERIC DEFAULT 6898107,
    total_equity NUMERIC DEFAULT 7551893,
    total_profit_loss NUMERIC DEFAULT -1465943,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG DANH MỤC VỊ THẾ NẮM GIỮ (POSITIONS)
CREATE TABLE IF NOT EXISTS public.positions (
    symbol TEXT PRIMARY KEY,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    t1_quantity INTEGER NOT NULL DEFAULT 0,
    t2_quantity INTEGER NOT NULL DEFAULT 0,
    avg_price NUMERIC NOT NULL DEFAULT 0,
    market_price NUMERIC NOT NULL DEFAULT 0,
    market_value NUMERIC NOT NULL DEFAULT 0,
    unrealized_pnl NUMERIC NOT NULL DEFAULT 0,
    unrealized_pnl_pct NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
    trade_date DATE DEFAULT CURRENT_DATE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE POLICY "Cho phep truy cap toan quyen portfolios" ON public.portfolios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phep truy cap toan quyen positions" ON public.positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phep truy cap toan quyen transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phep truy cap toan quyen watchlist" ON public.watchlist FOR ALL USING (true) WITH CHECK (true);

-- 6. NẠP DỮ LIỆU THỰC TẾ BAN ĐẦU CHO Nhà Đầu Tư VIP
INSERT INTO public.portfolios (id, account_name, account_number, sub_account, cash, receiving_cash, margin_debt, total_equity, total_profit_loss)
VALUES ('default', 'VIP Trader', '001C888999', '06', 0, 0, 6898107, 7551893, -1465943)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.positions (symbol, total_quantity, available_quantity, t1_quantity, t2_quantity, avg_price, market_price, market_value, unrealized_pnl, unrealized_pnl_pct)
VALUES ('TPB', 1000, 1000, 0, 0, 15918, 14450, 14450000, -1465943, -9.29)
ON CONFLICT (symbol) DO NOTHING;

INSERT INTO public.transactions (id, type, symbol, price, quantity, fee, tax, total_amount, notes)
VALUES ('tx_init_tpb', 'BUY', 'TPB', 15918, 1000, 23877, 0, 15941877, 'Vị thế TPB thực tế (Vốn tự có 8.89tr + Vay Margin DNSE 6.89tr)')
ON CONFLICT (id) DO NOTHING;
