import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';
import { localTradingEngine } from './localTradingEngine';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Hàm fetch an toàn kiểm tra Content-Type JSON chống lỗi HTML DOCTYPE của SPA
async function safeFetchJson(url: string, options?: RequestInit): Promise<any | null> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      return null;
    }
    const data = await res.json();
    return data && data.success ? data.data : null;
  } catch {
    return null;
  }
}

export const api = {
  // 1. Lấy tổng quan tài sản
  async getPortfolio(): Promise<Portfolio> {
    const remote = await safeFetchJson(`${API_BASE_URL}/api/portfolio`);
    if (remote) return remote;
    return localTradingEngine.getPortfolio();
  },

  // 2. Lấy danh sách vị thế cổ phiếu
  async getPositions(): Promise<Position[]> {
    const remote = await safeFetchJson(`${API_BASE_URL}/api/positions`);
    if (remote) return remote;
    return localTradingEngine.getPositions();
  },

  // 3. Lấy lịch sử giao dịch
  async getTransactions(): Promise<Transaction[]> {
    const remote = await safeFetchJson(`${API_BASE_URL}/api/transactions`);
    if (remote) return remote;
    return localTradingEngine.getTransactions();
  },

  // 4. Đặt lệnh giao dịch Mua / Bán
  async placeOrder(payload: OrderRequestPayload): Promise<{ transaction: Transaction; position: Position; portfolio: Portfolio }> {
    const remote = await safeFetchJson(`${API_BASE_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (remote) return remote;
    return localTradingEngine.placeOrder(payload);
  },

  // 5. Cập nhật giá thị trường
  async updateMarketPrice(symbol: string, market_price: number): Promise<Position> {
    const remote = await safeFetchJson(`${API_BASE_URL}/api/positions/update-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, market_price })
    });
    if (remote) return remote;
    return localTradingEngine.updateMarketPrice(symbol, market_price);
  },

  // 6. Chuyển trạng thái ngày mới (T+2.5 Settlement)
  async settleDay(): Promise<string> {
    const res = await safeFetchJson(`${API_BASE_URL}/api/settle-day`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res && res.message) return res.message;
    return localTradingEngine.settleDay();
  },

  // 7. Nạp hoặc Rút tiền
  async adjustCash(amount: number, action: 'DEPOSIT' | 'WITHDRAW'): Promise<Portfolio> {
    const remote = await safeFetchJson(`${API_BASE_URL}/api/portfolio/cash-adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, action })
    });
    if (remote) return remote;
    return localTradingEngine.adjustCash(amount, action);
  }
};
