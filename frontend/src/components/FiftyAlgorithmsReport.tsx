import React, { useState, useMemo } from 'react';
import {
  Cpu,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  BarChart3,
  Scale,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  LayoutGrid,
  ListFilter,
  Sparkles
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { run150PredictionAlgorithms, AlgorithmResult, SignalType, AlgorithmCategory } from '../services/predictionEngine';

export const FiftyAlgorithmsReport: React.FC = () => {
  const { selectedSymbol, setSelectedStock, positions, watchlist } = useTradingStore();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  const activeSym = selectedSymbol || (positions.length > 0 ? positions[0].symbol : 'TPB');
  const foundStock = watchlist.find((s) => s.symbol === activeSym);
  const currentPos = positions.find((p) => p.symbol === activeSym);
  const currentPrice = currentPos?.market_price || foundStock?.price || 14450;

  const prediction = useMemo(() => {
    return run150PredictionAlgorithms(activeSym, currentPrice);
  }, [activeSym, currentPrice]);

  const categories: { key: string; name: string; count: number }[] = [
    { key: 'ALL', name: 'Tất Cả (150)', count: 150 },
    { key: 'TREND', name: '📈 Xu Hướng & MA', count: 20 },
    { key: 'MOMENTUM', name: '⚡ Động Lượng & Oscillators', count: 25 },
    { key: 'VOLATILITY', name: '🌊 Biến Động & Kênh Giá', count: 15 },
    { key: 'VOLUME', name: '💰 Dòng Tiền & Khối Lượng', count: 20 },
    { key: 'PRICE_ACTION', name: '🕯️ Price Action & Nến Nhật', count: 15 },
    { key: 'PIVOT', name: '🎯 Điểm Xoay & Fibonacci', count: 12 },
    { key: 'RISK', name: '🛡️ Quản Trị Rủi Ro & MPT', count: 15 },
    { key: 'VALUATION', name: '📊 Định Giá Cơ Bản', count: 12 },
    { key: 'FINANCIAL_HEALTH', name: '🏥 Sức Khỏe Tài Chính', count: 8 },
    { key: 'AI_ALPHA', name: '🤖 AI & Tín Hiệu Alpha', count: 8 },
  ];

  const filteredAlgos = prediction.algorithms.filter((algo) => {
    const matchCat = activeCategory === 'ALL' || algo.category === activeCategory;
    const matchSearch =
      algo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      algo.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      algo.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const getSignalBadge = (sig: SignalType) => {
    switch (sig) {
      case 'STRONG_BUY':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold font-mono">
            MUA MẠNH
          </span>
        );
      case 'BUY':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold font-mono">
            MUA
          </span>
        );
      case 'NEUTRAL':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold font-mono">
            TRUNG LẬP
          </span>
        );
      case 'SELL':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold font-mono">
            BÁN
          </span>
        );
      case 'STRONG_SELL':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold font-mono">
            BÁN MẠNH
          </span>
        );
    }
  };

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* ══ HEADER: CHỌN MÃ & TỔNG HỢP 150 THUẬT TOÁN ══ */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="h-7 w-7 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-sans">
                HỆ THỐNG 150 THUẬT TOÁN & MÔ HÌNH ĐỊNH LƯỢNG
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                150 MODELS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tổng hợp 10 nhóm: MA, Động lượng, Kênh giá, Dòng tiền lớn, Price Action, Fibo, Quản trị rủi ro MPT, Định giá, Sức khỏe tài chính & AI Alpha
            </p>
          </div>
        </div>

        {/* Stock Selector & View Switcher */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Chế độ xem: Thẻ / Bảng */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('CARDS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                viewMode === 'CARDS' ? 'bg-indigo-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Thẻ Trực Quan</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                viewMode === 'TABLE' ? 'bg-indigo-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Bảng Pro</span>
            </button>
          </div>

          <select
            value={activeSym}
            onChange={(e) => {
              const s = watchlist.find((item) => item.symbol === e.target.value);
              setSelectedStock(e.target.value, s?.price || 14450, 'BUY');
            }}
            className="bg-slate-950 border border-slate-700 text-white font-bold font-mono text-base rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer w-44"
          >
            {watchlist.map((item) => (
              <option key={item.symbol} value={item.symbol}>
                {item.symbol} - {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ══ BẢNG ĐỒNG THUẬN TỔNG HỢP (CONSENSUS GAUGE) ══ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Consensus Score Card */}
        <div className="md:col-span-4 p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 rounded-3xl border border-indigo-500/30 flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              ĐIỂM ĐỒNG THUẬN 150 THUẬT TOÁN
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                {prediction.overallScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100 Điểm</span>
              <div className="ml-auto">{getSignalBadge(prediction.consensusSignal)}</div>
            </div>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Mã <b>{prediction.symbol}</b> đạt mức đồng thuận <b>{prediction.overallScore}%</b> tích cực từ 150 mô hình định lượng đa lớp.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-slate-800 font-mono text-center text-xs">
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 block">Tín Hiệu Mua</span>
              <b className="text-base text-emerald-400 font-black">{prediction.buyCount}</b>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <span className="text-[10px] text-amber-400 block">Trung Lập</span>
              <b className="text-base text-amber-400 font-black">{prediction.neutralCount}</b>
            </div>
            <div className="p-2.5 bg-rose-500/10 rounded-2xl border border-rose-500/20">
              <span className="text-[10px] text-rose-400 block">Tín Hiệu Bán</span>
              <b className="text-base text-rose-400 font-black">{prediction.sellCount}</b>
            </div>
          </div>
        </div>

        {/* Forecast Targets Card */}
        <div className="md:col-span-8 p-5 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              MỤC TIÊU DỰ BÁO ĐỊNH LƯỢNG (ATR & FIBONACCI EXTENSION)
            </span>
            <span className="text-xs font-mono text-slate-400">
              Thị giá: <b className="text-white">{formatNumber(prediction.currentPrice)} đ</b>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-sans">Mục Tiêu 1 Tuần:</span>
              <span className="text-base font-bold text-emerald-400">{formatNumber(prediction.targetPrice1W)} đ</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">+4.50%</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-2xl border border-emerald-500/30">
              <span className="text-[11px] text-emerald-400 block font-sans font-bold">Mục Tiêu 1 Tháng (Hòa Vốn):</span>
              <span className="text-base font-bold text-emerald-300">{formatNumber(prediction.targetPrice1M)} đ</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">+{prediction.expectedGainPct}% (Hòa Vốn)</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-2xl border border-rose-500/30">
              <span className="text-[11px] text-rose-400 block font-sans font-bold">Cắt Lỗ Kỷ Luật (Stop Loss):</span>
              <span className="text-base font-bold text-rose-400">{formatNumber(prediction.stopLossPrice)} đ</span>
              <span className="text-[10px] text-rose-400 block mt-0.5">-{prediction.expectedRiskPct}%</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-2xl border border-indigo-500/30">
              <span className="text-[11px] text-indigo-400 block font-sans font-bold">Tỷ Lệ Lợi Nhuận / Rủi Ro:</span>
              <span className="text-base font-bold text-indigo-300">R:R = {prediction.riskRewardRatio}</span>
              <span className="text-[10px] text-indigo-400 block mt-0.5">Lãi tiềm năng gấp {prediction.riskRewardRatio}x</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>
              <b>Khuyến nghị thuật toán:</b> Tỷ lệ R:R = <b>{prediction.riskRewardRatio}</b> vượt ngưỡng an toàn chuẩn (&gt; 2.0). Phù hợp nắm giữ chờ phục hồi mục tiêu <b>{formatNumber(prediction.targetPrice1M)}đ</b>.
            </span>
          </div>
        </div>
      </div>

      {/* ══ BỘ LỌC 10 NHÓM CHỈ BÁO & THANH TÌM KIẾM ══ */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Categories Tab Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-2 rounded-2xl whitespace-nowrap transition font-medium ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-bold shadow-md shadow-indigo-500/25'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm thuật toán, công thức..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner"
            />
          </div>
        </div>

        {/* ══ HIỂN THỊ DẠNG THẺ TRỰC QUAN (CARDS VIEW - MOMO/SHOPEE STYLE) ══ */}
        {viewMode === 'CARDS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredAlgos.map((algo, index) => (
              <div
                key={algo.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/60 transition space-y-2.5 shadow-sm group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-slate-500 w-5 pt-0.5">#{index + 1}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                        {algo.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-sans">{algo.categoryName}</span>
                    </div>
                  </div>
                  <div>{getSignalBadge(algo.signal)}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block font-sans">Giá trị tính toán:</span>
                  <b className="text-slate-200 text-sm">{algo.valueDisplay}</b>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Độ tin cậy:</span>
                    <b className="text-indigo-400">{algo.confidence}%</b>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                      style={{ width: `${algo.confidence}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1 border-t border-slate-800/50">
                  {algo.explanation}
                </p>

                <div className="text-[10px] font-mono text-slate-500 bg-slate-900/50 p-2 rounded-xl border border-slate-800/50 overflow-x-auto">
                  <code>{algo.formula}</code>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ HIỂN THỊ DẠNG BẢNG CHUYÊN SÂU (PRO TABLE VIEW) ══ */}
        {viewMode === 'TABLE' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800/80 max-h-[600px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-slate-950 z-10">
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-sans font-semibold">
                  <th className="py-3 px-4">Tên Thuật Toán ({filteredAlgos.length})</th>
                  <th className="py-3 px-3">Nhóm Chỉ Báo</th>
                  <th className="py-3 px-4">Giá Trị Tính Toán</th>
                  <th className="py-3 px-3 text-center">Tín Hiệu</th>
                  <th className="py-3 px-3 text-right">Độ Tin Cậy</th>
                  <th className="py-3 px-4 font-sans">Giải Thích Kỹ Thuật & Công Thức Toán</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredAlgos.map((algo, index) => (
                  <tr key={algo.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px] w-6">#{index + 1}</span>
                        <span className="text-white font-semibold font-sans">{algo.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-sans font-medium whitespace-nowrap">
                        {algo.categoryName}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-200">{algo.valueDisplay}</td>

                    <td className="py-3 px-3 text-center">{getSignalBadge(algo.signal)}</td>

                    <td className="py-3 px-3 text-right">
                      <span className="text-xs font-bold text-indigo-400">{algo.confidence}%</span>
                    </td>

                    <td className="py-3 px-4 font-sans text-xs text-slate-300">
                      <p>{algo.explanation}</p>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                        Công thức: <code className="text-indigo-300/80">{algo.formula}</code>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
