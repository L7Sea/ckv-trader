import React, { useState, useMemo } from 'react';
import {
  Newspaper,
  Building2,
  FileText,
  TrendingUp,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowUpRight,
  ShieldCheck,
  DollarSign,
  PieChart,
  ChevronRight
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { FULL_VN50_DATABASE } from './QuickRadarSearch';
import {
  DAILY_MARKET_NEWS,
  layThongTinDoanhNghiep,
  MarketNewsItem,
  CompanyIntelligenceProfile
} from '../services/marketIntelligenceService';

type SubTab = 'NEWS' | 'COMPANY_BCTC' | 'EXPERT_REPORTS';

export const MarketIntelligenceDashboard: React.FC = () => {
  const { selectedSymbol, setSelectedStock, watchlist } = useTradingStore();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('NEWS');
  const [newsCategory, setNewsCategory] = useState<string>('ALL');
  const [newsSearch, setNewsSearch] = useState<string>('');

  const activeSym = selectedSymbol || 'TPB';
  const foundStock = watchlist.find((s) => s.symbol === activeSym);
  const currentPrice = foundStock?.price || 14450;

  const companyProfile: CompanyIntelligenceProfile = useMemo(() => {
    return layThongTinDoanhNghiep(activeSym, currentPrice);
  }, [activeSym, currentPrice]);

  const filteredNews = DAILY_MARKET_NEWS.filter((item) => {
    const matchCat = newsCategory === 'ALL' || item.category === newsCategory;
    const matchSearch =
      item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(newsSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-6">
      {/* ══ HEADER: 3 TÍNH NĂNG THÔNG TIN TRỌNG YẾU ══ */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Newspaper className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-wider font-sans">
                TRUNG TÂM TIN TỨC, BÁO CÁO TÀI CHÍNH & KHUYẾN NGHỊ CHUYÊN GIA
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Đọc báo theo ngày · Báo cáo tài chính 4 quý gần nhất · Khuyến nghị chuyên gia SSI, VPS, HSC
            </p>
          </div>
        </div>

        {/* Stock Selector for Company & Reports */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Mã tra cứu:</span>
          <select
            value={activeSym}
            onChange={(e) => {
              const s = watchlist.find((item) => item.symbol === e.target.value);
              setSelectedStock(e.target.value, s?.price || 14450, 'BUY');
            }}
            className="bg-slate-950 border border-slate-700 text-white font-bold font-mono text-base rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer w-full lg:w-48"
          >
            {watchlist.map((item) => (
              <option key={item.symbol} value={item.symbol}>
                {item.symbol} - {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ══ 3 SUB TABS ══ */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('NEWS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'NEWS'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800'
          }`}
        >
          <Newspaper className="h-4 w-4" />
          <span>📰 ĐỌC BÁO & TIN TỨC THEO NGÀY</span>
        </button>

        <button
          onClick={() => setActiveSubTab('COMPANY_BCTC')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'COMPANY_BCTC'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>🏢 HỒ SƠ DOANH NGHIỆP & BCTC 4 QUÝ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('EXPERT_REPORTS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'EXPERT_REPORTS'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>🎯 BÁO CÁO KHUYẾN NGHỊ CHUYÊN GIA</span>
        </button>
      </div>

      {/* ═══════════════ SUB TAB 1: ĐỌC BÁO THEO NGÀY ═══════════════ */}
      {activeSubTab === 'NEWS' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {[
                { key: 'ALL', name: 'Tất Cả Tin Tức' },
                { key: 'MACRO', name: '🏛️ Vĩ Mô & Lãi Suất' },
                { key: 'CORPORATE', name: '🏢 Doanh Nghiệp' },
                { key: 'CONSENSUS', name: '📊 Nhận Định Thị Trường' }
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => setNewsCategory(c.key)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition font-medium ${
                    newsCategory === c.key
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm từ khóa, mã CP..."
                value={newsSearch}
                onChange={(e) => setNewsSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          {/* News Feed List */}
          <div className="space-y-3">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold text-[10px]">
                      {news.source}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {news.time} · {news.date}
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                    TÍCH CỰC
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                  {news.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{news.summary}</p>

                <div className="flex items-center gap-1.5 pt-1">
                  {news.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => {
                        const found = watchlist.find((s) => s.symbol === tag);
                        if (found) {
                          setSelectedStock(tag, found.price, 'BUY');
                        }
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 font-mono hover:text-cyan-300 hover:border-cyan-500/40 cursor-pointer transition"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ SUB TAB 2: HỒ SƠ DOANH NGHIỆP & BCTC 4 QUÝ ═══════════════ */}
      {activeSubTab === 'COMPANY_BCTC' && (
        <div className="space-y-5">
          {/* Company Header Card */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{companyProfile.companyName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold">
                    {companyProfile.symbol}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Ngành: <b>{companyProfile.industry}</b> · Chủ tịch: <b>{companyProfile.chairman}</b> · TGĐ: <b>{companyProfile.ceo}</b></p>
              </div>

              <div className="text-left sm:text-right font-mono text-xs">
                <span className="text-slate-400 block font-sans text-[11px]">Vốn hóa thị trường:</span>
                <span className="text-base font-bold text-white">{formatNumber(companyProfile.marketCap)} Tỷ VND</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans pt-2 border-t border-slate-900">
              {companyProfile.overview}
            </p>

            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-amber-300 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400 shrink-0" />
              <span><b>Lịch sử cổ tức:</b> {companyProfile.dividendHistory}</span>
            </div>
          </div>

          {/* Key Financial Metrics */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              CÁC CHỈ SỐ TÀI CHÍNH CỐT LÕI (TTM)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Định Giá P/E:</span>
                <span className="text-lg font-black text-emerald-400">{companyProfile.financialMetrics.pe}x</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Hấp dẫn</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Định Giá P/B:</span>
                <span className="text-lg font-black text-emerald-400">{companyProfile.financialMetrics.pb}x</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Biên an toàn cao</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Hiệu Suất ROE:</span>
                <span className="text-lg font-black text-cyan-400">{companyProfile.financialMetrics.roe}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Sinh lời vượt trội</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Giá Trị Sổ Sách (BVPS):</span>
                <span className="text-lg font-black text-indigo-400">{formatNumber(companyProfile.financialMetrics.bvps)} đ</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Tài sản ròng/CP</span>
              </div>
            </div>
          </div>

          {/* 4 Quarters Financial Statements Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              BÁO CÁO KẾT QUẢ KINH DOANH 4 QUÝ GẦN NHẤT
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-sans font-semibold">
                  <tr>
                    <th className="py-3 px-4">Kỳ Báo Cáo</th>
                    <th className="py-3 px-4 text-right">Doanh Thu (Tỷ đ)</th>
                    <th className="py-3 px-4 text-right text-emerald-400">Lợi Nhuận Sau Thuế (Tỷ đ)</th>
                    <th className="py-3 px-4 text-right">Tăng Trưởng YoY</th>
                    <th className="py-3 px-4 text-right">EPS Quý (đ)</th>
                    <th className="py-3 px-4 text-right">Biên Lãi Gộp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 bg-slate-950/60">
                  {companyProfile.quarterlyStatements.map((q) => (
                    <tr key={q.quarter} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-white font-mono">{q.quarter}</td>
                      <td className="py-3 px-4 text-right text-slate-200">{formatNumber(q.revenue)}</td>
                      <td className="py-3 px-4 text-right font-black text-emerald-400">{formatNumber(q.netProfit)}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">+{q.growthYoY}%</td>
                      <td className="py-3 px-4 text-right text-slate-300">{formatNumber(q.eps)}</td>
                      <td className="py-3 px-4 text-right text-slate-300">{q.grossMargin}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SUB TAB 3: BÁO CÁO KHUYẾN NGHỊ CỦA CHUYÊN GIA ═══════════════ */}
      {activeSubTab === 'EXPERT_REPORTS' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Báo cáo phân tích chuyên sâu mã: <b className="text-white text-sm">{companyProfile.symbol}</b>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {companyProfile.expertReports.length} Báo Cáo Phân Tích
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyProfile.expertReports.map((rep, i) => (
              <div key={i} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-bold font-mono text-xs">
                        {rep.brokerage}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">{rep.date}</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
                      {rep.action}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Giá Mục Tiêu 12T:</span>
                      <span className="text-lg font-black text-emerald-400">{formatNumber(rep.targetPrice)} đ</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Tiềm Năng Tăng:</span>
                      <span className="text-lg font-black text-emerald-400">+{rep.upsidePct}%</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                      Luận Điểm Đầu Tư Cốt Lõi:
                    </h5>
                    <ul className="text-xs text-slate-300 space-y-1 font-sans">
                      {rep.keyCatalysts.map((cat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{cat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-rose-400 uppercase tracking-wider font-mono mb-1.5">
                      Rủi Ro Cần Lưu Ý:
                    </h5>
                    <ul className="text-xs text-slate-400 space-y-1 font-sans">
                      {rep.keyRisks.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStock(companyProfile.symbol, currentPrice, 'BUY')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20"
                >
                  Ghi Mua {companyProfile.symbol} Theo Khuyến Nghị
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
