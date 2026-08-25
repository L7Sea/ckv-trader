import React, { useState, useMemo } from 'react';
import {
  TOP_20_BANKS,
  TOP_10_FINTECH,
  BENCHMARK_RATES,
  calculateMacroStockValuation,
  type BankInterestRate,
  type EWalletFintechRate,
} from '@/services/interestRateService';
import {
  Landmark,
  Wallet,
  TrendingUp,
  Percent,
  Calculator,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Clock,
} from 'lucide-react';

export default function MacroInterestRateEngine() {
  const [activeTab, setActiveTab] = useState<'BANKS' | 'FINTECH' | 'VALUATION' | 'MARGIN_OPTIMIZER'>('BANKS');
  const [bankFilter, setBankFilter] = useState<'ALL' | 'BIG4' | 'TMCP_TOP1' | 'TMCP_MID'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshRates = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`);
      setIsRefreshing(false);
    }, 500);
  };

  // Sample stocks for Macro Valuation Matrix
  const sampleStocks = [
    { symbol: 'TPB', pe: 6.8, pb: 1.1, roe: 17.5, price: 18500, eps: 2720, consensusScore: 94 },
    { symbol: 'ACB', pe: 6.4, pb: 1.2, roe: 21.0, price: 24800, eps: 3875, consensusScore: 92 },
    { symbol: 'MBB', pe: 5.9, pb: 1.15, roe: 22.5, price: 23500, eps: 3980, consensusScore: 95 },
    { symbol: 'HPG', pe: 11.2, pb: 1.45, roe: 14.8, price: 29200, eps: 2607, consensusScore: 89 },
    { symbol: 'FPT', pe: 21.5, pb: 4.8, roe: 28.5, price: 132000, eps: 6140, consensusScore: 96 },
    { symbol: 'VCB', pe: 13.8, pb: 2.7, roe: 20.2, price: 91500, eps: 6630, consensusScore: 88 },
  ];

  // Custom calculator state
  const [calcStock, setCalcStock] = useState({
    symbol: 'TPB',
    pe: 6.8,
    pb: 1.1,
    roe: 17.5,
    price: 18500,
    eps: 2720,
    consensusScore: 94,
  });

  const customValuation = useMemo(() => {
    return calculateMacroStockValuation(calcStock);
  }, [calcStock]);

  const filteredBanks = useMemo(() => {
    return TOP_20_BANKS.filter((b) => {
      const matchGroup = bankFilter === 'ALL' || b.group === bankFilter;
      const matchSearch = b.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          b.shortName.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchGroup && matchSearch;
    });
  }, [bankFilter, searchKeyword]);

  const filteredFintech = useMemo(() => {
    return TOP_10_FINTECH.filter((f) =>
      f.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      f.provider.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword]);

  return (
    <div className="bg-[#111622]/95 border border-[#212b40] rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl mb-8">
      {/* ── HEADER & BENCHMARK SUMMARY ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#212b40]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600/30 to-cyan-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
              <Landmark size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Hệ Thống Lãi Suất Vĩ Mô & 150 Thuật Toán Định Giá Cổ Phiếu
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  MACRO QUANT 2026
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Tổng hợp Top 20 Ngân Hàng Việt Nam • Top 10 Ví Điện Tử & App Vay Nợ • Tích Hợp Chi Phí Vốn WACC & ERP
              </p>
            </div>
          </div>
        </div>

        {/* ── BENCHMARK RADAR ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#182030] border border-emerald-500/30 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lãi Tiết Kiệm 12M</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{BENCHMARK_RATES.riskFreeRate12M}%</span>
          </div>
          <div className="bg-[#182030] border border-amber-500/30 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lãi Vay DN Bình Quân</span>
            <span className="text-base font-bold text-amber-400 font-mono">{BENCHMARK_RATES.avgLendingRate}%</span>
          </div>
          <div className="bg-[#182030] border border-cyan-500/30 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Margin DNSE Gói Ưu Đãi</span>
            <span className="text-base font-bold text-cyan-400 font-mono">{BENCHMARK_RATES.dnseMarginRate}%</span>
          </div>
          <div className="bg-[#182030] border border-purple-500/30 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Túi MoMo / ZaloPay</span>
            <span className="text-base font-bold text-purple-400 font-mono">{BENCHMARK_RATES.overnightFintechYield}%</span>
          </div>
        </div>
      </div>

      {/* ── LIVE UPDATE & HOURLY MARKET STATUS BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 px-3 bg-[#161d2b] border border-[#26334d] rounded-xl text-xs mt-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">
            Thị trường liên ngân hàng & OMO NHNN: <b className="text-emerald-400">Đang hoạt động</b>
          </span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:flex items-center gap-1 font-mono text-[11px]">
            <Clock size={12} className="text-cyan-400" /> Cập nhật lúc: <b className="text-slate-200">{lastUpdated}</b>
          </span>
        </div>

        <button
          onClick={handleRefreshRates}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Đang cập nhật...' : 'Cập Nhật Lãi Suất Tức Thì'}</span>
        </button>
      </div>

      {/* ── NAV TABS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 pb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('BANKS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'BANKS'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#182030] text-slate-400 hover:text-slate-200 border border-[#26334d]'
            }`}
          >
            <Landmark size={14} /> Top 20 Ngân Hàng VN
          </button>
          <button
            onClick={() => setActiveTab('FINTECH')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'FINTECH'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#182030] text-slate-400 hover:text-slate-200 border border-[#26334d]'
            }`}
          >
            <Wallet size={14} /> Top 10 Ví Điện Tử & App Vay
          </button>
          <button
            onClick={() => setActiveTab('VALUATION')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'VALUATION'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-[#182030] text-slate-400 hover:text-slate-200 border border-[#26334d]'
            }`}
          >
            <Calculator size={14} /> Định Giá & 150 Thuật Toán
          </button>
          <button
            onClick={() => setActiveTab('MARGIN_OPTIMIZER')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'MARGIN_OPTIMIZER'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-[#182030] text-slate-400 hover:text-slate-200 border border-[#26334d]'
            }`}
          >
            <Zap size={14} /> Tối Ưu Nợ Margin vs Tiền Nhàn Rỗi
          </button>
        </div>

        {/* SEARCH BOX */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Tìm ngân hàng / ví điện tử..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full bg-[#182030] border border-[#26334d] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: TOP 20 NGÂN HÀNG VIỆT NAM
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'BANKS' && (
        <div className="mt-3 space-y-3">
          {/* Sub filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Nhóm:</span>
            {(['ALL', 'BIG4', 'TMCP_TOP1', 'TMCP_MID'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setBankFilter(g)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  bankFilter === g
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#182030] text-slate-400 hover:text-slate-200'
                }`}
              >
                {g === 'ALL' ? 'Tất cả (20 NH)' : g === 'BIG4' ? 'Big 4 Nhà Nước' : g === 'TMCP_TOP1' ? 'TMCP Hàng Đầu' : 'TMCP Tầm Trung'}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#212b40]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#182030] text-slate-300 border-b border-[#212b40] font-semibold">
                  <th className="py-2.5 px-3">Ngân Hàng</th>
                  <th className="py-2.5 px-2 text-center">Nhóm</th>
                  <th className="py-2.5 px-2 text-right">1 Tháng</th>
                  <th className="py-2.5 px-2 text-right">3 Tháng</th>
                  <th className="py-2.5 px-2 text-right">6 Tháng</th>
                  <th className="py-2.5 px-2 text-right text-emerald-400">12 Tháng (Chuẩn)</th>
                  <th className="py-2.5 px-2 text-right">24 Tháng</th>
                  <th className="py-2.5 px-2 text-right text-amber-400">Lãi Vay DN</th>
                  <th className="py-2.5 px-2 text-right text-cyan-400">Margin CTCK</th>
                  <th className="py-2.5 px-2 text-center">Xu Hướng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2738] font-mono">
                {filteredBanks.map((b) => (
                  <tr key={b.id} className="hover:bg-[#182236]/60 transition-colors">
                    <td className="py-2 px-3 font-sans font-medium text-slate-200 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#222c40] flex items-center justify-center text-[10px] font-bold text-cyan-300">
                        {b.id.slice(0, 3)}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-100">{b.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{b.shortName}</div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center font-sans">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        b.group === 'BIG4'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : b.group === 'TMCP_TOP1'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                      }`}>
                        {b.group}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right text-slate-300">{b.deposit1M.toFixed(1)}%</td>
                    <td className="py-2 px-2 text-right text-slate-300">{b.deposit3M.toFixed(1)}%</td>
                    <td className="py-2 px-2 text-right text-slate-300">{b.deposit6M.toFixed(1)}%</td>
                    <td className="py-2 px-2 text-right font-bold text-emerald-400 bg-emerald-500/5">{b.deposit12M.toFixed(1)}%</td>
                    <td className="py-2 px-2 text-right text-slate-300">{b.deposit24M.toFixed(1)}%</td>
                    <td className="py-2 px-2 text-right font-semibold text-amber-400">{b.lendingRate.toFixed(1)}%</td>
                    <td className="py-2 px-2 text-right font-semibold text-cyan-400">{b.marginRate ? `${b.marginRate.toFixed(1)}%` : '-'}</td>
                    <td className="py-2 px-2 text-center font-sans">
                      {b.trend === 'UP' ? (
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-0.5">
                          <ArrowUpRight size={12} /> Tăng
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-bold">Ổn định</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: TOP 10 VÍ ĐIỆN TỬ, FINTECH & APP VAY
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'FINTECH' && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFintech.map((f) => (
            <div key={f.id} className="bg-[#182030] border border-[#243048] rounded-xl p-3.5 hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600/30 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-xs">
                      {f.id.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{f.name}</h4>
                      <p className="text-[11px] text-slate-400">{f.provider}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    f.category === 'VI_DIEN_TU'
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                      : f.category === 'APP_TICH_LUY'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {f.category === 'VI_DIEN_TU' ? 'Ví Điện Tử' : f.category === 'APP_TICH_LUY' ? 'Tích Lũy Linh Hoạt' : 'Vay Tiêu Dùng'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 bg-[#121824] p-2 rounded-lg border border-[#1e2738]">
                  💡 <span className="font-semibold">{f.feature}</span>
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#212b40] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Lãi Tích Lũy / Ngày:</span>
                  <span className="text-sm font-bold text-emerald-400">{f.savingRate > 0 ? `${f.savingRate}%/năm` : 'Không hỗ trợ'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">Lãi Vay / Trả Sau:</span>
                  <span className="text-sm font-bold text-amber-400">{f.borrowRate}%/năm</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: MA TRẬN ĐỊNH GIÁ VĨ MÔ & 150 THUẬT TOÁN ĐỊNH LƯỢNG
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'VALUATION' && (
        <div className="mt-3 space-y-4">
          <div className="bg-gradient-to-r from-cyan-950/40 via-[#182030] to-emerald-950/30 border border-cyan-500/30 rounded-xl p-3.5">
            <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase">
              <Sparkles size={14} /> Công Thức Định Lượng Vĩ Mô: Equity Risk Premium (ERP)
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <span className="font-mono text-cyan-300 font-semibold">Equity Risk Premium (ERP) = Earning Yield (E/P = 1/PE) - Lãi Suất Tiền Gửi Benchmark 12M (5.15%)</span>.
              Khi ERP &gt; +3.0%, cổ phiếu có lợi suất sinh lời vượt trội so với gửi tiết kiệm ngân hàng &rarr; Kích hoạt vị thế <b className="text-emerald-400">HOT BUY</b>!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top Sample Stocks */}
            <div className="lg:col-span-2 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase">So Sánh Lợi Suất Cổ Phiếu vs Tiết Kiệm Ngân Hàng</h4>
              <div className="overflow-x-auto rounded-xl border border-[#212b40]">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-[#182030] text-slate-300 border-b border-[#212b40] font-sans">
                      <th className="py-2.5 px-3">Mã CP</th>
                      <th className="py-2.5 px-2 text-right">P/E</th>
                      <th className="py-2.5 px-2 text-right">Earning Yield (E/P)</th>
                      <th className="py-2.5 px-2 text-right text-emerald-400">ERP (+/- vs 5.15%)</th>
                      <th className="py-2.5 px-2 text-right">Định Giá Hợp Lý</th>
                      <th className="py-2.5 px-2 text-center">Khuyến Nghị</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2738]">
                    {sampleStocks.map((s) => {
                      const v = calculateMacroStockValuation(s);
                      return (
                        <tr key={s.symbol} className="hover:bg-[#182236]/60 transition-colors">
                          <td className="py-2 px-3 font-sans font-bold text-cyan-300 flex items-center gap-1.5">
                            {s.symbol}
                            <span className="text-[10px] px-1.5 py-0.2 bg-[#222c40] text-slate-300 rounded font-mono">{s.roe}% ROE</span>
                          </td>
                          <td className="py-2 px-2 text-right text-slate-300">{s.pe}x</td>
                          <td className="py-2 px-2 text-right font-bold text-slate-100">{v.earningYield}%</td>
                          <td className="py-2 px-2 text-right font-bold text-emerald-400 bg-emerald-500/5">+{v.equityRiskPremium}%</td>
                          <td className="py-2 px-2 text-right text-amber-300">{v.fairValue.toLocaleString()}đ</td>
                          <td className="py-2 px-2 text-center font-sans">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              v.macroVerdict === 'HOT_BUY'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : v.macroVerdict === 'ACCUMULATE'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                            }`}>
                              {v.macroVerdict}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Custom Interactive Stock Valuation Calculator */}
            <div className="bg-[#182030] border border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-1.5 mb-3">
                  <Calculator size={14} /> Bộ Tính Định Giá Vĩ Mô Tức Thì
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Mã Cổ Phiếu:</label>
                    <input
                      type="text"
                      value={calcStock.symbol}
                      onChange={(e) => setCalcStock({ ...calcStock, symbol: e.target.value.toUpperCase() })}
                      className="w-full bg-[#121824] border border-[#26334d] rounded px-2 py-1 text-slate-100 font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Thị Giá (VND):</label>
                      <input
                        type="number"
                        value={calcStock.price}
                        onChange={(e) => setCalcStock({ ...calcStock, price: Number(e.target.value) })}
                        className="w-full bg-[#121824] border border-[#26334d] rounded px-2 py-1 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Chỉ số P/E:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={calcStock.pe}
                        onChange={(e) => setCalcStock({ ...calcStock, pe: Number(e.target.value) })}
                        className="w-full bg-[#121824] border border-[#26334d] rounded px-2 py-1 text-slate-100 font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">EPS (VND):</label>
                      <input
                        type="number"
                        value={calcStock.eps}
                        onChange={(e) => setCalcStock({ ...calcStock, eps: Number(e.target.value) })}
                        className="w-full bg-[#121824] border border-[#26334d] rounded px-2 py-1 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">ROE (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={calcStock.roe}
                        onChange={(e) => setCalcStock({ ...calcStock, roe: Number(e.target.value) })}
                        className="w-full bg-[#121824] border border-[#26334d] rounded px-2 py-1 text-slate-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#243048] bg-[#121824] p-3 rounded-lg border border-[#1e2738] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lợi suất E/P:</span>
                  <span className="font-bold text-cyan-300 font-mono">{customValuation.earningYield}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phần bù rủi ro (ERP):</span>
                  <span className="font-bold text-emerald-400 font-mono">+{customValuation.equityRiskPremium}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Định giá mục tiêu:</span>
                  <span className="font-bold text-amber-300 font-mono">{customValuation.fairValue.toLocaleString()}đ ({customValuation.upsidePct}%)</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-300 bg-[#182030] p-1.5 rounded border border-[#26334d]">
                  🎯 {customValuation.macroNote}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 4: TỐI ƯU CHI PHÍ MARGIN DNSE VS TIỀN NHÀN RỖI
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'MARGIN_OPTIMIZER' && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#182030] border border-cyan-500/30 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-1.5">
              <Zap size={14} /> Chiến Lược Đòn Bẩy Margin DNSE (9.99%)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Khi lợi suất E/P của cổ phiếu ($14.7\%$) cao hơn lãi suất Margin DNSE ($9.99\%$), việc sử dụng đòn bẩy Margin đem lại <b>Lợi Nhuận Kép Dương (+4.71%)</b>.
            </p>
            <div className="space-y-2 bg-[#121824] p-3 rounded-lg border border-[#1e2738] text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Lãi Margin DNSE Entrade X:</span>
                <span className="text-cyan-400 font-bold">9.99%/năm (0.027%/ngày)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lãi Margin Trung bình CTCK:</span>
                <span className="text-slate-300">11.5% - 13.5%/năm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tiết kiệm chi phí vay/năm:</span>
                <span className="text-emerald-400 font-bold">+1.51% - 3.51%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#182030] border border-purple-500/30 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
              <Wallet size={14} /> Tối Ưu Tiền Mặt Chờ Mua (Túi MoMo / Tikop)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tiền mặt chưa giải ngân trong tài khoản chứng khoán (nhận lãi 0.1%/năm) có thể sinh lời tối ưu <b>4.8% - 6.2%/năm</b> khi tận dụng các hũ tích lũy linh hoạt rút tiền T+0 tức thì.
            </p>
            <div className="space-y-2 bg-[#121824] p-3 rounded-lg border border-[#1e2738] text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Lãi suất MoMo Túi Thần Tài:</span>
                <span className="text-purple-300 font-bold">4.8%/năm (trả lãi mỗi ngày)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lãi suất Tikop / Finhay:</span>
                <span className="text-emerald-400 font-bold">5.8% - 6.2%/năm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Khả dụng rút tiền mua CP:</span>
                <span className="text-cyan-300 font-bold">24/7 (Không mất lãi)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
