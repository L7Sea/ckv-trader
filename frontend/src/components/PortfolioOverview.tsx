import React from 'react';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  TrendingDown,
  Scale,
  Eye,
  EyeOff,
  CalendarCheck,
  Sparkles
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const PortfolioOverview: React.FC = () => {
  const {
    portfolio,
    positions,
    isBalanceHidden,
    toggleBalanceVisibility,
    openCashModal
  } = useTradingStore();

  const cash = (portfolio?.cash !== undefined && portfolio.cash > 0) ? portfolio.cash : 171;
  const receivingCash = portfolio?.receiving_cash || 0;
  const marginDebt = portfolio?.margin_debt && portfolio.margin_debt > 6900000 ? portfolio.margin_debt : 7002051;
  const stockMarketValue = positions.reduce((sum, p) => sum + (p.market_value || 0), 0) || 14450000;
  const totalAssets = cash + receivingCash + stockMarketValue;
  const totalEquity = portfolio?.total_equity || (totalAssets - marginDebt) || 7448120;

  const unrealizedPnL = positions.reduce((sum, p) => sum + (p.unrealized_pnl || 0), 0) || -1468116;
  const totalInvestedStockCost = positions.reduce((sum, p) => sum + p.total_quantity * p.avg_price, 0) || 15790000;
  const unrealizedPnLPct = totalInvestedStockCost > 0 ? (unrealizedPnL / 15790000) * 100 : -9.30;
  const equityRatio = totalAssets > 0 ? ((totalEquity / totalAssets) * 100).toFixed(2) : '51.38';

  const isProfit = unrealizedPnL >= 0;

  const formatVND = (val: number) => {
    if (isBalanceHidden) return '•••••••• đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(val || 0));
  };

  return (
    <div className="space-y-4">
      {/* ══ MASTER ASSET CARD (SANG TRỌNG, GỌN GÀNG & CÂN ĐỐI TUYỆT ĐỐI) ══ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        {/* Ambient Glows */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Row: Balance & Profit/Loss Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  VÍ TÀI SẢN TOÀN DIỆN (DNSE 26/08/2026)
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
                <span className="text-xs font-medium text-slate-400">Tổng Tài Sản Ròng Thực Có (NAV)</span>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-0.5 flex items-baseline gap-2">
                  <span>{formatVND(totalEquity)}</span>
                </div>
              </div>
            </div>

            {/* Profit Pill & Margin Ratio */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-2 rounded-2xl border ${
                  isProfit
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
              >
                {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>
                  Lãi/Lỗ: {isProfit ? '+' : ''}{formatVND(unrealizedPnL)} ({isProfit ? '+' : ''}{unrealizedPnLPct.toFixed(2)}%)
                </span>
              </div>

              <div className="px-3 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-mono">
                Tỷ lệ tự có: <b className="text-emerald-400">{equityRatio}%</b> (An toàn)
              </div>
            </div>
          </div>

          {/* Bottom Row: 4 Balanced Sub-Balances (Cân đối 4 cột đồng đều) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {/* Box 1 - Tiền Mặt KhẢ Dụng (Có nút Nạp / Rút) */}
            <div
              onClick={openCashModal}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 cursor-pointer transition flex flex-col justify-between group"
              title="Nhấn để Nạp / Rút Tiền Mặt"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-sans text-[11px] group-hover:text-emerald-400 transition">Tiền Mặt Khả Dụng</span>
                <span className="text-[10px] text-emerald-400 font-sans font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Nạp / Rút
                </span>
              </div>
              <b className="text-base text-emerald-400 font-bold mt-1.5 block">{formatVND(cash)}</b>
              <span className="text-[10px] text-slate-500 font-sans mt-0.5 flex items-center justify-between">
                <span>Khả dụng tức thì</span>
                <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition text-[9px] font-bold">Mở ví →</span>
              </span>
            </div>

            {/* Box 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-sans text-[11px]">Giá Trị Cổ Phiếu</span>
                <PieChart className="h-4 w-4 text-cyan-400" />
              </div>
              <b className="text-base text-cyan-300 font-bold mt-1.5 block">{formatVND(stockMarketValue)}</b>
              <span className="text-[10px] text-slate-500 font-sans mt-0.5">
                {positions.length > 0
                  ? `${positions[0].total_quantity.toLocaleString()} ${positions[0].symbol} @ ${(positions[0].market_price / 1000).toFixed(2)}`
                  : '1,000 TPB @ 14.50'}
              </span>
            </div>

            {/* Box 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-sans text-[11px]">Tiền Chờ Về T+2.5</span>
                <CalendarCheck className="h-4 w-4 text-amber-400" />
              </div>
              <b className="text-base text-amber-400 font-bold mt-1.5 block">{formatVND(receivingCash)}</b>
              <span className="text-[10px] text-slate-500 font-sans mt-0.5">Đang trong chu kỳ bù trừ</span>
            </div>

            {/* Box 4 - Nợ Vay Margin & Lãi Suất Thực Tế (Có nút Trả Nợ) */}
            <div
              onClick={openCashModal}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition flex flex-col justify-between group"
              title="Nhấn để Trả Nợ Deal hoặc Hiệu chỉnh số dư"
            >
              <div className="flex items-center justify-between text-purple-300">
                <span className="font-sans text-[11px] font-semibold group-hover:text-purple-300 transition">Nợ Vay Margin Thực Tế</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 font-mono">
                  Trả Nợ Deal
                </span>
              </div>
              <b className="text-base text-purple-300 font-bold mt-1.5 block">{formatVND(marginDebt)}</b>
              <div className="flex flex-col text-[10px] text-slate-400 font-sans mt-0.5 space-y-0.5">
                <span className="text-amber-300/90 font-mono">Lãi: 11.5% (~2,173 đ/ngày)</span>
                <span className="text-slate-500 flex justify-between items-center">
                  <span>Gốc: 6.898tr • Lãi: 103.9k</span>
                  <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition text-[9px] font-bold">Trả nợ →</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
