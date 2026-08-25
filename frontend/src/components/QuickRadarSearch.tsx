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
  HelpCircle
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { run52PredictionAlgorithms, SignalType } from '../services/predictionEngine';

export interface VN50StockItem {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  changePct: number;
  volume: number;
}

/* ═══════════════════════════════════════════════════════════════
   BẢNG ĐẦY ĐỦ 52 MÃ VN50 + CÁC MÃ ĐANG QUAN TÂM CỦA ANH HẢI
   ═══════════════════════════════════════════════════════════════ */

export const FULL_VN50_DATABASE: VN50StockItem[] = [
  // Nhóm Ngân Hàng
  { symbol: 'TPB', name: 'Ngân hàng Tiên Phong', sector: 'Ngân hàng', price: 14450, changePct: -1.03, volume: 1000000 },
  { symbol: 'ACB', name: 'Ngân hàng Á Châu', sector: 'Ngân hàng', price: 22200, changePct: -1.33, volume: 7780000 },
  { symbol: 'BID', name: 'BIDV', sector: 'Ngân hàng', price: 36700, changePct: -0.54, volume: 4031600 },
  { symbol: 'CTG', name: 'VietinBank', sector: 'Ngân hàng', price: 31500, changePct: -0.94, volume: 7928400 },
  { symbol: 'HDB', name: 'HDBank', sector: 'Ngân hàng', price: 27000, changePct: -1.46, volume: 11433300 },
  { symbol: 'LPB', name: 'LPBank', sector: 'Ngân hàng', price: 49800, changePct: 1.43, volume: 3212500 },
  { symbol: 'MBB', name: 'Ngân hàng Quân Đội', sector: 'Ngân hàng', price: 20650, changePct: -0.48, volume: 10212100 },
  { symbol: 'SHB', name: 'Ngân hàng SHB', sector: 'Ngân hàng', price: 12050, changePct: -0.41, volume: 50895000 },
  { symbol: 'SSB', name: 'SeABank', sector: 'Ngân hàng', price: 15850, changePct: 2.26, volume: 2261600 },
  { symbol: 'STB', name: 'Sacombank', sector: 'Ngân hàng', price: 74200, changePct: -0.93, volume: 3352700 },
  { symbol: 'TCB', name: 'Techcombank', sector: 'Ngân hàng', price: 31300, changePct: -0.48, volume: 14732000 },
  { symbol: 'VCB', name: 'Vietcombank', sector: 'Ngân hàng', price: 59400, changePct: 0.34, volume: 5577200 },
  { symbol: 'VIB', name: 'VIB Bank', sector: 'Ngân hàng', price: 14650, changePct: -0.68, volume: 3095300 },
  { symbol: 'VPB', name: 'VPBank', sector: 'Ngân hàng', price: 26400, changePct: 0.19, volume: 16309200 },

  // Nhóm Công Nghệ & Bán Lẻ & Tiêu Dùng
  { symbol: 'FPT', name: 'Công nghệ FPT', sector: 'Công nghệ', price: 70700, changePct: -0.98, volume: 4690000 },
  { symbol: 'MWG', name: 'Thế Giới Di Động', sector: 'Bán lẻ', price: 73900, changePct: -1.60, volume: 2556400 },
  { symbol: 'PNJ', name: 'Vàng bạc Đá quý Phú Nhuận', sector: 'Bán lẻ', price: 92400, changePct: 0.54, volume: 1120000 },
  { symbol: 'MCH', name: 'Masan Consumer', sector: 'Tiêu dùng', price: 141800, changePct: 1.50, volume: 799800 },
  { symbol: 'MSN', name: 'Tập đoàn Masan', sector: 'Tiêu dùng', price: 69500, changePct: -0.71, volume: 4643500 },
  { symbol: 'SAB', name: 'Sabeco', sector: 'Đồ uống', price: 46100, changePct: 0.00, volume: 630400 },
  { symbol: 'VNM', name: 'Vinamilk', sector: 'Tiêu dùng', price: 62600, changePct: -0.95, volume: 3343900 },

  // Nhóm Bất Động Sản & Xây Dựng
  { symbol: 'VIC', name: 'Tập đoàn Vingroup', sector: 'Bất động sản', price: 220500, changePct: 2.80, volume: 10310200 },
  { symbol: 'VHM', name: 'Vinhomes', sector: 'Bất động sản', price: 73600, changePct: 0.27, volume: 9252600 },
  { symbol: 'VRE', name: 'Vincom Retail', sector: 'Bất động sản', price: 25200, changePct: -0.40, volume: 6940900 },
  { symbol: 'BCM', name: 'Becamex IDC', sector: 'BĐS KCN', price: 68200, changePct: -0.87, volume: 850000 },
  { symbol: 'KDH', name: 'Nhà Khang Điền', sector: 'Bất động sản', price: 34500, changePct: 0.29, volume: 1650000 },
  { symbol: 'PDR', name: 'Bất động sản Phát Đạt', sector: 'Bất động sản', price: 21800, changePct: -1.13, volume: 5400000 },
  { symbol: 'DIG', name: 'Tổng DIC Corp', sector: 'Bất động sản', price: 23600, changePct: -1.67, volume: 8900000 },
  { symbol: 'DXG', name: 'Tập đoàn Đất Xanh', sector: 'Bất động sản', price: 15400, changePct: -0.96, volume: 7200000 },
  { symbol: 'KBC', name: 'Kinh Bắc City', sector: 'BĐS KCN', price: 28500, changePct: 0.71, volume: 3200000 },
  { symbol: 'VCG', name: 'Vinaconex', sector: 'Xây dựng', price: 18900, changePct: -0.53, volume: 2900000 },

  // Nhóm Thép & Vật Liệu & Hóa Chất
  { symbol: 'HPG', name: 'Tập đoàn Hòa Phát', sector: 'Thép', price: 21800, changePct: -2.02, volume: 25844100 },
  { symbol: 'NKG', name: 'Thép Nam Kim', sector: 'Thép', price: 20400, changePct: -1.92, volume: 6800000 },
  { symbol: 'HSG', name: 'Tập đoàn Hoa Sen', sector: 'Thép', price: 19800, changePct: -1.74, volume: 8100000 },
  { symbol: 'DGC', name: 'Hóa chất Đức Giang', sector: 'Hóa chất', price: 112500, changePct: 1.17, volume: 2100000 },
  { symbol: 'DCM', name: 'Đạm Cà Mau', sector: 'Phân bón', price: 37200, changePct: 0.27, volume: 1800000 },
  { symbol: 'DPM', name: 'Đạm Phú Mỹ', sector: 'Phân bón', price: 33600, changePct: -0.30, volume: 1450000 },
  { symbol: 'GVR', name: 'Tập đoàn Cao Su VN', sector: 'Cao su', price: 32500, changePct: 0.93, volume: 2610200 },

  // Nhóm Dầu Khí & Năng Lượng
  { symbol: 'GAS', name: 'PV Gas', sector: 'Dầu khí', price: 83500, changePct: -1.76, volume: 2125200 },
  { symbol: 'BSR', name: 'Lọc Hóa Dầu Bình Sơn', sector: 'Dầu khí', price: 26700, changePct: -2.55, volume: 10594600 },
  { symbol: 'PLX', name: 'Petrolimex', sector: 'Dầu khí', price: 42300, changePct: -0.70, volume: 920000 },
  { symbol: 'PVD', name: 'Khoan Dầu khí PVD', sector: 'Dầu khí', price: 26800, changePct: -1.47, volume: 3400000 },
  { symbol: 'PVS', name: 'Kỹ thuật Dầu khí PVS', sector: 'Dầu khí', price: 38900, changePct: -0.77, volume: 3100000 },
  { symbol: 'POW', name: 'Điện lực Dầu khí POW', sector: 'Năng lượng', price: 11850, changePct: -0.42, volume: 6200000 },
  { symbol: 'REE', name: 'Cơ Điện Lạnh REE', sector: 'Năng lượng', price: 64800, changePct: 0.62, volume: 780000 },
  { symbol: 'PC1', name: 'Tập đoàn PC1', sector: 'Năng lượng', price: 26400, changePct: 0.38, volume: 1400000 },
  { symbol: 'HDG', name: 'Tập đoàn Hà Đô', sector: 'Năng lượng', price: 27100, changePct: -0.73, volume: 1900000 },
  { symbol: 'GEX', name: 'Tập đoàn Gelex', sector: 'Thiết bị điện', price: 20700, changePct: -1.19, volume: 5600000 },

  // Nhóm Chứng Khoán & Hàng Không & Bảo Hiểm
  { symbol: 'SSI', name: 'Chứng khoán SSI', sector: 'Chứng khoán', price: 21250, changePct: 0.00, volume: 30658300 },
  { symbol: 'VND', name: 'Chứng khoán VNDIRECT', sector: 'Chứng khoán', price: 14800, changePct: -0.67, volume: 18200000 },
  { symbol: 'VIX', name: 'Chứng khoán VIX', sector: 'Chứng khoán', price: 11650, changePct: -1.27, volume: 22400000 },
  { symbol: 'TCX', name: 'TCX', sector: 'Tài chính', price: 40300, changePct: -1.23, volume: 2028800 },
  { symbol: 'VJC', name: 'Vietjet Air', sector: 'Hàng không', price: 124700, changePct: 0.16, volume: 1511700 },
  { symbol: 'BVH', name: 'Bảo hiểm Bảo Việt', sector: 'Bảo hiểm', price: 42900, changePct: -0.46, volume: 650000 },
  { symbol: 'VPL', name: 'VPL', sector: 'Dịch vụ', price: 76500, changePct: -0.52, volume: 751800 }
];

export const QuickRadarSearch: React.FC = () => {
  const { setSelectedStock } = useTradingStore();
  const [searchQuery, setSearchQuery] = useState<string>('TPB');

  const selectedStock = useMemo(() => {
    return (
      FULL_VN50_DATABASE.find((s) => s.symbol.toUpperCase() === searchQuery.toUpperCase().trim()) ||
      FULL_VN50_DATABASE[0]
    );
  }, [searchQuery]);

  const prediction = useMemo(() => {
    return run52PredictionAlgorithms(selectedStock.symbol, selectedStock.price);
  }, [selectedStock]);

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  const getVerdictDetails = (sig: SignalType) => {
    switch (sig) {
      case 'STRONG_BUY':
      case 'BUY':
        return {
          title: 'KHUYẾN NGHỊ: NÊN MUA GOM / NẮM GIỮ',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
          action: 'MUA',
          actionColor: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
          desc: `Mã ${selectedStock.symbol} đang có ${prediction.buyCount}/52 thuật toán cho tín hiệu Mua. RSI và Dòng tiền MFI ở vùng quá bán, tiềm năng tăng +${prediction.expectedGainPct}% mục tiêu ${formatNumber(prediction.targetPrice1M)}đ.`
        };
      case 'NEUTRAL':
        return {
          title: 'KHUYẾN NGHỊ: NẮM GIỮ QUAN SÁT',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30',
          icon: <Scale className="h-6 w-6 text-amber-400" />,
          action: 'QUAN SÁT',
          actionColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
          desc: `Mã ${selectedStock.symbol} đang đi ngang tích lũy với ${prediction.neutralCount} chỉ báo trung lập. Chờ tín hiệu dòng tiền bứt phá để gia tăng tỷ trọng.`
        };
      case 'SELL':
      case 'STRONG_SELL':
        return {
          title: 'KHUYẾN NGHỊ: NÊN BÁN HẠ TỶ TRỌNG / CẮT LỖ',
          color: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/30',
          icon: <TrendingDown className="h-6 w-6 text-rose-400" />,
          action: 'BÁN',
          actionColor: 'bg-rose-500 hover:bg-rose-400 text-white',
          desc: `Mã ${selectedStock.symbol} chịu áp lực bán ngắn hạn. Cần tuân thủ kỷ luật cắt lỗ tại vùng ${formatNumber(prediction.stopLossPrice)}đ để bảo toàn vốn.`
        };
    }
  };

  const verdict = getVerdictDetails(prediction.consensusSignal);

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Ô DỰ TOÁN NHANH AI: NÊN MUA HAY BÁN?</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                VN50 RADAR
              </span>
            </h2>
            <p className="text-xs text-slate-400">Truy vết 52 mã VN50 & Trả lời tức thì theo 52 thuật toán định lượng</p>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
            placeholder="Gõ mã cổ phiếu (VD: TPB, HPG, FPT...)..."
            className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-cyan-500/40 rounded-xl text-sm font-bold font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
          />
        </div>
      </div>

      {/* Quick Verdict Card */}
      <div className={`p-4 rounded-2xl border ${verdict.bg} space-y-3`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono font-black text-2xl text-white">
              {selectedStock.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{selectedStock.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-sans">{selectedStock.sector}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono mt-0.5">
                <span>Thị giá: <b className="text-white text-sm">{formatNumber(selectedStock.price)} đ</b></span>
                <span className={selectedStock.changePct >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {selectedStock.changePct >= 0 ? '+' : ''}{selectedStock.changePct.toFixed(2)}%
                </span>
                <span className="text-slate-400 hidden sm:inline">KL: {formatNumber(selectedStock.volume)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block font-sans">Đồng Thuận 52 Algos:</span>
              <span className="text-xl font-black text-emerald-400">{prediction.overallScore}/100</span>
            </div>
          </div>
        </div>

        {/* Main Verdict Banner */}
        <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 flex items-start gap-3">
          {verdict.icon}
          <div className="flex-1 space-y-1">
            <h4 className={`text-sm font-black uppercase tracking-wide ${verdict.color}`}>
              {verdict.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{verdict.desc}</p>
          </div>
        </div>

        {/* 3 Quick Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Vùng Gom / Mua:</span>
            <b className="text-emerald-400 text-sm">{formatNumber(selectedStock.price)} - {formatNumber(Math.round(selectedStock.price * 1.015))} đ</b>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 block font-sans font-semibold">Mục Tiêu Chốt Lời (Target):</span>
            <b className="text-emerald-300 text-sm">{formatNumber(prediction.targetPrice1M)} đ (+{prediction.expectedGainPct}%)</b>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-rose-400 block font-sans font-semibold">Ngưỡng Cắt Lỗ (Stop Loss):</span>
            <b className="text-rose-400 text-sm">{formatNumber(prediction.stopLossPrice)} đ (-{prediction.expectedRiskPct}%)</b>
          </div>
        </div>

        {/* 1-Click Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setSelectedStock(selectedStock.symbol, selectedStock.price, 'BUY')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20"
          >
            Ghi Mua {selectedStock.symbol} Ngay
          </button>
          <button
            onClick={() => setSelectedStock(selectedStock.symbol, selectedStock.price, 'SELL')}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-wider transition shadow-md shadow-rose-500/20"
          >
            Ghi Bán {selectedStock.symbol}
          </button>
        </div>
      </div>
    </div>
  );
};
