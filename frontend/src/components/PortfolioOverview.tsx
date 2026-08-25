import React from 'react';
import { DollarSign, Clock, PieChart, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const PortfolioOverview: React.FC = () => {
  const { portfolio, positions } = useTradingStore();

  const cash = portfolio?.cash || 0;
  const receivingCash = portfolio?.receiving_cash || 0;
  const stockMarketValue = positions.reduce((sum, p) => sum + (p.market_value || 0), 0);
  const totalEquity = portfolio?.total_equity || (cash + receivingCash + stockMarketValue);

  // Tổng lãi lỗ chưa thực hiện (Unrealized PnL) của danh mục hiện tại
  const unrealizedPnL = positions.reduce((sum, p) => sum + (p.unrealized_pnl || 0), 0);
  const totalInvestedStockCost = positions.reduce((sum, p) => sum + (p.total_quantity * p.avg_price), 0);
  const unrealizedPnLPct = totalInvestedStockCost > 0 ? (unrealizedPnL / totalInvestedStockCost) * 100 : 0;

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng tài sản ròng (Total Equity) */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tổng Tài Sản Ròng (NAV)</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PieChart className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-white tracking-tight">{formatVND(totalEquity)}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Tiền + Cổ phiếu + Tiền chờ về</span>
          </div>
        </div>
      </div>

      {/* 2. Tiền mặt khả dụng & Sức mua */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tiền Mặt Khả Dụng</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-cyan-300 tracking-tight">{formatVND(cash)}</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Sức mua lệnh MUA</span>
            <span className="font-semibold text-slate-200 font-mono">{formatVND(cash)}</span>
          </div>
        </div>
      </div>

      {/* 3. Tiền chờ về (T+2.5) */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tiền Chờ Về (T+2.5)</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-amber-300 tracking-tight">{formatVND(receivingCash)}</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Từ các lệnh Bán</span>
            <span className="text-[11px] text-amber-400/80">Sẽ về tiền mặt khi chốt ngày</span>
          </div>
        </div>
      </div>

      {/* 4. Tổng Lãi/Lỗ tạm tính (Unrealized PnL) */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lãi / Lỗ Tạm Tính</span>
          <div className={`p-2 rounded-xl border ${unrealizedPnL >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
            {unrealizedPnL >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-bold font-mono tracking-tight ${unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {unrealizedPnL >= 0 ? '+' : ''}{formatVND(unrealizedPnL)}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Tỷ suất sinh lời:</span>
            <span className={`font-bold font-mono ${unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnLPct.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
