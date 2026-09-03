import React, { useState, useMemo } from 'react';
import {
  TOP_20_BANKS,
  TOP_10_FINTECH,
  BENCHMARK_RATES,
  calculateMacroStockValuation,
  type BankInterestRate,
  type EWalletFintechRate,
  type DepositTier,
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

import { useTradingStore } from '@/store/useTradingStore';

export default function MacroInterestRateEngine() {
  const { syncAllUnifiedData, isLiveSyncing } = useTradingStore();
  const [activeTab, setActiveTab] = useState<'BANKS' | 'FINTECH' | 'VALUATION' | 'MARGIN_OPTIMIZER'>('BANKS');
  const [bankFilter, setBankFilter] = useState<'ALL' | 'BIG4' | 'TMCP_TOP1' | 'TMCP_MID'>('ALL');
  const [bankSubTab, setBankSubTab] = useState<'DEPOSIT' | 'LENDING' | 'SIMULATOR'>('DEPOSIT');
  const [depositTerm, setDepositTerm] = useState<'KKH' | '1M' | '3M' | '6M' | '9M' | '12M' | '18M' | '24M' | '36M'>('12M');
  const [depositTier, setDepositTier] = useState<DepositTier>('ONLINE');
  const [simAmount, setSimAmount] = useState<number>(500000000); // 500 triệu VND
  const [searchKeyword, setSearchKeyword] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  });

  const handleRefreshRates = async () => {
    await syncAllUnifiedData();
    const now = new Date();
    setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`);
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  // Sample stocks for Macro Valuation Matrix
  const sampleStocks = [
    { symbol: 'TPB', pe: 5.3, pb: 0.95, roe: 17.5, price: 14450, eps: 2720, consensusScore: 95 },
    { symbol: 'ACB', pe: 6.4, pb: 1.2, roe: 21.0, price: 24800, eps: 3875, consensusScore: 92 },
    { symbol: 'MBB', pe: 5.9, pb: 1.15, roe: 22.5, price: 23500, eps: 3980, consensusScore: 95 },
    { symbol: 'HPG', pe: 11.2, pb: 1.45, roe: 14.8, price: 29200, eps: 2607, consensusScore: 89 },
    { symbol: 'FPT', pe: 21.5, pb: 4.8, roe: 28.5, price: 132000, eps: 6140, consensusScore: 96 },
    { symbol: 'VCB', pe: 13.8, pb: 2.7, roe: 20.2, price: 91500, eps: 6630, consensusScore: 88 },
  ];

  // Custom calculator state
  const [calcStock, setCalcStock] = useState({
    symbol: 'TPB',
    pe: 5.3,
    pb: 0.95,
    roe: 17.5,
    price: 14450,
    eps: 2720,
    consensusScore: 95,
  });

  const customValuation = useMemo(() => {
    return calculateMacroStockValuation(calcStock);
  }, [calcStock]);

  const filteredBanks = useMemo(() => {
    return TOP_20_BANKS.filter((b) => {
      const matchGroup = bankFilter === 'ALL' || b.group === bankFilter;
      const matchSearch =
        b.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        b.shortName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        b.id.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchGroup && matchSearch;
    });
  }, [bankFilter, searchKeyword]);

  const filteredFintech = useMemo(() => {
    return TOP_10_FINTECH.filter((f) => {
      return (
        f.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        f.provider.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        f.feature.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    });
  }, [searchKeyword]);

  return (
    <div className="bg-the/95 border border-vien rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl mb-8">
      {/* ── HEADER & BENCHMARK SUMMARY ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-vien">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-the border border-vien rounded-xl text-tot">
              <Landmark size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-chu flex items-center gap-2">
                Hệ Thống Lãi Suất Vĩ Mô & 150 Thuật Toán Định Giá Cổ Phiếu
                <span className="text-xs px-2 py-0.5 rounded-full bg-tot-nen text-tot font-mono border border-vien">
                  MACRO QUANT 2026
                </span>
              </h2>
              <p className="text-xs text-chu-phu mt-0.5">
                Tổng hợp Top 20 Ngân Hàng Việt Nam • Top 10 Ví Điện Tử & App Vay Nợ • Tích Hợp Chi Phí Vốn WACC & ERP
              </p>
            </div>
          </div>
        </div>

        {/* ── BENCHMARK RADAR ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-the border border-vien rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-chu-phu uppercase font-semibold block">Lãi Tiết Kiệm 12M</span>
            <span className="text-base font-bold text-tot font-mono">{BENCHMARK_RATES.riskFreeRate12M}%</span>
          </div>
          <div className="bg-the border border-vien rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-chu-phu uppercase font-semibold block">Lãi Vay DN Bình Quân</span>
            <span className="text-base font-bold text-canh-bao font-mono">{BENCHMARK_RATES.avgLendingRate}%</span>
          </div>
          <div className="bg-the border border-vien rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-chu-phu uppercase font-semibold block">Margin DNSE Gói Ưu Đãi</span>
            <span className="text-base font-bold text-nhan-chu font-mono">{BENCHMARK_RATES.dnseMarginRate}%</span>
          </div>
          <div className="bg-the border border-vien rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-chu-phu uppercase font-semibold block">Túi MoMo / ZaloPay</span>
            <span className="text-base font-bold text-nhan-chu font-mono">{BENCHMARK_RATES.overnightFintechYield}%</span>
          </div>
        </div>
      </div>

      {/* ── LIVE UPDATE & HOURLY MARKET STATUS BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 px-3 bg-the border border-vien rounded-xl text-xs mt-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tot opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tot"></span>
          </span>
          <span className="text-chu-phu font-medium">
            Thị trường liên ngân hàng & OMO NHNN: <b className="text-tot">Đang hoạt động</b>
          </span>
          <span className="text-chu-mo hidden md:inline">|</span>
          <span className="text-chu-phu hidden md:flex items-center gap-1 font-mono text-[11px]">
            <Clock size={12} className="text-nhan-chu" /> Cập nhật lúc: <b className="text-chu">{lastUpdated}</b>
          </span>
        </div>

        <button
          onClick={handleRefreshRates}
          disabled={isLiveSyncing}
          className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-tot-nen hover:bg-tot-nen text-tot border border-vien text-xs font-bold transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={12} className={isLiveSyncing ? 'animate-spin' : ''} />
          <span>{isLiveSyncing ? 'Đang đồng bộ toàn diện...' : 'Đồng Bộ Toàn Diện'}</span>
        </button>
      </div>

      {/* ── NAV TABS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 pb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('BANKS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'BANKS'
                ? 'bg-tot text-tren-nhan shadow-lg shadow-md'
                : 'bg-the text-chu-phu hover:text-chu border border-vien'
            }`}
          >
            <Landmark size={14} /> Top 20 Ngân Hàng VN
          </button>
          <button
            onClick={() => setActiveTab('FINTECH')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'FINTECH'
                ? 'bg-nhan text-tren-nhan shadow-lg shadow-md'
                : 'bg-the text-chu-phu hover:text-chu border border-vien'
            }`}
          >
            <Wallet size={14} /> Top 10 Ví Điện Tử & App Vay
          </button>
          <button
            onClick={() => setActiveTab('VALUATION')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'VALUATION'
                ? 'bg-nhan text-tren-nhan shadow-lg shadow-md'
                : 'bg-the text-chu-phu hover:text-chu border border-vien'
            }`}
          >
            <Calculator size={14} /> Định Giá & 150 Thuật Toán
          </button>
          <button
            onClick={() => setActiveTab('MARGIN_OPTIMIZER')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'MARGIN_OPTIMIZER'
                ? 'bg-canh-bao text-tren-nhan shadow-lg shadow-md'
                : 'bg-the text-chu-phu hover:text-chu border border-vien'
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
            className="w-full bg-the border border-vien rounded-lg px-3 py-1.5 text-xs text-chu focus:outline-none focus:border-nhan-chu"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: TOP 20 NGÂN HÀNG VIỆT NAM (TIỀN GỬI, CHO VAY, MÁY TÍNH LÃI)
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'BANKS' && (
        <div className="mt-3 space-y-4">
          {/* Sub Controls: Chuyển đổi giữa 3 chế độ xem */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-the p-2.5 rounded-xl border border-vien">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setBankSubTab('DEPOSIT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  bankSubTab === 'DEPOSIT'
                    ? 'bg-tot text-tren-nhan shadow-md shadow-md'
                    : 'text-chu-phu hover:text-chu'
                }`}
              >
                📊 Tiền Gửi Theo Kỳ Hạn Tháng
              </button>
              <button
                onClick={() => setBankSubTab('LENDING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  bankSubTab === 'LENDING'
                    ? 'bg-canh-bao text-tren-nhan shadow-md shadow-md'
                    : 'text-chu-phu hover:text-chu'
                }`}
              >
                🏢 Lãi Suất Cho Vay & Thế Chấp
              </button>
              <button
                onClick={() => setBankSubTab('SIMULATOR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  bankSubTab === 'SIMULATOR'
                    ? 'bg-nhan text-tren-nhan shadow-md shadow-md'
                    : 'text-chu-phu hover:text-chu'
                }`}
              >
                🧮 Máy Tính Tiền Lãi Theo Số Vốn
              </button>
            </div>

            {/* Sub filter NHÓM */}
            <div className="flex items-center gap-1.5">
              {(['ALL', 'BIG4', 'TMCP_TOP1', 'TMCP_MID'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setBankFilter(g)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                    bankFilter === g
                      ? 'bg-tot-nen text-tot border border-vien'
                      : 'bg-the text-chu-phu hover:text-chu border border-vien'
                  }`}
                >
                  {g === 'ALL' ? 'Tất cả' : g === 'BIG4' ? 'Big 4' : g === 'TMCP_TOP1' ? 'TMCP Top 1' : 'TMCP Mid'}
                </button>
              ))}
            </div>
          </div>

          {/* ── SUB TAB 1: BẢNG LÃI SUẤT TIỀN GỬI TOÀN BỘ KỲ HẠN THÁNG ── */}
          {bankSubTab === 'DEPOSIT' && (
            <div className="overflow-x-auto rounded-xl border border-vien">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-the text-chu-phu border-b border-vien font-sans font-semibold">
                    <th className="py-2.5 px-3">Ngân Hàng</th>
                    <th className="py-2.5 px-2 text-center">Nhóm</th>
                    <th className="py-2.5 px-2 text-right">KKH</th>
                    <th className="py-2.5 px-2 text-right">1T</th>
                    <th className="py-2.5 px-2 text-right">3T</th>
                    <th className="py-2.5 px-2 text-right">6T</th>
                    <th className="py-2.5 px-2 text-right">9T</th>
                    <th className="py-2.5 px-2 text-right text-tot font-bold bg-tot-nen">12T (Chuẩn)</th>
                    <th className="py-2.5 px-2 text-right">18T</th>
                    <th className="py-2.5 px-2 text-right">24T</th>
                    <th className="py-2.5 px-2 text-right">36T</th>
                    <th className="py-2.5 px-2 text-right text-nhan-chu">Online (+%)</th>
                    <th className="py-2.5 px-2 text-right text-nhan-chu">VIP &gt;5T (+%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vien">
                  {filteredBanks.map((b) => (
                    <tr key={b.id} className="hover:bg-the/60 transition-colors">
                      <td className="py-2 px-3 font-sans font-medium text-chu flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-the flex items-center justify-center text-[10px] font-bold text-nhan-chu">
                          {b.id.slice(0, 3)}
                        </span>
                        <div>
                          <div className="font-semibold text-chu">{b.name}</div>
                          <div className="text-[10px] text-chu-phu font-mono">{b.shortName}</div>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center font-sans">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          b.group === 'BIG4'
                            ? 'bg-loi-nen text-loi border border-vien'
                            : b.group === 'TMCP_TOP1'
                            ? 'bg-the2 text-nhan-chu border border-vien'
                            : 'bg-the2 text-chu-phu border border-vien-ro'
                        }`}>
                          {b.group}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right text-chu-phu">{b.depositKKH.toFixed(2)}%</td>
                      <td className="py-2 px-2 text-right text-chu-phu">{b.deposit1M.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-chu-phu">{b.deposit3M.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-chu-phu">{b.deposit6M.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-chu-phu">{b.deposit9M.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right font-black text-tot bg-tot-nen text-sm">
                        {b.deposit12M.toFixed(1)}%
                      </td>
                      <td className="py-2 px-2 text-right text-chu-phu">{b.deposit18M.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-chu-phu">{b.deposit24M.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-chu-phu">{b.deposit36M.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-nhan-chu font-semibold">+{b.onlineBonus}%</td>
                      <td className="py-2 px-2 text-right text-nhan-chu font-semibold">+{b.tierBonusOver5B}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── SUB TAB 2: BẢNG LÃI SUẤT CHO VAY (SXKD, MUA NHÀ, TÍN CHẤP, MARGIN) ── */}
          {bankSubTab === 'LENDING' && (
            <div className="overflow-x-auto rounded-xl border border-vien">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-the text-chu-phu border-b border-vien font-sans font-semibold">
                    <th className="py-2.5 px-3">Ngân Hàng</th>
                    <th className="py-2.5 px-2 text-center">Nhóm</th>
                    <th className="py-2.5 px-2 text-right text-tot">Vay SXKD Ngắn Hạn</th>
                    <th className="py-2.5 px-2 text-right text-tot">Vay SXKD Trung Dài Hạn</th>
                    <th className="py-2.5 px-2 text-right text-canh-bao font-bold">Vay Mua Nhà (Ưu Đãi Năm 1)</th>
                    <th className="py-2.5 px-2 text-right text-canh-bao">Vay Mua Nhà (Thả Nổi)</th>
                    <th className="py-2.5 px-2 text-right text-loi">Vay Tín Chấp / Thấu Chi</th>
                    <th className="py-2.5 px-2 text-right text-nhan-chu font-bold">Margin CTCK Trực Thuộc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vien">
                  {filteredBanks.map((b) => (
                    <tr key={b.id} className="hover:bg-the/60 transition-colors">
                      <td className="py-2 px-3 font-sans font-medium text-chu flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-the flex items-center justify-center text-[10px] font-bold text-nhan-chu">
                          {b.id.slice(0, 3)}
                        </span>
                        <div>
                          <div className="font-semibold text-chu">{b.name}</div>
                          <div className="text-[10px] text-chu-phu font-mono">{b.shortName}</div>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center font-sans">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          b.group === 'BIG4'
                            ? 'bg-loi-nen text-loi border border-vien'
                            : b.group === 'TMCP_TOP1'
                            ? 'bg-the2 text-nhan-chu border border-vien'
                            : 'bg-the2 text-chu-phu border border-vien-ro'
                        }`}>
                          {b.group}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right text-tot font-semibold">{b.loanBusinessShort.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-tot">{b.loanBusinessMid.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-canh-bao font-bold bg-canh-bao-nen">{b.loanMortgagePromo.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-canh-bao">{b.loanMortgageFloat.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-loi">{b.loanConsumerUnsecured.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right text-nhan-chu font-black">{b.marginRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── SUB TAB 3: MÁY TÍNH TIỀN LÃI THỰC TẾ THEO SỐ TIỀN & KỲ HẠN ── */}
          {bankSubTab === 'SIMULATOR' && (
            <div className="space-y-4">
              {/* Bộ điều khiển số tiền & kỳ hạn */}
              <div className="bg-the p-4 rounded-xl border border-vien space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-chu-phu font-medium block mb-1">
                      Số tiền gửi / ký gửi (VNĐ):
                    </label>
                    <input
                      type="number"
                      step="50000000"
                      min="0"
                      value={simAmount || ''}
                      onChange={(e) => setSimAmount(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full bg-the border border-vien rounded-lg px-3 py-2 text-chu font-mono font-bold text-sm focus:outline-none focus:border-nhan-chu"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[100000000, 500000000, 1000000000, 2000000000, 5000000000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setSimAmount(amt)}
                          className="px-2 py-0.5 rounded bg-the hover:bg-the text-[10px] font-mono text-nhan-chu transition"
                        >
                          {amt >= 1000000000 ? `${amt / 1000000000} Tỷ` : `${amt / 1000000} Tr`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-chu-phu font-medium block mb-1">
                      Kỳ hạn gửi:
                    </label>
                    <select
                      value={depositTerm}
                      onChange={(e) => setDepositTerm(e.target.value as any)}
                      className="w-full bg-the border border-vien rounded-lg px-3 py-2 text-chu font-mono font-bold text-sm focus:outline-none focus:border-nhan-chu"
                    >
                      <option value="KKH">Không kỳ hạn (Rút linh hoạt)</option>
                      <option value="1M">1 Tháng</option>
                      <option value="3M">3 Tháng</option>
                      <option value="6M">6 Tháng</option>
                      <option value="9M">9 Tháng</option>
                      <option value="12M">12 Tháng (Chuẩn 1 năm)</option>
                      <option value="18M">18 Tháng</option>
                      <option value="24M">24 Tháng (2 năm)</option>
                      <option value="36M">36 Tháng (3 năm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-chu-phu font-medium block mb-1">
                      Kênh gửi & Hạn mức khách hàng:
                    </label>
                    <select
                      value={depositTier}
                      onChange={(e) => setDepositTier(e.target.value as any)}
                      className="w-full bg-the border border-vien rounded-lg px-3 py-2 text-chu font-mono font-bold text-sm focus:outline-none focus:border-nhan-chu"
                    >
                      <option value="ONLINE">📱 Tiết kiệm Online (+0.2% - +0.35%)</option>
                      <option value="UNDER_1B">👤 Khách hàng chuẩn (&lt; 1 Tỷ)</option>
                      <option value="TIER_1B_5B">⭐ Khách hàng ưu tiên (1 - 5 Tỷ)</option>
                      <option value="OVER_5B">👑 Khách VIP / Private Banking (&gt; 5 Tỷ)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bảng tính toán tiền lãi thực tế */}
              <div className="overflow-x-auto rounded-xl border border-vien">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-the text-chu-phu border-b border-vien font-sans font-semibold">
                      <th className="py-2.5 px-3">Ngân Hàng</th>
                      <th className="py-2.5 px-2 text-right">Lãi Suất Áp Dụng</th>
                      <th className="py-2.5 px-2 text-right text-tot font-bold">Tổng Tiền Lãi Nhận Được</th>
                      <th className="py-2.5 px-2 text-right text-nhan-chu">Tiền Lãi Mỗi Tháng</th>
                      <th className="py-2.5 px-2 text-center">Xếp Hạng Sinh Lời</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-vien">
                    {filteredBanks
                      .map((b) => {
                        let baseRate = b.deposit12M;
                        let months = 12;
                        switch (depositTerm) {
                          case 'KKH': baseRate = b.depositKKH; months = 1 / 30; break;
                          case '1M': baseRate = b.deposit1M; months = 1; break;
                          case '3M': baseRate = b.deposit3M; months = 3; break;
                          case '6M': baseRate = b.deposit6M; months = 6; break;
                          case '9M': baseRate = b.deposit9M; months = 9; break;
                          case '12M': baseRate = b.deposit12M; months = 12; break;
                          case '18M': baseRate = b.deposit18M; months = 18; break;
                          case '24M': baseRate = b.deposit24M; months = 24; break;
                          case '36M': baseRate = b.deposit36M; months = 36; break;
                        }
                        let bonus = 0;
                        if (depositTier === 'ONLINE') bonus = b.onlineBonus;
                        else if (depositTier === 'TIER_1B_5B') bonus = b.tierBonus1B_5B;
                        else if (depositTier === 'OVER_5B') bonus = b.tierBonusOver5B;

                        const finalRate = baseRate + bonus;
                        const tongLai = Math.round((simAmount * (finalRate / 100) * months) / 12);
                        const laiThang = Math.round(tongLai / Math.max(1, months));

                        return { bank: b, finalRate, tongLai, laiThang };
                      })
                      .sort((a, b) => b.tongLai - a.tongLai)
                      .map((item, idx) => (
                        <tr key={item.bank.id} className="hover:bg-the/60 transition-colors">
                          <td className="py-2.5 px-3 font-sans font-medium text-chu flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-the2 text-nhan-chu flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-chu">{item.bank.name}</span>
                            <span className="text-[10px] text-chu-phu font-mono">({item.bank.shortName})</span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-bold text-chu">
                            {item.finalRate.toFixed(2)}%/năm
                          </td>
                          <td className="py-2.5 px-2 text-right font-black text-tot text-sm bg-tot-nen">
                            +{formatVND(item.tongLai)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-bold text-nhan-chu">
                            +{formatVND(item.laiThang)}/tháng
                          </td>
                          <td className="py-2.5 px-2 text-center font-sans">
                            {idx < 3 ? (
                              <span className="px-2 py-0.5 rounded-full bg-tot-nen text-tot font-bold text-[10px] border border-vien">
                                🏆 Top {idx + 1} Cao Nhất
                              </span>
                            ) : (
                              <span className="text-chu-phu text-[10px]">Cạnh tranh</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: TOP 10 VÍ ĐIỆN TỬ, FINTECH & APP VAY
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'FINTECH' && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFintech.map((f) => (
            <div key={f.id} className="bg-the border border-vien rounded-xl p-4 hover:border-vien transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-the border border-vien flex items-center justify-center text-nhan-chu font-bold text-sm">
                      {f.id.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-chu">{f.name}</h4>
                      <p className="text-[11px] text-chu-phu">{f.provider}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    f.category === 'VI_DIEN_TU'
                      ? 'bg-loi-nen text-loi border border-vien'
                      : f.category === 'APP_TICH_LUY'
                      ? 'bg-tot-nen text-tot border border-vien'
                      : 'bg-canh-bao-nen text-canh-bao border border-vien'
                  }`}>
                    {f.category === 'VI_DIEN_TU' ? 'Ví Điện Tử' : f.category === 'APP_TICH_LUY' ? 'Tích Lũy Linh Hoạt' : 'Vay Tiêu Dùng'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 bg-the rounded-lg border border-vien font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-chu-phu block font-sans">Sinh Lời Theo Ngày:</span>
                    <span className="text-sm font-black text-tot">
                      {f.savingRateDay > 0 ? `${f.savingRateDay.toFixed(1)}%/năm` : 'Không hỗ trợ'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-chu-phu block font-sans">Lãi Vay / Trả Sau (BNPL):</span>
                    <span className="text-sm font-black text-loi">{f.borrowRate.toFixed(1)}%/năm</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-chu-phu font-sans">
                  <div>Hạn mức: <b className="text-chu font-mono">{formatVND(f.limitMax)}</b></div>
                  <div>Rút tiền: <b className="text-nhan-chu">{f.withdrawalSpeed}</b></div>
                </div>

                <p className="text-xs text-chu-phu mt-2 bg-the/80 p-2 rounded-lg border border-vien">
                  💡 <span className="font-semibold">{f.feature}</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-vien text-xs text-chu-phu">
                <span>Đánh giá cộng đồng: ⭐ <b className="text-canh-bao">{f.rating}/5.0</b></span>
                <span className="text-nhan-chu font-bold font-mono">T+0 TỨC THÌ</span>
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
          <div className="bg-the border border-vien rounded-xl p-3.5">
            <h4 className="text-xs font-bold text-nhan-chu flex items-center gap-1.5 uppercase">
              <Sparkles size={14} /> Công Thức Định Lượng Vĩ Mô: Equity Risk Premium (ERP)
            </h4>
            <p className="text-xs text-chu-phu mt-1 leading-relaxed">
              <span className="font-mono text-nhan-chu font-semibold">Equity Risk Premium (ERP) = Earning Yield (E/P = 1/PE) - Lãi Suất Tiền Gửi Benchmark 12M (5.15%)</span>.
              Khi ERP &gt; +3.0%, cổ phiếu có lợi suất sinh lời vượt trội so với gửi tiết kiệm ngân hàng &rarr; Kích hoạt vị thế <b className="text-tot">HOT BUY</b>!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top Sample Stocks */}
            <div className="lg:col-span-2 space-y-2.5">
              <h4 className="text-xs font-bold text-chu-phu uppercase">So Sánh Lợi Suất Cổ Phiếu vs Tiết Kiệm Ngân Hàng</h4>
              <div className="overflow-x-auto rounded-xl border border-vien">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-the text-chu-phu border-b border-vien font-sans">
                      <th className="py-2.5 px-3">Mã CP</th>
                      <th className="py-2.5 px-2 text-right">P/E</th>
                      <th className="py-2.5 px-2 text-right">Earning Yield (E/P)</th>
                      <th className="py-2.5 px-2 text-right text-tot">ERP (+/- vs 5.15%)</th>
                      <th className="py-2.5 px-2 text-right">Định Giá Hợp Lý</th>
                      <th className="py-2.5 px-2 text-center">Khuyến Nghị</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-vien">
                    {sampleStocks.map((s) => {
                      const v = calculateMacroStockValuation(s);
                      return (
                        <tr
                          key={s.symbol}
                          onClick={() => useTradingStore.getState().navigateToStock(s.symbol, 'MARKET')}
                          className="hover:bg-the/80 transition-colors cursor-pointer group"
                          title="Nhấn để xem Bảng giá & Biểu đồ nến kỹ thuật"
                        >
                          <td className="py-2 px-3 font-sans font-bold text-nhan-chu group-hover:text-tot flex items-center gap-1.5">
                            {s.symbol}
                            <span className="text-[10px] px-1.5 py-0.2 bg-the text-chu-phu rounded font-mono">{s.roe}% ROE</span>
                          </td>
                          <td className="py-2 px-2 text-right text-chu-phu">{s.pe}x</td>
                          <td className="py-2 px-2 text-right font-bold text-chu">{v.earningYield}%</td>
                          <td className="py-2 px-2 text-right font-bold text-tot bg-tot-nen">+{v.equityRiskPremium}%</td>
                          <td className="py-2 px-2 text-right text-canh-bao">{v.fairValue.toLocaleString()}đ</td>
                          <td className="py-2 px-2 text-center font-sans">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              v.macroVerdict === 'HOT_BUY'
                                ? 'bg-tot-nen text-tot border border-vien'
                                : v.macroVerdict === 'ACCUMULATE'
                                ? 'bg-the2 text-nhan-chu border border-vien'
                                : 'bg-the2 text-chu-phu border border-vien-ro'
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
            <div className="bg-the border border-vien rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-nhan-chu uppercase flex items-center gap-1.5 mb-3">
                  <Calculator size={14} /> Bộ Tính Định Giá Vĩ Mô Tức Thì
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="text-[10px] text-chu-phu block mb-0.5">Mã Cổ Phiếu:</label>
                    <input
                      type="text"
                      value={calcStock.symbol}
                      onChange={(e) => setCalcStock({ ...calcStock, symbol: e.target.value.toUpperCase() })}
                      className="w-full bg-the border border-vien rounded px-2 py-1 text-chu font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-chu-phu block mb-0.5">Thị Giá (VND):</label>
                      <input
                        type="number"
                        value={calcStock.price}
                        onChange={(e) => setCalcStock({ ...calcStock, price: Number(e.target.value) })}
                        className="w-full bg-the border border-vien rounded px-2 py-1 text-chu font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-chu-phu block mb-0.5">Chỉ số P/E:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={calcStock.pe}
                        onChange={(e) => setCalcStock({ ...calcStock, pe: Number(e.target.value) })}
                        className="w-full bg-the border border-vien rounded px-2 py-1 text-chu font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-chu-phu block mb-0.5">EPS (VND):</label>
                      <input
                        type="number"
                        value={calcStock.eps}
                        onChange={(e) => setCalcStock({ ...calcStock, eps: Number(e.target.value) })}
                        className="w-full bg-the border border-vien rounded px-2 py-1 text-chu font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-chu-phu block mb-0.5">ROE (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={calcStock.roe}
                        onChange={(e) => setCalcStock({ ...calcStock, roe: Number(e.target.value) })}
                        className="w-full bg-the border border-vien rounded px-2 py-1 text-chu font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-vien bg-the p-3 rounded-lg border border-vien space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-chu-phu">Lợi suất E/P:</span>
                  <span className="font-bold text-nhan-chu font-mono">{customValuation.earningYield}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chu-phu">Phần bù rủi ro (ERP):</span>
                  <span className="font-bold text-tot font-mono">+{customValuation.equityRiskPremium}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chu-phu">Định giá mục tiêu:</span>
                  <span className="font-bold text-canh-bao font-mono">{customValuation.fairValue.toLocaleString()}đ ({customValuation.upsidePct}%)</span>
                </div>
                <div className="mt-1 text-[11px] text-chu-phu bg-the p-1.5 rounded border border-vien">
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
          <div className="bg-the border border-vien rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-nhan-chu uppercase flex items-center gap-1.5">
              <Zap size={14} /> Chiến Lược Đòn Bẩy Margin DNSE (9.99%)
            </h4>
            <p className="text-xs text-chu-phu leading-relaxed">
              Khi lợi suất E/P của cổ phiếu ($14.7\%$) cao hơn lãi suất Margin DNSE ($9.99\%$), việc sử dụng đòn bẩy Margin đem lại <b>Lợi Nhuận Kép Dương (+4.71%)</b>.
            </p>
            <div className="space-y-2 bg-the p-3 rounded-lg border border-vien text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-chu-phu">Lãi Margin DNSE Entrade X:</span>
                <span className="text-nhan-chu font-bold">9.99%/năm (0.027%/ngày)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-chu-phu">Lãi Margin Trung bình CTCK:</span>
                <span className="text-chu-phu">11.5% - 13.5%/năm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-chu-phu">Tiết kiệm chi phí vay/năm:</span>
                <span className="text-tot font-bold">+1.51% - 3.51%</span>
              </div>
            </div>
          </div>

          <div className="bg-the border border-vien rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-nhan-chu uppercase flex items-center gap-1.5">
              <Wallet size={14} /> Tối Ưu Tiền Mặt Chờ Mua (Túi MoMo / Tikop)
            </h4>
            <p className="text-xs text-chu-phu leading-relaxed">
              Tiền mặt chưa giải ngân trong tài khoản chứng khoán (nhận lãi 0.1%/năm) có thể sinh lời tối ưu <b>4.8% - 6.2%/năm</b> khi tận dụng các hũ tích lũy linh hoạt rút tiền T+0 tức thì.
            </p>
            <div className="space-y-2 bg-the p-3 rounded-lg border border-vien text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-chu-phu">Lãi suất MoMo Túi Thần Tài:</span>
                <span className="text-nhan-chu font-bold">4.8%/năm (trả lãi mỗi ngày)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-chu-phu">Lãi suất Tikop / Finhay:</span>
                <span className="text-tot font-bold">5.8% - 6.2%/năm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-chu-phu">Khả dụng rút tiền mua CP:</span>
                <span className="text-nhan-chu font-bold">24/7 (Không mất lãi)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
