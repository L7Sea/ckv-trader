export type TransactionType = 'BUY' | 'SELL' | 'DIVIDEND_CASH' | 'DIVIDEND_SHARE';

export type TradeStrategy = 
  | 'BREAKOUT' // Mua vượt đỉnh kháng cự
  | 'BREAKOUT_ACCUMULATE' // Mua gom khi bứt phá
  | 'PULLBACK_MA20' // Bắt đáy / Chạm hỗ trợ MA20
  | 'ACCUMULATION' // Tích lũy nền giá chặt
  | 'DCA_VALUE_BUY' // Mua bình quân giá gom vùng hỗ trợ
  | 'TREND_FOLLOWING' // Bám xu hướng tăng trưởng
  | 'DIVIDEND' // Săn quyền cổ tức
  | 'TAKE_PROFIT' // Chốt lời mục tiêu
  | 'STOP_LOSS' // Cắt lỗ kỷ luật (-5%/-7%)
  | 'OTHER'; // Khác

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
  strategy?: TradeStrategy;
  target_price?: number;
  stop_loss?: number;
  risk_reward_ratio?: number;
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
  target_price?: number;      // Giá mục tiêu
  stop_loss?: number;         // Giá cắt lỗ
  updated_at: string;
}

export interface Portfolio {
  cash: number;               // Tiền mặt khả dụng
  receiving_cash: number;     // Tiền chờ về (T+2.5)
  margin_debt: number;        // Nợ margin
  total_equity: number;       // Tổng tài sản ròng
  total_profit_loss: number;  // Tổng lãi lỗ
  current_simulated_date?: string; // Ngày mô phỏng hiện tại của sổ cái
  updated_at: string;
}

export interface OrderRequestPayload {
  type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  quantity: number;
  fee: number;
  tax: number;
  strategy?: TradeStrategy;
  target_price?: number;
  stop_loss?: number;
  trade_date?: string;
  notes?: string;
}
