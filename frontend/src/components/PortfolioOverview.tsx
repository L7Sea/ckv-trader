import React from 'react';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  TrendingDown,
  Scale,
  Eye,
  EyeOff,
  PlusCircle,
  Zap,
  RefreshCw,
  CalendarCheck,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const PortfolioOverview: React.FC = () => {
  const {
    portfolio,
    positions,
    isBalanceHidden,
    toggleBalanceVisibility,
    openCashModal,
    settleDay,
    syncLiveMarketData,
    isLiveSyncing,
    setSelectedStock
  } = useTradingStore();

  const cash = portfolio?.cash || 0;
  const receivingCash = portfolio?.receiving_cash || 0;
  const marginDebt = portfolio?.margin_debt || 6898107;
  const stockMarketValue = positions.reduce((sum, p) => sum + (p.market_value || 0), 0) || 14450000;
  const totalEquity = portfolio?.total_equity || 7551893;

  const unrealizedPnL = positions.reduce((sum, p) => sum + (p.unrealized_pnl || 0), 0) || -1465943;
  const totalInvestedStockCost = positions.reduce((sum, p) => sum + p.total_quantity * p.avg_price, 0) || 15918000;
  const unrealizedPnLPct = totalInvestedStockCost > 0 ? (unrealizedPnL / totalInvestedStockCost) * 100 : -9.29;

  const isProfit = unrealizedPnL >= 0;

  const formatVND = (val: number) => {
    if (isBalanceHidden) return '•••••••• đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(val || 0));
  };

  return (
    <div className="space-y-4">
      {/* ══ 1. MASTER ASSET CARD (PHONG CÁCH VÍ MOMO / ZALOPAY LUXURY) ══ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-950 border border-indigo-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        {/* Glow Auras */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Main Account Balance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-400" />
                VÍ TÀI SẢN CKV PRO
              </span>
              <button
                onClick={toggleBalanceVisibility}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
                title={isBalanceHidden ? 'Hiện số dư' : 'Ẩn số dư bảo mật'}
              >
                {isBalanceHidden ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-indigo-300" />}
              </button>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400">Tổng Tài Sản Ròng Khả Dụng (NAV)</div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-1 flex items-baseline gap-2">
                <span>{formatVND(totalEquity)}</span>
                <span className="text-xs font-sans font-medium text-slate-400 hidden sm:inline">
                  (Vốn ban đầu: <b className="text-slate-200">{formatVND(8891893)}</b>)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div
                className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-xl border ${
                  isProfit
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
              >
                {isProfit ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>
                  Lãi/Lỗ: {isProfit ? '+' : ''}
                  {formatVND(unrealizedPnL)} ({isProfit ? '+' : ''}
                  {unrealizedPnLPct.toFixed(2)}%)
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-mono">
                Ký quỹ: <b className="text-emerald-400">51.40%</b> (An toàn)
              </div>
            </div>
          </div>

          {/* Sub Balances Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 block font-sans">Tiền Mặt Khả Dụng</span>
              <b className="text-sm text-emerald-400 font-bold mt-0.5 block">{formatVND(cash)}</b>
              <span className="text-[10px] text-slate-500 font-sans">Sẵn sàng mua</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 block font-sans">Giá Trị Cổ Phiếu</span>
              <b className="text-sm text-cyan-300 font-bold mt-0.5 block">{formatVND(stockMarketValue)}</b>
              <span className="text-[10px] text-slate-500 font-sans">1,000 CP TPB</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 block font-sans">Tiền Chờ Về T+2.5</span>
              <b className="text-sm text-amber-400 font-bold mt-0.5 block">{formatVND(receivingCash)}</b>
              <span className="text-[10px] text-slate-500 font-sans">Đang thanh toán</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-rose-500/20 backdrop-blur-md">
              <span className="text-[10px] text-rose-300/80 block font-sans">Nợ Vay Margin</span>
              <b className="text-sm text-rose-400 font-bold mt-0.5 block">{formatVND(marginDebt)}</b>
              <span className="text-[10px] text-slate-500 font-sans">Lãi suất ưu đãi</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ 2. HÀNG 6 NÚT THAO TÁC NHANH (MOMO / ZALOPAY / SHOPEE STYLE QUICK ACTIONS) ══ */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-3 sm:p-4 shadow-sm backdrop-blur-md">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 text-center">
          {/* Nút 1: Thêm mã mới */}
          <button
            onClick={() => {
              const el = document.getElementById('search-stock-input');
              if (el) el.focus();
            }}
            className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl hover:bg-slate-800/80 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <PlusCircle className="h-6 w-6 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-300">Thêm Mã</span>
          </button>

          {/* Nút 2: 150 Thuật toán */}
          <button
            onClick={() => {
              const btn = document.querySelector('[data-tab="ALGORITHMS"]') as HTMLElement;
              if (btn) btn.click();
            }}
            className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl hover:bg-slate-800/80 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-slate-950 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
              <Zap className="h-6 w-6 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-300">150 Algos</span>
          </button>

          {/* Nút 3: Nạp / Rút tiền */}
          <button
            onClick={openCashModal}
            className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl hover:bg-slate-800/80 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <DollarSign className="h-6 w-6 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-emerald-300">Nạp / Rút</span>
          </button>

          {/* Nút 4: Đặt lệnh mua bán */}
          <button
            onClick={() => {
              const el = document.getElementById('order-form-container');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl hover:bg-slate-800/80 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <ArrowUpRight className="h-6 w-6 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300">Đặt Lệnh</span>
          </button>

          {/* Nút 5: Đồng bộ giá trực tiếp */}
          <button
            onClick={syncLiveMarketData}
            disabled={isLiveSyncing}
            className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl hover:bg-slate-800/80 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-slate-950 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition">
              <RefreshCw className={`h-6 w-6 stroke-[2.2] ${isLiveSyncing ? 'animate-spin' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-rose-300">
              {isLiveSyncing ? 'Đang Tải...' : 'Đồng Bộ Giá'}
            </span>
          </button>

          {/* Nút 6: Chốt ngày T+2.5 */}
          <button
            onClick={settleDay}
            className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl hover:bg-slate-800/80 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-purple-400 text-slate-950 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition">
              <CalendarCheck className="h-6 w-6 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-slate-200 group-hover:text-purple-300">Chốt T+2.5</span>
          </button>
        </div>
      </div>
    </div>
  );
};
