import { create } from 'zustand';
import { api } from '../services/api';
import { localTradingEngine } from '../services/localTradingEngine';
import { marketDataService, StockMarketInfo } from '../services/marketDataService';
import { computePositionPnL, daysSinceOpen, marginDebtAt, vnDateString } from '../services/dealModel';
import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';

export type TabType = 'TRADE' | 'DECISION' | 'ALGORITHMS' | 'MARKET' | 'MACRO' | 'INTELLIGENCE' | 'CHARTS' | 'ANALYTICS';

interface TradingState {
  portfolio: Portfolio | null;
  positions: Position[];
  transactions: Transaction[];
  watchlist: StockMarketInfo[];
  isLoading: boolean;
  isLiveSyncing: boolean;
  isBalanceHidden: boolean;
  error: string | null;
  successMessage: string | null;

  // Active Navigation Tab & Cross-Link Mechanism
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  navigateToStock: (symbol: string, targetTab?: TabType, action?: 'BUY' | 'SELL', targetPrice?: number) => void;
  
  // Selected stock for quick order prefill
  selectedSymbol: string;
  selectedPrice: number;
  selectedAction: 'BUY' | 'SELL';

  // Modals state
  isCashModalOpen: boolean;
  isPriceModalOpen: boolean;
  priceModalSymbol: string;
  priceModalCurrentPrice: number;

  // Actions
  fetchData: () => Promise<void>;
  placeOrder: (payload: OrderRequestPayload) => Promise<boolean>;
  updatePrice: (symbol: string, price: number) => Promise<boolean>;
  settleDay: () => Promise<boolean>;
  adjustCash: (amount: number, action: 'DEPOSIT' | 'WITHDRAW') => Promise<boolean>;
  repayMarginDebt: (amount: number) => Promise<boolean>;
  directUpdateAssets: (cash: number, marginDebt: number, positions?: Position[]) => Promise<boolean>;
  resetCleanSlate: (startingCash?: number) => void;
  resetToUserExactData: () => void;
  
  // Super-App Features
  toggleBalanceVisibility: () => void;
  syncAllUnifiedData: () => Promise<void>;
  syncLiveMarketData: () => Promise<void>;
  addCustomStock: (symbol: string) => Promise<StockMarketInfo>;
  removeCustomStock: (symbol: string) => void;
  
  setSelectedStock: (symbol: string, price: number, action?: 'BUY' | 'SELL') => void;
  openCashModal: () => void;
  closeCashModal: () => void;
  openPriceModal: (symbol: string, currentPrice: number) => void;
  closePriceModal: () => void;
  clearMessages: () => void;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  portfolio: null,
  positions: [],
  transactions: [],
  watchlist: marketDataService.getWatchlist(),
  isLoading: false,
  isLiveSyncing: false,
  isBalanceHidden: typeof window !== 'undefined' ? localStorage.getItem('ckv_balance_hidden') === 'true' : false,
  error: null,
  successMessage: null,

  activeTab: 'TRADE',
  setActiveTab: (tab: TabType) => set({ activeTab: tab }),
  navigateToStock: (symbol: string, targetTab: TabType = 'MARKET', action: 'BUY' | 'SELL' = 'BUY', targetPrice?: number) => {
    const s = get().watchlist.find((w) => w.symbol === symbol) || marketDataService.generateCompleteInfo(symbol);
    const price = targetPrice || s.price;
    set({
      selectedSymbol: symbol,
      selectedPrice: price,
      selectedAction: action,
      activeTab: targetTab
    });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  },

  selectedSymbol: 'TPB',
  selectedPrice: 14600,
  selectedAction: 'BUY',

  isCashModalOpen: false,
  isPriceModalOpen: false,
  priceModalSymbol: '',
  priceModalCurrentPrice: 0,

  toggleBalanceVisibility: () => {
    set((state) => {
      const next = !state.isBalanceHidden;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ckv_balance_hidden', String(next));
      }
      return { isBalanceHidden: next };
    });
  },

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      let [portfolio, positions, transactions] = await Promise.all([
        api.getPortfolio(),
        api.getPositions(),
        api.getTransactions()
      ]);

      // Tự động nạp chuẩn danh mục thực tế của Chủ nhân nếu là tài khoản Admin
      if (localTradingEngine.isAdmin() && (!positions || positions.length === 0 || !positions.some((p) => p.symbol === 'TPB'))) {
        const exact = localTradingEngine.resetToUserExactData();
        portfolio = exact.portfolio;
        positions = exact.positions;
        transactions = exact.transactions;
      }

      set({
        portfolio,
        positions,
        transactions,
        watchlist: marketDataService.getWatchlist(),
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải dữ liệu', isLoading: false });
    }
  },

  // Master All-in-one Unified Sync
  syncAllUnifiedData: async () => {
    set({ isLiveSyncing: true, error: null });
    try {
      /* 1. Đồng bộ giá. Truyền kèm các mã ĐANG NẮM GIỮ để chắc chắn chúng được
            lấy giá thực, kể cả khi chưa nằm trong danh mục theo dõi. */
      const heldSymbols = get().positions.map((p) => p.symbol);
      const priceSync = await marketDataService.syncAllLivePrices(heldSymbols);
      const updatedWatchlist = marketDataService.getWatchlist();

      // 2. Đồng bộ danh mục tài sản, vị thế và nợ margin
      let [portfolio, positions, transactions] = await Promise.all([
        api.getPortfolio(),
        api.getPositions(),
        api.getTransactions()
      ]);

      // Tự động cập nhật thị giá các vị thế nắm giữ theo giá mới nhất
      let totalStockVal = 0;
      let totalProfit = 0;
      const updatedPositions = positions.map((pos) => {
        const found = updatedWatchlist.find((s) => s.symbol === pos.symbol);
        const livePrice = found ? found.price : pos.market_price;
        const marketVal = pos.total_quantity * livePrice;
        
        // Một công thức duy nhất cho mọi mã (dealModel là nguồn sự thật)
        const calc = computePositionPnL(pos.symbol, pos.total_quantity, pos.avg_price, livePrice, new Date());
        const pnl = calc.pnl;
        const pnlPct = calc.pnlPct;

        totalStockVal += marketVal;
        totalProfit += pnl;
        return {
          ...pos,
          market_price: livePrice,
          market_value: marketVal,
          unrealized_pnl: pnl,
          unrealized_pnl_pct: pnlPct,
          breakeven_price: calc.breakevenPrice,
          updated_at: new Date().toISOString()
        };
      });

      /* Dư nợ được dựng lại theo số ngày thực kể từ ngày mở Deal, cộng phần nợ
         phát sinh ngoài Deal (nếu có) — không bao giờ giữ nguyên số chụp cũ. */
      const baselineDebt = marginDebtAt(daysSinceOpen(new Date()));
      const extraDebt = Math.max(
        0,
        (portfolio?.margin_debt || 0) - marginDebtAt(daysSinceOpen(portfolio?.current_simulated_date || new Date()))
      );
      const actualMarginDebt = localTradingEngine.isAdmin() ? baselineDebt + extraDebt : (portfolio?.margin_debt || 0);
      const actualCash = portfolio?.cash !== undefined ? portfolio.cash : 0;
      const newEquity = actualCash + (portfolio?.receiving_cash || 0) + totalStockVal - actualMarginDebt;
      const updatedPortfolio: Portfolio = {
        cash: actualCash,
        receiving_cash: portfolio?.receiving_cash || 0,
        margin_debt: actualMarginDebt,
        total_equity: newEquity,
        total_profit_loss: totalProfit,
        current_simulated_date: vnDateString(new Date()),
        updated_at: new Date().toISOString()
      };

      // Lưu local TRƯỚC, sau đó GHI NGƯỢC lên Supabase.
      // Thiếu bước ghi ngược này là lý do mọi thay đổi bị số cũ trong DB ghi đè khi tải lại trang.
      localTradingEngine.savePortfolio(updatedPortfolio);
      localTradingEngine.savePositions(updatedPositions);
      const persisted = await api.persistPortfolioState(updatedPortfolio, updatedPositions);

      set({
        watchlist: updatedWatchlist,
        portfolio: updatedPortfolio,
        positions: updatedPositions,
        transactions,
        isLiveSyncing: false,
        successMessage: `⚡ ĐỒNG BỘ ${persisted ? 'THÀNH CÔNG' : 'CỤC BỘ (chưa ghi được lên máy chủ)'}: ${priceSync.liveCount}/${priceSync.total} mã lấy được giá thực · NAV ${newEquity.toLocaleString('vi-VN')}đ · Nợ Margin ${updatedPortfolio.margin_debt.toLocaleString('vi-VN')}đ · Lãi/Lỗ ${totalProfit.toLocaleString('vi-VN')}đ`
      });
    } catch (e: any) {
      set({ isLiveSyncing: false, error: 'Lỗi đồng bộ toàn diện: ' + e.message });
    }
  },

  syncLiveMarketData: async () => {
    return get().syncAllUnifiedData();
  },

  addCustomStock: async (symbol: string) => {
    set({ isLoading: true, error: null });
    try {
      const stock = await marketDataService.addOrFetchStock(symbol);
      set({
        watchlist: marketDataService.getWatchlist(),
        selectedSymbol: stock.symbol,
        selectedPrice: stock.price,
        isLoading: false,
        successMessage: `Đã tìm thấy và nạp thành công mã ${stock.symbol} (${stock.name}) vào danh mục theo dõi!`
      });
      return stock;
    } catch (err: any) {
      set({ error: err.message || 'Không thể thêm mã', isLoading: false });
      throw err;
    }
  },

  removeCustomStock: (symbol: string) => {
    marketDataService.removeStock(symbol);
    set({
      watchlist: marketDataService.getWatchlist(),
      successMessage: `Đã xóa mã ${symbol} khỏi danh mục theo dõi`
    });
  },

  resetCleanSlate: (startingCash = 0) => {
    const clean = localTradingEngine.resetCleanSlate(startingCash);
    set({
      portfolio: clean.portfolio,
      positions: clean.positions,
      transactions: clean.transactions,
      successMessage: `Đã dọn sạch danh mục. Tiền mặt khởi tạo: ${startingCash.toLocaleString('vi-VN')}đ.`
    });
  },

  resetToUserExactData: () => {
    const exact = localTradingEngine.resetToUserExactData();
    set({
      portfolio: exact.portfolio,
      positions: exact.positions,
      transactions: exact.transactions,
successMessage: `Đã nạp lại danh mục thực tế: ${exact.positions[0]?.total_quantity.toLocaleString('vi-VN') || 0} ${exact.positions[0]?.symbol || ''} · NAV ${exact.portfolio.total_equity.toLocaleString('vi-VN')}đ · Nợ ${exact.portfolio.margin_debt.toLocaleString('vi-VN')}đ.`
    });
  },

  placeOrder: async (payload: OrderRequestPayload) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const result = await api.placeOrder(payload);
      set((state) => {
        const updatedPositions = [...state.positions];
        const idx = updatedPositions.findIndex((p) => p.symbol === result.position.symbol);
        if (idx >= 0) {
          updatedPositions[idx] = result.position;
        } else {
          updatedPositions.push(result.position);
        }
        const updatedTransactions = [result.transaction, ...state.transactions];

        return {
          portfolio: result.portfolio,
          positions: updatedPositions.filter((p) => p.total_quantity > 0),
          transactions: updatedTransactions,
          isLoading: false,
          successMessage: `Đã ghi nhật ký: ${payload.type === 'BUY' ? 'MUA' : 'BÁN'} ${payload.quantity.toLocaleString()} ${payload.symbol.toUpperCase()} giá ${payload.price.toLocaleString()}đ`
        };
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi ghi sổ lệnh', isLoading: false });
      return false;
    }
  },

  updatePrice: async (symbol: string, price: number) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const updatedPos = await api.updateMarketPrice(symbol, price);
      set((state) => {
        const updatedPositions = state.positions.map((p) => (p.symbol === symbol ? updatedPos : p));
        const newPortfolio = localTradingEngine.getPortfolio();

        return {
          positions: updatedPositions,
          portfolio: newPortfolio,
          isLoading: false,
          successMessage: `Đã cập nhật thị giá ${symbol} thành ${price.toLocaleString()}đ`
        };
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi cập nhật giá', isLoading: false });
      return false;
    }
  },

  settleDay: async () => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const msg = await api.settleDay();
      const [portfolio, positions, transactions] = await Promise.all([
        api.getPortfolio(),
        api.getPositions(),
        api.getTransactions()
      ]);
      set({ portfolio, positions, transactions, isLoading: false, successMessage: msg });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi chốt ngày T+2.5', isLoading: false });
      return false;
    }
  },

  adjustCash: async (amount: number, action: 'DEPOSIT' | 'WITHDRAW') => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const portfolio = await api.adjustCash(amount, action);
      set({
        portfolio,
        isLoading: false,
        successMessage: `Đã ${action === 'DEPOSIT' ? 'nạp thêm' : 'rút'} ${amount.toLocaleString()}đ tiền mặt thành công!`
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi thay đổi tiền mặt', isLoading: false });
      return false;
    }
  },

  repayMarginDebt: async (amount: number) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const portfolio = localTradingEngine.repayMarginDebt(amount);
      set({
        portfolio,
        isLoading: false,
        successMessage: `Đã trả ${amount.toLocaleString()}đ nợ gốc Margin Deal thành công! Dư nợ còn lại: ${(portfolio.margin_debt).toLocaleString()}đ.`
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi trả nợ margin', isLoading: false });
      return false;
    }
  },

  directUpdateAssets: async (cash: number, marginDebt: number, positions?: Position[]) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const { portfolio, positions: updatedPositions } = localTradingEngine.directUpdateAssets(cash, marginDebt, positions);
      set({
        portfolio,
        positions: updatedPositions,
        isLoading: false,
        successMessage: `Đã hiệu chỉnh số dư tài sản thành công: Tiền mặt ${cash.toLocaleString()}đ, Nợ Margin ${marginDebt.toLocaleString()}đ, NAV ${(portfolio.total_equity).toLocaleString()}đ!`
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi cập nhật tài sản', isLoading: false });
      return false;
    }
  },

  setSelectedStock: (symbol: string, price: number, action: 'BUY' | 'SELL' = 'BUY') => {
    set({ selectedSymbol: symbol.toUpperCase(), selectedPrice: price, selectedAction: action });
  },

  openCashModal: () => set({ isCashModalOpen: true }),
  closeCashModal: () => set({ isCashModalOpen: false }),
  openPriceModal: (symbol: string, currentPrice: number) =>
    set({ isPriceModalOpen: true, priceModalSymbol: symbol, priceModalCurrentPrice: currentPrice }),
  closePriceModal: () => set({ isPriceModalOpen: false }),
  clearMessages: () => set({ error: null, successMessage: null })
}));
