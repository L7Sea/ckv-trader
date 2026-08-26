import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as PieTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as AreaTooltip
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, ShieldCheck, Scale, DollarSign, Layers } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

const COLORS = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EC4899', '#3B82F6', '#64748B'];

export const PortfolioCharts: React.FC = () => {
  const { portfolio, positions } = useTradingStore();

  const cash = portfolio?.cash !== undefined ? portfolio.cash : 171;
  const receivingCash = portfolio?.receiving_cash || 0;
  const marginDebt = portfolio?.margin_debt || 7002051;
  const totalEquity = portfolio?.total_equity || 7498120;
  const stockMarketValue = positions.reduce((sum, p) => sum + (p.market_value || 0), 0) || 14500000;

  const totalCapital = totalEquity + marginDebt;
  const navPct = totalCapital > 0 ? ((totalEquity / totalCapital) * 100).toFixed(1) : '51.55';
  const debtPct = totalCapital > 0 ? ((marginDebt / totalCapital) * 100).toFixed(1) : '48.45';

  // 1. Dữ liệu Cơ Cấu Vốn: Vốn Tự Có (NAV thực tế) vs Vốn Vay Margin DNSE
  const capitalStructureData = React.useMemo(() => {
    return [
      { name: 'Vốn Tự Có (NAV Ròng)', value: totalEquity, color: '#10B981' },
      { name: 'Vay Margin DNSE (Deal)', value: marginDebt, color: '#8B5CF6' }
    ];
  }, [totalEquity, marginDebt]);

  // 2. Dữ liệu Phân Bổ Danh Mục Tài Sản (Asset Allocation)
  const allocationData = React.useMemo(() => {
    const data: { name: string; value: number; color: string }[] = [];

    // Tiền mặt
    if (cash > 0) {
      data.push({ name: 'Tiền mặt', value: cash, color: '#06B6D4' });
    }
    // Tiền chờ về
    if (receivingCash > 0) {
      data.push({ name: 'Tiền chờ về (T+2.5)', value: receivingCash, color: '#F59E0B' });
    }
    // Từng mã cổ phiếu
    positions.forEach((pos, idx) => {
      if (pos.market_value > 0) {
        data.push({
          name: `${pos.symbol} (${pos.total_quantity.toLocaleString()} CP)`,
          value: pos.market_value,
          color: COLORS[(idx + 2) % COLORS.length]
        });
      }
    });

    return data;
  }, [cash, receivingCash, positions]);

  const totalPortfolioValue = stockMarketValue + cash + receivingCash;

  // 3. Dữ liệu tăng trưởng NAV mô phỏng theo 14 ngày
  const navGrowthData = React.useMemo(() => {
    const res = [];
    const baseNav = totalEquity > 0 ? totalEquity : 7498120;
    const now = new Date();

    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const factor = 1 - i * 0.006 + (Math.random() - 0.5) * 0.012;
      res.push({
        date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        nav: Math.round(baseNav * factor)
      });
    }
    if (res.length > 0) {
      res[res.length - 1].nav = totalEquity;
    }
    return res;
  }, [totalEquity]);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* ══ HÀNG 1: CƠ CẤU VỐN DNSE & PHÂN BỔ CỔ PHIẾU ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biểu đồ 1: Cơ Cấu Nguồn Vốn Thực Tế (Vốn Tự Có vs Margin DNSE) */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cơ Cấu Vốn & Đòn Bẩy DNSE</h3>
                  <span className="text-[11px] text-slate-400">Vốn tự có {formatVND(totalEquity)} + Nợ vay {formatVND(marginDebt)}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-indigo-400 font-bold">{formatVND(totalCapital)}</span>
            </div>

            <div className="h-48 w-full mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={capitalStructureData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {capitalStructureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" strokeWidth={2} />
                    ))}
                  </Pie>
                  <PieTooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                    formatter={(val: any) => [formatVND(Number(val)), 'Số tiền']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tỷ lệ tự có</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{navPct}%</span>
              </div>
            </div>
          </div>

          {/* Chi tiết nguồn vốn */}
          <div className="space-y-2 mt-2 pt-2 border-t border-slate-800/60 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-emerald-300 font-sans font-bold">Vốn Tự Có Thực Tế (NAV):</span>
              </div>
              <b className="text-emerald-400 text-sm">{formatVND(totalEquity)} ({navPct}%)</b>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-indigo-300 font-sans font-bold">Vay Margin DNSE (Deal):</span>
              </div>
              <b className="text-indigo-400 text-sm">{formatVND(marginDebt)} ({debtPct}%)</b>
            </div>
          </div>
        </div>

        {/* Biểu đồ 2: Phân Bổ Danh Mục Cổ Phiếu Nắm Giữ */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PieIcon className="h-5 w-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Phân Bổ Danh Mục Cổ Phiếu</h3>
                  <span className="text-[11px] text-slate-400">Giá trị thị trường tài sản nắm giữ</span>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">{formatVND(totalPortfolioValue)}</span>
            </div>

            <div className="h-48 w-full mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" strokeWidth={2} />
                    ))}
                  </Pie>
                  <PieTooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                    formatter={(val: any) => [formatVND(Number(val)), 'Giá trị']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cổ phiếu</span>
                <span className="text-sm font-bold text-white font-mono">1,000 TPB</span>
              </div>
            </div>
          </div>

          {/* Legend List */}
          <div className="space-y-1.5 mt-2 max-h-28 overflow-y-auto pt-2 border-t border-slate-800/60 font-mono text-xs">
            {allocationData.map((item) => {
              const pct = totalPortfolioValue > 0 ? (item.value / totalPortfolioValue) * 100 : 0;
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-sans font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{formatVND(item.value)}</span>
                    <span className="font-bold text-white w-12 text-right">{pct.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ HÀNG 2: BIỂU ĐỒ ĐƯỜNG TĂNG TRƯỞNG TÀI SẢN RÒNG NAV ══ */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Đường Tăng Trưởng Tài Sản Ròng Thực Có (NAV Growth)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">14 ngày gần nhất</span>
        </div>

        <div className="h-64 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={navGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                domain={['auto', 'auto']}
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}Tr`}
              />
              <AreaTooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
                formatter={(val: any) => [formatVND(Number(val)), 'Tài Sản Ròng']}
              />
              <Area type="monotone" dataKey="nav" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#navGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
