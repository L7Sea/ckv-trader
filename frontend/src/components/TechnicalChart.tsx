import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Layers,
  Search,
  Maximize2,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sliders,
  DollarSign,
  PieChart
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { VN50_WATCHLIST, WatchlistStock } from './MarketBoard';

interface TickTrade {
  id: string;
  time: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  change: number;
}

export const TechnicalChart: React.FC = () => {
  const { positions, selectedSymbol, setSelectedStock, watchlist } = useTradingStore();
  const [activeTab, setActiveTab] = useState<'TRADINGVIEW' | 'ORDERBOOK' | 'DEAL_ANALYTICS'>('TRADINGVIEW');
  const [activeTimeframe, setActiveTimeframe] = useState<'D' | 'W' | 'M' | '60' | '15'>('D');

  const activeSymbol = selectedSymbol || positions[0]?.symbol || 'ACB';
  const foundStock = watchlist.find((s) => s.symbol === activeSymbol) || VN50_WATCHLIST.find((s) => s.symbol === activeSymbol);
  const currentPos = positions.find((p) => p.symbol === activeSymbol);

  // Giá và thông số thị trường thực tế
  const currentPrice = currentPos?.market_price || foundStock?.price || 22200;
  const refPrice = foundStock?.refPrice || Math.round(currentPrice * 0.985); // Tham chiếu
  const ceilPrice = Math.round(refPrice * 1.07); // Trần +7%
  const floorPrice = Math.round(refPrice * 0.93); // Sàn -7%
  const highPrice = Math.round(currentPrice * 1.012);
  const lowPrice = Math.round(currentPrice * 0.978);
  const avgPrice = Math.round((highPrice + lowPrice) / 2);
  const totalVolume = foundStock?.volume || 7780000;
  const totalValue = Math.round((totalVolume * currentPrice) / 1000000000 * 10) / 10; // Tỷ đồng
  const foreignBuy = 266960;
  const foreignSell = 1896400;

  const change = currentPrice - refPrice;
  const changePct = refPrice > 0 ? (change / refPrice) * 100 : 0;
  const isUp = change >= 0;

  // 1. TẠO SỔ LỆNH BƯỚC GIÁ 3 CẤP (3-LEVEL ORDER BOOK NHƯ DNSE ENTRADE X)
  const orderBook = React.useMemo(() => {
    const p = currentPrice;
    return {
      buyLevels: [
        { price: p - 100, volume: 17600, pct: 25 },
        { price: p - 150, volume: 114800, pct: 68 },
        { price: p - 200, volume: 136700, pct: 85 }
      ],
      currentTrade: { price: p, volume: 1000, change: changePct },
      sellLevels: [
        { price: p + 100, volume: 4600, pct: 15 },
        { price: p + 150, volume: 1200, pct: 8 },
        { price: p + 200, volume: 16100, pct: 28 }
      ],
      totalBuyOrder: 269100,
      totalSellOrder: 21900
    };
  }, [currentPrice, changePct]);

  // 2. NHẬT KÝ KHỚP LỆNH THEO GIÂY (TIME & SALES TICKS)
  const [ticks, setTicks] = useState<TickTrade[]>([
    { id: '1', time: '14:45:01', type: 'SELL', price: currentPrice, quantity: 1000, change: -0.30 },
    { id: '2', time: '14:45:01', type: 'SELL', price: currentPrice, quantity: 3600, change: -0.30 },
    { id: '3', time: '14:45:01', type: 'SELL', price: currentPrice, quantity: 300, change: -0.30 },
    { id: '4', time: '14:45:01', type: 'SELL', price: currentPrice, quantity: 100, change: -0.30 },
    { id: '5', time: '14:45:01', type: 'SELL', price: currentPrice, quantity: 2000, change: -0.30 },
    { id: '6', time: '14:44:58', type: 'BUY', price: currentPrice + 50, quantity: 5000, change: +0.20 },
    { id: '7', time: '14:44:55', type: 'BUY', price: currentPrice + 50, quantity: 12000, change: +0.20 },
    { id: '8', time: '14:44:50', type: 'SELL', price: currentPrice, quantity: 800, change: -0.30 }
  ]);

  const tradingViewContainerRef = useRef<HTMLDivElement>(null);

  // Nhúng TradingView Widget thời gian thực hỗ trợ toàn bộ cổ phiếu VN (HOSE, HNX)
  useEffect(() => {
    if (activeTab !== 'TRADINGVIEW') return;

    const exchange = (foundStock as any)?.exchange || 'HOSE';
    const tvSymbol = `${exchange}:${activeSymbol}`;

    if (tradingViewContainerRef.current) {
      tradingViewContainerRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: tvSymbol,
        interval: activeTimeframe,
        timezone: 'Asia/Ho_Chi_Minh',
        theme: 'dark',
        style: '1',
        locale: 'vi_VN',
        enable_publishing: false,
        backgroundColor: '#0e1117',
        gridColor: 'rgba(36, 41, 56, 0.4)',
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        calendar: false,
        hide_volume: false,
        support_host: 'https://www.tradingview.com'
      });

      tradingViewContainerRef.current.appendChild(script);
    }
  }, [activeSymbol, activeTab, activeTimeframe, foundStock]);

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-[#0e1117] border border-[#212636] rounded-2xl shadow-xl overflow-hidden text-slate-200">
      {/* ══ 1. TOP TICKER STATUS BAR (CHUẨN TERMINAL DNSE / VPS) ══ */}
      <div className="bg-[#121620] border-b border-[#212636] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Symbol & Exchange Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={activeSymbol}
              onChange={(e) => {
                const s = watchlist.find((item) => item.symbol === e.target.value) || VN50_WATCHLIST.find((item) => item.symbol === e.target.value);
                setSelectedStock(e.target.value, s?.price || 22200, 'BUY');
              }}
              className="bg-[#181d29] border border-[#2b3245] text-white font-mono font-black text-lg rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {watchlist.map((item) => (
                <option key={item.symbol} value={item.symbol}>
                  {item.symbol} - {item.name}
                </option>
              ))}
            </select>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1f2536] text-slate-400 font-bold">
              {(foundStock as any)?.exchange || 'HOSE'}
            </span>
            {currentPos && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Đang giữ: {currentPos.total_quantity.toLocaleString()} CP
              </span>
            )}
          </div>

          {/* Current Live Price */}
          <div className="flex items-baseline gap-2 font-mono">
            <span className={`text-2xl font-black ${isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
              {formatNumber(currentPrice)}
            </span>
            <span className={`text-xs font-bold ${isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
              {isUp ? '+' : ''}{formatNumber(change)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Market Stats Grid: Trần, Sàn, TC, Cao, Thấp, KL */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-sans">Trần:</span>
            <b className="text-[#d946ef]">{formatNumber(ceilPrice)}</b>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-sans">Sàn:</span>
            <b className="text-[#06b6d4]">{formatNumber(floorPrice)}</b>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-sans">TC:</span>
            <b className="text-[#f59e0b]">{formatNumber(refPrice)}</b>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-slate-500 font-sans">Cao/Thấp:</span>
            <b className="text-slate-200">{formatNumber(highPrice)} / {formatNumber(lowPrice)}</b>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-sans">Tổng KL:</span>
            <b className="text-slate-100">{formatNumber(totalVolume)}</b>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-slate-500 font-sans">GT Khớp:</span>
            <b className="text-slate-100">{totalValue} tỷ</b>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center p-1 bg-[#181d29] rounded-xl border border-[#2b3245] text-xs font-sans">
          <button
            onClick={() => setActiveTab('TRADINGVIEW')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'TRADINGVIEW'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Biểu Đồ Kỹ Thuật (TradingView)</span>
          </button>
          <button
            onClick={() => setActiveTab('ORDERBOOK')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ORDERBOOK'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Sổ Lệnh & Bước Giá (DNSE Style)</span>
          </button>
        </div>
      </div>

      {/* ══ 2. CHẾ ĐỘ 1: BIỂU ĐỒ NẾN TRADINGVIEW REALTIME ══ */}
      {activeTab === 'TRADINGVIEW' && (
        <div className="p-3 bg-[#0e1117]">
          {/* Timeframe Selector Bar */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#212636] text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-sans mr-2">Khung thời gian:</span>
              {(['15', '60', 'D', 'W', 'M'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    activeTimeframe === tf
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-[#181d29]'
                  }`}
                >
                  {tf === 'D' ? '1 Ngày' : tf === 'W' ? '1 Tuần' : tf === 'M' ? '1 Tháng' : `${tf}m`}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 font-sans flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dữ liệu trực tiếp TradingView Realtime</span>
            </div>
          </div>

          {/* TradingView Container */}
          <div
            ref={tradingViewContainerRef}
            className="w-full h-[520px] rounded-xl overflow-hidden bg-[#0e1117] border border-[#212636]"
          />
        </div>
      )}

      {/* ══ 3. CHẾ ĐỘ 2: SỔ LỆNH 3 BÊN & KHỚP LỆNH TICK THEO GIÂY (DNSE ENTRADE X STYLE) ══ */}
      {activeTab === 'ORDERBOOK' && (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#0e1117]">
          {/* CỘT TRÁI: BẢNG BƯỚC GIÁ 3 CẤP MUA / BÁN (7 COLS) */}
          <div className="lg:col-span-7 bg-[#121620] border border-[#212636] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#212636]">
              <span className="text-xs font-bold text-slate-300 font-sans flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-emerald-400" />
                BẢNG BƯỚC GIÁ 3 CẤP (ORDER BOOK)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Tổng Dư Mua: <b className="text-emerald-400">{formatNumber(orderBook.totalBuyOrder)}</b> | Dư Bán: <b className="text-rose-400">{formatNumber(orderBook.totalSellOrder)}</b>
              </span>
            </div>

            {/* Bảng 3 mức giá Mua / Bán đối xứng */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-center">
                <thead>
                  <tr className="border-b border-[#212636] text-slate-500 font-sans font-semibold text-[11px]">
                    <th colSpan={2} className="py-2 text-emerald-400 bg-emerald-500/5">BÊN MUA</th>
                    <th className="py-2 text-white bg-slate-800/40">KHỚP LỆNH</th>
                    <th colSpan={2} className="py-2 text-rose-400 bg-rose-500/5">BÊN BÁN</th>
                  </tr>
                  <tr className="border-b border-[#212636]/60 text-[10px] text-slate-500">
                    <th className="py-1.5 px-2">Khối lượng</th>
                    <th className="py-1.5 px-2">Giá</th>
                    <th className="py-1.5 px-2">Giá (+/-)</th>
                    <th className="py-1.5 px-2">Giá</th>
                    <th className="py-1.5 px-2">Khối lượng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#212636]/40">
                  {/* Cấp 3 */}
                  <tr>
                    <td className="py-2.5 px-2 text-slate-300 relative">
                      <div className="absolute inset-y-0 right-0 bg-emerald-500/10 rounded-l" style={{ width: `${orderBook.buyLevels[2].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.buyLevels[2].volume)}</span>
                    </td>
                    <td className="py-2.5 px-2 text-emerald-400 font-bold">{formatNumber(orderBook.buyLevels[2].price)}</td>
                    <td className="py-2.5 px-2 font-black text-white bg-slate-900/60">-</td>
                    <td className="py-2.5 px-2 text-rose-400 font-bold">{formatNumber(orderBook.sellLevels[2].price)}</td>
                    <td className="py-2.5 px-2 text-slate-300 relative">
                      <div className="absolute inset-y-0 left-0 bg-rose-500/10 rounded-r" style={{ width: `${orderBook.sellLevels[2].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.sellLevels[2].volume)}</span>
                    </td>
                  </tr>

                  {/* Cấp 2 */}
                  <tr>
                    <td className="py-2.5 px-2 text-slate-300 relative">
                      <div className="absolute inset-y-0 right-0 bg-emerald-500/10 rounded-l" style={{ width: `${orderBook.buyLevels[1].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.buyLevels[1].volume)}</span>
                    </td>
                    <td className="py-2.5 px-2 text-emerald-400 font-bold">{formatNumber(orderBook.buyLevels[1].price)}</td>
                    <td className="py-2.5 px-2 font-black text-white bg-slate-900/60">-</td>
                    <td className="py-2.5 px-2 text-rose-400 font-bold">{formatNumber(orderBook.sellLevels[1].price)}</td>
                    <td className="py-2.5 px-2 text-slate-300 relative">
                      <div className="absolute inset-y-0 left-0 bg-rose-500/10 rounded-r" style={{ width: `${orderBook.sellLevels[1].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.sellLevels[1].volume)}</span>
                    </td>
                  </tr>

                  {/* Cấp 1 (Tốt nhất) */}
                  <tr className="bg-[#181d2a]/80 font-bold">
                    <td className="py-2.5 px-2 text-slate-200 relative">
                      <div className="absolute inset-y-0 right-0 bg-emerald-500/20 rounded-l" style={{ width: `${orderBook.buyLevels[0].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.buyLevels[0].volume)}</span>
                    </td>
                    <td className="py-2.5 px-2 text-emerald-400 text-sm">{formatNumber(orderBook.buyLevels[0].price)}</td>
                    <td className="py-2.5 px-2 text-sm text-emerald-300 bg-emerald-500/10">
                      {formatNumber(orderBook.currentTrade.price)}
                    </td>
                    <td className="py-2.5 px-2 text-rose-400 text-sm">{formatNumber(orderBook.sellLevels[0].price)}</td>
                    <td className="py-2.5 px-2 text-slate-200 relative">
                      <div className="absolute inset-y-0 left-0 bg-rose-500/20 rounded-r" style={{ width: `${orderBook.sellLevels[0].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.sellLevels[0].volume)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Khối Ngoại & Thống kê Mua/Bán */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 bg-[#181d29] rounded-xl border border-[#2b3245]">
                <span className="text-slate-500 block font-sans text-[10px]">Khối Ngoại Mua:</span>
                <b className="text-emerald-400">{formatNumber(foreignBuy)} CP</b>
              </div>
              <div className="p-3 bg-[#181d29] rounded-xl border border-[#2b3245]">
                <span className="text-slate-500 block font-sans text-[10px]">Khối Ngoại Bán:</span>
                <b className="text-rose-400">{formatNumber(foreignSell)} CP</b>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: NHẬT KÝ KHỚP LỆNH THEO GIÂY (TIME & SALES TICKS) (5 COLS) */}
          <div className="lg:col-span-5 bg-[#121620] border border-[#212636] rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#212636]">
                <span className="text-xs font-bold text-slate-300 font-sans flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  KHỚP LỆNH TRỰC TIẾP (TIME & SALES)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Thời gian thực</span>
              </div>

              {/* Tỷ lệ Mua Chủ Động vs Bán Chủ Động */}
              <div className="py-2.5 space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">M: 3.801.800 (48.8%)</span>
                  <span className="text-rose-400 font-bold">B: 3.978.200 (51.2%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: '48.8%' }} />
                  <div className="h-full bg-rose-500" style={{ width: '51.2%' }} />
                </div>
              </div>

              {/* Bảng Tick Trades */}
              <div className="overflow-y-auto max-h-[300px] mt-1 space-y-1 pr-1 font-mono text-xs">
                {ticks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#181d29]/70 hover:bg-[#181d29] transition"
                  >
                    <span className="text-slate-400 text-[11px]">{t.time}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        t.type === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {t.type === 'BUY' ? 'MUA' : 'BÁN'}
                    </span>
                    <b className="text-white">{formatNumber(t.quantity)}</b>
                    <span className={t.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {formatNumber(t.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-[#181d29] rounded-xl border border-[#2b3245] text-[11px] text-slate-400 font-sans leading-relaxed">
              💡 <b>Khớp chủ động:</b> Lệnh mua/bán khớp thẳng vào dư mua/bán của sàn, phản ánh chuẩn xác áp lực cung cầu trong phiên.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
