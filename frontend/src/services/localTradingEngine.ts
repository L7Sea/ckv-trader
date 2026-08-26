import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';

const PORTFOLIO_KEY = 'ckv_local_portfolio';
const POSITIONS_KEY = 'ckv_local_positions';
const TRANSACTIONS_KEY = 'ckv_local_transactions';

/* ═══ KHỞI TẠO CHÍNH XÁC DANH MỤC & NGUỒN VỐN CỦA ANH HẢI (VIP Trader) THEO DNSE 26/08/2026 (9h42) ═══
   • Tiền mặt khả dụng: 171đ
   • Cổ phiếu: 1,000 TPB @ 14,500đ (14.50) -> Giá trị: 14,500,000đ
   • Vốn vay Margin Deal gốc: 6,898,107đ
   • Lãi vay Margin lũy kế: 103,944đ (Lãi suất thực tế 11.50%/năm ~ 2,173đ/ngày)
   • Tổng Nợ vay Margin DNSE: 7,002,051đ
   • Tài sản ròng thực có (NAV): 7,498,120đ (Tổng tài sản 14,500,171đ - Nợ 7,002,051đ)
   • Lãi/Lỗ chưa chốt Deal TPB: -1,418,116đ (-8.99%)
   • Giá hòa vốn thực tế trên Deal DNSE: 15.920 (15,920đ/CP)
   • Tỷ lệ ký quỹ Deal: 51.55%
═══════════════════════════════════════════════════════════════════════════════════ */

const initialPortfolio: Portfolio = {
  cash: 171, // Tiền mặt thực tế trên app DNSE
  receiving_cash: 0,
  margin_debt: 7002051, // Tổng nợ Margin DNSE (gốc 6.898tr + lãi vay tích luỹ 103.9kđ)
  total_equity: 7498120, // NAV thực có = 14,500,171 - 7,002,051 = 7,498,120đ
  total_profit_loss: -1418116, // Lỗ chưa chốt Deal -8.99%
  current_simulated_date: new Date().toISOString().slice(0, 10),
  updated_at: new Date().toISOString()
};

const initialPositions: Position[] = [
  {
    symbol: 'TPB',
    total_quantity: 1000,
    available_quantity: 1000,
    t1_quantity: 0,
    t2_quantity: 0,
    avg_price: 15920, // Giá hòa vốn thực tế 15.920
    market_price: 14500, // Thị giá 14.50 (+0.35%)
    market_value: 14500000,
    unrealized_pnl: -1418116,
    unrealized_pnl_pct: -8.99,
    target_price: 16500, // Mục tiêu kỳ vọng
    stop_loss: 13800, // Ngưỡng cắt lỗ bảo vệ
    updated_at: new Date().toISOString()
  }
];

const initialTransactions: Transaction[] = [
  {
    id: 'tx_tpb_init',
    type: 'BUY',
    symbol: 'TPB',
    price: 15920,
    quantity: 1000,
    fee: 23877,
    tax: 0,
    total_amount: 15920000,
    net_amount: 15943877,
    strategy: 'PULLBACK_MA20',
    target_price: 16500,
    stop_loss: 13800,
    notes: 'Vị thế 1,000 TPB (Vốn tự có ban đầu 8.89tr + Vay Margin Deal 6.89tr + Lãi vay tích luỹ)',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    trade_date: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10)
  }
];

export const localTradingEngine = {
  getPortfolio(): Portfolio {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    if (!data) {
      this.savePortfolio(initialPortfolio);
      return initialPortfolio;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialPortfolio;
    }
  },

  savePortfolio(p: Portfolio) {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(p));
  },

  getPositions(): Position[] {
    const data = localStorage.getItem(POSITIONS_KEY);
    if (!data) {
      this.savePositions(initialPositions);
      return initialPositions;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialPositions;
    }
  },

  savePositions(positions: Position[]) {
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
  },

  getTransactions(): Transaction[] {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    if (!data) {
      this.saveTransactions(initialTransactions);
      return initialTransactions;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialTransactions;
    }
  },

  saveTransactions(txs: Transaction[]) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
  },

  resetToUserExactData(): { portfolio: Portfolio; positions: Position[]; transactions: Transaction[] } {
    this.savePortfolio(initialPortfolio);
    this.savePositions(initialPositions);
    this.saveTransactions(initialTransactions);
    return {
      portfolio: initialPortfolio,
      positions: initialPositions,
      transactions: initialTransactions
    };
  },

  placeOrder(payload: OrderRequestPayload): { transaction: Transaction; position: Position; portfolio: Portfolio } {
    const { symbol, type, quantity, price, strategy, target_price, stop_loss, trade_date, notes } = payload;
    const portfolio = this.getPortfolio();
    const positions = this.getPositions();
    const transactions = this.getTransactions();

    const grossAmount = quantity * price;
    const fee = grossAmount * 0.0015;
    const tax = type === 'SELL' ? grossAmount * 0.001 : 0;

    let existingPos = positions.find((p) => p.symbol === symbol);

    if (type === 'BUY') {
      const totalRequired = grossAmount + fee;
      if (portfolio.cash < totalRequired) {
        throw new Error(`Sức mua tiền mặt không đủ (${portfolio.cash.toLocaleString()}đ)! Anh có thể bấm Nạp tiền hoặc sử dụng tính năng Mô phỏng Mua thêm.`);
      }

      portfolio.cash -= totalRequired;

      if (!existingPos) {
        existingPos = {
          symbol,
          total_quantity: quantity,
          available_quantity: 0,
          t1_quantity: 0,
          t2_quantity: quantity,
          avg_price: (grossAmount + fee) / quantity,
          market_price: price,
          market_value: grossAmount,
          unrealized_pnl: grossAmount - (grossAmount + fee),
          unrealized_pnl_pct: ((grossAmount - (grossAmount + fee)) / (grossAmount + fee)) * 100,
          target_price,
          stop_loss,
          updated_at: new Date().toISOString()
        };
        positions.push(existingPos);
      } else {
        const oldTotal = existingPos.total_quantity;
        const newTotal = oldTotal + quantity;
        const oldCost = oldTotal * existingPos.avg_price;
        const newCost = oldCost + grossAmount + fee;
        const newAvg = newCost / newTotal;

        existingPos.total_quantity = newTotal;
        existingPos.t2_quantity += quantity;
        existingPos.avg_price = newAvg;
        existingPos.market_price = price;
        existingPos.market_value = newTotal * price;
        existingPos.unrealized_pnl = existingPos.market_value - newCost;
        existingPos.unrealized_pnl_pct = (existingPos.unrealized_pnl / newCost) * 100;
        if (target_price) existingPos.target_price = target_price;
        if (stop_loss) existingPos.stop_loss = stop_loss;
        existingPos.updated_at = new Date().toISOString();
      }
    } else {
      // BÁN
      if (!existingPos || existingPos.available_quantity < quantity) {
        const avail = existingPos ? existingPos.available_quantity : 0;
        throw new Error(`Không đủ cổ phiếu khả dụng để bán! (Khả dụng: ${avail.toLocaleString()})`);
      }

      const netProceeds = grossAmount - fee - tax;
      portfolio.receiving_cash += netProceeds;

      existingPos.available_quantity -= quantity;
      existingPos.total_quantity -= quantity;
      const remainingCost = existingPos.total_quantity * existingPos.avg_price;
      existingPos.market_value = existingPos.total_quantity * existingPos.market_price;
      existingPos.unrealized_pnl = existingPos.market_value - remainingCost;
      existingPos.unrealized_pnl_pct = remainingCost > 0 ? (existingPos.unrealized_pnl / remainingCost) * 100 : 0;
      existingPos.updated_at = new Date().toISOString();
    }

    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    const totalProfit = positions.reduce((sum, p) => sum + p.unrealized_pnl, 0);
    portfolio.total_profit_loss = totalProfit;
    portfolio.total_equity = portfolio.cash + portfolio.receiving_cash + stockValuation - portfolio.margin_debt;
    portfolio.updated_at = new Date().toISOString();

    const selectedDate = trade_date || new Date().toISOString().slice(0, 10);
    const transaction: Transaction = {
      id: 'tx_' + Date.now(),
      symbol,
      type,
      quantity,
      price,
      fee,
      tax,
      total_amount: grossAmount,
      net_amount: type === 'BUY' ? grossAmount + fee : grossAmount - fee - tax,
      strategy,
      target_price,
      stop_loss,
      notes,
      timestamp: new Date().toISOString(),
      trade_date: selectedDate
    };

    const finalPositions = positions.filter((p) => p.total_quantity > 0);
    this.savePortfolio(portfolio);
    this.savePositions(finalPositions);
    this.saveTransactions([transaction, ...transactions]);

    const activePos = existingPos || finalPositions[0];
    return { transaction, position: activePos, portfolio };
  },

  updateMarketPrice(symbol: string, market_price: number): Position {
    const positions = this.getPositions();
    const pos = positions.find((p) => p.symbol === symbol);
    if (!pos) throw new Error(`Không tìm thấy mã ${symbol} trong danh mục`);

    pos.market_price = market_price;
    pos.market_value = pos.total_quantity * market_price;
    const cost = pos.total_quantity * pos.avg_price;
    pos.unrealized_pnl = pos.market_value - cost;
    pos.unrealized_pnl_pct = cost > 0 ? (pos.unrealized_pnl / cost) * 100 : 0;
    pos.updated_at = new Date().toISOString();

    this.savePositions(positions);

    const portfolio = this.getPortfolio();
    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    const totalProfit = positions.reduce((sum, p) => sum + p.unrealized_pnl, 0);
    portfolio.total_profit_loss = totalProfit;
    portfolio.total_equity = portfolio.cash + portfolio.receiving_cash + stockValuation - portfolio.margin_debt;
    this.savePortfolio(portfolio);

    return pos;
  },

  settleDay(): string {
    const positions = this.getPositions();
    const portfolio = this.getPortfolio();

    let movedShares = 0;
    for (const pos of positions) {
      if (pos.t1_quantity > 0 || pos.t2_quantity > 0) {
        movedShares += pos.t1_quantity;
        pos.available_quantity += pos.t1_quantity;
        pos.t1_quantity = pos.t2_quantity;
        pos.t2_quantity = 0;
        pos.updated_at = new Date().toISOString();
      }
    }

    const cashReceived = portfolio.receiving_cash;
    portfolio.cash += cashReceived;
    portfolio.receiving_cash = 0;

    // Tính lãi vay Margin lũy kế theo ngày thực tế DNSE Deal (11.5%/năm ~ 2,173đ/ngày)
    let marginInterestToday = 0;
    if (portfolio.margin_debt > 0) {
      marginInterestToday = Math.round((6898107 * 0.115) / 365); // Đúng 2,173đ/ngày
      portfolio.margin_debt += marginInterestToday;
      
      // Cập nhật giá hòa vốn tương ứng cho vị thế nắm giữ
      const tpbPos = positions.find((p) => p.symbol === 'TPB');
      if (tpbPos && tpbPos.total_quantity > 0) {
        tpbPos.avg_price = Math.round(tpbPos.avg_price + marginInterestToday / tpbPos.total_quantity);
        tpbPos.unrealized_pnl = tpbPos.market_value - (14450000 + 1468116 + marginInterestToday);
        tpbPos.unrealized_pnl_pct = (tpbPos.unrealized_pnl / (tpbPos.total_quantity * tpbPos.avg_price)) * 100;
        tpbPos.updated_at = new Date().toISOString();
      }
    }

    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    const totalProfit = positions.reduce((sum, p) => sum + p.unrealized_pnl, 0);
    portfolio.total_profit_loss = totalProfit;
    portfolio.total_equity = portfolio.cash + portfolio.receiving_cash + stockValuation - portfolio.margin_debt;
    portfolio.updated_at = new Date().toISOString();

    this.savePositions(positions);
    this.savePortfolio(portfolio);

    return `Đã chốt ngày T+2.5 thành công! +${cashReceived.toLocaleString()}đ tiền mặt, +${movedShares.toLocaleString()} CP khả dụng. ${marginInterestToday > 0 ? `(Lãi vay Margin phát sinh: +${marginInterestToday.toLocaleString()}đ/ngày)` : ''}`;
  },

  adjustCash(amount: number, action: 'DEPOSIT' | 'WITHDRAW'): Portfolio {
    const portfolio = this.getPortfolio();
    if (action === 'WITHDRAW' && portfolio.cash < amount) {
      throw new Error(`Số dư tiền mặt không đủ để rút ${amount.toLocaleString()}đ!`);
    }

    if (action === 'DEPOSIT') {
      portfolio.cash += amount;
    } else {
      portfolio.cash -= amount;
    }

    const positions = this.getPositions();
    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    portfolio.total_equity = portfolio.cash + portfolio.receiving_cash + stockValuation - portfolio.margin_debt;
    portfolio.updated_at = new Date().toISOString();

    this.savePortfolio(portfolio);
    return portfolio;
  }
};
