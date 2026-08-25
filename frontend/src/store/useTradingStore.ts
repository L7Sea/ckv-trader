import { create } from 'zustand';
import { api } from '../services/api';
import { localTradingEngine } from '../services/localTradingEngine';
import { OrderRequestPayload, Portfolio, Position, Transaction } from '../types';

interface TradingState {
  portfolio: Portfolio | null;
  positions: Position[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  
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
  resetCleanSlate: (startingCash?: number) => void;
  resetToUserExactData: () => void;
  
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
  isLoading: false,
  error: null,
  successMessage: null,

  selectedSymbol: 'TPB',
  selectedPrice: 14450,
  selectedAction: 'BUY',

  isCashModalOpen: false,
  isPriceModalOpen: false,
  priceModalSymbol: '',
  priceModalCurrentPrice: 0,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      let [portfolio, positions, transactions] = await Promise.all([
        api.getPortfolio(),
        api.getPositions(),
        api.getTransactions()
      ]);

      // Tự động nạp chuẩn danh mục thực tế nếu chưa có TPB
      if (!positions || positions.length === 0 || !positions.some((p) => p.symbol === 'TPB')) {
        const exact = localTradingEngine.resetToUserExactData();
        portfolio = exact.portfolio;
        positions = exact.positions;
        transactions = exact.transactions;
      }

      set({ portfolio, positions, transactions, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải dữ liệu', isLoading: false });
    }
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

  setSelectedStock: (symbol: string, price: number, action: 'BUY' | 'SELL' = 'BUY') => {
    set({ selectedSymbol: symbol, selectedPrice: price, selectedAction: action });
  },

  openCashModal: () => set({ isCashModalOpen: true }),
  closeCashModal: () => set({ isCashModalOpen: false }),
  openPriceModal: (symbol: string, currentPrice: number) =>
    set({ isPriceModalOpen: true, priceModalSymbol: symbol, priceModalCurrentPrice: currentPrice }),
  closePriceModal: () => set({ isPriceModalOpen: false }),
  clearMessages: () => set({ error: null, successMessage: null })
}));
