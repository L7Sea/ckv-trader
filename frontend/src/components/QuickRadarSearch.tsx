import React, { useState, useMemo } from 'react';
import {
  Zap,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Scale,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Flame,
  ChevronRight,
  RefreshCw,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { run150PredictionAlgorithms, SignalType } from '../services/predictionEngine';
import { StockMarketInfo, marketDataService, PRELOADED_VN_STOCKS } from '../services/marketDataService';

export const FULL_VN50_DATABASE: { symbol: string; name: string; sector: string; price: number; changePct: number; volume: number }[] = Object.keys(PRELOADED_VN_STOCKS).map((sym) => {
  const s = marketDataService.generateCompleteInfo(sym);
  return { symbol: s.symbol, name: s.name, sector: s.sector, price: s.price, changePct: s.changePct, volume: s.volume };
});

const TRENDING_STOCKS = ['TPB', 'HPG', 'FPT', 'SSI', 'MWG', 'FRT', 'CTR', 'VCI', 'DGW', 'VIC', 'VHM'];

export const QuickRadarSearch: React.FC = () => {
  const {
    selectedSymbol,
    setSelectedStock,
    watchlist,
    addCustomStock,
    removeCustomStock,
    syncLiveMarketData,
    isLiveSyncing
  } = useTradingStore();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'HOT' | 'BANK' | 'TECH' | 'CUSTOM'>('ALL');
  const [customTickerInput, setCustomTickerInput] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Lấy danh sách mã đang hiển thị
  const filteredWatchlist = useMemo(() => {
    let list = watchlist;
    if (activeTabFilter === 'HOT') {
      list = watchlist.filter((s) => TRENDING_STOCKS.includes(s.symbol));
    } else if (activeTabFilter === 'BANK') {
      list = watchlist.filter((s) => s.sector.includes('Ngân hàng') || s.sector.includes('Tài chính'));
    } else if (activeTabFilter === 'TECH') {
      list = watchlist.filter((s) => s.sector.includes('Công nghệ') || s.sector.includes('Viễn thông') || s.sector.includes('Bán lẻ'));
    } else if (activeTabFilter === 'CUSTOM') {
      list = watchlist.filter((s) => s.isCustom);
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toUpperCase().trim();
    return watchlist.filter(
      (s) => s.symbol.includes(q) || s.name.toUpperCase().includes(q) || s.sector.toUpperCase().includes(q)
    );
  }, [watchlist, searchQuery, activeTabFilter]);

  // Cổ phiếu đang được chọn để soi chi tiết
  const currentStock = useMemo(() => {
    return watchlist.find((s) => s.symbol === selectedSymbol) || watchlist[0] || {
      symbol: 'TPB',
      name: 'Ngân hàng Tiên Phong',
      sector: 'Ngân hàng',
      price: 14450,
      refPrice: 14600,
      ceilPrice: 15600,
      floorPrice: 13600,
      change: -150,
      changePct: -1.03,
      volume: 1000000,
      high52W: 19500,
      low52W: 13800,
      pe: 7.8,
      pb: 1.02,
      roe: 18.2,
      eps: 1850,
      marketCap: 32000,
      dividendYield: 7.5,
      lastUpdated: '15:00:00'
    };
  }, [watchlist, selectedSymbol]);

  // Chạy 150 thuật toán định lượng cho mã đang chọn
  const prediction = useMemo(() => {
    return run150PredictionAlgorithms(currentStock.symbol, currentStock.price);
  }, [currentStock]);

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  const handleAddCustomStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTickerInput.trim()) return;
    setIsAdding(true);
    try {
      const added = await addCustomStock(customTickerInput);
      setCustomTickerInput('');
      setSelectedStock(added.symbol, added.price, 'BUY');
    } catch {
      // Error handled in store
    } finally {
      setIsAdding(false);
    }
  };

  const getVerdictDetails = (sig: SignalType) => {
    switch (sig) {
      case 'STRONG_BUY':
      case 'BUY':
        return {
          title: 'KHUYẾN NGHỊ AI: NÊN MUA GOM / NẮM GIỮ',
          color: 'text-tot',
          bg: 'bg-tot-nen border-vien',
          badgeBg: 'bg-tot text-tren-nhan',
          icon: <TrendingUp className="h-5 w-5 text-tot" />,
          action: 'MUA NGAY',
          actionColor: 'bg-tot hover:bg-tot text-tren-nhan',
          desc: `Mã ${currentStock.symbol} đang có ${prediction.buyCount}/150 thuật toán cho tín hiệu Mua. RSI và Dòng tiền MFI ở vùng quá bán, tiềm năng tăng +${prediction.expectedGainPct}% mục tiêu ${formatNumber(prediction.targetPrice1M)}đ.`
        };
      case 'NEUTRAL':
        return {
          title: 'KHUYẾN NGHỊ AI: NẮM GIỮ QUAN SÁT',
          color: 'text-canh-bao',
          bg: 'bg-canh-bao-nen border-vien',
          badgeBg: 'bg-canh-bao text-tren-nhan',
          icon: <Scale className="h-5 w-5 text-canh-bao" />,
          action: 'QUAN SÁT',
          actionColor: 'bg-canh-bao hover:bg-canh-bao text-tren-nhan',
          desc: `Mã ${currentStock.symbol} đang đi ngang tích lũy với ${prediction.neutralCount}/150 chỉ báo trung lập. Chờ tín hiệu dòng tiền bứt phá để gia tăng tỷ trọng.`
        };
      case 'SELL':
      case 'STRONG_SELL':
        return {
          title: 'KHUYẾN NGHỊ AI: NÊN BÁN HẠ TỶ TRỌNG / CẮT LỖ',
          color: 'text-loi',
          bg: 'bg-loi-nen border-vien',
          badgeBg: 'bg-loi text-tren-nhan',
          icon: <TrendingDown className="h-5 w-5 text-loi" />,
          action: 'BÁN',
          actionColor: 'bg-loi hover:bg-loi text-tren-nhan',
          desc: `Mã ${currentStock.symbol} chịu áp lực bán ngắn hạn. Cần tuân thủ kỷ luật cắt lỗ tại vùng ${formatNumber(prediction.stopLossPrice)}đ để bảo toàn vốn.`
        };
    }
  };

  const verdict = getVerdictDetails(prediction.consensusSignal);

  return (
    <div className="bg-the border border-vien rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-5">
      {/* ══ HEADER: THANH TÌM KIẾM & THÊM MÃ TỰ ĐỘNG (SHOPEE STYLE) ══ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-nhan-chu to-tot text-chu shadow-md shadow-md">
            <Zap className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-chu uppercase tracking-wider font-sans">
                RADAR THÔNG MINH & QUÉT TÍN HIỆU ĐỊNH LƯỢNG
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-the2 text-nhan-chu border border-vien font-mono font-bold animate-pulse">
                REALTIME
              </span>
            </div>
            <p className="text-xs text-chu-phu">
              Nhập bất kỳ mã chứng khoán (HOSE, HNX, UPCoM) $\rightarrow$ Tự động phân tích dòng tiền & tổng hợp tín hiệu đa khung thời gian
            </p>
          </div>
        </div>

        {/* Input Thêm Mã Nhanh */}
        <form onSubmit={handleAddCustomStock} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-nhan-chu" />
            <input
              id="search-stock-input"
              type="text"
              value={customTickerInput}
              onChange={(e) => setCustomTickerInput(e.target.value.toUpperCase())}
              placeholder="Nhập mã mới (VD: FRT, VCI, CTR...)..."
              className="w-full pl-9 pr-3 py-2 bg-nen border border-vien rounded-xl text-sm font-bold font-mono text-chu placeholder:text-chu-mo focus:outline-none focus:border-nhan-chu transition shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !customTickerInput.trim()}
            className="px-4 py-2 bg-gradient-to-r from-nhan-chu to-tot text-chu font-bold text-xs rounded-xl hover:opacity-95 transition disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5 shadow-md shadow-md"
          >
            {isAdding ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <PlusCircle className="h-3.5 w-3.5" />}
            <span>Thêm Mã</span>
          </button>
        </form>
      </div>

      {/* ══ TRENDING CHIPS / BỘ LỌC SHOPEE / VIETTEL MONEY ══ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-chu-phu flex items-center gap-1 shrink-0">
          <Flame className="h-3.5 w-3.5 text-canh-bao" /> Hot:
        </span>
        {TRENDING_STOCKS.map((sym) => {
          const item = watchlist.find((s) => s.symbol === sym);
          const isSelected = currentStock.symbol === sym;
          return (
            <button
              key={sym}
              onClick={() => {
                const stock = watchlist.find((s) => s.symbol === sym) || marketDataService.generateCompleteInfo(sym);
                setSelectedStock(stock.symbol, stock.price, 'BUY');
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 shrink-0 border ${
                isSelected
                  ? 'bg-gradient-to-r from-nhan-chu to-tot text-chu border-transparent shadow-md shadow-md'
                  : 'bg-nen text-chu-phu border-vien hover:border-vien hover:text-chu'
              }`}
            >
              <span>{sym}</span>
              {item && (
                <span
                  className={`text-[10px] ${
                    item.changePct >= 0 ? (isSelected ? 'text-chu font-black' : 'text-tot') : (isSelected ? 'text-chu font-black' : 'text-loi')
                  }`}
                >
                  {item.changePct >= 0 ? '+' : ''}
                  {item.changePct}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══ CARD SOI CHI TIẾT CỔ PHIẾU ĐANG CHỌN (SUPER-APP CARD VIEW) ══ */}
      <div className={`p-5 rounded-3xl border ${verdict.bg} space-y-4 relative overflow-hidden backdrop-blur-xl`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Company Title & Price */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-nen border border-vien flex flex-col items-center justify-center font-mono text-chu shadow-inner shrink-0">
              <span className="text-xl font-black">{currentStock.symbol}</span>
              <span className="text-[9px] text-nhan-chu font-sans">{currentStock.exchange || 'HOSE'}</span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black text-chu tracking-tight">{currentStock.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-lg bg-the2 text-chu-phu font-sans font-medium">
                  {currentStock.sector}
                </span>
                {currentStock.isCustom && (
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-the2 text-nhan-chu border border-vien font-mono">
                    Tùy biến
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono mt-1">
                <span>
                  Thị giá: <b className="text-chu text-base">{formatNumber(currentStock.price)} đ</b>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-lg font-bold ${
                    currentStock.changePct >= 0 ? 'bg-tot-nen text-tot' : 'bg-loi-nen text-loi'
                  }`}
                >
                  {currentStock.changePct >= 0 ? '+' : ''}
                  {formatNumber(currentStock.change)} đ ({currentStock.changePct >= 0 ? '+' : ''}
                  {currentStock.changePct.toFixed(2)}%)
                </span>
                <span className="text-chu-phu">KL: {formatNumber(currentStock.volume)}</span>
                <span className="text-chu-mo">P/E: {currentStock.pe}x | P/B: {currentStock.pb}x</span>
              </div>
            </div>
          </div>

          {/* Consensus Meter & Gauge */}
          <div className="flex items-center gap-4 bg-nen border border-vien p-3 rounded-2xl shrink-0 w-full lg:w-auto justify-between lg:justify-start">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-chu-phu font-sans">Đồng thuận 150 Algos:</span>
                <b className="text-tot text-sm">{prediction.overallScore}/100</b>
              </div>
              {/* Visual Gauge Bar */}
              <div className="w-44 h-2 rounded-full bg-the2 overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-loi via-canh-bao to-tot transition-all duration-500"
                  style={{ width: `${prediction.overallScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-chu-mo font-mono">
                <span>0 Bán</span>
                <span>50 Trung lập</span>
                <span>100 Mua</span>
              </div>
            </div>

            <div className="pl-3 border-l border-vien text-center">
              <span className="text-[10px] text-chu-phu block">Tín hiệu Mua</span>
              <b className="text-lg font-mono text-tot font-black">{prediction.buyCount}</b>
              <span className="text-[9px] text-chu-mo block">/150 mô hình</span>
            </div>
          </div>
        </div>

        {/* AI Verdict Banner */}
        <div className="p-3.5 bg-nen rounded-2xl border border-vien flex items-start gap-3">
          {verdict.icon}
          <div className="flex-1 space-y-1">
            <h4 className={`text-sm font-black uppercase tracking-wide ${verdict.color}`}>{verdict.title}</h4>
            <p className="text-xs text-chu-phu leading-relaxed font-sans">{verdict.desc}</p>
          </div>
        </div>

        {/* 3 Quick Parameters (Cân đối 3 cột đồng đều) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-center">
          <div className="p-3.5 bg-nen rounded-2xl border border-vien flex flex-col justify-center">
            <span className="text-[11px] text-chu-phu font-sans">Vùng Gom Khuyến Nghị</span>
            <b className="text-tot text-sm mt-1 block">
              {formatNumber(currentStock.price)} - {formatNumber(Math.round(currentStock.price * 1.015))} đ
            </b>
          </div>

          <div className="p-3.5 bg-nen rounded-2xl border border-vien flex flex-col justify-center">
            <span className="text-[11px] text-tot font-sans font-semibold">Mục Tiêu 1 Tháng (Hòa Vốn)</span>
            <b className="text-tot text-sm mt-1 block">
              {formatNumber(prediction.targetPrice1M)} đ (+{prediction.expectedGainPct}%)
            </b>
          </div>

          <div className="p-3.5 bg-nen rounded-2xl border border-vien flex flex-col justify-center">
            <span className="text-[11px] text-loi font-sans font-semibold">Ngưỡng Cắt Lỗ Kỷ Luật</span>
            <b className="text-loi text-sm mt-1 block">
              {formatNumber(prediction.stopLossPrice)} đ (-{prediction.expectedRiskPct}%)
            </b>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {currentStock.isCustom ? (
            <button
              onClick={() => removeCustomStock(currentStock.symbol)}
              className="text-xs text-loi hover:text-loi flex items-center gap-1 py-1.5 px-3 rounded-xl hover:bg-loi-nen transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Xóa mã này khỏi danh mục</span>
            </button>
          ) : (
            <span className="text-[11px] text-chu-mo font-sans">Cập nhật lúc: {currentStock.lastUpdated}</span>
          )}

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={() => {
                const btn = document.querySelector('[data-tab="ALGORITHMS"]') as HTMLElement;
                if (btn) btn.click();
              }}
              className="px-4 py-2 rounded-xl bg-the2 text-nhan-chu hover:bg-the2 border border-vien text-xs font-bold font-sans transition flex items-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5 text-nhan-chu" />
              <span>Chi Tiết 150 Thuật Toán</span>
            </button>

            <button
              onClick={() => {
                setSelectedStock(currentStock.symbol, currentStock.price, 'BUY');
                const el = document.getElementById('order-form-container');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-5 py-2 rounded-xl font-bold text-xs transition shadow-lg flex items-center gap-1.5 ${verdict.actionColor}`}
            >
              <span>{verdict.action} {currentStock.symbol}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
