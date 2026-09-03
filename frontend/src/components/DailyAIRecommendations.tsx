import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  TrendingDown,
  Scale,
  Flame,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Filter,
  CheckCircle2,
  PieChart,
  Activity
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { TOP_300_STOCKS, getDailyAIPicks, MarketStock300 } from '../services/top300Stocks';

export const DailyAIRecommendations: React.FC = () => {
  const { positions, setSelectedStock, navigateToStock } = useTradingStore();
  const [activeTab, setActiveTab] = useState<'DAILY_PICKS' | 'HEATMAP' | 'BREADTH'>('DAILY_PICKS');

  const { topHosePicks, portfolioDcaPicks } = getDailyAIPicks(positions);

  // Phân nhóm ngành cho Bản Đồ Nhiệt (Market Heatmap)
  const sectorGroups = React.useMemo(() => {
    const map = new Map<string, MarketStock300[]>();
    TOP_300_STOCKS.forEach((stock) => {
      const list = map.get(stock.sector) || [];
      list.push(stock);
      map.set(stock.sector, list);
    });
    return Array.from(map.entries()).map(([sector, stocks]) => ({
      sector,
      stocks,
      avgChange: stocks.reduce((sum, s) => sum + s.changePct, 0) / stocks.length
    }));
  }, []);

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-the border border-vien rounded-2xl shadow-xl overflow-hidden text-chu">
      {/* ══ HEADER: GỢI Ý ĐỊNH LƯỢNG & BẢN ĐỒ NHIỆT ══ */}
      <div className="bg-the border-b border-vien px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-canh-bao-nen text-canh-bao border border-vien">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-chu font-sans uppercase tracking-wide">
                TRUNG TÂM PHÂN TÍCH TOÀN THỊ TRƯỜNG & GỢI Ý HÀNG NGÀY
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-tot-nen text-tot border border-vien font-mono font-bold">
                DAILY RADAR
              </span>
            </div>
            <p className="text-xs text-chu-phu">
              Cập nhật thông số kỹ thuật, định giá P/E và dòng tiền lớn trực tiếp phiên hôm nay
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-the rounded-xl border border-vien text-xs font-sans">
          <button
            onClick={() => setActiveTab('DAILY_PICKS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'DAILY_PICKS'
                ? 'bg-tot text-tren-nhan shadow'
                : 'text-chu-phu hover:text-chu'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Gợi Ý Hôm Nay (Top HOSE & Mua Thêm)</span>
          </button>
          <button
            onClick={() => setActiveTab('HEATMAP')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'HEATMAP'
                ? 'bg-tot text-tren-nhan shadow'
                : 'text-chu-phu hover:text-chu'
            }`}
          >
            <PieChart className="h-3.5 w-3.5" />
            <span>Bản Đồ Nhiệt Ngành (Heatmap)</span>
          </button>
          <button
            onClick={() => setActiveTab('BREADTH')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'BREADTH'
                ? 'bg-tot text-tren-nhan shadow'
                : 'text-chu-phu hover:text-chu'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Độ Rộng Thị Trường</span>
          </button>
        </div>
      </div>

      {/* ══ TAB 1: GỢI Ý HÔM NAY (TOP HOSE PICKS & DCA MUA THÊM MÃ CŨ) ══ */}
      {activeTab === 'DAILY_PICKS' && (
        <div className="p-4 sm:p-5 space-y-6 bg-the">
          {/* PHẦN A: ĐIỂM GOM MUA THÊM CHO MÃ ĐANG CÓ (ĐẶC BIỆT TPB) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-vien">
              <span className="text-xs font-bold text-canh-bao font-sans flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-canh-bao" />
                CHIẾN LƯỢC MUA THÊM / GIA TĂNG VỊ THẾ CŨ (HÒA VỐN NHANH)
              </span>
              <span className="text-[11px] font-mono text-chu-phu">
                Tối ưu hóa giá vốn & hạ áp lực Margin
              </span>
            </div>

            {portfolioDcaPicks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioDcaPicks.map(({ stock, currentAvg, dcaPrice, gainNeeded, estDays }) => (
                  <div
                    key={stock.symbol}
                    className="p-4 rounded-2xl bg-the border border-vien flex flex-col justify-between space-y-3 relative overflow-hidden shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-canh-bao-nen text-canh-bao font-mono font-black text-sm border border-vien">
                            {stock.symbol}
                          </span>
                          <span className="text-xs font-bold text-chu">{stock.name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-tot-nen text-tot font-mono font-bold">
                          ĐIỂM GOM TỐT
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-the border border-vien text-xs font-mono text-center">
                        <div>
                          <span className="text-[10px] text-chu-mo block font-sans">Giá vốn hiện tại:</span>
                          <b className="text-canh-bao text-sm mt-0.5 block">{formatNumber(currentAvg)} đ</b>
                        </div>
                        <div>
                          <span className="text-[10px] text-chu-mo block font-sans">Vùng gom thêm:</span>
                          <b className="text-tot text-sm mt-0.5 block">{formatNumber(dcaPrice)} đ</b>
                        </div>
                        <div>
                          <span className="text-[10px] text-chu-mo block font-sans">Cần tăng để về bờ:</span>
                          <b className="text-tot text-sm mt-0.5 block">+{gainNeeded}%</b>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-chu-phu font-sans text-[11px]">
                        Dự kiến về bờ: <b className="text-chu font-mono">{estDays} - {estDays + 2} phiên</b>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigateToStock(stock.symbol, 'DECISION')}
                          className="px-2.5 py-1.5 rounded-xl bg-canh-bao-nen text-canh-bao font-bold hover:bg-canh-bao-nen border border-vien transition text-xs font-sans"
                          title="Xem kịch bản hòa vốn chi tiết"
                        >
                          Hòa Vốn
                        </button>
                        <button
                          onClick={() => navigateToStock(stock.symbol, 'TRADE', 'BUY', dcaPrice)}
                          className="px-3 py-1.5 rounded-xl bg-canh-bao text-tren-nhan font-bold hover:bg-canh-bao transition flex items-center gap-1 font-sans shadow"
                          title="Chuyển sang form đặt lệnh mua gom"
                        >
                          <span>Đặt Lệnh Gom</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-the border border-vien text-center text-xs text-chu-phu font-sans">
                Danh mục chưa có vị thế cổ phiếu nắm giữ. Hãy khám phá <b className="text-tot">Top 5 mã đột biến HOSE</b> bên dưới để bắt đầu giải ngân!
              </div>
            )}
          </div>

          {/* PHẦN B: TOP 5 MÃ HOSE ĐẠT ĐIỂM AI CAO NHẤT HÔM NAY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-vien">
              <span className="text-xs font-bold text-tot font-sans flex items-center gap-1.5">
                <Award className="h-4 w-4 text-tot" />
                TOP 5 CƠ HỘI MUA MỚI ĐỘT BIẾN TRÊN SÀN HOSE (ĐIỂM AI &gt; 85)
              </span>
              <span className="text-[11px] font-mono text-chu-phu">
                Sàng lọc từ 100 cổ phiếu đầu ngành HOSE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {topHosePicks.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => navigateToStock(stock.symbol, 'MARKET')}
                  className="p-3.5 rounded-2xl bg-the border border-vien hover:border-vien transition cursor-pointer flex flex-col justify-between space-y-2 group shadow"
                  title="Nhấn để xem Bảng giá & Biểu đồ nến kỹ thuật"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black font-mono text-chu group-hover:text-tot transition">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-tot-nen text-tot font-mono font-bold">
                        {stock.consensusScore}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-chu-phu truncate mt-0.5">{stock.name}</p>
                    <span className="text-[10px] text-chu-mo block font-sans">{stock.sector}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-the border border-vien space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-chu-mo font-sans text-[10px]">Thị giá:</span>
                      <b className="text-chu">{formatNumber(stock.price)} đ</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chu-mo font-sans text-[10px]">P/E:</span>
                      <b className="text-chu-phu">{stock.pe}x</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chu-mo font-sans text-[10px]">ROE:</span>
                      <b className="text-tot">{stock.roe}%</b>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToStock(stock.symbol, 'TRADE', 'BUY');
                      }}
                      className="text-[10px] font-bold text-tot bg-tot-nen hover:bg-tot hover:text-tren-nhan px-2 py-1 rounded transition font-sans"
                    >
                      Đặt Lệnh
                    </button>
                    <span className="text-[11px] text-chu-phu group-hover:text-nhan-chu flex items-center gap-0.5">
                      Soi nến <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 2: BẢN ĐỒ NHIỆT NGÀNH (MARKET HEATMAP / TREE MAP) ══ */}
      {activeTab === 'HEATMAP' && (
        <div className="p-4 sm:p-5 space-y-4 bg-the">
          <div className="flex items-center justify-between text-xs font-mono text-chu-phu pb-2 border-b border-vien">
            <span>Phân bổ trực quan theo ngành và biến động giá phiên hôm nay</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-tot inline-block" /> Tăng (&gt;0%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-canh-bao inline-block" /> Tham chiếu (0%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-loi inline-block" /> Giảm (&lt;0%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorGroups.map(({ sector, stocks, avgChange }) => (
              <div key={sector} className="p-3.5 bg-the border border-vien rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-vien/60">
                  <b className="text-xs text-chu font-sans">{sector}</b>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      avgChange >= 0 ? 'text-tot' : 'text-loi'
                    }`}
                  >
                    {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 font-mono text-xs">
                  {stocks.map((stk) => {
                    const isUp = stk.changePct > 0;
                    const isDown = stk.changePct < 0;
                    return (
                      <button
                        key={stk.symbol}
                        onClick={() => setSelectedStock(stk.symbol, stk.price, 'BUY')}
                        className={`p-2 rounded-xl text-center transition hover:scale-105 border ${
                          isUp
                            ? 'bg-tot-nen border-vien text-tot'
                            : isDown
                            ? 'bg-loi-nen border-vien text-loi'
                            : 'bg-canh-bao-nen border-vien text-canh-bao'
                        }`}
                      >
                        <b className="block text-xs font-black">{stk.symbol}</b>
                        <span className="text-[10px] block mt-0.5">
                          {isUp ? '+' : ''}{stk.changePct.toFixed(1)}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB 3: ĐỘ RỘNG THỊ TRƯỜNG & CHỈ SỐ DẪN DẮT (MARKET BREADTH) ══ */}
      {activeTab === 'BREADTH' && (
        <div className="p-4 sm:p-5 space-y-5 bg-the">
          {/* Thanh Tỷ Lệ Mã Tăng / Giảm */}
          <div className="p-4 bg-the border border-vien rounded-2xl space-y-3">
            <span className="text-xs font-bold text-chu-phu font-sans uppercase">
              TỔNG QUAN ĐỘ RỘNG THỊ TRƯỜNG TOÀN SÀN
            </span>
            <div className="w-full h-4 rounded-full bg-the2 overflow-hidden flex font-mono text-[10px] font-bold text-center text-chu">
              <div className="h-full bg-tot flex items-center justify-center" style={{ width: '48%' }}>
                215 Tăng (48%)
              </div>
              <div className="h-full bg-canh-bao flex items-center justify-center" style={{ width: '12%' }}>
                54 TC
              </div>
              <div className="h-full bg-loi text-tren-nhan flex items-center justify-center" style={{ width: '40%' }}>
                185 Giảm (40%)
              </div>
            </div>
          </div>

          {/* Top Tác Động Điểm Số VN-Index */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Top Tăng Điểm */}
            <div className="p-4 bg-the border border-vien rounded-2xl space-y-2">
              <span className="text-xs font-bold text-tot font-sans block pb-1 border-b border-vien">
                TOP ĐÓNG GÓP TĂNG ĐIỂM VN-INDEX
              </span>
              {[
                { sym: 'VIC', pts: '+1.85 đ', price: '220.500 đ' },
                { sym: 'VCB', pts: '+0.92 đ', price: '59.400 đ' },
                { sym: 'LPB', pts: '+0.65 đ', price: '49.800 đ' },
                { sym: 'SSB', pts: '+0.48 đ', price: '15.850 đ' }
              ].map((item) => (
                <div key={item.sym} className="flex justify-between items-center py-1 border-b border-vien/40">
                  <b className="text-chu">{item.sym}</b>
                  <span className="text-chu-phu">{item.price}</span>
                  <b className="text-tot font-bold">{item.pts}</b>
                </div>
              ))}
            </div>

            {/* Top Giảm Điểm */}
            <div className="p-4 bg-the border border-vien rounded-2xl space-y-2">
              <span className="text-xs font-bold text-loi font-sans block pb-1 border-b border-vien">
                TOP KÉO GIẢM ĐIỂM VN-INDEX
              </span>
              {[
                { sym: 'GAS', pts: '-1.12 đ', price: '83.500 đ' },
                { sym: 'MWG', pts: '-0.78 đ', price: '73.900 đ' },
                { sym: 'HPG', pts: '-0.62 đ', price: '21.800 đ' },
                { sym: 'FPT', pts: '-0.45 đ', price: '70.700 đ' }
              ].map((item) => (
                <div key={item.sym} className="flex justify-between items-center py-1 border-b border-vien/40">
                  <b className="text-chu">{item.sym}</b>
                  <span className="text-chu-phu">{item.price}</span>
                  <b className="text-loi font-bold">{item.pts}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
