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
import { DEAL_CONFIG } from '../services/dealModel';

export const PositionDecisionEngine: React.FC = () => {
  const { positions, portfolio, watchlist, selectedSymbol, setSelectedStock } = useTradingStore();

  // Cho phép chọn bất kỳ mã nào trong danh mục nắm giữ hoặc theo dõi
  const [activeTicker, setActiveTicker] = useState<string>(selectedSymbol || (positions.length > 0 ? positions[0].symbol : 'TPB'));

  // Lấy dữ liệu vị thế nếu có nắm giữ
  const heldPos = positions.find((p) => p.symbol === activeTicker);
  const stockInfo = watchlist.find((s) => s.symbol === activeTicker);

  const marketPrice = heldPos?.market_price || stockInfo?.price || 14450;
  const avgCostPrice = heldPos ? heldPos.avg_price : marketPrice;
  const totalQuantity = heldPos ? heldPos.total_quantity : 0;
  const unrealizedPnL = heldPos ? heldPos.unrealized_pnl : 0;
  const unrealizedPnLPct = heldPos ? heldPos.unrealized_pnl_pct : 0;
  const marginDebt = portfolio?.margin_debt !== undefined ? portfolio.margin_debt : 0;

  // State kịch bản mua thêm bình quân giá
  const [extraQty, setExtraQty] = useState<number>(1000);
  const [extraPrice, setExtraPrice] = useState<number>(marketPrice);

  // Tính toán kịch bản mua thêm
  const currentShares = totalQuantity;
  const currentCostTotal = currentShares * avgCostPrice;
  const newBuyCost = extraQty * extraPrice;
  const totalSharesAfter = currentShares + extraQty;
  const newAvgPrice = totalSharesAfter > 0 ? Math.round((currentCostTotal + newBuyCost) / totalSharesAfter) : extraPrice;
  const costReduction = avgCostPrice > 0 ? avgCostPrice - newAvgPrice : 0;
  const neededGainToBreakevenCurrent = marketPrice > 0 && avgCostPrice > 0 ? (((avgCostPrice - marketPrice) / marketPrice) * 100).toFixed(2) : '0.00';
  const neededGainToBreakevenNew = extraPrice > 0 ? (((newAvgPrice - extraPrice) / extraPrice) * 100).toFixed(2) : '0.00';

  // Stress test: 3 cây sàn liên tiếp (-21%)
  const drop3FloorsPrice = Math.round(marketPrice * 0.79);
  const drop3FloorsValue = currentShares * drop3FloorsPrice;
  const drop3FloorsNav = (portfolio?.cash || 0) + drop3FloorsValue - marginDebt;
  const drop3FloorsMarginRate = (drop3FloorsValue + (portfolio?.cash || 0)) > 0 ? (drop3FloorsNav / (drop3FloorsValue + (portfolio?.cash || 0))) * 100 : 100;
  const isMarginCallRisk = marginDebt > 0 && drop3FloorsMarginRate < 35;
  const requiredCallDeposit = isMarginCallRisk ? Math.max(0, Math.round(marginDebt * 0.4 - drop3FloorsNav)) : 0;

  // Ước tính thời gian hòa vốn (dựa trên biên độ trung bình 1.2% - 1.5%/phiên)
  const estDaysCurrent = Math.max(1, Math.ceil(Number(neededGainToBreakevenCurrent) / 1.3));
  const estDaysNew = Math.max(1, Math.ceil(Number(neededGainToBreakevenNew) / 1.3));

  const formatNumber = (num: number) => Math.round(num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-the border border-vien rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 backdrop-blur-md">
      {/* ══ HEADER: CHỌN MÃ & TỔNG QUAN HÒA VỐN ══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-vien">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-canh-bao-nen text-canh-bao border border-vien shrink-0">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-chu font-sans">
                QUẢN TRỊ VỊ THẾ & CHIẾN LƯỢC HÒA VỐN: <span className="text-canh-bao font-mono font-black">{activeTicker}</span>
              </h2>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                  unrealizedPnL >= 0
                    ? 'bg-tot-nen text-tot border-vien'
                    : 'bg-loi-nen text-loi border-vien'
                }`}
              >
                {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnLPct.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-chu-phu">
              {heldPos ? 'Vị thế thực tế đang nắm giữ trong danh mục' : 'Chưa có vị thế (Chế độ mô phỏng tính điểm hòa vốn)'}
            </p>
          </div>
        </div>

        {/* Dropdown chọn bất kỳ mã nào */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-chu-phu whitespace-nowrap">Chọn mã:</span>
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
            className="bg-nen border border-vien text-chu font-bold font-mono text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-canh-bao cursor-pointer w-48"
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
        <div className="p-3.5 bg-nen rounded-2xl border border-vien flex flex-col justify-center">
          <span className="text-[11px] text-chu-phu font-sans">Khối lượng nắm giữ</span>
          <p className="text-base font-bold text-chu mt-1">{formatNumber(currentShares)} CP</p>
        </div>

        <div className="p-3.5 bg-nen rounded-2xl border border-vien flex flex-col justify-center">
          <span className="text-[11px] text-chu-phu font-sans">Giá vốn hòa vốn</span>
          <p className="text-base font-bold text-canh-bao mt-1">{formatNumber(avgCostPrice)} đ</p>
        </div>

        <div className="p-3.5 bg-nen rounded-2xl border border-vien flex flex-col justify-center">
          <span className="text-[11px] text-chu-phu font-sans">Thị giá hiện tại</span>
          <p className="text-base font-bold text-nhan-chu mt-1">{formatNumber(marketPrice)} đ</p>
        </div>

        <div className="p-3.5 bg-nen rounded-2xl border border-vien flex flex-col justify-center">
          <div className="flex items-center justify-between text-nhan-chu font-sans text-[11px]">
            <span className="font-semibold">Nợ Margin Thực Tế</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-the2 text-nhan-chu font-bold border border-vien font-mono">
              {DEAL_CONFIG.marginRateAnnual.toFixed(2)}%/năm
            </span>
          </div>
          <p className="text-base font-bold text-nhan-chu mt-1">{formatNumber(marginDebt)} đ</p>
          <span className="text-[10px] text-canh-bao font-mono mt-0.5">Lãi vay: ~2,173 đ/ngày</span>
        </div>
      </div>

      {/* ══ THANH ĐIỀU CHỈNH THAM SỐ MÔ PHỎNG DCA (TÁCH BIỆT TRÊN ĐẦU ĐỂ 3 THẺ ĐỀU NHAU) ══ */}
      <div className="p-3 bg-nen rounded-2xl border border-vien flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-tot font-bold font-sans">
          <Calculator className="h-4 w-4" />
          <span>Tùy chỉnh tham số mô phỏng mua gom (DCA):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono">
          <div className="flex items-center gap-1.5 bg-the px-3 py-1.5 rounded-xl border border-vien">
            <span className="text-chu-phu font-sans text-[11px]">Mua thêm:</span>
            <input
              type="number"
              value={extraQty}
              onChange={(e) => setExtraQty(Math.max(100, Number(e.target.value)))}
              className="w-20 bg-nen border border-vien rounded-lg px-2 py-0.5 text-tot font-bold text-center text-xs"
            />
            <span className="text-chu-phu text-[11px]">CP</span>
          </div>
          <div className="flex items-center gap-1.5 bg-the px-3 py-1.5 rounded-xl border border-vien">
            <span className="text-chu-phu font-sans text-[11px]">Giá gom:</span>
            <input
              type="number"
              value={extraPrice}
              onChange={(e) => setExtraPrice(Number(e.target.value))}
              className="w-24 bg-nen border border-vien rounded-lg px-2 py-0.5 text-tot font-bold text-center text-xs"
            />
            <span className="text-chu-phu text-[11px]">đ</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-chu-phu text-[11px] font-sans">
            <span>(Vốn thêm: <b className="text-chu font-mono">{formatNumber(extraQty * extraPrice)}đ</b>)</span>
          </div>
        </div>
      </div>

      {/* ══ 3 KỊCH BẢN CHIẾN LƯỢC (CÂN BẰNG CHIỀU CAO & NỘI DUNG 100%) ══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* KỊCH BẢN 1: GIỮ NGUYÊN (HOLD) */}
        <div className="p-4 rounded-2xl bg-nen border border-vien flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-canh-bao bg-canh-bao-nen px-2.5 py-1 rounded-xl border border-vien">
                KỊCH BẢN 1: GIỮ NGUYÊN
              </span>
              <Clock className="h-4 w-4 text-canh-bao" />
            </div>

            <h3 className="text-sm font-bold text-chu">Chờ Hồi Phục Về Giá Vốn</h3>

            <div className="p-3.5 rounded-xl bg-the border border-vien space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-chu-phu font-sans">Cần tăng để hòa vốn:</span>
                <b className="text-tot text-sm">+{neededGainToBreakevenCurrent}%</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-chu-phu font-sans">Thời gian dự kiến:</span>
                <b className="text-chu">{estDaysCurrent} - {estDaysCurrent + 4} phiên</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-chu-phu font-sans">Kháng cự MA20:</span>
                <b className="text-nhan-chu">{formatNumber(Math.round(marketPrice * 1.05))} đ</b>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-the border border-vien text-[11px] text-chu-phu leading-relaxed font-sans min-h-[44px] flex items-center">
            💡 <b>Đánh giá:</b> Phù hợp khi VN-Index giữ vững hỗ trợ và bạn không muốn nạp thêm tiền.
          </div>

          <button
            onClick={() => useTradingStore.getState().navigateToStock(activeTicker, 'MARKET')}
            className="w-full py-2 bg-the2 hover:bg-the2 text-nhan-chu font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 font-sans border border-vien"
          >
            <span>Soi Biểu Đồ & Sổ Lệnh</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* KỊCH BẢN 2: MUA BÌNH QUÂN (DCA) */}
        <div className="p-4 rounded-2xl bg-nen border border-vien flex flex-col justify-between space-y-4 relative overflow-hidden shadow-lg shadow-md">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-tot bg-tot-nen px-2.5 py-1 rounded-xl border border-vien">
                KỊCH BẢN 2: MUA BÌNH QUÂN (DCA)
              </span>
              <Calculator className="h-4 w-4 text-tot" />
            </div>

            <h3 className="text-sm font-bold text-chu">Kéo Giá Vốn Xuống Thấp</h3>

            <div className="p-3.5 rounded-xl bg-the border border-vien space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-chu-phu font-sans">Giá vốn mới sau DCA:</span>
                <b className="text-tot text-sm">{formatNumber(newAvgPrice)} đ</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-chu-phu font-sans">Chỉ cần tăng để về bờ:</span>
                <b className="text-tot font-bold">+{neededGainToBreakevenNew}% (Giảm {costReduction > 0 ? `-${formatNumber(costReduction)}đ` : '0đ'})</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-chu-phu font-sans">Thời gian hòa vốn:</span>
                <b className="text-tot">{estDaysNew} - {estDaysNew + 2} phiên</b>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-tot-nen border border-vien text-[11px] text-tot leading-relaxed font-sans min-h-[44px] flex items-center relative z-10">
            ⭐ <b>Khuyến nghị AI:</b> Giảm một nửa thời gian về bờ khi mua gom ở vùng giá hỗ trợ.
          </div>

          <button
            onClick={() => useTradingStore.getState().navigateToStock(activeTicker, 'TRADE', 'BUY', extraPrice)}
            className="w-full py-2 bg-gradient-to-r from-tot to-tot text-chu font-bold text-xs rounded-xl hover:opacity-95 transition flex items-center justify-center gap-1.5 font-sans shadow-md shadow-md"
          >
            <span>Thực Hiện Mua Gom (DCA)</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* KỊCH BẢN 3: CẮT LỖ KỶ LUẬT (HẠ MARGIN) */}
        <div className="p-4 rounded-2xl bg-nen border border-vien flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-loi bg-loi-nen px-2.5 py-1 rounded-xl border border-vien">
                KỊCH BẢN 3: CẮT LỖ KỶ LUẬT
              </span>
              <AlertTriangle className="h-4 w-4 text-loi" />
            </div>

            <h3 className="text-sm font-bold text-chu">Bảo Toàn Vốn & Hạ Nợ Margin</h3>

            <div className="p-3.5 rounded-xl bg-the border border-vien space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-chu-phu font-sans">Ngưỡng cắt lỗ kỷ luật:</span>
                <b className="text-loi text-sm">{formatNumber(Math.round(marketPrice * 0.94))} đ</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-chu-phu font-sans">Mức lỗ tối đa:</span>
                <b className="text-loi">-{formatNumber(Math.abs(unrealizedPnL) + currentShares * marketPrice * 0.06)} đ</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-chu-phu font-sans">Mục tiêu xử lý:</span>
                <b className="text-chu font-sans">Tất toán nợ Margin</b>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-the border border-vien text-[11px] text-chu-phu leading-relaxed font-sans min-h-[44px] flex items-center">
            🛡️ <b>Kỷ luật:</b> Giải phóng nợ vay DNSE để tránh chịu lãi vay ngày khi gãy hỗ trợ.
          </div>

          <button
            onClick={() => useTradingStore.getState().navigateToStock(activeTicker, 'TRADE', 'SELL')}
            className="w-full py-2 bg-loi-nen hover:bg-loi-nen text-loi font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 font-sans border border-vien"
          >
            <span>Đặt Lệnh Cắt Lỗ Hạ Margin</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
