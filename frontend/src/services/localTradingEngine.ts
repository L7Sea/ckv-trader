import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';

const PORTFOLIO_KEY = 'ckv_local_portfolio';
const POSITIONS_KEY = 'ckv_local_positions';
const TRANSACTIONS_KEY = 'ckv_local_transactions';

const initialPortfolio: Portfolio = {
  cash: 150000000,
  receiving_cash: 0,
  margin_debt: 0,
  total_equity: 272250000,
  total_profit_loss: 3950000,
  updated_at: new Date().toISOString()
};

const initialPositions: Position[] = [
  {
    symbol: 'HPG',
    total_quantity: 2500,
    available_quantity: 1500,
    t1_quantity: 500,
    t2_quantity: 500,
    avg_price: 27800,
    market_price: 28500,
    market_value: 71250000,
    unrealized_pnl: 1750000,
    unrealized_pnl_pct: 2.52,
    updated_at: new Date().toISOString()
  },
  {
    symbol: 'FPT',
    total_quantity: 400,
    available_quantity: 400,
    t1_quantity: 0,
    t2_quantity: 0,
    avg_price: 122000,
    market_price: 127500,
    market_value: 51000000,
    unrealized_pnl: 2200000,
    unrealized_pnl_pct: 4.51,
    updated_at: new Date().toISOString()
  }
];

const initialTransactions: Transaction[] = [
  {
    id: 'tx_init_1',
    type: 'BUY',
    symbol: 'HPG',
    price: 27500,
    quantity: 1500,
    fee: 61875,
    tax: 0,
    total_amount: 41250000,
    net_amount: 41311875,
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    trade_date: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10)
  },
  {
    id: 'tx_init_2',
    type: 'BUY',
    symbol: 'FPT',
    price: 122000,
    quantity: 400,
    fee: 73200,
    tax: 0,
    total_amount: 48800000,
    net_amount: 48873200,
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    trade_date: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10)
  }
];

export const localTradingEngine = {
  getPortfolio(): Portfolio {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    if (!data) {
      localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(initialPortfolio));
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
      localStorage.setItem(POSITIONS_KEY, JSON.stringify(initialPositions));
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
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialTransactions));
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

  placeOrder(payload: OrderRequestPayload): { transaction: Transaction; position: Position; portfolio: Portfolio } {
    const { symbol, type, quantity, price } = payload;
    const portfolio = this.getPortfolio();
    const positions = this.getPositions();
    const transactions = this.getTransactions();

    const grossAmount = quantity * price;
    const fee = grossAmount * 0.0015; // 0.15% phí giao dịch
    const tax = type === 'SELL' ? grossAmount * 0.001 : 0; // 0.1% thuế bán

    let existingPos = positions.find((p) => p.symbol === symbol);

    if (type === 'BUY') {
      const totalRequired = grossAmount + fee;
      if (portfolio.cash < totalRequired) {
        throw new Error(`Sức mua không đủ! Cần ${totalRequired.toLocaleString()}đ nhưng tiền mặt chỉ có ${portfolio.cash.toLocaleString()}đ`);
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
        existingPos.updated_at = new Date().toISOString();
      }
    } else {
      // BÁN
      if (!existingPos || existingPos.available_quantity < quantity) {
        const avail = existingPos ? existingPos.available_quantity : 0;
        throw new Error(`Không đủ cổ phiếu khả dụng để bán! (Khả dụng: ${avail.toLocaleString()}, đang chờ T+1/T+2: ${existingPos ? (existingPos.t1_quantity + existingPos.t2_quantity).toLocaleString() : 0})`);
      }

      const netProceeds = grossAmount - fee - tax;
      portfolio.receiving_cash += netProceeds; // Tiền chờ về T+2.5

      existingPos.available_quantity -= quantity;
      existingPos.total_quantity -= quantity;
      const remainingCost = existingPos.total_quantity * existingPos.avg_price;
      existingPos.market_value = existingPos.total_quantity * existingPos.market_price;
      existingPos.unrealized_pnl = existingPos.market_value - remainingCost;
      existingPos.unrealized_pnl_pct = remainingCost > 0 ? (existingPos.unrealized_pnl / remainingCost) * 100 : 0;
      existingPos.updated_at = new Date().toISOString();
    }

    // Tính lại tổng tài sản
    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    const totalProfit = positions.reduce((sum, p) => sum + p.unrealized_pnl, 0);
    portfolio.total_profit_loss = totalProfit;
    portfolio.total_equity = portfolio.cash + portfolio.receiving_cash + stockValuation - portfolio.margin_debt;
    portfolio.updated_at = new Date().toISOString();

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
      timestamp: new Date().toISOString(),
      trade_date: new Date().toISOString().slice(0, 10)
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
    portfolio.updated_at = new Date().toISOString();

    this.savePositions(positions);
    this.savePortfolio(portfolio);

    return `Đã chốt ngày T+2.5 thành công! +${cashReceived.toLocaleString()}đ tiền mặt khả dụng, +${movedShares.toLocaleString()} cổ phiếu khả dụng sẵn sàng bán.`;
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
