import React, { useState, useMemo } from 'react';
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
  Zap,
  Filter
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { TOP_300_STOCKS, MarketStock300 } from '../services/top300Stocks';


export const VN50_WATCHLIST = TOP_300_STOCKS;
export type WatchlistStock = MarketStock300;

export const MarketBoard: React.FC = () => {
  const { setSelectedStock, selectedSymbol } = useTradingStore();
  const [activeExchange, setActiveExchange] = useState<'ALL' | 'HOSE' | 'HNX' | 'UPCOM'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const sectors = useMemo(() => {
    const set = new Set<string>();
    TOP_300_STOCKS.forEach((s) => set.add(s.sector));
    return ['ALL', ...Array.from(set)];
  }, []);

  const filteredStocks = useMemo(() => {
    return TOP_300_STOCKS.filter((stock) => {
      const matchExchange = activeExchange === 'ALL' || stock.exchange === activeExchange;
      const matchSector = selectedSector === 'ALL' || stock.sector === selectedSector;
      const matchSearch =
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchExchange && matchSector && matchSearch;
    });
  }, [activeExchange, selectedSector, searchTerm]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const totalPages = Math.ceil(filteredStocks.length / pageSize) || 1;
  const paginatedStocks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStocks.slice(start, start + pageSize);
  }, [filteredStocks, currentPage, pageSize]);

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-the border border-vien rounded-2xl shadow-xl overflow-hidden text-chu space-y-4 p-4 sm:p-5">
      {/* ══ HEADER: BẢNG GIÁ THỰC TẾ 300 CỔ PHIẾU ĐẦU NGÀNH ══ */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-vien">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-tot-nen text-tot border border-vien">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-chu font-sans uppercase">
                BẢNG GIÁ THỰC TẾ 300 CỔ PHIẾU ĐẦU NGÀNH (HOSE • HNX • UPCOM)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-tot-nen text-tot border border-vien font-mono font-bold">
                {filteredStocks.length} MÃ
              </span>
            </div>
            <p className="text-xs text-chu-phu">
              Dữ liệu giá khớp, khối lượng giao dịch và chỉ số cơ bản P/E, P/B, ROE. Nhấp dòng để soi nến kỹ thuật & sổ lệnh 3 cấp.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-chu-mo" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-the border border-vien rounded-xl pl-9 pr-3 py-1.5 text-xs text-chu placeholder:text-chu-mo focus:outline-none focus:border-tot font-mono"
          />
        </div>
      </div>

      {/* ══ TABS LỌC THEO SÀN & NGÀNH ══ */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Exchange Tabs */}
        <div className="flex items-center p-1 bg-the rounded-xl border border-vien">
          {[
            { key: 'ALL', label: 'Tất Cả (300)' },
            { key: 'HOSE', label: '🏛️ HOSE (100)' },
            { key: 'HNX', label: '🏢 HNX (100)' },
            { key: 'UPCOM', label: '🏪 UPCoM (100)' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveExchange(tab.key as any)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeExchange === tab.key
                  ? 'bg-tot text-tren-nhan shadow'
                  : 'text-chu-phu hover:text-chu'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sector Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-chu-phu text-[11px] font-sans">Lọc ngành:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-the border border-vien text-chu font-sans text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-tot cursor-pointer"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec === 'ALL' ? 'Tất cả các ngành' : sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ══ BẢNG DỮ LIỆU CỔ PHIẾU ══ */}
      <div className="overflow-x-auto max-h-[500px] border border-vien rounded-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-the z-10 border-b border-vien text-chu-phu font-sans font-semibold">
            <tr>
              <th className="py-2.5 px-3">Mã</th>
              <th className="py-2.5 px-2">Tên Doanh Nghiệp</th>
              <th className="py-2.5 px-2">Sàn</th>
              <th className="py-2.5 px-2">Ngành</th>
              <th className="py-2.5 px-2 text-right">Khớp Lệnh</th>
              <th className="py-2.5 px-2 text-right">+/-</th>
              <th className="py-2.5 px-2 text-right">%</th>
              <th className="py-2.5 px-2 text-right">Tổng KL</th>
              <th className="py-2.5 px-2 text-right">P/E</th>
              <th className="py-2.5 px-2 text-right">P/B</th>
              <th className="py-2.5 px-2 text-right">ROE</th>
              <th className="py-2.5 px-2 text-center">AI Signal</th>
              <th className="py-2.5 px-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vien/40 bg-the">
            {paginatedStocks.map((stock) => {
              const isUp = stock.change > 0;
              const isDown = stock.change < 0;
              const priceColor = isUp ? 'text-tot' : isDown ? 'text-loi' : 'text-canh-bao';
              const isSelected = selectedSymbol === stock.symbol;

              return (
                <tr
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock.symbol, stock.price, 'BUY')}
                  className={`transition group cursor-pointer ${
                    isSelected ? 'bg-tot-nen border-l-2 border-tot' : 'hover:bg-the'
                  }`}
                >
                  <td className="py-2.5 px-3 font-black text-chu text-sm">
                    <div className="flex items-center gap-1.5">
                      <span>{stock.symbol}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-tot animate-pulse" />}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-chu-phu font-sans max-w-[150px] truncate">
                    {stock.name}
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="px-1.5 py-0.5 rounded bg-the text-[10px] text-chu-phu font-bold">
                      {stock.exchange}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-chu-phu font-sans text-[11px]">
                    {stock.sector}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-bold text-sm ${priceColor}`}>
                    {formatNumber(stock.price)}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-bold ${priceColor}`}>
                    {isUp ? '+' : ''}{formatNumber(stock.change)}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-bold ${priceColor}`}>
                    {isUp ? '+' : ''}{stock.changePct.toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-2 text-right text-chu-phu">
                    {formatNumber(stock.volume)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-chu-phu">
                    {stock.pe}x
                  </td>
                  <td className="py-2.5 px-2 text-right text-chu-phu">
                    {stock.pb}x
                  </td>
                  <td className="py-2.5 px-2 text-right text-tot font-bold">
                    {stock.roe}%
                  </td>
                  <td className="py-2.5 px-2 text-center font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stock.aiSignal === 'STRONG_BUY'
                          ? 'bg-tot-nen text-tot border border-vien'
                          : stock.aiSignal === 'BUY'
                          ? 'bg-tot-nen text-tot'
                          : 'bg-canh-bao-nen text-canh-bao'
                      }`}
                    >
                      {stock.aiSignal}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStock(stock.symbol, stock.price, 'BUY');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-tot-nen hover:bg-tot text-tot hover:text-tren-nhan font-sans font-bold transition text-[11px]"
                    >
                      Soi Nến
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-vien text-xs font-mono text-chu-phu">
          <div>
            Hiển thị {Math.min(filteredStocks.length, (currentPage - 1) * pageSize + 1)} - {Math.min(filteredStocks.length, currentPage * pageSize)} trên tổng số <b className="text-tot">{filteredStocks.length}</b> mã
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-the hover:bg-the text-chu-phu disabled:opacity-40 transition font-sans font-semibold"
            >
              Trang trước
            </button>
            <span className="px-2 py-1 bg-the rounded border border-vien text-chu font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-the hover:bg-the text-chu-phu disabled:opacity-40 transition font-sans font-semibold"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
