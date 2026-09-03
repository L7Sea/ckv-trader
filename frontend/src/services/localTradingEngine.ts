import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';
import { wallpaperService } from './wallpaperService';
import { DEAL_CONFIG, computeDealSnapshot, computePositionPnL, daysSinceOpen, marginDebtAt, vnDateString } from './dealModel';

const PORTFOLIO_KEY = 'ckv_local_portfolio';
const POSITIONS_KEY = 'ckv_local_positions';
const TRANSACTIONS_KEY = 'ckv_local_transactions';
const DATA_VERSION_KEY = 'ckv_data_version_lock';
export const CURRENT_DATA_VERSION = '2026-08-28-dealmodel-v7';

/* Giá tham chiếu cuối cùng đã biết của Deal (28/08/2026 06:26). Chỉ là mồi khởi tạo
   khi chưa đồng bộ được giá thị trường — mọi con số tiền vẫn TÍNH từ dealModel,
   tuyệt đối không hardcode ảnh chụp số dư như các phiên bản trước. */
const LAST_KNOWN_DEAL_PRICE = 14700;

/** Ngày hôm nay theo giờ Việt Nam — mọi mốc ngày trong app phải dùng hàm này. */
const todayISO = () => vnDateString(new Date());

/** Dựng tổng quan tài sản của chủ tài khoản tại hiện tại, suy ra từ dealModel. */
function buildAdminPortfolio(marketPrice = LAST_KNOWN_DEAL_PRICE): Portfolio {
  const snap = computeDealSnapshot(marketPrice, new Date());
  return {
    cash: snap.cash,
    receiving_cash: 0,
    margin_debt: snap.marginDebt,
    total_equity: snap.netAssetValue,
    total_profit_loss: snap.unrealizedPnL,
    current_simulated_date: todayISO(),
    updated_at: new Date().toISOString()
  };
}

/** Dựng vị thế Deal của chủ tài khoản tại hiện tại, suy ra từ dealModel. */
function buildAdminPositions(marketPrice = LAST_KNOWN_DEAL_PRICE): Position[] {
  const snap = computeDealSnapshot(marketPrice, new Date());
  return [
    {
      symbol: DEAL_CONFIG.symbol,
      total_quantity: DEAL_CONFIG.quantity,
      available_quantity: DEAL_CONFIG.quantity,
      t1_quantity: 0,
      t2_quantity: 0,
      avg_price: Math.round(DEAL_CONFIG.costBasisAtOpen / DEAL_CONFIG.quantity),
      breakeven_price: snap.breakevenPrice,
      market_price: marketPrice,
      market_value: snap.stockValue,
      unrealized_pnl: snap.unrealizedPnL,
      unrealized_pnl_pct: snap.unrealizedPnLPct,
      target_price: 16500,
      stop_loss: 13800,
      updated_at: new Date().toISOString()
    }
  ];
}

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

let activeUserId = 'guest';
let isActiveUserAdmin = false;

const emptyUserPortfolio: Portfolio = {
  cash: 0,
  receiving_cash: 0,
  margin_debt: 0,
  total_equity: 0,
  total_profit_loss: 0,
  current_simulated_date: vnDateString(new Date()),
  updated_at: new Date().toISOString()
};

export const localTradingEngine = {
  setActiveUserId(userId: string, isAdmin: boolean) {
    activeUserId = userId;
    isActiveUserAdmin = isAdmin;
  },

  isAdmin() {
    return isActiveUserAdmin || activeUserId === 'admin_hai_master';
  },

  getStorageKeys() {
    if (isActiveUserAdmin || activeUserId === 'admin_hai_master') {
      return {
        portfolio: PORTFOLIO_KEY,
        positions: POSITIONS_KEY,
        transactions: TRANSACTIONS_KEY
      };
    }
    return {
      portfolio: `${PORTFOLIO_KEY}_${activeUserId}`,
      positions: `${POSITIONS_KEY}_${activeUserId}`,
      transactions: `${TRANSACTIONS_KEY}_${activeUserId}`
    };
  },

  ensureDataFreshness() {
    try {
      if (isActiveUserAdmin) {
        const savedVer = localStorage.getItem(DATA_VERSION_KEY);
        if (savedVer !== CURRENT_DATA_VERSION) {
          this.resetToUserExactData();
          localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
        }
      }
    } catch {}
  },

  getPortfolio(): Portfolio {
    this.ensureDataFreshness();
    const keys = this.getStorageKeys();
    const data = localStorage.getItem(keys.portfolio);
    if (!data) {
      const initial = isActiveUserAdmin ? buildAdminPortfolio() : emptyUserPortfolio;
      this.savePortfolio(initial);
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return isActiveUserAdmin ? buildAdminPortfolio() : emptyUserPortfolio;
    }
  },

  savePortfolio(p: Portfolio) {
    const keys = this.getStorageKeys();
    localStorage.setItem(keys.portfolio, JSON.stringify(p));
  },

  getPositions(): Position[] {
    this.ensureDataFreshness();
    const keys = this.getStorageKeys();
    const data = localStorage.getItem(keys.positions);
    if (!data) {
      const initial = isActiveUserAdmin ? buildAdminPositions() : [];
      this.savePositions(initial);
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return isActiveUserAdmin ? buildAdminPositions() : [];
    }
  },

  savePositions(positions: Position[]) {
    const keys = this.getStorageKeys();
    localStorage.setItem(keys.positions, JSON.stringify(positions));
  },

  getTransactions(): Transaction[] {
    this.ensureDataFreshness();
    const keys = this.getStorageKeys();
    const data = localStorage.getItem(keys.transactions);
    if (!data) {
      const initial = isActiveUserAdmin ? initialTransactions : [];
      this.saveTransactions(initial);
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return isActiveUserAdmin ? initialTransactions : [];
    }
  },

  saveTransactions(txs: Transaction[]) {
    const keys = this.getStorageKeys();
    localStorage.setItem(keys.transactions, JSON.stringify(txs));
  },

  resetToUserExactData(): { portfolio: Portfolio; positions: Position[]; transactions: Transaction[] } {
    if (isActiveUserAdmin) {
      const portfolio = buildAdminPortfolio(LAST_KNOWN_DEAL_PRICE);
      const positions = buildAdminPositions(LAST_KNOWN_DEAL_PRICE);
      this.savePortfolio(portfolio);
      this.savePositions(positions);
      this.saveTransactions(initialTransactions);
      return { portfolio, positions, transactions: initialTransactions };
    } else {
      this.savePortfolio(emptyUserPortfolio);
      this.savePositions([]);
      this.saveTransactions([]);
      return {
        portfolio: emptyUserPortfolio,
        positions: [],
        transactions: []
      };
    }
  },

  /** Dọn sạch hoàn toàn danh mục, chỉ giữ lại số tiền mặt khởi tạo do người dùng chọn. */
  resetCleanSlate(startingCash = 0): { portfolio: Portfolio; positions: Position[]; transactions: Transaction[] } {
    const portfolio: Portfolio = {
      ...emptyUserPortfolio,
      cash: Math.max(0, startingCash),
      total_equity: Math.max(0, startingCash),
      current_simulated_date: todayISO(),
      updated_at: new Date().toISOString()
    };
    this.savePortfolio(portfolio);
    this.savePositions([]);
    this.saveTransactions([]);
    return { portfolio, positions: [], transactions: [] };
  },

  placeOrder(payload: OrderRequestPayload): {
    transaction: Transaction;
    position: Position;
    portfolio: Portfolio;
    /** Những chỗ sổ không khớp thực tế. Lệnh VẪN được ghi. */
    canhBao: string[];
  } {
    const { symbol, type, quantity, price, strategy, target_price, stop_loss, trade_date, notes } = payload;
    const portfolio = this.getPortfolio();
    const positions = this.getPositions();
    const transactions = this.getTransactions();

    /* Mọi điều không khớp đều đi vào đây rồi trả về cho giao diện — thay cho
       việc ném lỗi và huỷ bản ghi. */
    const canhBao: string[] = [];

    const grossAmount = quantity * price;
    const fee = grossAmount * 0.0015;
    const tax = type === 'SELL' ? grossAmount * 0.001 : 0;

    let existingPos = positions.find((p) => p.symbol === symbol);

    if (type === 'BUY') {
      const totalRequired = grossAmount + fee;
      const funding = payload.funding_source || (portfolio.cash >= totalRequired ? 'CASH' : 'MARGIN_DEAL');

      if (funding === 'CASH') {
        /* CKV là sổ GHI CHÉP, không phải sàn. Lệnh đã khớp thật ngoài công ty
           chứng khoán rồi — app không có quyền phủ nhận việc đã xảy ra.
           Thiếu tiền mặt thì vẫn ghi, để số dư âm và CẢNH BÁO. Số âm chính là
           dấu hiệu nhìn thấy được rằng sổ cần hiệu chỉnh; chặn ghi thì mất luôn
           cả bản ghi lẫn dấu hiệu. */
        if (portfolio.cash < totalRequired) {
          canhBao.push(
            `Tiền mặt trong sổ (${portfolio.cash.toLocaleString('vi-VN')}đ) ít hơn số cần ` +
            `(${totalRequired.toLocaleString('vi-VN')}đ). Đã ghi lệnh và để số dư âm — ` +
            `hãy hiệu chỉnh vốn cho khớp thực tế.`
          );
        }
        portfolio.cash -= totalRequired;
      } else if (funding === 'MARGIN_DEAL') {
        // Vay 100% qua Margin Deal DNSE
        portfolio.margin_debt += totalRequired;
      } else if (funding === 'HYBRID') {
        // Hỗn hợp 50% tự có + 50% Margin
        const cashPart = Math.min(portfolio.cash, Math.round(totalRequired * 0.5));
        const debtPart = totalRequired - cashPart;
        portfolio.cash -= cashPart;
        portfolio.margin_debt += debtPart;
      }

      if (!existingPos) {
        existingPos = {
          symbol,
          total_quantity: quantity,
          available_quantity: 0,
          t1_quantity: 0,
          t2_quantity: quantity,
          avg_price: Math.round((grossAmount + fee) / quantity),
          breakeven_price: Math.round((grossAmount + fee) / quantity),
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
        const oldCost = oldTotal * (existingPos.avg_price || price);
        const newCost = oldCost + grossAmount + fee;
        const newAvg = newCost / newTotal;

        // Tính lại giá hòa vốn Deal mới sau khi mua thêm (DCA) - Không hardcode mã TPB
        const defaultBreakeven = existingPos.avg_price || price;
        const oldBreakevenCost = oldTotal * (existingPos.breakeven_price || defaultBreakeven);
        const newBreakevenCost = oldBreakevenCost + grossAmount + fee;
        const newBreakevenPrice = Math.round(newBreakevenCost / newTotal);

        existingPos.total_quantity = newTotal;
        existingPos.t2_quantity += quantity;
        existingPos.avg_price = Math.round(newAvg);
        existingPos.breakeven_price = newBreakevenPrice;
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
      /* Bán nhiều hơn số khả dụng trong sổ: vẫn ghi. Chu kỳ T+2.5 trong app có
         thể chậm hơn thực tế, và người dùng biết rõ mình đã bán gì. */
      if (!existingPos) {
        canhBao.push(`Sổ chưa có mã ${symbol}. Đã tạo vị thế từ chính lệnh bán này — hãy kiểm lại giá vốn.`);
        existingPos = {
          symbol,
          total_quantity: quantity,
          available_quantity: quantity,
          t1_quantity: 0,
          t2_quantity: 0,
          avg_price: price,
          breakeven_price: price,
          market_price: price,
          market_value: quantity * price,
          unrealized_pnl: 0,
          unrealized_pnl_pct: 0,
          updated_at: new Date().toISOString()
        };
        positions.push(existingPos);
      } else if (existingPos.available_quantity < quantity) {
        canhBao.push(
          `Khả dụng trong sổ chỉ ${existingPos.available_quantity.toLocaleString('vi-VN')} CP, ` +
          `ít hơn số bán ${quantity.toLocaleString('vi-VN')} CP. Đã ghi lệnh — có thể chu kỳ T+2.5 ` +
          `trong app chậm hơn thực tế, hãy bấm "Chốt ngày" hoặc hiệu chỉnh.`
        );
      }

      const netProceeds = grossAmount - fee - tax;
      const costOfSoldShares = quantity * (existingPos.avg_price || 0);
      const realizedPnL = Math.round(netProceeds - costOfSoldShares);

      portfolio.receiving_cash += netProceeds;
      portfolio.total_profit_loss = (portfolio.total_profit_loss || 0) + realizedPnL;

      existingPos.available_quantity = Math.max(0, existingPos.available_quantity - quantity);
      existingPos.total_quantity = Math.max(0, existingPos.total_quantity - quantity);
      const remainingCost = existingPos.total_quantity * existingPos.avg_price;
      existingPos.market_value = existingPos.total_quantity * existingPos.market_price;
      existingPos.unrealized_pnl = existingPos.market_value - remainingCost;
      existingPos.unrealized_pnl_pct = remainingCost > 0 ? (existingPos.unrealized_pnl / remainingCost) * 100 : 0;
      existingPos.updated_at = new Date().toISOString();
    }

    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    const totalUnrealizedProfit = positions.reduce((sum, p) => sum + p.unrealized_pnl, 0);
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
      realized_pnl: type === 'SELL' ? Math.round((grossAmount - fee - tax) - (quantity * (existingPos?.avg_price || 0))) : undefined,
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

    const activePos = existingPos || finalPositions[0] || {
      symbol,
      total_quantity: 0,
      available_quantity: 0,
      t1_quantity: 0,
      t2_quantity: 0,
      avg_price: price,
      market_price: price,
      market_value: 0,
      unrealized_pnl: 0,
      unrealized_pnl_pct: 0,
      updated_at: new Date().toISOString()
    };
    return { transaction, position: activePos, portfolio, canhBao };
  },

  /**
   * Đưa dư nợ Margin về đúng mức của NGÀY HÔM NAY theo dealModel.
   * Trả về phần lãi vay chênh lệch vừa được ghi nhận thêm (có thể là 0).
   * Chỉ áp dụng cho Deal gốc; nợ phát sinh do mua thêm bằng Margin giữ nguyên.
   */
  syncMarginDebtToToday(portfolio: Portfolio): number {
    const expected = marginDebtAt(daysSinceOpen(new Date()));
    const extraDebt = portfolio.margin_debt - marginDebtAt(daysSinceOpen(portfolio.current_simulated_date || todayISO()));
    const target = expected + Math.max(0, Math.round(extraDebt));
    const delta = target - portfolio.margin_debt;
    portfolio.margin_debt = target;
    portfolio.current_simulated_date = todayISO();
    return delta;
  },

  updateMarketPrice(symbol: string, market_price: number): Position {
    const positions = this.getPositions();
    const pos = positions.find((p) => p.symbol === symbol);
    if (!pos) throw new Error(`Không tìm thấy mã ${symbol} trong danh mục`);

    const calc = computePositionPnL(pos.symbol, pos.total_quantity, pos.avg_price, market_price, new Date());
    pos.market_price = market_price;
    pos.market_value = pos.total_quantity * market_price;
    pos.unrealized_pnl = calc.pnl;
    pos.unrealized_pnl_pct = calc.pnlPct;
    pos.breakeven_price = calc.breakevenPrice;
    pos.updated_at = new Date().toISOString();

    this.savePositions(positions);

    const portfolio = this.getPortfolio();
    this.syncMarginDebtToToday(portfolio);
    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    portfolio.total_profit_loss = positions.reduce((sum, p) => sum + p.unrealized_pnl, 0);
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

    /* Lãi vay Margin được tính lại theo SỐ NGÀY LỊCH THỰC kể từ ngày mở Deal
       (lãi đơn trên dư nợ gốc), thay vì cộng thêm 1 ngày mỗi lần bấm nút như
       phiên bản cũ — vốn khiến nợ đứng yên khi không bấm và nhảy vọt khi bấm
       nhiều lần. */
    const marginInterestToday = this.syncMarginDebtToToday(portfolio);
    if (marginInterestToday !== 0) {
      // Phân bổ chi phí lãi vay vào giá hòa vốn theo TỶ TRỌNG VỐN (thay vì chia đều)
      const totalMarginPositions = positions.filter((p) => p.total_quantity > 0 && p.symbol !== DEAL_CONFIG.symbol);
      const totalStockValuation = totalMarginPositions.reduce((sum, p) => sum + (p.market_value || p.total_quantity * p.avg_price), 0);
      
      if (totalMarginPositions.length > 0 && totalStockValuation > 0) {
        totalMarginPositions.forEach((pos) => {
          const posVal = pos.market_value || (pos.total_quantity * pos.avg_price);
          const posWeight = posVal / totalStockValuation;
          const interestForPos = Math.round(marginInterestToday * posWeight);
          if (pos.total_quantity > 0) {
            const currentBreakeven = pos.breakeven_price || pos.avg_price;
            pos.breakeven_price = Math.round(currentBreakeven + (interestForPos / pos.total_quantity));
            pos.updated_at = new Date().toISOString();
          }
        });
      }
    }

    for (const pos of positions) {
      const calc = computePositionPnL(pos.symbol, pos.total_quantity, pos.avg_price, pos.market_price, new Date());
      pos.unrealized_pnl = calc.pnl;
      pos.unrealized_pnl_pct = calc.pnlPct;
      pos.breakeven_price = calc.breakevenPrice;
    }

    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    portfolio.total_profit_loss = positions.reduce((sum, p) => sum + p.unrealized_pnl, 0);
    portfolio.total_equity = portfolio.cash + portfolio.receiving_cash + stockValuation - portfolio.margin_debt;
    portfolio.updated_at = new Date().toISOString();

    this.savePositions(positions);
    this.savePortfolio(portfolio);

    return `Đã chốt ngày T+2.5 thành công! +${cashReceived.toLocaleString()}đ tiền mặt, +${movedShares.toLocaleString()} CP khả dụng. ${marginInterestToday > 0 ? `(Lãi vay phát sinh: +${marginInterestToday.toLocaleString()}đ/ngày)` : ''}`;
  },

  adjustCash(amount: number, action: 'DEPOSIT' | 'WITHDRAW'): Portfolio {
    const portfolio = this.getPortfolio();
    if (action === 'WITHDRAW' && portfolio.cash < amount) {
      throw new Error(`Số dư tiền mặt không đủ để rút ${amount.toLocaleString()}đ (Hiện có: ${portfolio.cash.toLocaleString()}đ)!`);
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
  },

  repayMarginDebt(amount: number): Portfolio {
    const portfolio = this.getPortfolio();
    if (portfolio.cash < amount) {
      throw new Error(`Tiền mặt khả dụng (${portfolio.cash.toLocaleString()}đ) không đủ để trả ${amount.toLocaleString()}đ nợ Deal!`);
    }

    const actualRepay = Math.min(portfolio.margin_debt, amount);
    portfolio.margin_debt = Math.max(0, portfolio.margin_debt - actualRepay);
    portfolio.cash = Math.max(0, portfolio.cash - actualRepay);

    const positions = this.getPositions();
    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    portfolio.total_equity = portfolio.cash + portfolio.receiving_cash + stockValuation - portfolio.margin_debt;
    portfolio.updated_at = new Date().toISOString();
    this.savePortfolio(portfolio);
    return portfolio;
  },

  directUpdateAssets(cash: number, marginDebt: number, positionsUpdate?: Position[]): { portfolio: Portfolio; positions: Position[] } {
    const portfolio = this.getPortfolio();
    let positions = positionsUpdate || this.getPositions();
    portfolio.cash = Math.max(0, cash);
    portfolio.margin_debt = Math.max(0, marginDebt);
    const stockValuation = positions.reduce((sum, p) => sum + p.market_value, 0);
    portfolio.total_equity = portfolio.cash + portfolio.receiving_cash + stockValuation - portfolio.margin_debt;
    portfolio.updated_at = new Date().toISOString();
    this.savePortfolio(portfolio);
    if (positionsUpdate) {
      this.savePositions(positions);
    }
    return { portfolio, positions };
  },

  exportDataAsJson(): string {
    const data = {
      portfolio: this.getPortfolio(),
      positions: this.getPositions(),
      transactions: this.getTransactions(),
      wallpaper: wallpaperService.getConfig(),
      exportedAt: new Date().toISOString(),
      version: CURRENT_DATA_VERSION
    };
    return JSON.stringify(data, null, 2);
  },

  importDataFromJson(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.portfolio && Array.isArray(data.positions) && Array.isArray(data.transactions)) {
        this.savePortfolio(data.portfolio);
        this.savePositions(data.positions);
        this.saveTransactions(data.transactions);
        if (data.wallpaper) {
          wallpaperService.importConfig(data.wallpaper);
        }
        return true;
      }
    } catch {}
    return false;
  }
};
