import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';
import { localTradingEngine } from './localTradingEngine';

const SUPABASE_URL = 'https://srgdawqqwogkyncqvqta.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZ2Rhd3Fxd29na3luY3F2cXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDY3OTIsImV4cCI6MjEwMzIyMjc5Mn0._VPuo9m9dw7NEYWTbJmmRQAaw4KiNDuEH7Y5mGHfr08';

const getHeaders = (extra: Record<string, string> = {}) => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  ...extra
});

export const api = {
  // 1. Lấy tổng quan tài sản từ Supabase (Chỉ dành cho Admin Master)
  async getPortfolio(): Promise<Portfolio> {
    if (!localTradingEngine.isAdmin()) {
      return localTradingEngine.getPortfolio();
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolios?id=eq.default&limit=1`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          const p = rows[0];
          return {
            cash: Number(p.cash !== undefined ? p.cash : 171),
            receiving_cash: Number(p.receiving_cash || 0),
            margin_debt: Number(p.margin_debt || 7002051),
            total_equity: Number(p.total_equity || 7498120),
            total_profit_loss: Number(p.total_profit_loss || -1418116),
            updated_at: p.updated_at
          };
        }
      }
    } catch {}
    return localTradingEngine.getPortfolio();
  },

  // 2. Lấy danh sách vị thế cổ phiếu từ Supabase (Chỉ dành cho Admin Master)
  async getPositions(): Promise<Position[]> {
    if (!localTradingEngine.isAdmin()) {
      return localTradingEngine.getPositions();
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/positions`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            symbol: r.symbol,
            total_quantity: Number(r.total_quantity || 0),
            available_quantity: Number(r.available_quantity || 0),
            t1_quantity: Number(r.t1_quantity || 0),
            t2_quantity: Number(r.t2_quantity || 0),
            avg_price: Number(r.avg_price || 0),
            market_price: Number(r.market_price || 0),
            market_value: Number(r.market_value || 0),
            unrealized_pnl: Number(r.unrealized_pnl || 0),
            unrealized_pnl_pct: Number(r.unrealized_pnl_pct || 0),
            updated_at: r.updated_at
          }));
        }
      }
    } catch {}
    return localTradingEngine.getPositions();
  },

  // 3. Lấy lịch sử giao dịch từ Supabase (Chỉ dành cho Admin Master)
  async getTransactions(): Promise<Transaction[]> {
    if (!localTradingEngine.isAdmin()) {
      return localTradingEngine.getTransactions();
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/transactions?order=created_at.desc`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            type: r.type,
            symbol: r.symbol,
            price: Number(r.price),
            quantity: Number(r.quantity),
            fee: Number(r.fee || 0),
            tax: Number(r.tax || 0),
            total_amount: Number(r.total_amount || 0),
            net_amount: Number(r.net_amount || r.total_amount || 0),
            avg_price_at_trade: Number(r.avg_price_at_trade || r.price),
            timestamp: r.created_at || new Date().toISOString(),
            trade_date: r.trade_date,
            notes: r.notes || ''
          }));
        }
      }
    } catch {}
    return localTradingEngine.getTransactions();
  },

  // 4. Đặt lệnh giao dịch Mua / Bán & Đồng bộ lên Supabase
  async placeOrder(payload: OrderRequestPayload): Promise<{ transaction: Transaction; position: Position; portfolio: Portfolio }> {
    const localResult = localTradingEngine.placeOrder(payload);
    try {
      // Đồng bộ lên Supabase trong nền
      await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/portfolios`, {
          method: 'POST',
          headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
          body: JSON.stringify({ id: 'default', ...localResult.portfolio })
        }),
        fetch(`${SUPABASE_URL}/rest/v1/positions`, {
          method: 'POST',
          headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
          body: JSON.stringify(localResult.position)
        }),
        fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(localResult.transaction)
        })
      ]);
    } catch (e) {
      console.warn('Sync to Supabase background error:', e);
    }
    return localResult;
  },

  // 5. Cập nhật giá thị trường
  async updateMarketPrice(symbol: string, market_price: number): Promise<Position> {
    const updated = localTradingEngine.updateMarketPrice(symbol, market_price);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/positions?symbol=eq.${symbol}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          market_price,
          market_value: updated.market_value,
          unrealized_pnl: updated.unrealized_pnl,
          unrealized_pnl_pct: updated.unrealized_pnl_pct,
          updated_at: new Date().toISOString()
        })
      });
    } catch {}
    return updated;
  },

  // 6. Chuyển trạng thái ngày mới (T+2.5 Settlement)
  async settleDay(): Promise<string> {
    const msg = localTradingEngine.settleDay();
    const currentPortfolio = localTradingEngine.getPortfolio();
    const currentPositions = localTradingEngine.getPositions();
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/portfolios`, {
        method: 'POST',
        headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
        body: JSON.stringify({ id: 'default', ...currentPortfolio })
      });
      for (const pos of currentPositions) {
        await fetch(`${SUPABASE_URL}/rest/v1/positions`, {
          method: 'POST',
          headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
          body: JSON.stringify(pos)
        });
      }
    } catch {}
    return msg;
  },

  // 7. Nạp hoặc Rút tiền
  async adjustCash(amount: number, action: 'DEPOSIT' | 'WITHDRAW'): Promise<Portfolio> {
    const p = localTradingEngine.adjustCash(amount, action);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/portfolios`, {
        method: 'POST',
        headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
        body: JSON.stringify({ id: 'default', ...p })
      });
    } catch {}
    return p;
  }
};
