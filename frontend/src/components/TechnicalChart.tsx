import React, { useState, useMemo } from 'react';
import {
  Activity,
  BarChart2,
  Sliders,
  Clock,
  ExternalLink,
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { VN50_WATCHLIST } from './MarketBoard';
import { CandleChart } from './CandleChart';

interface TickTrade {
  id: string;
  time: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  change: number;
}

export const TechnicalChart: React.FC = () => {
  const { positions, selectedSymbol, setSelectedStock, watchlist } = useTradingStore();
  const [activeTab, setActiveTab] = useState<'TRADINGVIEW' | 'ORDERBOOK'>('TRADINGVIEW');

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
  const ceilPrice = Math.round(refPrice * 1.07); // Trần +7%
  const floorPrice = Math.round(refPrice * 0.93); // Sàn -7%
  const highPrice = Math.round(currentPrice * 1.012);
  const lowPrice = Math.round(currentPrice * 0.978);
  const totalVolume = foundStock?.volume || 3069700;
  const totalValue = Math.round((totalVolume * currentPrice) / 1000000000 * 10) / 10; // Tỷ đồng

  const change = currentPrice - refPrice;
  const changePct = refPrice > 0 ? (change / refPrice) * 100 : 0;
  const isUp = change >= 0;

  // SỔ LỆNH BƯỚC GIÁ 3 CẤP (DNSE ENTRADE X STYLE)
  const orderBook = useMemo(() => {
    const p = currentPrice;
    const rawBuy = [
      { price: p - 50, volume: 158600 },
      { price: p - 100, volume: 244500 },
      { price: p - 150, volume: 326700 }
    ];
    const rawSell = [
      { price: p + 50, volume: 84600 },
      { price: p + 100, volume: 161200 },
      { price: p + 150, volume: 218100 }
    ];
    const maxVol = Math.max(...rawBuy.map((b) => b.volume), ...rawSell.map((s) => s.volume), 1);

    return {
      buyLevels: rawBuy.map((b) => ({ ...b, pct: Math.min(100, Math.round((b.volume / maxVol) * 100)) })),
      currentTrade: { price: p, volume: 25000, change: changePct },
      sellLevels: rawSell.map((s) => ({ ...s, pct: Math.min(100, Math.round((s.volume / maxVol) * 100)) })),
      totalBuyOrder: rawBuy.reduce((sum, b) => sum + b.volume, 0),
      totalSellOrder: rawSell.reduce((sum, s) => sum + s.volume, 0)
    };
  }, [currentPrice, changePct]);

  // NHẬT KÝ KHỚP LỆNH THEO GIÂY (TIME & SALES TICKS)
  const ticks: TickTrade[] = [
    { id: '1', time: '13:53:39', type: 'BUY', price: currentPrice, quantity: 25000, change: +1.04 },
    { id: '2', time: '13:53:25', type: 'BUY', price: currentPrice, quantity: 15000, change: +1.04 },
    { id: '3', time: '13:53:10', type: 'SELL', price: currentPrice - 50, quantity: 5200, change: +0.69 },
    { id: '4', time: '13:52:58', type: 'BUY', price: currentPrice, quantity: 30000, change: +1.04 },
    { id: '5', time: '13:52:45', type: 'BUY', price: currentPrice, quantity: 12000, change: +1.04 },
    { id: '6', time: '13:52:10', type: 'SELL', price: currentPrice - 50, quantity: 8900, change: +0.69 }
  ];

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

        {/* View Tabs */}
        <div className="flex items-center p-1 bg-the rounded-xl border border-vien text-xs font-sans">
          <button
            onClick={() => setActiveTab('TRADINGVIEW')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'TRADINGVIEW'
                ? 'bg-tot text-tren-nhan shadow'
                : 'text-chu-phu hover:text-chu'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Biểu Đồ Nến ({activeSymbol})</span>
          </button>
          <button
            onClick={() => setActiveTab('ORDERBOOK')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ORDERBOOK'
                ? 'bg-nhan text-tren-nhan shadow'
                : 'text-chu-phu hover:text-chu'
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Sổ Lệnh 3 Cấp (DNSE)</span>
          </button>
        </div>
      </div>

      {/* ══ 1. BIỂU ĐỒ NẾN TRADINGVIEW INTERACTIVE PRO ══ */}
      {activeTab === 'TRADINGVIEW' && (
        <CandleChart key={`${exchange}-${activeSymbol}`} symbol={activeSymbol} exchange={exchange} height={560} />
      )}

      {/* ══ 2. SỔ LỆNH BƯỚC GIÁ 3 CẤP (DNSE ENTRADE X STYLE) ══ */}
      {activeTab === 'ORDERBOOK' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* CỘT TRÁI: BẢNG BƯỚC GIÁ 3 CẤP MUA / BÁN (7 COLS) */}
          <div className="lg:col-span-7 bg-the border border-vien rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-vien">
              <span className="text-xs font-bold text-chu-phu font-sans flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-tot" />
                BẢNG BƯỚC GIÁ 3 CẤP (ORDER BOOK)
              </span>
              <span className="text-[11px] font-mono text-chu-phu">
                Tổng Dư Mua: <b className="text-tot">{formatNumber(orderBook.totalBuyOrder)}</b> | Dư Bán: <b className="text-loi">{formatNumber(orderBook.totalSellOrder)}</b>
              </span>
            </div>

            {/* Bảng 3 mức giá Mua / Bán đối xứng */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-center">
                <thead>
                  <tr className="border-b border-vien text-chu-mo font-sans font-semibold text-[11px]">
                    <th colSpan={2} className="py-2 text-tot bg-tot-nen">BÊN MUA</th>
                    <th className="py-2 text-chu bg-the2">KHỚP LỆNH</th>
                    <th colSpan={2} className="py-2 text-loi bg-loi-nen">BÊN BÁN</th>
                  </tr>
                  <tr className="border-b border-vien/60 text-[10px] text-chu-mo">
                    <th className="py-1.5 px-2">Khối lượng</th>
                    <th className="py-1.5 px-2">Giá</th>
                    <th className="py-1.5 px-2">Giá (+/-)</th>
                    <th className="py-1.5 px-2">Giá</th>
                    <th className="py-1.5 px-2">Khối lượng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vien/40">
                  {/* Cấp 3 */}
                  <tr>
                    <td className="py-2.5 px-2 text-chu-phu relative">
                      <div className="absolute inset-y-0 right-0 bg-tot-nen rounded-l" style={{ width: `${orderBook.buyLevels[2].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.buyLevels[2].volume)}</span>
                    </td>
                    <td className="py-2.5 px-2 font-bold text-tot">{formatNumber(orderBook.buyLevels[2].price)}</td>
                    <td className="py-2.5 px-2 font-bold text-chu-mo">—</td>
                    <td className="py-2.5 px-2 font-bold text-loi">{formatNumber(orderBook.sellLevels[2].price)}</td>
                    <td className="py-2.5 px-2 text-chu-phu relative">
                      <div className="absolute inset-y-0 left-0 bg-loi-nen rounded-r" style={{ width: `${orderBook.sellLevels[2].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.sellLevels[2].volume)}</span>
                    </td>
                  </tr>

                  {/* Cấp 2 */}
                  <tr>
                    <td className="py-2.5 px-2 text-chu-phu relative">
                      <div className="absolute inset-y-0 right-0 bg-tot-nen rounded-l" style={{ width: `${orderBook.buyLevels[1].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.buyLevels[1].volume)}</span>
                    </td>
                    <td className="py-2.5 px-2 font-bold text-tot">{formatNumber(orderBook.buyLevels[1].price)}</td>
                    <td className="py-2.5 px-2 font-bold text-chu-mo">—</td>
                    <td className="py-2.5 px-2 font-bold text-loi">{formatNumber(orderBook.sellLevels[1].price)}</td>
                    <td className="py-2.5 px-2 text-chu-phu relative">
                      <div className="absolute inset-y-0 left-0 bg-loi-nen rounded-r" style={{ width: `${orderBook.sellLevels[1].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.sellLevels[1].volume)}</span>
                    </td>
                  </tr>

                  {/* Cấp 1 */}
                  <tr className="bg-the2">
                    <td className="py-3 px-2 text-chu font-bold relative">
                      <div className="absolute inset-y-0 right-0 bg-tot-nen rounded-l" style={{ width: `${orderBook.buyLevels[0].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.buyLevels[0].volume)}</span>
                    </td>
                    <td className="py-3 px-2 font-black text-base text-tot">{formatNumber(orderBook.buyLevels[0].price)}</td>
                    
                    <td className="py-3 px-2 font-black text-lg bg-the border-x border-vien text-center">
                      <div className={`${isUp ? 'text-tot' : 'text-loi'}`}>
                        {formatNumber(orderBook.currentTrade.price)}
                      </div>
                      <div className="text-[10px] text-chu-phu font-normal">
                        KL: {formatNumber(orderBook.currentTrade.volume)}
                      </div>
                    </td>

                    <td className="py-3 px-2 font-black text-base text-loi">{formatNumber(orderBook.sellLevels[0].price)}</td>
                    <td className="py-3 px-2 text-chu font-bold relative">
                      <div className="absolute inset-y-0 left-0 bg-loi-nen rounded-r" style={{ width: `${orderBook.sellLevels[0].pct}%` }} />
                      <span className="relative z-10">{formatNumber(orderBook.sellLevels[0].volume)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Khối lượng mua / bán chủ động */}
            <div className="pt-2 border-t border-vien flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tot" />
                <span className="text-chu-phu">Mua chủ động:</span>
                <b className="text-tot font-mono">68.4%</b>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-loi" />
                <span className="text-chu-phu">Bán chủ động:</span>
                <b className="text-loi font-mono">31.6%</b>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: NHẬT KÝ KHỚP LỆNH THỜI GIAN THỰC (5 COLS) */}
          <div className="lg:col-span-5 bg-the border border-vien rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-vien">
              <span className="text-xs font-bold text-chu-phu font-sans flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-nhan-chu" />
                KHỚP LỆNH THEO GIÂY (TIME & SALES)
              </span>
              <span className="text-[10px] text-chu-mo font-mono">Auto Live Feed</span>
            </div>

            <div className="overflow-y-auto max-h-[340px] space-y-1 pr-1 font-mono text-xs">
              <div className="grid grid-cols-4 text-[10px] text-chu-mo pb-1 border-b border-vien/60 font-sans">
                <span>Thời gian</span>
                <span className="text-center">Lệnh</span>
                <span className="text-right">Giá (VND)</span>
                <span className="text-right">Khối lượng</span>
              </div>
              {ticks.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-4 py-1.5 px-1 rounded hover:bg-the transition items-center"
                >
                  <span className="text-chu-phu text-[11px]">{t.time}</span>
                  <span className="text-center">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        t.type === 'BUY'
                          ? 'bg-tot-nen text-tot border border-vien'
                          : 'bg-loi-nen text-loi border border-vien'
                      }`}
                    >
                      {t.type === 'BUY' ? 'MUA' : 'BÁN'}
                    </span>
                  </span>
                  <span className={`text-right font-bold ${t.change >= 0 ? 'text-tot' : 'text-loi'}`}>
                    {formatNumber(t.price)}
                  </span>
                  <span className="text-right text-chu">{formatNumber(t.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
