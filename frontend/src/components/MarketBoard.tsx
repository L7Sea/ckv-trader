import React, { useState } from 'react';
import {
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  Search,
  Calendar,
  Eye,
  Activity,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export interface WatchlistStock {
  symbol: string;
  name: string;
  price: number;
  refPrice: number;
  ceilPrice: number;
  floorPrice: number;
  volume: number;
  change: number;
  changePct: number;
  highlight?: string;
}

/* ═══════════════════════════════════════════════════════════════
   30 MÃ THEO DÕI CHÍNH XÁC THEO 3 BẢNG ẢNH CỦA ANH HẢI (VIP Trader)
   Chỉ số VN-Index: 1791.41 (+2.63 | +0.15%)
   ═══════════════════════════════════════════════════════════════ */

export const USER_WATCHLIST: WatchlistStock[] = [
  { symbol: 'ACB', name: 'Á Châu ACB', price: 22200, refPrice: 22500, ceilPrice: 24050, floorPrice: 20950, volume: 7780000, change: -300, changePct: -1.33, highlight: '9.99%*' },
  { symbol: 'BID', name: 'BIDV', price: 36700, refPrice: 36900, ceilPrice: 39450, floorPrice: 34350, volume: 4031600, change: -200, changePct: -0.54 },
  { symbol: 'BSR', name: 'Lọc Hóa Dầu Bình Sơn', price: 26700, refPrice: 27400, ceilPrice: 29300, floorPrice: 25500, volume: 10594600, change: -700, changePct: -2.55 },
  { symbol: 'CTG', name: 'VietinBank', price: 31500, refPrice: 31800, ceilPrice: 34000, floorPrice: 29600, volume: 7928400, change: -300, changePct: -0.94 },
  { symbol: 'FPT', name: 'Công nghệ FPT', price: 70700, refPrice: 71400, ceilPrice: 76300, floorPrice: 66500, volume: 4690000, change: -700, changePct: -0.98, highlight: '9.99%*' },
  { symbol: 'GAS', name: 'PV Gas', price: 83500, refPrice: 85000, ceilPrice: 90950, floorPrice: 79050, volume: 2125200, change: -1500, changePct: -1.76 },
  { symbol: 'GVR', name: 'Tập đoàn Cao Su VN', price: 32500, refPrice: 32200, ceilPrice: 34450, floorPrice: 29950, volume: 2610200, change: 300, changePct: 0.93 },
  { symbol: 'HDB', name: 'HDBank', price: 27000, refPrice: 27400, ceilPrice: 29300, floorPrice: 25500, volume: 11433300, change: -400, changePct: -1.46 },
  { symbol: 'HPG', name: 'Tập đoàn Hòa Phát', price: 21800, refPrice: 22250, ceilPrice: 23800, floorPrice: 20700, volume: 25844100, change: -450, changePct: -2.02 },
  { symbol: 'LPB', name: 'LPBank', price: 49800, refPrice: 49100, ceilPrice: 52500, floorPrice: 45700, volume: 3212500, change: 700, changePct: 1.43 },
  { symbol: 'MBB', name: 'Ngân hàng Quân Đội', price: 20650, refPrice: 20750, ceilPrice: 22200, floorPrice: 19300, volume: 10212100, change: -100, changePct: -0.48 },
  { symbol: 'MCH', name: 'Masan Consumer', price: 141800, refPrice: 139700, ceilPrice: 153600, floorPrice: 125800, volume: 799800, change: 2100, changePct: 1.50 },
  { symbol: 'MSN', name: 'Tập đoàn Masan', price: 69500, refPrice: 70000, ceilPrice: 74900, floorPrice: 65100, volume: 4643500, change: -500, changePct: -0.71 },
  { symbol: 'MWG', name: 'Thế Giới Di Động', price: 73900, refPrice: 75100, ceilPrice: 80300, floorPrice: 69900, volume: 2556400, change: -1200, changePct: -1.60 },
  { symbol: 'SAB', name: 'Sabeco', price: 46100, refPrice: 46100, ceilPrice: 49300, floorPrice: 42900, volume: 630400, change: 0, changePct: 0.00 },
  { symbol: 'SHB', name: 'SHB', price: 12050, refPrice: 12100, ceilPrice: 12900, floorPrice: 11300, volume: 50895000, change: -50, changePct: -0.41 },
  { symbol: 'SSB', name: 'SeABank', price: 15850, refPrice: 15500, ceilPrice: 16550, floorPrice: 14450, volume: 2261600, change: 350, changePct: 2.26 },
  { symbol: 'SSI', name: 'Chứng khoán SSI', price: 21250, refPrice: 21250, ceilPrice: 22700, floorPrice: 19800, volume: 30658300, change: 0, changePct: 0.00 },
  { symbol: 'STB', name: 'Sacombank', price: 74200, refPrice: 74900, ceilPrice: 80100, floorPrice: 69700, volume: 3352700, change: -700, changePct: -0.93 },
  { symbol: 'TCB', name: 'Techcombank', price: 31300, refPrice: 31450, ceilPrice: 33650, floorPrice: 29250, volume: 14732000, change: -150, changePct: -0.48 },
  { symbol: 'TCX', name: 'TCX', price: 40300, refPrice: 40800, ceilPrice: 43650, floorPrice: 37950, volume: 2028800, change: -500, changePct: -1.23 },
  { symbol: 'VCB', name: 'Vietcombank', price: 59400, refPrice: 59200, ceilPrice: 63300, floorPrice: 55100, volume: 5577200, change: 200, changePct: 0.34 },
  { symbol: 'VHM', name: 'Vinhomes', price: 73600, refPrice: 73400, ceilPrice: 78500, floorPrice: 68300, volume: 9252600, change: 200, changePct: 0.27 },
  { symbol: 'VIB', name: 'VIB Bank', price: 14650, refPrice: 14750, ceilPrice: 15750, floorPrice: 13750, volume: 3095300, change: -100, changePct: -0.68 },
  { symbol: 'VIC', name: 'Tập đoàn Vingroup', price: 220500, refPrice: 214500, ceilPrice: 229500, floorPrice: 199500, volume: 10310200, change: 6000, changePct: 2.80 },
  { symbol: 'VJC', name: 'Vietjet Air', price: 124700, refPrice: 124500, ceilPrice: 133200, floorPrice: 115800, volume: 1511700, change: 200, changePct: 0.16 },
  { symbol: 'VNM', name: 'Vinamilk', price: 62600, refPrice: 63200, ceilPrice: 67600, floorPrice: 58800, volume: 3343900, change: -600, changePct: -0.95 },
  { symbol: 'VPB', name: 'VPBank', price: 26400, refPrice: 26350, ceilPrice: 28150, floorPrice: 24550, volume: 16309200, change: 50, changePct: 0.19 },
  { symbol: 'VPL', name: 'VPL', price: 76500, refPrice: 76900, ceilPrice: 82200, floorPrice: 71600, volume: 751800, change: -400, changePct: -0.52 },
];

export const VN50_WATCHLIST = USER_WATCHLIST;

export const MarketBoard: React.FC = () => {
  const { setSelectedStock } = useTradingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [detailStock, setDetailStock] = useState<WatchlistStock | null>(null);

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  const filteredList = USER_WATCHLIST.filter((stock) => {
    return (
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
      {/* ══ BẢNG CHÍNH: CHỈ SỐ VN-INDEX THEO NGÀY ══ */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xl">
            VNI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">CHỈ SỐ VN-INDEX (HOSE)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-0.5">
              <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight">1,791.41</span>
              <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" /> +2.63 (+0.15%)
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm mã hoặc tên (nhấp để xem chi tiết)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Danh sách 30 mã đang theo dõi • <b>Nhấp vào từng mã để mở toàn bộ thông tin chi tiết & biểu đồ</b></span>
        <span className="font-mono text-emerald-400">{filteredList.length} Mã</span>
      </div>

      {/* Bảng giá tổng quan */}
      <div className="overflow-x-auto max-h-96 rounded-2xl border border-slate-800/60">
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-slate-950 z-10">
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-sans font-semibold">
              <th className="py-3 px-3">Mã CP</th>
              <th className="py-3 px-3">Khớp Lệnh</th>
              <th className="py-3 px-3 text-right">+/- (%)</th>
              <th className="py-3 px-3 text-right">Tổng Khối Lượng</th>
              <th className="py-3 px-3 text-right text-purple-400 hidden sm:table-cell">Trần</th>
              <th className="py-3 px-3 text-right text-cyan-400 hidden sm:table-cell">Sàn</th>
              <th className="py-3 px-3 text-center font-sans">Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredList.map((item) => {
              const isProfit = item.change > 0;
              const isRef = item.change === 0;

              return (
                <tr
                  key={item.symbol}
                  onClick={() => setDetailStock(item)}
                  className="hover:bg-slate-800/60 cursor-pointer transition active:scale-[0.99]"
                >
                  <td className="py-3 px-3 font-bold text-white text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-black">{item.symbol}</span>
                      {item.highlight && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                          {item.highlight}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-sans hidden md:inline ml-1">
                        - {item.name}
                      </span>
                    </div>
                  </td>

                  <td className={`py-3 px-3 font-bold text-sm ${isRef ? 'text-amber-400' : isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatNumber(item.price)}
                  </td>

                  <td className={`py-3 px-3 text-right font-bold ${isRef ? 'text-amber-400' : isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}{item.changePct.toFixed(2)}%
                  </td>

                  <td className="py-3 px-3 text-right text-slate-300 font-semibold">
                    {formatNumber(item.volume)}
                  </td>

                  <td className="py-3 px-3 text-right text-purple-400 font-medium hidden sm:table-cell">
                    {formatNumber(item.ceilPrice)}
                  </td>

                  <td className="py-3 px-3 text-right text-cyan-400 font-medium hidden sm:table-cell">
                    {formatNumber(item.floorPrice)}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 transition">
                      <Eye className="h-3.5 w-3.5" /> Xem
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ══ MODAL CHI TIẾT KHI NHẤN VÀO TỪNG MÃ ══ */}
      {detailStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-xl font-mono">
                  {detailStock.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{detailStock.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">HOSE</span>
                  </div>
                  <p className="text-xs text-slate-400">Sổ lệnh chi tiết & Chỉ số kỹ thuật</p>
                </div>
              </div>
              <button
                onClick={() => setDetailStock(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Khớp Lệnh:</span>
                <span className={`text-xl font-bold ${detailStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatNumber(detailStock.price)}
                </span>
                <span className={`text-[11px] block mt-0.5 font-bold ${detailStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {detailStock.change >= 0 ? '+' : ''}{detailStock.changePct.toFixed(2)}%
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-purple-400 block font-sans font-semibold">Giá Trần:</span>
                <span className="text-base font-bold text-purple-400">{formatNumber(detailStock.ceilPrice)}</span>
                <span className="text-[11px] text-cyan-400 block mt-1 font-sans font-semibold">Giá Sàn:</span>
                <span className="text-base font-bold text-cyan-400">{formatNumber(detailStock.floorPrice)}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-amber-400 block font-sans font-semibold">Tham Chiếu:</span>
                <span className="text-base font-bold text-amber-400">{formatNumber(detailStock.refPrice)}</span>
                <span className="text-[11px] text-slate-400 block mt-1 font-sans">Tổng KL:</span>
                <span className="text-xs font-bold text-white">{formatNumber(detailStock.volume)}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedStock(detailStock.symbol, detailStock.price, 'BUY');
                  setDetailStock(null);
                }}
                className="py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
              >
                Ghi Nhật Ký MUA {detailStock.symbol}
              </button>

              <button
                onClick={() => {
                  setSelectedStock(detailStock.symbol, detailStock.price, 'SELL');
                  setDetailStock(null);
                }}
                className="py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-rose-500/20"
              >
                Ghi Nhật Ký BÁN {detailStock.symbol}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
