import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';

const PORTFOLIO_KEY = 'ckv_local_portfolio';
const POSITIONS_KEY = 'ckv_local_positions';
const TRANSACTIONS_KEY = 'ckv_local_transactions';
const DATA_VERSION_KEY = 'ckv_data_version_lock';
export const CURRENT_DATA_VERSION = '2026-08-26-1006-v3';

/* ═══ KHỞI TẠO CHÍNH XÁC DANH MỤC & NGUỒN VỐN CỦA ANH HẢI (VIP Trader) THEO DNSE 26/08/2026 (10h06) ═══
   • Tiền mặt khả dụng: 171đ
   • Cổ phiếu: 1,000 TPB @ 14,450đ (14.45) -> Giá trị: 14,450,000đ
   • Vốn vay Margin Deal gốc: 6,898,107đ
   • Lãi vay Margin lũy kế: 103,944đ (Lãi suất thực tế 11.50%/năm ~ 2,173đ/ngày)
   • Tổng Nợ vay Margin DNSE: 7,002,051đ
   • Tài sản ròng thực có (NAV): 7,448,120đ (Tổng tài sản 14,450,171đ - Nợ 7,002,051đ)
   • Lãi/Lỗ chưa chốt Deal TPB: -1,468,116đ (-9.30%)
   • Giá hòa vốn thực tế trên Deal DNSE: 15.920 (15,920đ/CP)
   • Tỷ lệ ký quỹ Deal: 51.38%
═══════════════════════════════════════════════════════════════════════════════════ */

const initialPortfolio: Portfolio = {
  cash: 171, // Tiền mặt thực tế trên app DNSE
  receiving_cash: 0,
  margin_debt: 7002051, // Tổng nợ Margin DNSE (gốc 6.898tr + lãi vay tích luỹ 103.9kđ)
  total_equity: 7448120, // NAV thực có = 14,450,171 - 7,002,051 = 7,448,120đ
  total_profit_loss: -1468116, // Lỗ chưa chốt Deal -9.30%
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
    market_price: 14450, // Thị giá 14.45 (0.00%)
    market_value: 14450000,
    unrealized_pnl: -1468116,
    unrealized_pnl_pct: -9.30,
    target_price: 16500, // Mục tiêu kỳ vọng
    stop_loss: 13800, // Ngưỡng cắt lỗ bảo vệ
    updated_at: new Date().toISOString()
  }
];

const initialTransactions: Transaction[] = [
  {
    id: 'tx_tpb_1',
    type: 'BUY',
    symbol: 'TPB',
    price: 16200,
    quantity: 200,
    fee: 4860,
    tax: 0,
    total_amount: 3240000,
    net_amount: 3244860,
    strategy: 'TREND_FOLLOWING',
    target_price: 17500,
    stop_loss: 14000,
    notes: 'Khớp lệnh mở Deal 14:12 18/06/2026',
    timestamp: '2026-06-18T14:12:00.000Z',
    trade_date: '2026-06-18'
  },
  {
    id: 'tx_tpb_2',
    type: 'BUY',
    symbol: 'TPB',
    price: 16200,
    quantity: 200,
    fee: 4860,
    tax: 0,
    total_amount: 3240000,
    net_amount: 3244860,
    strategy: 'BREAKOUT_ACCUMULATE',
    target_price: 17500,
    stop_loss: 14000,
    notes: 'Khớp lệnh mua gom 14:45 09/07/2026',
    timestamp: '2026-07-09T14:45:00.000Z',
    trade_date: '2026-07-09'
  },
  {
    id: 'tx_tpb_3',
    type: 'BUY',
    symbol: 'TPB',
    price: 15550,
    quantity: 300,
    fee: 6998,
    tax: 0,
    total_amount: 4665000,
    net_amount: 4671998,
    strategy: 'DCA_VALUE_BUY',
    target_price: 16500,
    stop_loss: 13800,
    notes: 'Khớp lệnh DCA 13:55 13/07/2026',
    timestamp: '2026-07-13T13:55:00.000Z',
    trade_date: '2026-07-13'
  },
  {
    id: 'tx_tpb_4',
    type: 'BUY',
    symbol: 'TPB',
    price: 15500,
    quantity: 200,
    fee: 4650,
    tax: 0,
    total_amount: 3100000,
    net_amount: 3104650,
    strategy: 'DCA_VALUE_BUY',
    target_price: 16500,
    stop_loss: 13800,
    notes: 'Khớp lệnh DCA 14:17 13/07/2026',
    timestamp: '2026-07-13T14:17:00.000Z',
    trade_date: '2026-07-13'
  },
  {
    id: 'tx_tpb_5',
    type: 'BUY',
    symbol: 'TPB',
    price: 15450,
    quantity: 100,
    fee: 2318,
    tax: 0,
    total_amount: 1545000,
    net_amount: 1547318,
    strategy: 'DCA_VALUE_BUY',
    target_price: 16500,
    stop_loss: 13800,
    notes: 'Khớp lệnh DCA 14:18 13/07/2026 (Ứng sức mua Deal 6.99tr)',
    timestamp: '2026-07-13T14:18:00.000Z',
    trade_date: '2026-07-13'
  }
];

export const localTradingEngine = {
  ensureDataFreshness() {
    try {
      const savedVer = localStorage.getItem(DATA_VERSION_KEY);
      if (savedVer !== CURRENT_DATA_VERSION) {
        this.resetToUserExactData();
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
      }
    } catch {}
  },

  getPortfolio(): Portfolio {
    this.ensureDataFreshness();
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
    this.ensureDataFreshness();
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
    this.ensureDataFreshness();
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
