import { create } from 'zustand';
import { api } from '../services/api';
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

  selectedSymbol: '',
  selectedPrice: 0,
  selectedAction: 'BUY',

  isCashModalOpen: false,
  isPriceModalOpen: false,
  priceModalSymbol: '',
  priceModalCurrentPrice: 0,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [portfolio, positions, transactions] = await Promise.all([
        api.getPortfolio(),
        api.getPositions(),
        api.getTransactions()
      ]);
      set({ portfolio, positions, transactions, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Không thể kết nối đến máy chủ Backend', isLoading: false });
    }
  },

  placeOrder: async (payload: OrderRequestPayload) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const result = await api.placeOrder(payload);
      set((state) => {
        // Cập nhật vị thế trong danh sách
        const updatedPositions = [...state.positions];
        const idx = updatedPositions.findIndex((p) => p.symbol === result.position.symbol);
        if (idx >= 0) {
          updatedPositions[idx] = result.position;
        } else {
          updatedPositions.push(result.position);
        }
        // Thêm giao dịch vào lịch sử
        const updatedTransactions = [result.transaction, ...state.transactions];

        return {
          portfolio: result.portfolio,
          positions: updatedPositions.filter((p) => p.total_quantity > 0),
          transactions: updatedTransactions,
          isLoading: false,
          successMessage: `Khớp lệnh thành công: ${payload.type} ${payload.quantity.toLocaleString()} ${payload.symbol.toUpperCase()} giá ${(payload.price).toLocaleString()}đ`
        };
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi đặt lệnh', isLoading: false });
      return false;
    }
  },

  updatePrice: async (symbol: string, price: number) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const updatedPos = await api.updateMarketPrice(symbol, price);
      set((state) => {
        const updatedPositions = state.positions.map((p) => (p.symbol === symbol ? updatedPos : p));
        // Tính lại tổng tài sản
        const totalStockVal = updatedPositions.reduce((sum, p) => sum + p.market_value, 0);
        const newPortfolio = state.portfolio
          ? {
              ...state.portfolio,
              total_equity: (state.portfolio.cash || 0) + (state.portfolio.receiving_cash || 0) + totalStockVal - (state.portfolio.margin_debt || 0)
            }
          : null;
        return {
          positions: updatedPositions,
          portfolio: newPortfolio,
          isLoading: false,
          isPriceModalOpen: false,
          successMessage: `Đã cập nhật giá thị trường ${symbol} thành ${price.toLocaleString()}đ`
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
      await get().fetchData();
      set({ isLoading: false, successMessage: msg });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi thanh toán ngày T+2.5', isLoading: false });
      return false;
    }
  },

  adjustCash: async (amount: number, action: 'DEPOSIT' | 'WITHDRAW') => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const updatedPortfolio = await api.adjustCash(amount, action);
      set({
        portfolio: updatedPortfolio,
        isLoading: false,
        isCashModalOpen: false,
        successMessage: `${action === 'DEPOSIT' ? 'Nạp' : 'Rút'} ${amount.toLocaleString()}đ thành công!`
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi nạp/rút tiền', isLoading: false });
      return false;
    }
  },

  setSelectedStock: (symbol: string, price: number, action: 'BUY' | 'SELL' = 'BUY') => {
    set({ selectedSymbol: symbol, selectedPrice: price, selectedAction: action });
  },

  openCashModal: () => set({ isCashModalOpen: true }),
  closeCashModal: () => set({ isCashModalOpen: false }),

  openPriceModal: (symbol: string, currentPrice: number) => {
    set({ isPriceModalOpen: true, priceModalSymbol: symbol, priceModalCurrentPrice: currentPrice });
  },
  closePriceModal: () => set({ isPriceModalOpen: false }),

  clearMessages: () => set({ error: null, successMessage: null })
}));
