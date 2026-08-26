import { create } from 'zustand';
import { api } from '../services/api';
import { localTradingEngine } from '../services/localTradingEngine';
import { marketDataService, StockMarketInfo } from '../services/marketDataService';
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
  navigateToStock: (symbol: string, targetTab: TabType = 'CHARTS', action: 'BUY' | 'SELL' = 'BUY', targetPrice?: number) => {
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
      // 1. Đồng bộ dữ liệu giá thực tế 300 mã cổ phiếu
      await marketDataService.syncAllLivePrices();
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
        
        // Đối với Deal TPB: Tính theo công thức chuẩn DNSE (bao gồm phí thuế và lãi vay tích luỹ 128.1k)
        let pnl = 0;
        let pnlPct = 0;
        if (pos.symbol === 'TPB') {
          pnl = marketVal - 15790000 - 128116; // -1,468,116đ khi ở 14.45; -1,418,116đ khi ở 14.50
          pnlPct = (pnl / 15790000) * 100;
        } else {
          const cost = pos.total_quantity * pos.avg_price;
          pnl = marketVal - cost;
          pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
        }

        totalStockVal += marketVal;
        totalProfit += pnl;
        return {
          ...pos,
          market_price: livePrice,
          market_value: marketVal,
          unrealized_pnl: pnl,
          unrealized_pnl_pct: pnlPct,
          updated_at: new Date().toISOString()
        };
      });

      const actualMarginDebt = portfolio?.margin_debt !== undefined ? portfolio.margin_debt : 0;
      const actualCash = portfolio?.cash !== undefined ? portfolio.cash : 0;
      const newEquity = actualCash + (portfolio?.receiving_cash || 0) + totalStockVal - actualMarginDebt;
      const updatedPortfolio: Portfolio = {
        cash: actualCash,
        receiving_cash: portfolio?.receiving_cash || 0,
        margin_debt: actualMarginDebt,
        total_equity: newEquity,
        total_profit_loss: totalProfit,
        current_simulated_date: portfolio?.current_simulated_date || new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString()
      };

      // Lưu lại local trading engine
      localTradingEngine.savePortfolio(updatedPortfolio);
      localTradingEngine.savePositions(updatedPositions);

      set({
        watchlist: updatedWatchlist,
        portfolio: updatedPortfolio,
        positions: updatedPositions,
        transactions,
        isLiveSyncing: false,
        successMessage: `⚡ ĐỒNG BỘ TOÀN DIỆN THÀNH CÔNG: 300 mã giá thực (HOSE/HNX/UPCOM) + Lãi suất 20 Ngân hàng & FinTech + Tài sản NAV (${newEquity.toLocaleString('vi-VN')}đ) & Nợ Margin (${(updatedPortfolio.margin_debt).toLocaleString('vi-VN')}đ)!`
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
    const clean = localTradingEngine.resetToUserExactData();
    set({
      portfolio: clean.portfolio,
      positions: clean.positions,
      transactions: clean.transactions,
      successMessage: 'Đã đồng bộ lại dữ liệu thực tế: 1,000 TPB, nợ margin 6.89tr, NAV 7.55tr.'
    });
  },

  resetToUserExactData: () => {
    const exact = localTradingEngine.resetToUserExactData();
    set({
      portfolio: exact.portfolio,
      positions: exact.positions,
      transactions: exact.transactions,
      successMessage: 'Đã nạp chính xác danh mục thực tế: 1,000 TPB (Vốn thực có: 8.89tr, Nợ Margin: 6.89tr).'
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
        const totalStockVal = updatedPositions.reduce((sum, p) => sum + p.market_value, 0);
        const newPortfolio = state.portfolio
          ? {
              ...state.portfolio,
              total_equity: state.portfolio.cash + state.portfolio.receiving_cash + totalStockVal - state.portfolio.margin_debt,
              total_profit_loss: updatedPositions.reduce((sum, p) => sum + p.unrealized_pnl, 0),
              updated_at: new Date().toISOString()
            }
          : null;

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
