import React from 'react';
import { DollarSign, Clock, PieChart, TrendingUp, TrendingDown, ShieldCheck, Scale } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const PortfolioOverview: React.FC = () => {
  const { portfolio, positions } = useTradingStore();

  const cash = portfolio?.cash || 0;
  const receivingCash = portfolio?.receiving_cash || 0;
  const marginDebt = portfolio?.margin_debt || 6898107;
  const stockMarketValue = positions.reduce((sum, p) => sum + (p.market_value || 0), 0);
  const totalEquity = portfolio?.total_equity || 7551893;

  const unrealizedPnL = positions.reduce((sum, p) => sum + (p.unrealized_pnl || 0), 0) || -1465943;
  const totalInvestedStockCost = positions.reduce((sum, p) => sum + p.total_quantity * p.avg_price, 0) || 15918000;
  const unrealizedPnLPct = totalInvestedStockCost > 0 ? (unrealizedPnL / totalInvestedStockCost) * 100 : -9.29;

  const isProfit = unrealizedPnL >= 0;

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(val || 0));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng tài sản ròng (NAV) */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tài Sản Ròng (NAV)</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PieChart className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-white tracking-tight">{formatVND(totalEquity)}</div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>Tỷ lệ ký quỹ vốn tự có:</span>
            <span className="font-bold text-emerald-400 font-mono">51.40%</span>
          </div>
        </div>
      </div>

      {/* 2. Vốn Thực Có Ban Đầu */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vốn Thực Có Ban Đầu</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-cyan-300 tracking-tight">{formatVND(8891893)}</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Giá trị CP hiện tại:</span>
            <span className="font-semibold text-slate-200 font-mono">{formatVND(stockMarketValue || 14450000)}</span>
          </div>
        </div>
      </div>

      {/* 3. Vốn Vay Margin (Deal) */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vốn Vay (Margin Deal)</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Scale className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-indigo-300 tracking-tight">{formatVND(marginDebt)}</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Tổng giải ngân vốn:</span>
            <span className="font-semibold text-slate-200 font-mono">{formatVND(15790000)}</span>
          </div>
        </div>
      </div>

      {/* 4. Tổng Lãi / Lỗ Chưa Chốt */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lãi Chưa Chốt (PnL)</span>
          <div className={`p-2 rounded-xl ${isProfit ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            {isProfit ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-bold font-mono tracking-tight ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfit ? '+' : ''}{formatVND(unrealizedPnL)}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Tỷ suất PnL:</span>
            <span className={`font-bold font-mono px-2 py-0.5 rounded-lg ${isProfit ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
              {isProfit ? '+' : ''}{unrealizedPnLPct.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
