import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Calculator,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingDown,
  Clock,
  DollarSign,
  Scale,
  Sparkles
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const PositionDecisionEngine: React.FC = () => {
  const { positions, portfolio, watchlist, selectedSymbol, setSelectedStock } = useTradingStore();

  // Cho phép chọn bất kỳ mã nào trong danh mục nắm giữ hoặc theo dõi
  const [activeTicker, setActiveTicker] = useState<string>(selectedSymbol || (positions.length > 0 ? positions[0].symbol : 'TPB'));

  // Lấy dữ liệu vị thế nếu có nắm giữ
  const heldPos = positions.find((p) => p.symbol === activeTicker);
  const stockInfo = watchlist.find((s) => s.symbol === activeTicker);

  const marketPrice = heldPos?.market_price || stockInfo?.price || 14450;
  const avgCostPrice = heldPos?.avg_price || Math.round(marketPrice * 1.08); // Giá vốn
  const totalQuantity = heldPos?.total_quantity || 1000;
  const unrealizedPnL = heldPos ? heldPos.unrealized_pnl : (marketPrice - avgCostPrice) * totalQuantity;
  const unrealizedPnLPct = heldPos ? heldPos.unrealized_pnl_pct : ((marketPrice - avgCostPrice) / avgCostPrice) * 100;
  const marginDebt = portfolio?.margin_debt || 6898107;

  // State kịch bản mua thêm bình quân giá
  const [extraQty, setExtraQty] = useState<number>(1000);
  const [extraPrice, setExtraPrice] = useState<number>(marketPrice);

  // Tính toán kịch bản mua thêm
  const currentShares = totalQuantity;
  const currentCostTotal = currentShares * avgCostPrice;
  const newBuyCost = extraQty * extraPrice;
  const totalSharesAfter = currentShares + extraQty;
  const newAvgPrice = Math.round((currentCostTotal + newBuyCost) / totalSharesAfter);
  const neededGainToBreakevenCurrent = (((avgCostPrice - marketPrice) / marketPrice) * 100).toFixed(2);
  const neededGainToBreakevenNew = (((newAvgPrice - extraPrice) / extraPrice) * 100).toFixed(2);

  // Ước tính thời gian hòa vốn (dựa trên biên độ trung bình 1.2% - 1.5%/phiên)
  const estDaysCurrent = Math.max(1, Math.ceil(Number(neededGainToBreakevenCurrent) / 1.3));
  const estDaysNew = Math.max(1, Math.ceil(Number(neededGainToBreakevenNew) / 1.3));

  const formatNumber = (num: number) => Math.round(num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 backdrop-blur-md">
      {/* ══ HEADER: CHỌN MÃ & TỔNG QUAN HÒA VỐN ══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>QUẢN TRỊ VỊ THẾ & CHIẾN LƯỢC HÒA VỐN: {activeTicker}</span>
              </h2>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                  unrealizedPnL >= 0
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
              >
                {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnLPct.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {heldPos ? 'Đang nắm giữ trong danh mục' : 'Chưa có vị thế (Chế độ mô phỏng tính điểm hòa vốn)'}
            </p>
          </div>
        </div>

        {/* Dropdown chọn bất kỳ mã nào */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Chọn mã:</span>
          <select
            value={activeTicker}
            onChange={(e) => {
              setActiveTicker(e.target.value);
              const found = watchlist.find((s) => s.symbol === e.target.value);
              if (found) {
                setExtraPrice(found.price);
                setSelectedStock(found.symbol, found.price, 'BUY');
              }
            }}
            className="bg-slate-950 border border-slate-700 text-white font-bold font-mono text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {/* Các mã đang nắm giữ */}
            {positions.map((p) => (
              <option key={p.symbol} value={p.symbol}>
                ★ {p.symbol} (Đang nắm {p.total_quantity.toLocaleString()} CP)
              </option>
            ))}
            {/* Các mã khác trong watchlist */}
            {watchlist
              .filter((w) => !positions.some((p) => p.symbol === w.symbol))
              .map((w) => (
                <option key={w.symbol} value={w.symbol}>
                  {w.symbol} - {w.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* ══ TÓM TẮT VỊ THẾ THỰC TẾ ══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Khối lượng nắm giữ:</span>
          <p className="text-base font-bold font-mono text-white mt-0.5">{formatNumber(currentShares)} CP</p>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Giá vốn (Hòa vốn):</span>
          <p className="text-base font-bold font-mono text-amber-400 mt-0.5">{formatNumber(avgCostPrice)} đ</p>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Thị giá hiện tại:</span>
          <p className="text-base font-bold font-mono text-cyan-300 mt-0.5">{formatNumber(marketPrice)} đ</p>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Nợ vay Margin DNSE:</span>
          <p className="text-base font-bold font-mono text-indigo-300 mt-0.5">{formatNumber(marginDebt)} đ</p>
        </div>
      </div>

      {/* ══ 3 KỊCH BẢN CHIẾN LƯỢC TOÀN DIỆN ══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KỊCH BẢN 1: GIỮ NGUYÊN (HOLD) */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                KỊCH BẢN 1: GIỮ NGUYÊN
              </span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-white mt-2">Chờ Hồi Phục Về Giá Vốn</h3>
            <ul className="text-xs text-slate-300 space-y-2 mt-2">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  Cần tăng: <b className="text-emerald-400">+{neededGainToBreakevenCurrent}%</b> (từ {formatNumber(marketPrice)} lên {formatNumber(avgCostPrice)}đ).
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  Thời gian dự kiến: <b>{estDaysCurrent} - {estDaysCurrent + 4} phiên</b> (khoảng 1.5 - 2 tuần) khi nhóm ngành có sóng.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Kháng cự ngắn hạn: <b>{formatNumber(Math.round(marketPrice * 1.05))}đ</b> (MA20) và <b>{formatNumber(avgCostPrice)}đ</b>.</span>
              </li>
            </ul>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            💡 <b>Đánh giá:</b> Phù hợp nếu VN-Index giữ vững xu hướng và không chịu áp lực lãi vay margin DNSE gấp.
          </div>
        </div>

        {/* KỊCH BẢN 2: MUA THÊM BÌNH QUÂN GIÁ (DCA) */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                KỊCH BẢN 2: MUA BÌNH QUÂN (DCA)
              </span>
              <Calculator className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white mt-2">Kéo Giá Vốn Xuống Vùng Thấp</h3>

            {/* Form chỉnh thông số DCA */}
            <div className="grid grid-cols-2 gap-2 my-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-400 block">Số lượng mua thêm:</label>
                <input
                  type="number"
                  value={extraQty}
                  onChange={(e) => setExtraQty(Math.max(100, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-emerald-400 font-bold mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Giá dự kiến mua (đ):</label>
                <input
                  type="number"
                  value={extraPrice}
                  onChange={(e) => setExtraPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-emerald-400 font-bold mt-0.5"
                />
              </div>
            </div>

            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  Giá vốn mới: <b className="text-emerald-400 text-sm font-mono">{formatNumber(newAvgPrice)} đ</b> (Giảm{' '}
                  {formatNumber(avgCostPrice - newAvgPrice)}đ).
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  Chỉ cần tăng: <b className="text-emerald-400">+{neededGainToBreakevenNew}%</b> là đã hòa vốn.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  Thời gian hòa vốn rút ngắn: <b>{estDaysNew} - {estDaysNew + 2} phiên</b> (khoảng 3 - 5 ngày).
                </span>
              </li>
            </ul>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
            ⭐ <b>Khuyến nghị AI:</b> Nếu có sẵn tiền mặt, việc mua gom ở vùng hỗ trợ giúp về bờ nhanh gấp 2 lần.
          </div>
        </div>

        {/* KỊCH BẢN 3: CẮT LỖ BẢO TOÀN VỐN & HẠ MARGIN */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                KỊCH BẢN 3: CẮT LỖ KỶ LUẬT
              </span>
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-white mt-2">Bảo Toàn Vốn & Hạ Nợ Margin</h3>
            <ul className="text-xs text-slate-300 space-y-2 mt-2">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>
                  Ngưỡng cắt lỗ kỷ luật: <b>{formatNumber(Math.round(marketPrice * 0.94))} đ</b> (Thủng hỗ trợ MA200).
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>
                  Số lỗ chấp nhận: <b>{formatNumber(Math.abs(unrealizedPnL) + currentShares * marketPrice * 0.06)} đ</b>.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Mục đích: Giải phóng toàn bộ nợ Margin DNSE, tránh chịu lãi vay kéo dài và chuyển vốn sang mã mạnh hơn.</span>
              </li>
            </ul>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            🛡️ <b>Kỷ luật:</b> Chỉ thực hiện khi cổ phiếu xác nhận gãy kênh xu hướng trung hạn.
          </div>
        </div>
      </div>
    </div>
  );
};
