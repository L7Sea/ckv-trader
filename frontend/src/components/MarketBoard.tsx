import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  Search,
  Calendar,
  Eye,
  Activity,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Filter
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { TOP_300_STOCKS, MarketStock300 } from '../services/top300Stocks';

export const USER_WATCHLIST = TOP_300_STOCKS;
export const VN50_WATCHLIST = TOP_300_STOCKS;
export type WatchlistStock = MarketStock300;

export const MarketBoard: React.FC = () => {
  const { setSelectedStock, selectedSymbol } = useTradingStore();
  const [activeExchange, setActiveExchange] = useState<'ALL' | 'HOSE' | 'HNX' | 'UPCOM'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const sectors = useMemo(() => {
    const set = new Set<string>();
    TOP_300_STOCKS.forEach((s) => set.add(s.sector));
    return ['ALL', ...Array.from(set)];
  }, []);

  const filteredStocks = useMemo(() => {
    return TOP_300_STOCKS.filter((stock) => {
      const matchExchange = activeExchange === 'ALL' || stock.exchange === activeExchange;
      const matchSector = selectedSector === 'ALL' || stock.sector === selectedSector;
      const matchSearch =
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchExchange && matchSector && matchSearch;
    });
  }, [activeExchange, selectedSector, searchTerm]);

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-[#0e1117] border border-[#212636] rounded-2xl shadow-xl overflow-hidden text-slate-200 space-y-4 p-4 sm:p-5">
      {/* ══ HEADER: BẢNG GIÁ THỰC TẾ 300 CỔ PHIẾU ĐẦU NGÀNH ══ */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#212636]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-sans uppercase">
                BẢNG GIÁ THỰC TẾ 300 CỔ PHIẾU ĐẦU NGÀNH (HOSE • HNX • UPCOM)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                {filteredStocks.length} MÃ
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Dữ liệu giá khớp, khối lượng giao dịch và chỉ số cơ bản P/E, P/B, ROE. Nhấp dòng để soi nến kỹ thuật & sổ lệnh 3 cấp.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121620] border border-[#212636] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* ══ TABS LỌC THEO SÀN & NGÀNH ══ */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Exchange Tabs */}
        <div className="flex items-center p-1 bg-[#121620] rounded-xl border border-[#212636]">
          {[
            { key: 'ALL', label: 'Tất Cả (300)' },
            { key: 'HOSE', label: '🏛️ HOSE (100)' },
            { key: 'HNX', label: '🏢 HNX (100)' },
            { key: 'UPCOM', label: '🏪 UPCoM (100)' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveExchange(tab.key as any)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeExchange === tab.key
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sector Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-sans">Lọc ngành:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-[#121620] border border-[#212636] text-white font-sans text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec === 'ALL' ? 'Tất cả các ngành' : sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ══ BẢNG DỮ LIỆU CỔ PHIẾU ══ */}
      <div className="overflow-x-auto max-h-[500px] border border-[#212636] rounded-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-[#121620] z-10 border-b border-[#212636] text-slate-400 font-sans font-semibold">
            <tr>
              <th className="py-2.5 px-3">Mã</th>
              <th className="py-2.5 px-2">Tên Doanh Nghiệp</th>
              <th className="py-2.5 px-2">Sàn</th>
              <th className="py-2.5 px-2">Ngành</th>
              <th className="py-2.5 px-2 text-right">Khớp Lệnh</th>
              <th className="py-2.5 px-2 text-right">+/-</th>
              <th className="py-2.5 px-2 text-right">%</th>
              <th className="py-2.5 px-2 text-right">Tổng KL</th>
              <th className="py-2.5 px-2 text-right">P/E</th>
              <th className="py-2.5 px-2 text-right">P/B</th>
              <th className="py-2.5 px-2 text-right">ROE</th>
              <th className="py-2.5 px-2 text-center">AI Signal</th>
              <th className="py-2.5 px-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#212636]/40 bg-[#0e1117]">
            {filteredStocks.map((stock) => {
              const isUp = stock.change > 0;
              const isDown = stock.change < 0;
              const priceColor = isUp ? 'text-[#0ecb81]' : isDown ? 'text-[#f6465d]' : 'text-[#f59e0b]';
              const isSelected = selectedSymbol === stock.symbol;

              return (
                <tr
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock.symbol, stock.price, 'BUY')}
                  className={`transition group cursor-pointer ${
                    isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : 'hover:bg-[#181d29]'
                  }`}
                >
                  <td className="py-2.5 px-3 font-black text-white text-sm">
                    <div className="flex items-center gap-1.5">
                      <span>{stock.symbol}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-slate-300 font-sans max-w-[150px] truncate">
                    {stock.name}
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#1f2536] text-[10px] text-slate-400 font-bold">
                      {stock.exchange}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-slate-400 font-sans text-[11px]">
                    {stock.sector}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-bold text-sm ${priceColor}`}>
                    {formatNumber(stock.price)}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-bold ${priceColor}`}>
                    {isUp ? '+' : ''}{formatNumber(stock.change)}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-bold ${priceColor}`}>
                    {isUp ? '+' : ''}{stock.changePct.toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-300">
                    {formatNumber(stock.volume)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    {stock.pe}x
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    {stock.pb}x
                  </td>
                  <td className="py-2.5 px-2 text-right text-emerald-400 font-bold">
                    {stock.roe}%
                  </td>
                  <td className="py-2.5 px-2 text-center font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stock.aiSignal === 'STRONG_BUY'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : stock.aiSignal === 'BUY'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {stock.aiSignal}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStock(stock.symbol, stock.price, 'BUY');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-sans font-bold transition text-[11px]"
                    >
                      Soi Nến
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
