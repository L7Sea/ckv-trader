import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Calculator,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowUpRight,
  TrendingDown,
  Clock,
  DollarSign,
  Scale,
  Sparkles,
  CheckCircle2
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
  const marginDebt = portfolio?.margin_debt || 7002051;

  // State kịch bản mua thêm bình quân giá
  const [extraQty, setExtraQty] = useState<number>(1000);
  const [extraPrice, setExtraPrice] = useState<number>(marketPrice);

  // Tính toán kịch bản mua thêm
  const currentShares = totalQuantity;
  const currentCostTotal = currentShares * avgCostPrice;
  const newBuyCost = extraQty * extraPrice;
  const totalSharesAfter = currentShares + extraQty;
  const newAvgPrice = Math.round((currentCostTotal + newBuyCost) / totalSharesAfter);
  const costReduction = avgCostPrice - newAvgPrice;
  const neededGainToBreakevenCurrent = (((avgCostPrice - marketPrice) / marketPrice) * 100).toFixed(2);
  const neededGainToBreakevenNew = (((newAvgPrice - extraPrice) / extraPrice) * 100).toFixed(2);

  // Ước tính thời gian hòa vốn (dựa trên biên độ trung bình 1.2% - 1.5%/phiên)
  const estDaysCurrent = Math.max(1, Math.ceil(Number(neededGainToBreakevenCurrent) / 1.3));
  const estDaysNew = Math.max(1, Math.ceil(Number(neededGainToBreakevenNew) / 1.3));

  const formatNumber = (num: number) => Math.round(num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 backdrop-blur-md">
      {/* ══ HEADER: CHỌN MÃ & TỔNG QUAN HÒA VỐN ══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-sans">
                QUẢN TRỊ VỊ THẾ & CHIẾN LƯỢC HÒA VỐN: <span className="text-amber-400 font-mono font-black">{activeTicker}</span>
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
              {heldPos ? 'Vị thế thực tế đang nắm giữ trong danh mục' : 'Chưa có vị thế (Chế độ mô phỏng tính điểm hòa vốn)'}
            </p>
          </div>
        </div>

        {/* Dropdown chọn bất kỳ mã nào */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
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
            className="bg-slate-950 border border-slate-700 text-white font-bold font-mono text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer w-48"
          >
            {positions.map((p) => (
              <option key={p.symbol} value={p.symbol}>
                ★ {p.symbol} ({p.total_quantity.toLocaleString()} CP)
              </option>
            ))}
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

      {/* ══ 4 Ô TÓM TẮT VỊ THẾ CÂN ĐỐI TUYỆT ĐỐI ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center font-mono">
        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col justify-center">
          <span className="text-[11px] text-slate-400 font-sans">Khối lượng nắm giữ</span>
          <p className="text-base font-bold text-white mt-1">{formatNumber(currentShares)} CP</p>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col justify-center">
          <span className="text-[11px] text-slate-400 font-sans">Giá vốn hòa vốn</span>
          <p className="text-base font-bold text-amber-400 mt-1">{formatNumber(avgCostPrice)} đ</p>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col justify-center">
          <span className="text-[11px] text-slate-400 font-sans">Thị giá hiện tại</span>
          <p className="text-base font-bold text-cyan-300 mt-1">{formatNumber(marketPrice)} đ</p>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-indigo-500/30 flex flex-col justify-center">
          <div className="flex items-center justify-between text-indigo-300 font-sans text-[11px]">
            <span className="font-semibold">Nợ Margin Thực Tế</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 font-mono">
              11.50%/năm
            </span>
          </div>
          <p className="text-base font-bold text-indigo-300 mt-1">{formatNumber(marginDebt)} đ</p>
          <span className="text-[10px] text-amber-300/90 font-mono mt-0.5">Lãi vay: ~2,173 đ/ngày</span>
        </div>
      </div>

      {/* ══ THANH ĐIỀU CHỈNH THAM SỐ MÔ PHỎNG DCA (TÁCH BIỆT TRÊN ĐẦU ĐỂ 3 THẺ ĐỀU NHAU) ══ */}
      <div className="p-3 bg-slate-950/90 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-bold font-sans">
          <Calculator className="h-4 w-4" />
          <span>Tùy chỉnh tham số mô phỏng mua gom (DCA):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-sans text-[11px]">Mua thêm:</span>
            <input
              type="number"
              value={extraQty}
              onChange={(e) => setExtraQty(Math.max(100, Number(e.target.value)))}
              className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-emerald-400 font-bold text-center text-xs"
            />
            <span className="text-slate-400 text-[11px]">CP</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-sans text-[11px]">Giá gom:</span>
            <input
              type="number"
              value={extraPrice}
              onChange={(e) => setExtraPrice(Number(e.target.value))}
              className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-emerald-400 font-bold text-center text-xs"
            />
            <span className="text-slate-400 text-[11px]">đ</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-slate-400 text-[11px] font-sans">
            <span>(Vốn thêm: <b className="text-white font-mono">{formatNumber(extraQty * extraPrice)}đ</b>)</span>
          </div>
        </div>
      </div>

      {/* ══ 3 KỊCH BẢN CHIẾN LƯỢC (CÂN BẰNG CHIỀU CAO & NỘI DUNG 100%) ══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* KỊCH BẢN 1: GIỮ NGUYÊN (HOLD) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                KỊCH BẢN 1: GIỮ NGUYÊN
              </span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>

            <h3 className="text-sm font-bold text-white">Chờ Hồi Phục Về Giá Vốn</h3>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Cần tăng để hòa vốn:</span>
                <b className="text-emerald-400 text-sm">+{neededGainToBreakevenCurrent}%</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Thời gian dự kiến:</span>
                <b className="text-slate-200">{estDaysCurrent} - {estDaysCurrent + 4} phiên</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Kháng cự MA20:</span>
                <b className="text-cyan-300">{formatNumber(Math.round(marketPrice * 1.05))} đ</b>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans min-h-[44px] flex items-center">
            💡 <b>Đánh giá:</b> Phù hợp khi VN-Index giữ vững hỗ trợ và bạn không muốn nạp thêm tiền.
          </div>

          <button
            onClick={() => useTradingStore.getState().navigateToStock(activeTicker, 'MARKET')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 font-sans border border-slate-700"
          >
            <span>Soi Biểu Đồ & Sổ Lệnh</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* KỊCH BẢN 2: MUA BÌNH QUÂN (DCA) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-lg shadow-emerald-500/5">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                KỊCH BẢN 2: MUA BÌNH QUÂN (DCA)
              </span>
              <Calculator className="h-4 w-4 text-emerald-400" />
            </div>

            <h3 className="text-sm font-bold text-white">Kéo Giá Vốn Xuống Thấp</h3>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Giá vốn mới sau DCA:</span>
                <b className="text-emerald-400 text-sm">{formatNumber(newAvgPrice)} đ</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Chỉ cần tăng để về bờ:</span>
                <b className="text-emerald-300 font-bold">+{neededGainToBreakevenNew}% (Giảm {costReduction > 0 ? `-${formatNumber(costReduction)}đ` : '0đ'})</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Thời gian hòa vốn:</span>
                <b className="text-emerald-300">{estDaysNew} - {estDaysNew + 2} phiên</b>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 leading-relaxed font-sans min-h-[44px] flex items-center relative z-10">
            ⭐ <b>Khuyến nghị AI:</b> Giảm một nửa thời gian về bờ khi mua gom ở vùng giá hỗ trợ.
          </div>

          <button
            onClick={() => useTradingStore.getState().navigateToStock(activeTicker, 'TRADE', 'BUY', extraPrice)}
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs rounded-xl hover:opacity-95 transition flex items-center justify-center gap-1.5 font-sans shadow-md shadow-emerald-500/20"
          >
            <span>Thực Hiện Mua Gom (DCA)</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* KỊCH BẢN 3: CẮT LỖ KỶ LUẬT (HẠ MARGIN) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20">
                KỊCH BẢN 3: CẮT LỖ KỶ LUẬT
              </span>
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>

            <h3 className="text-sm font-bold text-white">Bảo Toàn Vốn & Hạ Nợ Margin</h3>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Ngưỡng cắt lỗ kỷ luật:</span>
                <b className="text-rose-400 text-sm">{formatNumber(Math.round(marketPrice * 0.94))} đ</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Mức lỗ tối đa:</span>
                <b className="text-rose-400">-{formatNumber(Math.abs(unrealizedPnL) + currentShares * marketPrice * 0.06)} đ</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Mục tiêu xử lý:</span>
                <b className="text-slate-200 font-sans">Tất toán nợ Margin</b>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans min-h-[44px] flex items-center">
            🛡️ <b>Kỷ luật:</b> Giải phóng nợ vay DNSE để tránh chịu lãi vay ngày khi gãy hỗ trợ.
          </div>

          <button
            onClick={() => useTradingStore.getState().navigateToStock(activeTicker, 'TRADE', 'SELL')}
            className="w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 font-sans border border-rose-500/40"
          >
            <span>Đặt Lệnh Cắt Lỗ Hạ Margin</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
