import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';
import { localTradingEngine } from './localTradingEngine';
import { missingColumnFrom } from './supabaseErrors';

const SUPABASE_URL = 'https://srgdawqqwogkyncqvqta.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZ2Rhd3Fxd29na3luY3F2cXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDY3OTIsImV4cCI6MjEwMzIyMjc5Mn0._VPuo9m9dw7NEYWTbJmmRQAaw4KiNDuEH7Y5mGHfr08';

const getHeaders = (extra: Record<string, string> = {}) => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  ...extra
});

/* Danh sách cột THỰC SỰ tồn tại trong Supabase (đồng bộ với sql/01-cau-truc.sql).
   Gửi thừa cột khiến PostgREST trả 400 PGRST204 và huỷ toàn bộ lệnh ghi — đây là
   nguyên nhân app trước đây báo "thành công" nhưng không lưu được gì. */
const PORTFOLIO_COLUMNS = [
  'id', 'cash', 'receiving_cash', 'margin_debt',
  'total_equity', 'total_profit_loss', 'current_simulated_date', 'updated_at'
];

const POSITION_COLUMNS = [
  'symbol', 'total_quantity', 'available_quantity', 't1_quantity', 't2_quantity',
  'avg_price', 'breakeven_price', 'market_price', 'market_value',
  'unrealized_pnl', 'unrealized_pnl_pct', 'target_price', 'stop_loss', 'updated_at'
];

const TRANSACTION_COLUMNS = [
  'id', 'type', 'symbol', 'price', 'quantity', 'fee', 'tax', 'total_amount',
  'net_amount', 'realized_pnl', 'strategy', 'target_price', 'stop_loss',
  'trade_date', 'notes'
];

/** Chỉ giữ lại các khoá có thật trong bảng, bỏ undefined. */
function pick(obj: Record<string, any>, columns: string[]): Record<string, any> {
  const out: Record<string, any> = {};
  for (const key of columns) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

/**
 * Ghi lên Supabase và BÁO LỖI THẬT thay vì nuốt im lặng.
 *
 * Nếu cơ sở dữ liệu chưa được cập nhật cấu trúc (thiếu cột), PostgREST huỷ TOÀN BỘ
 * lệnh ghi chỉ vì một cột lạ — đúng lỗi đã khiến app im lặng không lưu được gì suốt
 * từ 25/8. Ở đây ta bỏ cột bị thiếu rồi thử lại, để dữ liệu vẫn lưu được trên DB cũ,
 * đồng thời log cảnh báo nhắc chạy sql/01-cau-truc.sql.
 */
async function writeToSupabase(
  path: string,
  body: Record<string, any> | Record<string, any>[],
  method: 'POST' | 'PATCH' = 'POST',
  attempt = 0
): Promise<boolean> {
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
      method,
      headers: getHeaders(method === 'POST' ? { Prefer: 'resolution=merge-duplicates' } : {}),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) return true;

    const errorText = await res.text();
    const missing = attempt < 8 && !Array.isArray(body) ? missingColumnFrom(errorText) : null;

    if (missing && missing in (body as Record<string, any>)) {
      console.warn(
        `[Supabase] Bảng thiếu cột "${missing}" — bỏ qua cột này và thử lại. ` +
          'Hãy chạy sql/01-cau-truc.sql trong Supabase SQL Editor để bổ sung đầy đủ.'
      );
      const { [missing]: _removed, ...rest } = body as Record<string, any>;
      return writeToSupabase(path, rest, method, attempt + 1);
    }

    console.error('[Supabase ' + method + ' ' + path + '] ' + res.status + ': ' + errorText);
    return false;
  } catch (e) {
    console.error('[Supabase ' + method + ' ' + path + '] loi mang:', e);
    return false;
  }
}

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
            cash: Number(p.cash || 0),
            receiving_cash: Number(p.receiving_cash || 0),
            margin_debt: Number(p.margin_debt || 0),
            total_equity: Number(p.total_equity || 0),
            total_profit_loss: Number(p.total_profit_loss || 0),
            current_simulated_date: p.current_simulated_date || undefined,
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
            breakeven_price: r.breakeven_price != null ? Number(r.breakeven_price) : undefined,
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
  async placeOrder(payload: OrderRequestPayload): Promise<{ transaction: Transaction; position: Position; portfolio: Portfolio; canhBao: string[] }> {
    const localResult = localTradingEngine.placeOrder(payload);
    await Promise.all([
      writeToSupabase('portfolios', pick({ id: 'default', ...localResult.portfolio }, PORTFOLIO_COLUMNS)),
      writeToSupabase('positions', pick(localResult.position as any, POSITION_COLUMNS)),
      writeToSupabase('transactions', pick(localResult.transaction as any, TRANSACTION_COLUMNS))
    ]);
    return localResult;
  },

  // 5. Cập nhật giá thị trường
  async updateMarketPrice(symbol: string, market_price: number): Promise<Position> {
    const updated = localTradingEngine.updateMarketPrice(symbol, market_price);
    await Promise.all([
      writeToSupabase('positions?symbol=eq.' + symbol, pick({ ...updated, updated_at: new Date().toISOString() } as any, POSITION_COLUMNS), 'PATCH'),
      writeToSupabase('portfolios', pick({ id: 'default', ...localTradingEngine.getPortfolio() }, PORTFOLIO_COLUMNS))
    ]);
    return updated;
  },

  // 6. Chuyển trạng thái ngày mới (T+2.5 Settlement)
  async settleDay(): Promise<string> {
    const msg = localTradingEngine.settleDay();
    const currentPortfolio = localTradingEngine.getPortfolio();
    const currentPositions = localTradingEngine.getPositions();
    await api.persistPortfolioState(currentPortfolio, currentPositions);
    return msg;
  },

  // 7. Nạp hoặc Rút tiền
  async adjustCash(amount: number, action: 'DEPOSIT' | 'WITHDRAW'): Promise<Portfolio> {
    const p = localTradingEngine.adjustCash(amount, action);
    await writeToSupabase('portfolios', pick({ id: 'default', ...p }, PORTFOLIO_COLUMNS));
    return p;
  },

  /**
   * Ghi trạng thái tài sản + vị thế lên Supabase.
   * Trả về true khi TẤT CẢ lệnh ghi thành công, để UI báo trung thực.
   */
  async persistPortfolioState(portfolio: Portfolio, positions: Position[]): Promise<boolean> {
    if (!localTradingEngine.isAdmin()) return true;
    const results = await Promise.all([
      writeToSupabase('portfolios', pick({ id: 'default', ...portfolio }, PORTFOLIO_COLUMNS)),
      ...positions.map((pos) => writeToSupabase('positions', pick(pos as any, POSITION_COLUMNS)))
    ]);
    return results.every(Boolean);
  }
};
