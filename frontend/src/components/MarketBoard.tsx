import React, { useState } from 'react';
import { LayoutGrid, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Eye, Search, Filter } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export interface WatchlistStock {
  symbol: string;
  name: string;
  sector: 'BANK' | 'STEEL' | 'SECURITIES' | 'REALESTATE' | 'RETAIL_TECH' | 'ENERGY_IND';
  price: number;
  refPrice: number;   // Giá tham chiếu (Vàng)
  ceilPrice: number;  // Giá trần (Tím +7%)
  floorPrice: number; // Giá sàn (Xanh lơ -7%)
  volume: number;
  change: number;
  changePct: number;
}

export const VN50_WATCHLIST: WatchlistStock[] = [
  // 1. Ngân Hàng (Banks)
  { symbol: 'VCB', name: 'Vietcombank', sector: 'BANK', price: 92000, refPrice: 91500, ceilPrice: 97900, floorPrice: 85100, volume: 1850000, change: 500, changePct: 0.55 },
  { symbol: 'BID', name: 'BIDV', sector: 'BANK', price: 49500, refPrice: 49000, ceilPrice: 52400, floorPrice: 45600, volume: 2100000, change: 500, changePct: 1.02 },
  { symbol: 'CTG', name: 'VietinBank', sector: 'BANK', price: 36200, refPrice: 35800, ceilPrice: 38300, floorPrice: 33300, volume: 4500000, change: 400, changePct: 1.12 },
  { symbol: 'TCB', name: 'Techcombank', sector: 'BANK', price: 23800, refPrice: 23200, ceilPrice: 24800, floorPrice: 21600, volume: 11200000, change: 600, changePct: 2.59 },
  { symbol: 'MBB', name: 'Ngân hàng Quân Đội', sector: 'BANK', price: 24800, refPrice: 24500, ceilPrice: 26200, floorPrice: 22800, volume: 15300000, change: 300, changePct: 1.22 },
  { symbol: 'VPB', name: 'VPBank', sector: 'BANK', price: 19400, refPrice: 19200, ceilPrice: 20500, floorPrice: 17900, volume: 16800000, change: 200, changePct: 1.04 },
  { symbol: 'ACB', name: 'Á Châu ACB', sector: 'BANK', price: 25400, refPrice: 25100, ceilPrice: 26850, floorPrice: 23350, volume: 6800000, change: 300, changePct: 1.20 },
  { symbol: 'STB', name: 'Sacombank', sector: 'BANK', price: 31200, refPrice: 31500, ceilPrice: 33700, floorPrice: 29300, volume: 9400000, change: -300, changePct: -0.95 },
  { symbol: 'HDB', name: 'HDBank', sector: 'BANK', price: 26800, refPrice: 26500, ceilPrice: 28350, floorPrice: 24650, volume: 5200000, change: 300, changePct: 1.13 },
  { symbol: 'VIB', name: 'VIB Bank', sector: 'BANK', price: 21800, refPrice: 21600, ceilPrice: 23100, floorPrice: 20100, volume: 4300000, change: 200, changePct: 0.93 },
  { symbol: 'TPB', name: 'TPBank', sector: 'BANK', price: 18200, refPrice: 18000, ceilPrice: 19250, floorPrice: 16750, volume: 7200000, change: 200, changePct: 1.11 },
  { symbol: 'SHB', name: 'SHB', sector: 'BANK', price: 11200, refPrice: 11100, ceilPrice: 11850, floorPrice: 10350, volume: 19500000, change: 100, changePct: 0.90 },
  { symbol: 'LPB', name: 'LPBank', sector: 'BANK', price: 32500, refPrice: 31800, ceilPrice: 34000, floorPrice: 29600, volume: 3800000, change: 700, changePct: 2.20 },
  { symbol: 'MSB', name: 'MSB', sector: 'BANK', price: 14500, refPrice: 14400, ceilPrice: 15400, floorPrice: 13400, volume: 4100000, change: 100, changePct: 0.69 },
  { symbol: 'EIB', name: 'Eximbank', sector: 'BANK', price: 18600, refPrice: 18800, ceilPrice: 20100, floorPrice: 17500, volume: 5800000, change: -200, changePct: -1.06 },
  { symbol: 'OCB', name: 'OCB', sector: 'BANK', price: 14200, refPrice: 14100, ceilPrice: 15050, floorPrice: 13150, volume: 2900000, change: 100, changePct: 0.71 },

  // 2. Thép & Vật Liệu (Steel & Materials)
  { symbol: 'HPG', name: 'Tập đoàn Hòa Phát', sector: 'STEEL', price: 29000, refPrice: 28400, ceilPrice: 30350, floorPrice: 26450, volume: 18450000, change: 600, changePct: 2.11 },
  { symbol: 'HSG', name: 'Hoa Sen Group', sector: 'STEEL', price: 21500, refPrice: 21100, ceilPrice: 22550, floorPrice: 19650, volume: 8900000, change: 400, changePct: 1.90 },
  { symbol: 'NKG', name: 'Thép Nam Kim', sector: 'STEEL', price: 22400, refPrice: 22000, ceilPrice: 23500, floorPrice: 20500, volume: 6200000, change: 400, changePct: 1.82 },

  // 3. Chứng Khoán (Securities)
  { symbol: 'SSI', name: 'Chứng khoán SSI', sector: 'SECURITIES', price: 34500, refPrice: 34000, ceilPrice: 36350, floorPrice: 31650, volume: 12800000, change: 500, changePct: 1.47 },
  { symbol: 'VND', name: 'VNDIRECT', sector: 'SECURITIES', price: 16800, refPrice: 16500, ceilPrice: 17650, floorPrice: 15350, volume: 14200000, change: 300, changePct: 1.82 },
  { symbol: 'VCI', name: 'Chứng khoán Vietcap', sector: 'SECURITIES', price: 47200, refPrice: 46500, ceilPrice: 49750, floorPrice: 43250, volume: 5100000, change: 700, changePct: 1.51 },
  { symbol: 'HCM', name: 'Chứng khoán HSC', sector: 'SECURITIES', price: 30500, refPrice: 30000, ceilPrice: 32100, floorPrice: 27900, volume: 4900000, change: 500, changePct: 1.67 },
  { symbol: 'VIX', name: 'Chứng khoán VIX', sector: 'SECURITIES', price: 12400, refPrice: 12200, ceilPrice: 13050, floorPrice: 11350, volume: 16500000, change: 200, changePct: 1.64 },

  // 4. Bất Động Sản (Real Estate)
  { symbol: 'VHM', name: 'Vinhomes', sector: 'REALESTATE', price: 43500, refPrice: 43000, ceilPrice: 46000, floorPrice: 40000, volume: 8100000, change: 500, changePct: 1.16 },
  { symbol: 'VIC', name: 'Tập đoàn Vingroup', sector: 'REALESTATE', price: 44200, refPrice: 44500, ceilPrice: 47600, floorPrice: 41400, volume: 4200000, change: -300, changePct: -0.67 },
  { symbol: 'VRE', name: 'Vincom Retail', sector: 'REALESTATE', price: 20100, refPrice: 19900, ceilPrice: 21250, floorPrice: 18550, volume: 5400000, change: 200, changePct: 1.01 },
  { symbol: 'KDH', name: 'Nhà Khang Điền', sector: 'REALESTATE', price: 37500, refPrice: 37000, ceilPrice: 39550, floorPrice: 34450, volume: 2600000, change: 500, changePct: 1.35 },
  { symbol: 'PDR', name: 'Phát Đạt', sector: 'REALESTATE', price: 22800, refPrice: 22500, ceilPrice: 24050, floorPrice: 20950, volume: 7800000, change: 300, changePct: 1.33 },
  { symbol: 'NVL', name: 'Novaland', sector: 'REALESTATE', price: 13500, refPrice: 13400, ceilPrice: 14300, floorPrice: 12500, volume: 15200000, change: 100, changePct: 0.75 },
  { symbol: 'DXG', name: 'Đất Xanh', sector: 'REALESTATE', price: 15800, refPrice: 15500, ceilPrice: 16550, floorPrice: 14450, volume: 9800000, change: 300, changePct: 1.94 },
  { symbol: 'DIG', name: 'DIC Corp', sector: 'REALESTATE', price: 23600, refPrice: 23200, ceilPrice: 24800, floorPrice: 21600, volume: 8400000, change: 400, changePct: 1.72 },
  { symbol: 'KBC', name: 'Kinh Bắc', sector: 'REALESTATE', price: 28500, refPrice: 28200, ceilPrice: 30150, floorPrice: 26250, volume: 4600000, change: 300, changePct: 1.06 },

  // 5. Bán Lẻ, Tiêu Dùng & Công Nghệ (Retail & Tech)
  { symbol: 'FPT', name: 'Công nghệ FPT', sector: 'RETAIL_TECH', price: 136000, refPrice: 134500, ceilPrice: 143900, floorPrice: 125100, volume: 4200000, change: 1500, changePct: 1.12 },
  { symbol: 'MWG', name: 'Thế Giới Di Động', sector: 'RETAIL_TECH', price: 65200, refPrice: 66000, ceilPrice: 70600, floorPrice: 61400, volume: 6900000, change: -800, changePct: -1.21 },
  { symbol: 'MSN', name: 'Tập đoàn Masan', sector: 'RETAIL_TECH', price: 76800, refPrice: 76000, ceilPrice: 81300, floorPrice: 70700, volume: 3800000, change: 800, changePct: 1.05 },
  { symbol: 'VNM', name: 'Vinamilk', sector: 'RETAIL_TECH', price: 68500, refPrice: 68000, ceilPrice: 72700, floorPrice: 63300, volume: 4100000, change: 500, changePct: 0.74 },
  { symbol: 'SAB', name: 'Sabeco', sector: 'RETAIL_TECH', price: 57200, refPrice: 57500, ceilPrice: 61500, floorPrice: 53500, volume: 950000, change: -300, changePct: -0.52 },
  { symbol: 'FRT', name: 'FPT Retail (Long Châu)', sector: 'RETAIL_TECH', price: 178000, refPrice: 174000, ceilPrice: 186100, floorPrice: 161900, volume: 1200000, change: 4000, changePct: 2.30 },
  { symbol: 'DGW', name: 'Digiworld', sector: 'RETAIL_TECH', price: 44800, refPrice: 44200, ceilPrice: 47250, floorPrice: 41150, volume: 2300000, change: 600, changePct: 1.36 },
  { symbol: 'PNJ', name: 'Vàng Bạc Đá Quý Phú Nhuận', sector: 'RETAIL_TECH', price: 98500, refPrice: 97500, ceilPrice: 104300, floorPrice: 90700, volume: 1600000, change: 1000, changePct: 1.03 },

  // 6. Năng Lượng, Dầu Khí & Hóa Chất (Energy & Industrials)
  { symbol: 'GAS', name: 'PV Gas', sector: 'ENERGY_IND', price: 74200, refPrice: 74000, ceilPrice: 79100, floorPrice: 68900, volume: 1100000, change: 200, changePct: 0.27 },
  { symbol: 'PLX', name: 'Petrolimex', sector: 'ENERGY_IND', price: 42800, refPrice: 42500, ceilPrice: 45450, floorPrice: 39550, volume: 1800000, change: 300, changePct: 0.71 },
  { symbol: 'POW', name: 'PV Power', sector: 'ENERGY_IND', price: 12800, refPrice: 12700, ceilPrice: 13550, floorPrice: 11850, volume: 8600000, change: 100, changePct: 0.79 },
  { symbol: 'PVD', name: 'Khoan Dầu Khí PVD', sector: 'ENERGY_IND', price: 27400, refPrice: 27000, ceilPrice: 28850, floorPrice: 25150, volume: 4900000, change: 400, changePct: 1.48 },
  { symbol: 'PVS', name: 'Dịch vụ Dầu khí PVS', sector: 'ENERGY_IND', price: 39800, refPrice: 39200, ceilPrice: 43100, floorPrice: 35300, volume: 5400000, change: 600, changePct: 1.53 },
  { symbol: 'DGC', name: 'Hóa chất Đức Giang', sector: 'ENERGY_IND', price: 114000, refPrice: 112000, ceilPrice: 119800, floorPrice: 104200, volume: 2900000, change: 2000, changePct: 1.79 },
  { symbol: 'DCM', name: 'Đạm Cà Mau', sector: 'ENERGY_IND', price: 37200, refPrice: 36800, ceilPrice: 39350, floorPrice: 34250, volume: 3200000, change: 400, changePct: 1.09 },
  { symbol: 'DPM', name: 'Đạm Phú Mỹ', sector: 'ENERGY_IND', price: 34100, refPrice: 33800, ceilPrice: 36150, floorPrice: 31450, volume: 2800000, change: 300, changePct: 0.89 },
  { symbol: 'GVR', name: 'Tập đoàn Cao Su VN', sector: 'ENERGY_IND', price: 34800, refPrice: 34200, ceilPrice: 36550, floorPrice: 31850, volume: 3900000, change: 600, changePct: 1.75 },
  { symbol: 'GEX', name: 'Tập đoàn Gelex', sector: 'ENERGY_IND', price: 21600, refPrice: 21200, ceilPrice: 22650, floorPrice: 19750, volume: 11400000, change: 400, changePct: 1.89 },
  { symbol: 'REE', name: 'Cơ Điện Lạnh REE', sector: 'ENERGY_IND', price: 65400, refPrice: 65000, ceilPrice: 69500, floorPrice: 60500, volume: 1400000, change: 400, changePct: 0.62 }
];

export const MarketBoard: React.FC = () => {
  const { setSelectedStock, selectedSymbol } = useTradingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  const filteredList = VN50_WATCHLIST.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>BẢNG GIÁ VN50 TOÀN DIỆN</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {VN50_WATCHLIST.length} Mã Bluechips
              </span>
            </h2>
            <p className="text-xs text-slate-400">Bấm vào mã để mở Biểu đồ kỹ thuật & Điền nhật ký lệnh</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm mã hoặc tên công ty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Sector Filter Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: 'Tất Cả VN50' },
          { key: 'BANK', label: '🏦 Ngân Hàng' },
          { key: 'STEEL', label: '🏗️ Thép & VL' },
          { key: 'SECURITIES', label: '📈 Chứng Khoán' },
          { key: 'REALESTATE', label: '🏢 Bất Động Sản' },
          { key: 'RETAIL_TECH', label: '🛒 Bán Lẻ & Tech' },
          { key: 'ENERGY_IND', label: '⚡ Năng Lượng & Dầu Khí' },
        ].map((sec) => (
          <button
            key={sec.key}
            onClick={() => setSelectedSector(sec.key)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
              selectedSector === sec.key
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-96 rounded-2xl border border-slate-800/60">
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-slate-950 z-10">
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-sans font-semibold">
              <th className="py-2.5 px-3">Mã CP</th>
              <th className="py-2.5 px-3">Tên Doanh Nghiệp</th>
              <th className="py-2.5 px-3 text-right text-purple-400">Trần</th>
              <th className="py-2.5 px-3 text-right text-cyan-400">Sàn</th>
              <th className="py-2.5 px-3 text-right text-amber-400">TC</th>
              <th className="py-2.5 px-3 text-right">Khớp Lệnh</th>
              <th className="py-2.5 px-3 text-right">+/- (%)</th>
              <th className="py-2.5 px-3 text-right">Tổng KL</th>
              <th className="py-2.5 px-3 text-center font-sans">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredList.map((item) => {
              const isProfit = item.change >= 0;
              const isSelected = selectedSymbol === item.symbol;

              return (
                <tr
                  key={item.symbol}
                  onClick={() => setSelectedStock(item.symbol, item.price, 'BUY')}
                  className={`hover:bg-slate-800/60 cursor-pointer transition ${
                    isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-white text-sm">
                    <span className="inline-flex items-center gap-1">
                      {item.symbol}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-slate-300 font-sans truncate max-w-[150px]">
                    {item.name}
                  </td>

                  <td className="py-2.5 px-3 text-right text-purple-400 font-semibold">
                    {formatNumber(item.ceilPrice)}
                  </td>

                  <td className="py-2.5 px-3 text-right text-cyan-400 font-semibold">
                    {formatNumber(item.floorPrice)}
                  </td>

                  <td className="py-2.5 px-3 text-right text-amber-400 font-semibold">
                    {formatNumber(item.refPrice)}
                  </td>

                  <td className={`py-2.5 px-3 text-right font-bold text-sm ${
                    item.price >= item.ceilPrice
                      ? 'text-purple-400'
                      : item.price <= item.floorPrice
                      ? 'text-cyan-400'
                      : isProfit
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}>
                    {formatNumber(item.price)}
                  </td>

                  <td className={`py-2.5 px-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span className="inline-flex items-center">
                      {isProfit ? '+' : ''}{item.changePct.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right text-slate-400">
                    {formatNumber(item.volume)}
                  </td>

                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => setSelectedStock(item.symbol, item.price, 'BUY')}
                        className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold transition text-[11px]"
                      >
                        Ghi Mua
                      </button>
                      <button
                        onClick={() => setSelectedStock(item.symbol, item.price, 'SELL')}
                        className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-bold transition text-[11px]"
                      >
                        Ghi Bán
                      </button>
                    </div>
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
