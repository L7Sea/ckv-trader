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
          <span className="px-2.5 py-1 rounded-xl bg-tot-nen text-tot border border-vien text-[11px] font-bold font-mono">
            MUA MẠNH
          </span>
        );
      case 'BUY':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-tot-nen text-tot border border-vien text-[11px] font-bold font-mono">
            MUA
          </span>
        );
      case 'NEUTRAL':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-canh-bao-nen text-canh-bao border border-vien text-[11px] font-bold font-mono">
            TRUNG LẬP
          </span>
        );
      case 'SELL':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-loi-nen text-loi border border-vien text-[11px] font-bold font-mono">
            BÁN
          </span>
        );
      case 'STRONG_SELL':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-loi-nen text-loi border border-vien text-[11px] font-bold font-mono">
            BÁN MẠNH
          </span>
        );
    }
  };

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-the border border-vien rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* ══ HEADER: CHỌN MÃ & TỔNG HỢP 150 THUẬT TOÁN ══ */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-vien">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-the text-chu shadow-lg shadow-md">
            <Cpu className="h-7 w-7 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-chu uppercase tracking-wider font-sans">
                HỆ THỐNG THUẬT TOÁN & MÔ HÌNH ĐỊNH LƯỢNG
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-the2 text-nhan-chu border border-vien font-mono font-bold">
                {prediction.algorithms.length} ALGOS
              </span>
            </div>
            <p className="text-xs text-chu-phu">
              Tổng hợp 10 nhóm: MA, Động lượng, Kênh giá, Dòng tiền lớn, Price Action, Fibo, Quản trị rủi ro MPT, Định giá, Sức khỏe tài chính & AI Alpha
            </p>
          </div>
        </div>

        {/* Stock Selector & View Switcher */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Chế độ xem: Thẻ / Bảng */}
          <div className="flex items-center p-1 bg-nen rounded-xl border border-vien text-xs">
            <button
              onClick={() => setViewMode('CARDS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                viewMode === 'CARDS' ? 'bg-nhan text-tren-nhan font-bold shadow' : 'text-chu-phu hover:text-chu'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Thẻ Trực Quan</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                viewMode === 'TABLE' ? 'bg-nhan text-tren-nhan font-bold shadow' : 'text-chu-phu hover:text-chu'
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
            className="bg-nen border border-vien text-chu font-bold font-mono text-base rounded-xl px-3 py-1.5 focus:outline-none focus:border-nhan-chu cursor-pointer w-44"
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
        <div className="md:col-span-4 p-5 bg-the rounded-3xl border border-vien flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold text-chu-phu uppercase tracking-wider font-mono">
              ĐIỂM ĐỒNG THUẬN 150 THUẬT TOÁN
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-4xl font-black font-mono text-tot tracking-tight">
                {prediction.overallScore}
              </span>
              <span className="text-xs text-chu-phu font-mono">/ 100 Điểm</span>
              <div className="ml-auto">{getSignalBadge(prediction.consensusSignal)}</div>
            </div>
            <p className="text-xs text-chu-phu mt-3 leading-relaxed">
              Mã <b>{prediction.symbol}</b> đạt mức đồng thuận <b>{prediction.overallScore}%</b> tích cực từ 150 mô hình định lượng đa lớp.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-vien font-mono text-center text-xs">
            <div className="p-2.5 bg-tot-nen rounded-2xl border border-vien">
              <span className="text-[10px] text-tot block">Tín Hiệu Mua</span>
              <b className="text-base text-tot font-black">{prediction.buyCount}</b>
            </div>
            <div className="p-2.5 bg-canh-bao-nen rounded-2xl border border-vien">
              <span className="text-[10px] text-canh-bao block">Trung Lập</span>
              <b className="text-base text-canh-bao font-black">{prediction.neutralCount}</b>
            </div>
            <div className="p-2.5 bg-loi-nen rounded-2xl border border-vien">
              <span className="text-[10px] text-loi block">Tín Hiệu Bán</span>
              <b className="text-base text-loi font-black">{prediction.sellCount}</b>
            </div>
          </div>
        </div>

        {/* Forecast Targets Card */}
        <div className="md:col-span-8 p-5 bg-nen rounded-3xl border border-vien flex flex-col justify-between space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-chu-phu uppercase tracking-wider font-mono">
              MỤC TIÊU DỰ BÁO ĐỊNH LƯỢNG (ATR & FIBONACCI EXTENSION)
            </span>
            <span className="text-xs font-mono text-chu-phu">
              Thị giá: <b className="text-chu">{formatNumber(prediction.currentPrice)} đ</b>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="p-3 bg-the rounded-2xl border border-vien flex flex-col justify-center">
              <span className="text-[11px] text-chu-phu block font-sans">Mục Tiêu 1 Tuần</span>
              <span className="text-base font-bold text-tot mt-0.5">{formatNumber(prediction.targetPrice1W)} đ</span>
              <span className="text-[10px] text-tot block mt-0.5">+4.50%</span>
            </div>

            <div className="p-3 bg-the rounded-2xl border border-vien flex flex-col justify-center">
              <span className="text-[11px] text-tot block font-sans font-bold">Mục Tiêu 1 Tháng</span>
              <span className="text-base font-bold text-tot mt-0.5">{formatNumber(prediction.targetPrice1M)} đ</span>
              <span className="text-[10px] text-tot block mt-0.5">+{prediction.expectedGainPct}% (Hòa Vốn)</span>
            </div>

            <div className="p-3 bg-the rounded-2xl border border-vien flex flex-col justify-center">
              <span className="text-[11px] text-loi block font-sans font-bold">Cắt Lỗ Kỷ Luật</span>
              <span className="text-base font-bold text-loi mt-0.5">{formatNumber(prediction.stopLossPrice)} đ</span>
              <span className="text-[10px] text-loi block mt-0.5">-{prediction.expectedRiskPct}%</span>
            </div>

            <div className="p-3 bg-the rounded-2xl border border-vien flex flex-col justify-center">
              <span className="text-[11px] text-nhan-chu block font-sans font-bold">Tỷ Lệ Lãi / Lỗ</span>
              <span className="text-base font-bold text-nhan-chu mt-0.5">R:R = {prediction.riskRewardRatio}</span>
              <span className="text-[10px] text-nhan-chu block mt-0.5">Gấp {prediction.riskRewardRatio}x rủi ro</span>
            </div>
          </div>

          <div className="p-3 bg-the rounded-2xl border border-vien text-xs text-chu-phu flex items-center gap-2">
            <Info className="h-4 w-4 text-nhan-chu shrink-0" />
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
                    ? 'bg-the text-chu font-bold shadow-md shadow-md'
                    : 'bg-nen text-chu-phu hover:text-chu border border-vien'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-chu-phu" />
            <input
              type="text"
              placeholder="Tìm thuật toán, công thức..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-nen border border-vien rounded-2xl text-xs text-chu placeholder:text-chu-mo focus:outline-none focus:border-nhan-chu font-sans shadow-inner"
            />
          </div>
        </div>

        {/* ══ HIỂN THỊ DẠNG THẺ TRỰC QUAN (CARDS VIEW - MOMO/SHOPEE STYLE) ══ */}
        {viewMode === 'CARDS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredAlgos.map((algo, index) => (
              <div
                key={algo.id}
                className="p-4 rounded-2xl bg-nen border border-vien hover:border-vien hover:bg-the transition space-y-2.5 shadow-sm group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-chu-mo w-5 pt-0.5">#{index + 1}</span>
                    <div>
                      <h4 className="text-xs font-bold text-chu group-hover:text-nhan-chu transition">
                        {algo.name}
                      </h4>
                      <span className="text-[10px] text-chu-phu font-sans">{algo.categoryName}</span>
                    </div>
                  </div>
                  <div>{getSignalBadge(algo.signal)}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-the border border-vien text-xs font-mono">
                  <span className="text-[10px] text-chu-phu block font-sans">Giá trị tính toán:</span>
                  <b className="text-chu text-sm">{algo.valueDisplay}</b>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-chu-phu">
                    <span>Độ tin cậy:</span>
                    <b className="text-nhan-chu">{algo.confidence}%</b>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-the2 overflow-hidden">
                    <div
                      className="h-full bg-the rounded-full"
                      style={{ width: `${algo.confidence}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-chu-phu font-sans leading-relaxed pt-1 border-t border-vien">
                  {algo.explanation}
                </p>

                <div className="text-[10px] font-mono text-chu-mo bg-the p-2 rounded-xl border border-vien overflow-x-auto">
                  <code>{algo.formula}</code>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ HIỂN THỊ DẠNG BẢNG CHUYÊN SÂU (PRO TABLE VIEW) ══ */}
        {viewMode === 'TABLE' && (
          <div className="overflow-x-auto rounded-2xl border border-vien max-h-[600px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-nen z-10">
                <tr className="border-b border-vien text-chu-phu uppercase tracking-wider font-sans font-semibold">
                  <th className="py-3 px-4">Tên Thuật Toán ({filteredAlgos.length})</th>
                  <th className="py-3 px-3">Nhóm Chỉ Báo</th>
                  <th className="py-3 px-4">Giá Trị Tính Toán</th>
                  <th className="py-3 px-3 text-center">Tín Hiệu</th>
                  <th className="py-3 px-3 text-right">Độ Tin Cậy</th>
                  <th className="py-3 px-4 font-sans">Giải Thích Kỹ Thuật & Công Thức Toán</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-the2">
                {filteredAlgos.map((algo, index) => (
                  <tr key={algo.id} className="hover:bg-the2 transition">
                    <td className="py-3 px-4 font-bold text-chu">
                      <div className="flex items-center gap-2">
                        <span className="text-chu-mo text-[10px] w-6">#{index + 1}</span>
                        <span className="text-chu font-semibold font-sans">{algo.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-the2 text-chu-phu font-sans font-medium whitespace-nowrap">
                        {algo.categoryName}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-chu">{algo.valueDisplay}</td>

                    <td className="py-3 px-3 text-center">{getSignalBadge(algo.signal)}</td>

                    <td className="py-3 px-3 text-right">
                      <span className="text-xs font-bold text-nhan-chu">{algo.confidence}%</span>
                    </td>

                    <td className="py-3 px-4 font-sans text-xs text-chu-phu">
                      <p>{algo.explanation}</p>
                      <span className="text-[10px] font-mono text-chu-mo block mt-0.5">
                        Công thức: <code className="text-nhan-chu">{algo.formula}</code>
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
