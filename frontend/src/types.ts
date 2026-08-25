export type TransactionType = 'BUY' | 'SELL' | 'DIVIDEND_CASH' | 'DIVIDEND_SHARE';

export interface Transaction {
  id: string;
  type: TransactionType;
  symbol: string;
  price: number;
  quantity: number;
  fee: number;
  tax: number;
  total_amount: number;
  net_amount: number;
  avg_price_at_trade?: number;
  realized_pnl?: number;
  timestamp: string;
  trade_date: string;
  settlement_date?: string;
  notes?: string;
}

export interface Position {
  symbol: string;
  available_quantity: number; // Cổ phiếu khả dụng (được phép bán)
  t1_quantity: number;        // Cổ phiếu T+1 (mua T-1)
  t2_quantity: number;        // Cổ phiếu T+2 (mua hôm nay T-0)
  total_quantity: number;     // available + t1 + t2
  avg_price: number;          // Giá vốn bình quân gia quyền
  market_price: number;       // Giá thị trường
  market_value: number;       // total_quantity * market_price
  unrealized_pnl: number;     // Lãi/lỗ chưa thực hiện
  unrealized_pnl_pct: number; // % Lãi/lỗ
  updated_at: string;
}

export interface Portfolio {
  cash: number;               // Tiền mặt khả dụng
  receiving_cash: number;     // Tiền chờ về (T+2.5)
  margin_debt: number;        // Nợ margin
  total_equity: number;       // Tổng tài sản ròng
  total_profit_loss: number;  // Tổng lãi lỗ
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
