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
    <div className="bg-the border border-vien rounded-3xl p-5 shadow-sm space-y-6">
      {/* ══ HEADER: 3 TÍNH NĂNG THÔNG TIN TRỌNG YẾU ══ */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-vien">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-the2 text-nhan-chu border border-vien">
            <Newspaper className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-chu uppercase tracking-wider font-sans">
                TRUNG TÂM TIN TỨC, BÁO CÁO TÀI CHÍNH & KHUYẾN NGHỊ CHUYÊN GIA
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-the2 text-nhan-chu border border-vien font-mono font-bold">
                INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-chu-phu">
              Đọc báo theo ngày · Báo cáo tài chính 4 quý gần nhất · Khuyến nghị chuyên gia SSI, VPS, HSC
            </p>
          </div>
        </div>

        {/* Stock Selector for Company & Reports */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <span className="text-xs text-chu-phu whitespace-nowrap">Mã tra cứu:</span>
          <select
            value={activeSym}
            onChange={(e) => {
              const s = watchlist.find((item) => item.symbol === e.target.value);
              setSelectedStock(e.target.value, s?.price || 14450, 'BUY');
            }}
            className="bg-nen border border-vien text-chu font-bold font-mono text-base rounded-xl px-3 py-1.5 focus:outline-none focus:border-nhan-chu cursor-pointer w-full lg:w-48"
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
      <div className="flex items-center gap-2 border-b border-vien pb-2">
        <button
          onClick={() => setActiveSubTab('NEWS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'NEWS'
              ? 'bg-nhan text-tren-nhan shadow-md shadow-md'
              : 'text-chu-phu hover:text-chu bg-nen border border-vien'
          }`}
        >
          <Newspaper className="h-4 w-4" />
          <span>📰 ĐỌC BÁO & TIN TỨC THEO NGÀY</span>
        </button>

        <button
          onClick={() => setActiveSubTab('COMPANY_BCTC')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'COMPANY_BCTC'
              ? 'bg-nhan text-tren-nhan shadow-md shadow-md'
              : 'text-chu-phu hover:text-chu bg-nen border border-vien'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>🏢 HỒ SƠ DOANH NGHIỆP & BCTC 4 QUÝ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('EXPERT_REPORTS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'EXPERT_REPORTS'
              ? 'bg-nhan text-tren-nhan shadow-md shadow-md'
              : 'text-chu-phu hover:text-chu bg-nen border border-vien'
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
                      ? 'bg-nhan text-tren-nhan font-bold shadow-md shadow-md'
                      : 'bg-nen text-chu-phu hover:text-chu border border-vien'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-chu-phu" />
              <input
                type="text"
                placeholder="Tìm từ khóa, mã CP..."
                value={newsSearch}
                onChange={(e) => setNewsSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-nen border border-vien rounded-xl text-xs text-chu placeholder:text-chu-mo focus:outline-none focus:border-nhan-chu font-sans"
              />
            </div>
          </div>

          {/* News Feed List */}
          <div className="space-y-3">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="p-4 bg-nen rounded-2xl border border-vien hover:border-vien transition space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-the2 text-nhan-chu border border-vien font-mono font-bold text-[10px]">
                      {news.source}
                    </span>
                    <span className="text-chu-phu font-mono text-[11px]">
                      {news.time} · {news.date}
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-tot-nen text-tot border border-vien font-mono font-bold">
                    TÍCH CỰC
                  </span>
                </div>

                <h3 className="text-sm font-bold text-chu group-hover:text-nhan-chu transition leading-snug">
                  {news.title}
                </h3>

                <p className="text-xs text-chu-phu leading-relaxed font-sans">{news.summary}</p>

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
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-the text-chu-phu border border-vien font-mono hover:text-nhan-chu hover:border-vien cursor-pointer transition"
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
          <div className="p-5 bg-nen rounded-2xl border border-vien space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-chu">{companyProfile.companyName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-the2 text-nhan-chu border border-vien font-mono font-bold">
                    {companyProfile.symbol}
                  </span>
                </div>
                <p className="text-xs text-chu-phu mt-0.5">Ngành: <b>{companyProfile.industry}</b> · Chủ tịch: <b>{companyProfile.chairman}</b> · TGĐ: <b>{companyProfile.ceo}</b></p>
              </div>

              <div className="text-left sm:text-right font-mono text-xs">
                <span className="text-chu-phu block font-sans text-[11px]">Vốn hóa thị trường:</span>
                <span className="text-base font-bold text-chu">{formatNumber(companyProfile.marketCap)} Tỷ VND</span>
              </div>
            </div>

            <p className="text-xs text-chu-phu leading-relaxed font-sans pt-2 border-t border-vien">
              {companyProfile.overview}
            </p>

            <div className="p-2.5 bg-the rounded-xl border border-vien text-xs text-canh-bao flex items-center gap-2">
              <Award className="h-4 w-4 text-canh-bao shrink-0" />
              <span><b>Lịch sử cổ tức:</b> {companyProfile.dividendHistory}</span>
            </div>
          </div>

          {/* Key Financial Metrics */}
          <div>
            <h4 className="text-xs font-bold text-chu-phu uppercase tracking-wider font-mono mb-3">
              CÁC CHỈ SỐ TÀI CHÍNH CỐT LÕI (TTM)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              <div className="p-3 bg-nen rounded-2xl border border-vien">
                <span className="text-[11px] text-chu-phu block font-sans">Định Giá P/E:</span>
                <span className="text-lg font-black text-tot">{companyProfile.financialMetrics.pe}x</span>
                <span className="text-[10px] text-chu-mo block mt-0.5">Hấp dẫn</span>
              </div>

              <div className="p-3 bg-nen rounded-2xl border border-vien">
                <span className="text-[11px] text-chu-phu block font-sans">Định Giá P/B:</span>
                <span className="text-lg font-black text-tot">{companyProfile.financialMetrics.pb}x</span>
                <span className="text-[10px] text-chu-mo block mt-0.5">Biên an toàn cao</span>
              </div>

              <div className="p-3 bg-nen rounded-2xl border border-vien">
                <span className="text-[11px] text-chu-phu block font-sans">Hiệu Suất ROE:</span>
                <span className="text-lg font-black text-nhan-chu">{companyProfile.financialMetrics.roe}%</span>
                <span className="text-[10px] text-chu-mo block mt-0.5">Sinh lời vượt trội</span>
              </div>

              <div className="p-3 bg-nen rounded-2xl border border-vien">
                <span className="text-[11px] text-chu-phu block font-sans">Giá Trị Sổ Sách (BVPS):</span>
                <span className="text-lg font-black text-nhan-chu">{formatNumber(companyProfile.financialMetrics.bvps)} đ</span>
                <span className="text-[10px] text-chu-mo block mt-0.5">Tài sản ròng/CP</span>
              </div>
            </div>
          </div>

          {/* 4 Quarters Financial Statements Table */}
          <div>
            <h4 className="text-xs font-bold text-chu-phu uppercase tracking-wider font-mono mb-3">
              BÁO CÁO KẾT QUẢ KINH DOANH 4 QUÝ GẦN NHẤT
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-vien">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-nen border-b border-vien text-chu-phu uppercase tracking-wider font-sans font-semibold">
                  <tr>
                    <th className="py-3 px-4">Kỳ Báo Cáo</th>
                    <th className="py-3 px-4 text-right">Doanh Thu (Tỷ đ)</th>
                    <th className="py-3 px-4 text-right text-tot">Lợi Nhuận Sau Thuế (Tỷ đ)</th>
                    <th className="py-3 px-4 text-right">Tăng Trưởng YoY</th>
                    <th className="py-3 px-4 text-right">EPS Quý (đ)</th>
                    <th className="py-3 px-4 text-right">Biên Lãi Gộp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-the2 bg-nen">
                  {companyProfile.quarterlyStatements.map((q) => (
                    <tr key={q.quarter} className="hover:bg-the2 transition">
                      <td className="py-3 px-4 font-bold text-chu font-mono">{q.quarter}</td>
                      <td className="py-3 px-4 text-right text-chu">{formatNumber(q.revenue)}</td>
                      <td className="py-3 px-4 text-right font-black text-tot">{formatNumber(q.netProfit)}</td>
                      <td className="py-3 px-4 text-right font-bold text-tot">+{q.growthYoY}%</td>
                      <td className="py-3 px-4 text-right text-chu-phu">{formatNumber(q.eps)}</td>
                      <td className="py-3 px-4 text-right text-chu-phu">{q.grossMargin}%</td>
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
          <div className="p-3.5 bg-nen rounded-2xl border border-vien flex items-center justify-between">
            <span className="text-xs text-chu-phu font-mono">
              Báo cáo phân tích chuyên sâu mã: <b className="text-chu text-sm">{companyProfile.symbol}</b>
            </span>
            <span className="text-xs font-mono text-tot font-bold">
              {companyProfile.expertReports.length} Báo Cáo Phân Tích
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyProfile.expertReports.map((rep, i) => (
              <div key={i} className="p-5 bg-nen rounded-2xl border border-vien space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-the2 text-nhan-chu border border-vien font-bold font-mono text-xs">
                        {rep.brokerage}
                      </span>
                      <span className="text-chu-mo text-xs font-mono">{rep.date}</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-tot-nen text-tot border border-vien text-xs font-bold font-mono">
                      {rep.action}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-the rounded-xl border border-vien font-mono">
                    <div>
                      <span className="text-[10px] text-chu-phu block font-sans">Giá Mục Tiêu 12T:</span>
                      <span className="text-lg font-black text-tot">{formatNumber(rep.targetPrice)} đ</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-chu-phu block font-sans">Tiềm Năng Tăng:</span>
                      <span className="text-lg font-black text-tot">+{rep.upsidePct}%</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-chu-phu uppercase tracking-wider font-mono mb-1.5">
                      Luận Điểm Đầu Tư Cốt Lõi:
                    </h5>
                    <ul className="text-xs text-chu-phu space-y-1 font-sans">
                      {rep.keyCatalysts.map((cat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-tot font-bold">•</span>
                          <span>{cat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-loi uppercase tracking-wider font-mono mb-1.5">
                      Rủi Ro Cần Lưu Ý:
                    </h5>
                    <ul className="text-xs text-chu-phu space-y-1 font-sans">
                      {rep.keyRisks.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-loi font-bold">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStock(companyProfile.symbol, currentPrice, 'BUY')}
                  className="w-full py-2.5 rounded-xl bg-tot hover:bg-tot text-tren-nhan font-black text-xs uppercase tracking-wider transition shadow-md shadow-md"
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
