export type TransactionType = 'BUY' | 'SELL' | 'DIVIDEND_CASH' | 'DIVIDEND_SHARE';

export interface Transaction {
  id: string;
  type: TransactionType;
  symbol: string;
  price: number;
  quantity: number;
  fee: number;
  tax: number;
  total_amount: number; // Tổng giá trị khớp lệnh
  net_amount: number;   // BUY: price*qty + fee, SELL: price*qty - fee - tax
  avg_price_at_trade?: number; // Giá vốn tại thời điểm giao dịch (để lưu vết)
  realized_pnl?: number;       // Lãi/lỗ thực hiện đối với lệnh SELL
  timestamp: string;          // ISO 8601
  trade_date: string;         // YYYY-MM-DD
  settlement_date?: string;   // Ngày dự kiến về tài khoản (T+2.5)
  notes?: string;
}

export interface Position {
  symbol: string;
  available_quantity: number; // Cổ phiếu khả dụng (được phép bán)
  t1_quantity: number;        // Cổ phiếu T+1 (mua T-1)
  t2_quantity: number;        // Cổ phiếu T+2 (mua hôm nay T-0)
  total_quantity: number;     // available + t1 + t2
  avg_price: number;          // Giá vốn bình quân gia quyền (đã gồm phí mua)
  market_price: number;       // Giá thị trường (nhập tay)
  market_value: number;       // total_quantity * market_price
  unrealized_pnl: number;     // Lãi/lỗ chưa thực hiện = (market_price - avg_price) * total_quantity
  unrealized_pnl_pct: number; // % Lãi/lỗ
  updated_at: string;
}

export interface Portfolio {
  cash: number;               // Tiền mặt khả dụng để mua
  receiving_cash: number;     // Tiền chờ về từ các lệnh bán (T+2.5)
  margin_debt: number;        // Nợ margin (nếu có)
  total_equity: number;       // Tổng tài sản ròng = Tiền mặt + Tiền chờ về + Tổng giá trị CP - Nợ
  total_profit_loss: number;  // Tổng lãi lỗ đã thực hiện + chưa thực hiện
  updated_at: string;
}

export interface OrderRequestPayload {
  type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  quantity: number;
  fee: number;
  tax: number;
  trade_date?: string;
  notes?: string;
}
