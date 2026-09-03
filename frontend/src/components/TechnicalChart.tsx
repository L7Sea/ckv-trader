import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { VN50_WATCHLIST } from './MarketBoard';
import { CandleChart } from './CandleChart';


export const TechnicalChart: React.FC = () => {
  const { positions, selectedSymbol, setSelectedStock, watchlist } = useTradingStore();

  const activeSymbol = selectedSymbol || positions[0]?.symbol || 'TPB';
  const foundStock = watchlist.find((s) => s.symbol === activeSymbol) || VN50_WATCHLIST.find((s) => s.symbol === activeSymbol);
  const currentPos = positions.find((p) => p.symbol === activeSymbol);

  /* Sàn niêm yết lấy TỪ DỮ LIỆU của chính mã đó; hai danh sách cứng bên dưới chỉ
     là phương án dự phòng cho mã lạ chưa có trong kho. */
  const hnxSymbols = ['SHS', 'IDC', 'PVS', 'CEO', 'MBS', 'NVB', 'TNG', 'VCS', 'DTD', 'BVS', 'HUT', 'TIG'];
  const upcomSymbols = ['BSR', 'VGI', 'C4G', 'ABB', 'QNS', 'MCH', 'VEA', 'OIL', 'SSH', 'NAB', 'DDV', 'ACV'];
  const exchange =
    foundStock?.exchange ||
    (hnxSymbols.includes(activeSymbol) ? 'HNX' : upcomSymbols.includes(activeSymbol) ? 'UPCOM' : 'HOSE');

  // Giá và thông số thị trường thực tế
  const currentPrice = currentPos?.market_price || foundStock?.price || 14600;
  const refPrice = foundStock?.refPrice || Math.round(currentPrice * 0.985); // Tham chiếu
  const change = currentPrice - refPrice;
  const changePct = refPrice > 0 ? (change / refPrice) * 100 : 0;
  const isUp = change >= 0;



  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div id="technical-chart-container" className="bg-the border border-vien rounded-3xl shadow-xl overflow-hidden text-chu space-y-3 p-4 sm:p-5">
      {/* ══ TOP TICKER STATUS BAR ══ */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-3 border-b border-vien">
        {/* Symbol Selector & Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={activeSymbol}
              onChange={(e) => {
                const s = watchlist.find((item) => item.symbol === e.target.value) || VN50_WATCHLIST.find((item) => item.symbol === e.target.value);
                setSelectedStock(e.target.value, s?.price || 14600, 'BUY');
              }}
              className="bg-the border border-vien text-chu font-mono font-black text-lg rounded-xl px-3 py-1.5 focus:outline-none focus:border-tot cursor-pointer"
            >
              {watchlist.map((item) => (
                <option key={item.symbol} value={item.symbol}>
                  {item.symbol} - {item.name} ({item.exchange})
                </option>
              ))}
            </select>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-the text-nhan-chu font-bold border border-vien">
              {exchange}
            </span>
            {currentPos && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-tot-nen text-tot border border-vien">
                Đang giữ: {currentPos.total_quantity.toLocaleString()} CP
              </span>
            )}
          </div>

          {/* Current Live Price */}
          <div className="flex items-baseline gap-2 font-mono">
            <span className={`text-2xl font-black ${isUp ? 'text-tot' : 'text-loi'}`}>
              {formatNumber(currentPrice)}
            </span>
            <span className={`text-xs font-bold ${isUp ? 'text-tot' : 'text-loi'}`}>
              {isUp ? '+' : ''}{formatNumber(change)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
            </span>
          </div>
        </div>

      </div>

      {/* Biểu đồ nến thật — vẽ từ dữ liệu sàn, xem CandleChart.tsx */}
      <CandleChart key={`${exchange}-${activeSymbol}`} symbol={activeSymbol} exchange={exchange} height={560} />
    </div>
  );
};
