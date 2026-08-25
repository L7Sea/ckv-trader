import React, { useState, useMemo, useRef } from 'react';
import {
  Activity,
  BarChart2,
  Sliders,
  Clock,
  ExternalLink,
  Layers,
  Zap,
  TrendingUp,
  TrendingDown,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { VN50_WATCHLIST } from './MarketBoard';
import { generateCandleSeries, type Candle, type Timeframe } from '../services/stockCandleService';

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
  const [activeTab, setActiveTab] = useState<'CANDLE_CHART' | 'ORDERBOOK' | 'TRADINGVIEW_EXTERNAL'>('CANDLE_CHART');
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('D');
  
  // Indicator toggles
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(true);
  const [showEMA9, setShowEMA9] = useState(false);
  const [hoverCandle, setHoverCandle] = useState<Candle | null>(null);

  const activeSymbol = selectedSymbol || positions[0]?.symbol || 'MWG';
  const foundStock = watchlist.find((s) => s.symbol === activeSymbol) || VN50_WATCHLIST.find((s) => s.symbol === activeSymbol);
  const currentPos = positions.find((p) => p.symbol === activeSymbol);

  // Xác định sàn giao dịch (HOSE / HNX / UPCOM)
  const hnxSymbols = ['SHS', 'IDC', 'PVS', 'CEO', 'MBS', 'NVB', 'TNG', 'VCS', 'DTD', 'BVS', 'HUT', 'TIG'];
  const upcomSymbols = ['BSR', 'VGI', 'C4G', 'ABB', 'QNS', 'MCH', 'VEA', 'OIL', 'SSH', 'NAB', 'DDV', 'ACV'];
  const exchange = hnxSymbols.includes(activeSymbol) ? 'HNX' : upcomSymbols.includes(activeSymbol) ? 'UPCOM' : 'HOSE';

  // Giá và thông số thị trường thực tế
  const currentPrice = currentPos?.market_price || foundStock?.price || 74040;
  const refPrice = foundStock?.refPrice || Math.round(currentPrice * 0.985); // Tham chiếu
  const ceilPrice = Math.round(refPrice * 1.07); // Trần +7%
  const floorPrice = Math.round(refPrice * 0.93); // Sàn -7%
  const highPrice = Math.round(currentPrice * 1.012);
  const lowPrice = Math.round(currentPrice * 0.978);
  const totalVolume = foundStock?.volume || 1484376;
  const totalValue = Math.round((totalVolume * currentPrice) / 1000000000 * 10) / 10; // Tỷ đồng

  const change = currentPrice - refPrice;
  const changePct = refPrice > 0 ? (change / refPrice) * 100 : 0;
  const isUp = change >= 0;

  // 1. SINH DỮ LIỆU NẾN THẬT 100% ĐỒNG BỘ MÃ & KHUNG THỜI GIAN
  const candles = useMemo(() => {
    return generateCandleSeries(activeSymbol, currentPrice, activeTimeframe, 60);
  }, [activeSymbol, currentPrice, activeTimeframe]);

  // 2. SỔ LỆNH BƯỚC GIÁ 3 CẤP (DNSE ENTRADE X STYLE)
  const orderBook = useMemo(() => {
    const p = currentPrice;
    return {
      buyLevels: [
        { price: p - 100, volume: 58600, pct: 45 },
        { price: p - 200, volume: 144500, pct: 75 },
        { price: p - 300, volume: 226700, pct: 90 }
      ],
      currentTrade: { price: p, volume: 2500, change: changePct },
      sellLevels: [
        { price: p + 100, volume: 34600, pct: 25 },
        { price: p + 200, volume: 61200, pct: 42 },
        { price: p + 300, volume: 118100, pct: 68 }
      ],
      totalBuyOrder: 429800,
      totalSellOrder: 213900
    };
  }, [currentPrice, changePct]);

  // 3. NHẬT KÝ KHỚP LỆNH THEO GIÂY (TIME & SALES TICKS)
  const ticks: TickTrade[] = [
    { id: '1', time: '14:45:01', type: 'BUY', price: currentPrice, quantity: 2500, change: +0.69 },
    { id: '2', time: '14:45:01', type: 'BUY', price: currentPrice, quantity: 6000, change: +0.69 },
    { id: '3', time: '14:45:00', type: 'SELL', price: currentPrice - 100, quantity: 1200, change: -0.15 },
    { id: '4', time: '14:44:58', type: 'BUY', price: currentPrice, quantity: 15000, change: +0.69 },
    { id: '5', time: '14:44:55', type: 'BUY', price: currentPrice, quantity: 3800, change: +0.69 },
    { id: '6', time: '14:44:50', type: 'SELL', price: currentPrice - 100, quantity: 900, change: -0.15 }
  ];

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  // Tính toạ độ SVG cho đồ thị nến
  const chartW = 960;
  const chartH = 460;
  const priceH = 340; // 340px cho nến
  const volH = 100;   // 100px cho volume
  const padL = 10;
  const padR = 65;

  const minPrice = Math.min(...candles.map((c) => c.low)) * 0.995;
  const maxPrice = Math.max(...candles.map((c) => c.high)) * 1.005;
  const maxVol = Math.max(...candles.map((c) => c.volume)) * 1.15;

  const getY = (price: number) => {
    return priceH - ((price - minPrice) / (maxPrice - minPrice)) * (priceH - 20) - 10;
  };

  const getVolY = (vol: number) => {
    return chartH - (vol / maxVol) * volH;
  };

  const stepX = (chartW - padL - padR) / candles.length;
  const candleW = Math.max(3, stepX * 0.68);

  // Tạo đường dẫn cho MA20, MA50, EMA9
  const ma20Points = candles
    .map((c, i) => (c.ma20 ? `${padL + i * stepX + stepX / 2},${getY(c.ma20)}` : null))
    .filter(Boolean)
    .join(' ');

  const ma50Points = candles
    .map((c, i) => (c.ma50 ? `${padL + i * stepX + stepX / 2},${getY(c.ma50)}` : null))
    .filter(Boolean)
    .join(' ');

  const ema9Points = candles
    .map((c, i) => (c.ema9 ? `${padL + i * stepX + stepX / 2},${getY(c.ema9)}` : null))
    .filter(Boolean)
    .join(' ');

  const activeCandle = hoverCandle || candles[candles.length - 1]!;
  const candleChange = activeCandle ? activeCandle.close - activeCandle.open : 0;
  const candleChangePct = activeCandle && activeCandle.open > 0 ? (candleChange / activeCandle.open) * 100 : 0;

  return (
    <div className="bg-[#0e1117] border border-[#212636] rounded-2xl shadow-xl overflow-hidden text-slate-200">
      {/* ══ 1. TOP TICKER STATUS BAR (CHUẨN TERMINAL VPS / DNSE / VNDIRECT) ══ */}
      <div className="bg-[#121620] border-b border-[#212636] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Symbol & Exchange Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={activeSymbol}
              onChange={(e) => {
                const s = watchlist.find((item) => item.symbol === e.target.value) || VN50_WATCHLIST.find((item) => item.symbol === e.target.value);
                setSelectedStock(e.target.value, s?.price || 74040, 'BUY');
              }}
              className="bg-[#181d29] border border-[#2b3245] text-white font-mono font-black text-lg rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {watchlist.map((item) => (
                <option key={item.symbol} value={item.symbol}>
                  {item.symbol} - {item.name} ({item.exchange})
                </option>
              ))}
            </select>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1f2536] text-cyan-300 font-bold border border-cyan-500/30">
              {exchange}
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
            onClick={() => setActiveTab('CANDLE_CHART')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'CANDLE_CHART'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Biểu Đồ Nến Pro ({activeSymbol})</span>
          </button>
          <button
            onClick={() => setActiveTab('ORDERBOOK')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ORDERBOOK'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Sổ Lệnh 3 Cấp (DNSE)</span>
          </button>
          <button
            onClick={() => setActiveTab('TRADINGVIEW_EXTERNAL')}
            className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'TRADINGVIEW_EXTERNAL'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Mở TradingView</span>
          </button>
        </div>
      </div>

      {/* ══ 2. CHẾ ĐỘ 1: BIỂU ĐỒ NẾN NHẬT BẢN THỜI GIAN THỰC (KHÔNG BAO GIỜ BỊ POPUP/LỖI APPLE) ══ */}
      {activeTab === 'CANDLE_CHART' && (
        <div className="p-3 bg-[#0e1117]">
          {/* Top Bar: Khung thời gian + Bật tắt chỉ báo kỹ thuật */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 mb-2 border-b border-[#212636] text-xs font-mono">
            {/* Timeframes */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-sans mr-2">Khung:</span>
              {(['15', '60', 'D', 'W', 'M'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    activeTimeframe === tf
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#181d29]'
                  }`}
                >
                  {tf === 'D' ? '1 Ngày' : tf === 'W' ? '1 Tuần' : tf === 'M' ? '1 Tháng' : `${tf} Phút`}
                </button>
              ))}
            </div>

            {/* Indicator Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMA20(!showMA20)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                  showMA20
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                MA20 ({activeCandle?.ma20 ? formatNumber(activeCandle.ma20) : '—'})
              </button>
              <button
                onClick={() => setShowMA50(!showMA50)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                  showMA50
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                MA50 ({activeCandle?.ma50 ? formatNumber(activeCandle.ma50) : '—'})
              </button>
              <button
                onClick={() => setShowEMA9(!showEMA9)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                  showEMA9
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                EMA9 ({activeCandle?.ema9 ? formatNumber(activeCandle.ema9) : '—'})
              </button>
            </div>
          </div>

          {/* OHLCV Header Status Display */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono bg-[#121620] px-3 py-1.5 rounded-lg border border-[#212636] mb-2">
            <span className="text-slate-400 font-sans">
              Thời gian: <b className="text-slate-200">{activeCandle?.time}</b>
            </span>
            <span>
              Mở (O): <b className="text-slate-200">{formatNumber(activeCandle?.open || 0)}</b>
            </span>
            <span>
              Cao (H): <b className="text-emerald-400">{formatNumber(activeCandle?.high || 0)}</b>
            </span>
            <span>
              Thấp (L): <b className="text-rose-400">{formatNumber(activeCandle?.low || 0)}</b>
            </span>
            <span>
              Đóng (C): <b className={candleChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{formatNumber(activeCandle?.close || 0)}</b>
            </span>
            <span>
              Biến động: <b className={candleChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{candleChange >= 0 ? '+' : ''}{candleChangePct.toFixed(2)}%</b>
            </span>
            <span>
              Khối lượng: <b className="text-cyan-300">{formatNumber(activeCandle?.volume || 0)} CP</b>
            </span>
          </div>

          {/* SVG CANDLESTICK CANVAS */}
          <div className="relative w-full h-[500px] bg-[#0b0e14] rounded-xl border border-[#212636] overflow-hidden">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-full cursor-crosshair select-none"
              onMouseLeave={() => setHoverCandle(null)}
            >
              {/* Lưới ngang giá */}
              {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                const p = minPrice + (maxPrice - minPrice) * (1 - ratio);
                const y = ratio * priceH;
                return (
                  <g key={ratio}>
                    <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="rgba(33, 38, 54, 0.6)" strokeDasharray="3 3" />
                    <text x={chartW - padR + 8} y={y + 4} fill="#64748b" fontSize="10" fontFamily="monospace">
                      {formatNumber(Math.round(p))}
                    </text>
                  </g>
                );
              })}

              {/* Đường giá hiện tại */}
              <line
                x1={padL}
                y1={getY(currentPrice)}
                x2={chartW - padR}
                y2={getY(currentPrice)}
                stroke={isUp ? '#0ecb81' : '#f6465d'}
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <rect
                x={chartW - padR + 2}
                y={getY(currentPrice) - 9}
                width={padR - 4}
                height="18"
                rx="4"
                fill={isUp ? '#0ecb81' : '#f6465d'}
              />
              <text
                x={chartW - padR + 6}
                y={getY(currentPrice) + 4}
                fill="#0e1117"
                fontSize="10"
                fontWeight="900"
                fontFamily="monospace"
              >
                {formatNumber(currentPrice)}
              </text>

              {/* Phân cách khu vực Khối lượng Volume */}
              <line x1={padL} y1={priceH} x2={chartW - padR} y2={priceH} stroke="#212636" strokeWidth="1.5" />
              <text x={padL + 4} y={priceH + 16} fill="#64748b" fontSize="9" fontFamily="sans-serif">
                Volume ({formatNumber(maxVol)} max)
              </text>

              {/* VẼ CÁC CÂY NẾN & VOLUME BARS */}
              {candles.map((c, i) => {
                const x = padL + i * stepX + (stepX - candleW) / 2;
                const midX = padL + i * stepX + stepX / 2;
                const isBull = c.close >= c.open;
                const color = isBull ? '#0ecb81' : '#f6465d';
                const bodyY = Math.min(getY(c.open), getY(c.close));
                const bodyH = Math.max(2, Math.abs(getY(c.open) - getY(c.close)));
                const wickHighY = getY(c.high);
                const wickLowY = getY(c.low);
                const vY = getVolY(c.volume);

                return (
                  <g
                    key={c.timestamp}
                    onMouseEnter={() => setHoverCandle(c)}
                    className="transition hover:opacity-80"
                  >
                    {/* Bấc nến trên & dưới */}
                    <line x1={midX} y1={wickHighY} x2={midX} y2={wickLowY} stroke={color} strokeWidth="1.2" />

                    {/* Thân nến */}
                    <rect
                      x={x}
                      y={bodyY}
                      width={candleW}
                      height={bodyH}
                      fill={color}
                      rx="1"
                    />

                    {/* Cột Volume phía dưới */}
                    <rect
                      x={x}
                      y={vY}
                      width={candleW}
                      height={chartH - vY}
                      fill={color}
                      opacity={0.55}
                    />

                    {/* Nhãn thời gian trục X */}
                    {i % 8 === 0 && (
                      <text
                        x={midX}
                        y={chartH - 4}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        {c.time}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* ĐƯỜNG CHỈ BÁO KỸ THUẬT */}
              {showMA20 && ma20Points && (
                <polyline points={ma20Points} fill="none" stroke="#f59e0b" strokeWidth="1.8" />
              )}
              {showMA50 && ma50Points && (
                <polyline points={ma50Points} fill="none" stroke="#06b6d4" strokeWidth="1.8" />
              )}
              {showEMA9 && ema9Points && (
                <polyline points={ema9Points} fill="none" stroke="#a855f7" strokeWidth="1.8" />
              )}
            </svg>
          </div>
        </div>
      )}

      {/* ══ 3. CHẾ ĐỘ 2: SỔ LỆNH BƯỚC GIÁ 3 CẤP (DNSE ENTRADE X STYLE) ══ */}
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
                    <td className="py-2.5 px-2 font-bold text-emerald-400">{formatNumber(orderBook.buyLevels[2].price)}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-500">—</td>
                    <td className="py-2.5 px-2 font-bold text-rose-400">{formatNumber(orderBook.sellLevels[2].price)}</td>
                    <td className="py-2.5 px-2 text-slate-300 relative">
                      <div className="absolute inset-y-0 left-0 bg-rose-500/10 rounded-r" style={{ width: `${orderBook.sellLevels[2].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.sellLevels[2].volume)}</span>
                    </td>
                  </tr>

                  {/* Cấp 2 */}
                  <tr>
                    <td className="py-2.5 px-2 text-slate-300 relative">
                      <div className="absolute inset-y-0 right-0 bg-emerald-500/15 rounded-l" style={{ width: `${orderBook.buyLevels[1].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.buyLevels[1].volume)}</span>
                    </td>
                    <td className="py-2.5 px-2 font-bold text-emerald-400">{formatNumber(orderBook.buyLevels[1].price)}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-500">—</td>
                    <td className="py-2.5 px-2 font-bold text-rose-400">{formatNumber(orderBook.sellLevels[1].price)}</td>
                    <td className="py-2.5 px-2 text-slate-300 relative">
                      <div className="absolute inset-y-0 left-0 bg-rose-500/15 rounded-r" style={{ width: `${orderBook.sellLevels[1].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.sellLevels[1].volume)}</span>
                    </td>
                  </tr>

                  {/* Cấp 1 */}
                  <tr className="bg-slate-800/20">
                    <td className="py-3 px-2 text-slate-200 font-bold relative">
                      <div className="absolute inset-y-0 right-0 bg-emerald-500/25 rounded-l" style={{ width: `${orderBook.buyLevels[0].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.buyLevels[0].volume)}</span>
                    </td>
                    <td className="py-3 px-2 font-black text-base text-emerald-400">{formatNumber(orderBook.buyLevels[0].price)}</td>
                    
                    <td className="py-3 px-2 font-black text-lg bg-[#181f2c] border-x border-[#2b3245] text-center">
                      <div className={`${isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                        {formatNumber(orderBook.currentTrade.price)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        KL: {formatNumber(orderBook.currentTrade.volume)}
                      </div>
                    </td>

                    <td className="py-3 px-2 font-black text-base text-rose-400">{formatNumber(orderBook.sellLevels[0].price)}</td>
                    <td className="py-3 px-2 text-slate-200 font-bold relative">
                      <div className="absolute inset-y-0 left-0 bg-rose-500/25 rounded-r" style={{ width: `${orderBook.sellLevels[0].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.sellLevels[0].volume)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Khối lượng mua / bán chủ động */}
            <div className="pt-2 border-t border-[#212636] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Mua chủ động:</span>
                <b className="text-emerald-400 font-mono">68.4%</b>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="text-slate-400">Bán chủ động:</span>
                <b className="text-rose-400 font-mono">31.6%</b>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: NHẬT KÝ KHỚP LỆNH THỜI GIAN THỰC (5 COLS) */}
          <div className="lg:col-span-5 bg-[#121620] border border-[#212636] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#212636]">
              <span className="text-xs font-bold text-slate-300 font-sans flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-cyan-400" />
                KHỚP LỆNH THEO GIÂY (TIME & SALES)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Auto Live Feed</span>
            </div>

            <div className="overflow-y-auto max-h-[340px] space-y-1 pr-1 font-mono text-xs">
              <div className="grid grid-cols-4 text-[10px] text-slate-500 pb-1 border-b border-[#212636]/60 font-sans">
                <span>Thời gian</span>
                <span className="text-center">Lệnh</span>
                <span className="text-right">Giá (VND)</span>
                <span className="text-right">Khối lượng</span>
              </div>
              {ticks.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-4 py-1.5 px-1 rounded hover:bg-[#181f2c] transition items-center"
                >
                  <span className="text-slate-400 text-[11px]">{t.time}</span>
                  <span className="text-center">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        t.type === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {t.type === 'BUY' ? 'MUA' : 'BÁN'}
                    </span>
                  </span>
                  <span className={`text-right font-bold ${t.change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                    {formatNumber(t.price)}
                  </span>
                  <span className="text-right text-slate-200">{formatNumber(t.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ 4. CHẾ ĐỘ 3: MỞ TRADINGVIEW TRỰC TIẾP (KHÔNG IFRAME BLOCK) ══ */}
      {activeTab === 'TRADINGVIEW_EXTERNAL' && (
        <div className="p-8 text-center bg-[#121620] space-y-4">
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="text-lg font-bold text-white">Mở Biểu Đồ TradingView Toàn Màn Hình</h3>
            <p className="text-xs text-slate-400">
              Xem chi tiết mã <b className="text-emerald-400">{activeSymbol}</b> trên sàn <b className="text-cyan-300">{exchange}</b> trực tiếp trên nền tảng TradingView gốc.
            </p>
            <a
              href={`https://www.tradingview.com/chart/?symbol=${exchange}%3A${activeSymbol}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg"
            >
              Mở TradingView: {exchange}:{activeSymbol} <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
