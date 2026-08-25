import React from 'react';
import { LayoutGrid, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export interface WatchlistStock {
  symbol: string;
  name: string;
  price: number;
  refPrice: number;   // Giá tham chiếu (Vàng)
  ceilPrice: number;  // Giá trần (Tím +7%)
  floorPrice: number; // Giá sàn (Xanh lơ -7%)
  volume: number;
  change: number;
  changePct: number;
}

const VN30_WATCHLIST: WatchlistStock[] = [
  { symbol: 'HPG', name: 'Tập đoàn Hòa Phát', price: 29000, refPrice: 28400, ceilPrice: 30350, floorPrice: 26450, volume: 18450000, change: 600, changePct: 2.11 },
  { symbol: 'FPT', name: 'Công nghệ FPT', price: 136000, refPrice: 134500, ceilPrice: 143900, floorPrice: 125100, volume: 4200000, change: 1500, changePct: 1.12 },
  { symbol: 'SSI', name: 'Chứng khoán SSI', price: 34500, refPrice: 34000, ceilPrice: 36350, floorPrice: 31650, volume: 12800000, change: 500, changePct: 1.47 },
  { symbol: 'MWG', name: 'Thế Giới Di Động', price: 65200, refPrice: 66000, ceilPrice: 70600, floorPrice: 61400, volume: 6900000, change: -800, changePct: -1.21 },
  { symbol: 'VHM', name: 'Vinhomes', price: 43500, refPrice: 43000, ceilPrice: 46000, floorPrice: 40000, volume: 8100000, change: 500, changePct: 1.16 },
  { symbol: 'MBB', name: 'Ngân hàng Quân Đội', price: 24800, refPrice: 24500, ceilPrice: 26200, floorPrice: 22800, volume: 15300000, change: 300, changePct: 1.22 },
  { symbol: 'TCB', name: 'Techcombank', price: 23600, refPrice: 23200, ceilPrice: 24800, floorPrice: 21600, volume: 11200000, change: 400, changePct: 1.72 },
  { symbol: 'VCB', name: 'Vietcombank', price: 92000, refPrice: 91500, ceilPrice: 97900, floorPrice: 85100, volume: 1800000, change: 500, changePct: 0.55 },
  { symbol: 'STB', name: 'Sacombank', price: 31200, refPrice: 31500, ceilPrice: 33700, floorPrice: 29300, volume: 9400000, change: -300, changePct: -0.95 },
  { symbol: 'DGC', name: 'Hóa chất Đức Giang', price: 114000, refPrice: 112000, ceilPrice: 119800, floorPrice: 104200, volume: 2900000, change: 2000, changePct: 1.79 }
];

export const MarketBoard: React.FC = () => {
  const { setSelectedStock, selectedSymbol } = useTradingStore();

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Bảng Giá Thị Trường & Watchlist (VN30)</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Nhấp vào mã để Xem Biểu Đồ & Đặt Lệnh nhanh
        </span>
      </div>

      <div className="overflow-x-auto mt-4 max-h-80">
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-slate-900 z-10">
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-sans font-semibold">
              <th className="pb-3 px-2">Mã CP</th>
              <th className="pb-3 px-2">Tên Doanh Nghiệp</th>
              <th className="pb-3 px-2 text-right text-purple-400">Trần</th>
              <th className="pb-3 px-2 text-right text-cyan-400">Sàn</th>
              <th className="pb-3 px-2 text-right text-amber-400">TC</th>
              <th className="pb-3 px-2 text-right">Khớp Lệnh</th>
              <th className="pb-3 px-2 text-right">+/- (%)</th>
              <th className="pb-3 px-2 text-right">Tổng KL</th>
              <th className="pb-3 px-2 text-center font-sans">Lệnh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {VN30_WATCHLIST.map((item) => {
              const isProfit = item.change >= 0;
              const isSelected = selectedSymbol === item.symbol;

              return (
                <tr
                  key={item.symbol}
                  onClick={() => setSelectedStock(item.symbol, item.price, 'BUY')}
                  className={`hover:bg-slate-800/50 cursor-pointer transition ${
                    isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''
                  }`}
                >
                  {/* Mã CP */}
                  <td className="py-3 px-2 font-bold text-white text-sm">
                    <span className="inline-flex items-center gap-1">
                      {item.symbol}
                    </span>
                  </td>

                  {/* Tên DN */}
                  <td className="py-3 px-2 text-slate-300 font-sans truncate max-w-[140px]">
                    {item.name}
                  </td>

                  {/* Trần */}
                  <td className="py-3 px-2 text-right text-purple-400 font-semibold">
                    {formatNumber(item.ceilPrice)}
                  </td>

                  {/* Sàn */}
                  <td className="py-3 px-2 text-right text-cyan-400 font-semibold">
                    {formatNumber(item.floorPrice)}
                  </td>

                  {/* Tham Chiếu */}
                  <td className="py-3 px-2 text-right text-amber-400 font-semibold">
                    {formatNumber(item.refPrice)}
                  </td>

                  {/* Khớp Lệnh */}
                  <td className={`py-3 px-2 text-right font-bold text-sm ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatNumber(item.price)}
                  </td>

                  {/* +/- (%) */}
                  <td className="py-3 px-2 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {isProfit ? '+' : ''}{item.changePct.toFixed(2)}%
                    </span>
                  </td>

                  {/* Tổng KL */}
                  <td className="py-3 px-2 text-right text-slate-300">
                    {formatNumber(item.volume)}
                  </td>

                  {/* Nút đặt lệnh */}
                  <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedStock(item.symbol, item.price, 'BUY')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold font-sans transition"
                    >
                      Mua
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
