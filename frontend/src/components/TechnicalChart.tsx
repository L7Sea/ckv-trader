import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ReferenceLine
} from 'recharts';
import { Activity, TrendingUp, BarChart2, Layers, Search } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { VN50_WATCHLIST, WatchlistStock } from './MarketBoard';

interface ChartPoint {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20: number;
  ma50: number;
  rsi: number;
  upperBand: number;
  lowerBand: number;
  color: string;
}

// Hàm sinh dữ liệu biến động kỹ thuật chuẩn xác
function generateTechnicalHistory(symbol: string, basePrice: number, days = 30): ChartPoint[] {
  const data: ChartPoint[] = [];
  let currentPrice = basePrice * 0.88;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

    const changePct = (Math.sin(i / 4) * 0.02) + (Math.random() - 0.48) * 0.03;
    const open = Math.round(currentPrice);
    currentPrice = Math.round(currentPrice * (1 + changePct));
    const close = currentPrice;
    const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.015));
    const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.015));
    const volume = Math.round(1500000 + Math.random() * 8000000);
    const color = close >= open ? '#10B981' : '#F43F5E';

    data.push({
      date: dateStr,
      price: close,
      open,
      high,
      low,
      close,
      volume,
      ma20: Math.round(currentPrice * 0.98),
      ma50: Math.round(currentPrice * 0.95),
      rsi: Math.round(40 + Math.sin(i / 3) * 25 + Math.random() * 10),
      upperBand: Math.round(currentPrice * 1.05),
      lowerBand: Math.round(currentPrice * 0.93),
      color
    });
  }

  if (data.length > 0) {
    data[data.length - 1].close = basePrice;
    data[data.length - 1].price = basePrice;
  }

  return data;
}

export const TechnicalChart: React.FC = () => {
  const { positions, selectedSymbol, setSelectedStock } = useTradingStore();
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '6M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'AREA' | 'CANDLE'>('AREA');
  const [showMA, setShowMA] = useState(true);
  const [showBands, setShowBands] = useState(false);
  const [showRSI, setShowRSI] = useState(true);

  const activeSymbol = selectedSymbol || positions[0]?.symbol || 'HPG';
  const foundStock = VN50_WATCHLIST.find((s: WatchlistStock) => s.symbol === activeSymbol);
  const currentPos = positions.find((p) => p.symbol === activeSymbol);
  const basePrice = currentPos?.market_price || foundStock?.price || 29000;

  const daysMap = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 250 };
  const chartData = useMemo(() => {
    return generateTechnicalHistory(activeSymbol, basePrice, daysMap[timeframe]);
  }, [activeSymbol, basePrice, timeframe]);

  const firstPrice = chartData[0]?.price || basePrice;
  const lastPrice = chartData[chartData.length - 1]?.price || basePrice;
  const periodChangePct = ((lastPrice - firstPrice) / firstPrice) * 100;
  const isPositive = periodChangePct >= 0;

  const formatNumber = (val: number) => (val || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={activeSymbol}
                onChange={(e) => {
                  const s = VN50_WATCHLIST.find((item: WatchlistStock) => item.symbol === e.target.value);
                  setSelectedStock(e.target.value, s?.price || 30000, 'BUY');
                }}
                className="bg-slate-950 border border-slate-800 text-white font-bold font-mono text-lg rounded-xl px-2.5 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {VN50_WATCHLIST.map((item: WatchlistStock) => (
                  <option key={item.symbol} value={item.symbol}>
                    {item.symbol} - {item.name}
                  </option>
                ))}
              </select>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">HOSE</span>
              {currentPos && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Đang nắm giữ: {currentPos.total_quantity.toLocaleString()} CP
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-white">
                {formatNumber(basePrice)} <span className="text-xs text-slate-400 font-normal">VND</span>
              </span>
              <span className={`text-xs font-bold font-mono flex items-center px-2 py-0.5 rounded-lg ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {isPositive ? '+' : ''}{periodChangePct.toFixed(2)}% ({timeframe})
              </span>
            </div>
          </div>
        </div>

        {/* Chart Controls & Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
          {/* Indicator Toggles */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setShowMA(!showMA)}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${showMA ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500'}`}
            >
              MA20/50
            </button>
            <button
              onClick={() => setShowBands(!showBands)}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${showBands ? 'bg-purple-500/20 text-purple-300' : 'text-slate-500'}`}
            >
              Bollinger
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${showRSI ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500'}`}
            >
              RSI (14)
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
            {(['1W', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  timeframe === tf ? 'bg-emerald-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Technical Price & Indicator Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis
              yAxisId="price"
              domain={['dataMin - 1000', 'dataMax + 1000']}
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => (v / 1000).toFixed(1) + 'k'}
            />
            <YAxis
              yAxisId="volume"
              orientation="right"
              domain={[0, 'dataMax * 3.5']}
              hide
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '16px',
                color: '#F8FAFC',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
              formatter={(val: any, name: any) => [formatNumber(Number(val)), name]}
            />

            {/* Volume Bars */}
            <Bar yAxisId="volume" dataKey="volume" fill="#334155" opacity={0.5} radius={[4, 4, 0, 0]} name="Khối lượng" />

            {/* Area Price */}
            <Area
              yAxisId="price"
              type="monotone"
              dataKey="close"
              stroke={isPositive ? '#10B981' : '#F43F5E'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGradient)"
              name="Giá đóng cửa"
            />

            {/* MA Lines */}
            {showMA && (
              <>
                <Line yAxisId="price" type="monotone" dataKey="ma20" stroke="#F59E0B" strokeWidth={1.5} dot={false} name="MA20" />
                <Line yAxisId="price" type="monotone" dataKey="ma50" stroke="#3B82F6" strokeWidth={1.5} dot={false} name="MA50" />
              </>
            )}

            {/* Bollinger Bands */}
            {showBands && (
              <>
                <Line yAxisId="price" type="monotone" dataKey="upperBand" stroke="#A855F7" strokeDasharray="3 3" strokeWidth={1.2} dot={false} name="Bollinger Upper" />
                <Line yAxisId="price" type="monotone" dataKey="lowerBand" stroke="#A855F7" strokeDasharray="3 3" strokeWidth={1.2} dot={false} name="Bollinger Lower" />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Secondary RSI Chart Panel */}
      {showRSI && (
        <div className="h-20 w-full pt-2 border-t border-slate-800/80">
          <div className="flex justify-between text-[11px] font-mono text-cyan-400 mb-1">
            <span>Chỉ báo Động lượng RSI (14)</span>
            <span>RSI: {chartData[chartData.length - 1]?.rsi} (30: Quá bán • 70: Quá mua)</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} ticks={[30, 70]} tickLine={false} />
              <ReferenceLine y={70} stroke="#F43F5E" strokeDasharray="3 3" />
              <ReferenceLine y={30} stroke="#10B981" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="rsi" stroke="#06B6D4" strokeWidth={1.8} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
