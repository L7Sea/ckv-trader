import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';

// Sử dụng relative URL '/api' để Vite Proxy tự chuyển tiếp về Backend (hỗ trợ cả máy tính, điện thoại qua Wi-Fi và Cloudflare Tunnel)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
  // Lấy tổng quan tài sản
  async getPortfolio(): Promise<Portfolio> {
    const res = await fetch(`${API_BASE_URL}/api/portfolio`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Không thể tải thông tin danh mục');
    return data.data;
  },

  // Lấy danh sách vị thế cổ phiếu
  async getPositions(): Promise<Position[]> {
    const res = await fetch(`${API_BASE_URL}/api/positions`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Không thể tải danh sách vị thế cổ phiếu');
    return data.data;
  },

  // Lấy lịch sử giao dịch
  async getTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE_URL}/api/transactions`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Không thể tải lịch sử giao dịch');
    return data.data;
  },

  // Đặt lệnh giao dịch Mua / Bán
  async placeOrder(payload: OrderRequestPayload): Promise<{ transaction: Transaction; position: Position; portfolio: Portfolio }> {
    const res = await fetch(`${API_BASE_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Đặt lệnh không thành công');
    return data.data;
  },

  // Cập nhật giá thị trường thủ công
  async updateMarketPrice(symbol: string, market_price: number): Promise<Position> {
    const res = await fetch(`${API_BASE_URL}/api/positions/update-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, market_price })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Không thể cập nhật giá thị trường');
    return data.data;
  },

  // Chuyển trạng thái ngày mới (T+2.5 Settlement)
  async settleDay(): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/api/settle-day`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Không thể thanh toán T+2.5');
    return data.message;
  },

  // Nạp hoặc Rút tiền
  async adjustCash(amount: number, action: 'DEPOSIT' | 'WITHDRAW'): Promise<Portfolio> {
    const res = await fetch(`${API_BASE_URL}/api/portfolio/cash-adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, action })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Giao dịch tiền không thành công');
    return data.data;
  }
};
