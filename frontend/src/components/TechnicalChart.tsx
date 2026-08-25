import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line
} from 'recharts';
import { Activity } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

interface ChartPoint {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20: number;
}

// Hàm sinh dữ liệu biến động giá mô phỏng kỹ thuật mượt mà cho từng mã chứng khoán
function generateStockHistory(symbol: string, basePrice: number, days = 30): ChartPoint[] {
  const data: ChartPoint[] = [];
  let currentPrice = basePrice * 0.9;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

    const changePct = (Math.random() - 0.48) * 0.035; // Dao động +-3.5%
    const open = Math.round(currentPrice);
    currentPrice = Math.round(currentPrice * (1 + changePct));
    const close = currentPrice;
    const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.015));
    const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.015));
    const volume = Math.round(500000 + Math.random() * 3500000);

    data.push({
      date: dateStr,
      price: close,
      open,
      high,
      low,
      close,
      volume,
      ma20: Math.round(currentPrice * (1 + (Math.random() - 0.5) * 0.01))
    });
  }

  // Đảm bảo điểm cuối cùng khớp với giá hiện tại
  if (data.length > 0) {
    data[data.length - 1].close = basePrice;
    data[data.length - 1].price = basePrice;
  }

  return data;
}

export const TechnicalChart: React.FC = () => {
  const { positions, selectedSymbol, setSelectedStock } = useTradingStore();
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '1Y'>('1M');

  const activeSymbol = selectedSymbol || positions[0]?.symbol || 'HPG';
  const currentPos = positions.find((p) => p.symbol === activeSymbol);
  const basePrice = currentPos?.market_price || 29000;

  const daysMap = { '1W': 7, '1M': 30, '3M': 90, '1Y': 250 };
  const chartData = React.useMemo(() => {
    return generateStockHistory(activeSymbol, basePrice, daysMap[timeframe]);
  }, [activeSymbol, basePrice, timeframe]);

  const firstPrice = chartData[0]?.price || basePrice;
  const lastPrice = chartData[chartData.length - 1]?.price || basePrice;
  const periodChangePct = ((lastPrice - firstPrice) / firstPrice) * 100;
  const isPositive = periodChangePct >= 0;

  const formatNumber = (val: number) => (val || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-mono text-white tracking-tight">{activeSymbol}</h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">HOSE</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold font-mono text-white">{formatNumber(lastPrice)} đ</span>
              <span
                className={`inline-flex items-center text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                  isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {isPositive ? '+' : ''}{periodChangePct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe & Chart Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Chọn khung thời gian */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono font-semibold">
            {(['1W', '1M', '3M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  timeframe === tf ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedStock(activeSymbol, lastPrice, 'BUY')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            Đặt Lệnh {activeSymbol}
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#F8FAFC',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
              formatter={(val: any, name: any) => {
                if (name === 'price') return [`${formatNumber(Number(val))} đ`, 'Giá Đóng Cửa'];
                if (name === 'ma20') return [`${formatNumber(Number(val))} đ`, 'Đường MA20'];
                if (name === 'volume') return [Number(val).toLocaleString(), 'Khối lượng'];
                return [val, name || ''];
              }}
            />

            {/* Volume Bar */}
            <Bar dataKey="volume" yAxisId={0} fill="#334155" opacity={0.3} radius={[4, 4, 0, 0]} />

            {/* Area Price */}
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10B981' : '#EF4444'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />

            {/* MA20 Line */}
            <Line type="monotone" dataKey="ma20" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
        <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-slate-500 block text-[10px]">ĐỈNH KỲ ({timeframe})</span>
          <span className="font-bold text-slate-200">{formatNumber(Math.max(...chartData.map((d) => d.high)))} đ</span>
        </div>
        <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-slate-500 block text-[10px]">ĐÁY KỲ ({timeframe})</span>
          <span className="font-bold text-slate-200">{formatNumber(Math.min(...chartData.map((d) => d.low)))} đ</span>
        </div>
        <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-slate-500 block text-[10px]">KLGD TRUNG BÌNH</span>
          <span className="font-bold text-slate-200">
            {formatNumber(Math.round(chartData.reduce((s, d) => s + d.volume, 0) / chartData.length))} CP
          </span>
        </div>
        <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-slate-500 block text-[10px]">CHỈ SỐ RSI (14)</span>
          <span className="font-bold text-emerald-400">58.4 (Vùng Tích Luỹ)</span>
        </div>
      </div>
    </div>
  );
};
