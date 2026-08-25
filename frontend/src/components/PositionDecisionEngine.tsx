import React, { useState } from 'react';
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
  Scale
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const PositionDecisionEngine: React.FC = () => {
  const { positions, portfolio } = useTradingStore();
  const tpbPos = positions.find((p) => p.symbol === 'TPB') || {
    symbol: 'TPB',
    total_quantity: 1000,
    available_quantity: 1000,
    avg_price: 15918,
    market_price: 14450,
    market_value: 14450000,
    unrealized_pnl: -1465943,
    unrealized_pnl_pct: -9.29
  };

  // State kịch bản mua thêm bình quân giá
  const [extraQty, setExtraQty] = useState<number>(1000);
  const [extraPrice, setExtraPrice] = useState<number>(14450);

  // Tính toán kịch bản mua thêm
  const currentShares = tpbPos.total_quantity;
  const currentCostTotal = currentShares * tpbPos.avg_price;
  const newBuyCost = extraQty * extraPrice;
  const totalSharesAfter = currentShares + extraQty;
  const newAvgPrice = Math.round((currentCostTotal + newBuyCost) / totalSharesAfter);
  const neededGainToBreakevenCurrent = (((tpbPos.avg_price - tpbPos.market_price) / tpbPos.market_price) * 100).toFixed(2);
  const neededGainToBreakevenNew = (((newAvgPrice - extraPrice) / extraPrice) * 100).toFixed(2);

  // Ước tính thời gian hòa vốn (dựa trên beta & biến động trung bình TPB 1.2% - 1.8%/phiên)
  const estDaysCurrent = Math.ceil(Number(neededGainToBreakevenCurrent) / 1.3);
  const estDaysNew = Math.ceil(Number(neededGainToBreakevenNew) / 1.3);

  const formatNumber = (num: number) => Math.round(num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>THUẬT TOÁN ĐỀ XUẤT QUYẾT ĐỊNH & HÒA VỐN: TPB</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-bold">
                Lỗ: -9.29%
              </span>
            </h2>
            <p className="text-xs text-slate-400">Phân tích đa kịch bản: Giữ nguyên · Mua bình quân · Cắt lỗ hạ Margin</p>
          </div>
        </div>
      </div>

      {/* Tóm tắt vị thế thực tế */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Khối lượng nắm giữ:</span>
          <p className="text-base font-bold font-mono text-white mt-0.5">{formatNumber(tpbPos.total_quantity)} CP</p>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Giá vốn (Hòa vốn):</span>
          <p className="text-base font-bold font-mono text-amber-400 mt-0.5">{formatNumber(tpbPos.avg_price)} đ</p>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Thị giá hiện tại:</span>
          <p className="text-base font-bold font-mono text-rose-400 mt-0.5">{formatNumber(tpbPos.market_price)} đ</p>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Vốn vay Margin (Deal):</span>
          <p className="text-base font-bold font-mono text-indigo-400 mt-0.5">6,898,107 đ</p>
        </div>
      </div>

      {/* 3 KỊCH BẢN CHIẾN LƯỢC TOÀN DIỆN */}
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
                <span>Cần tăng: <b className="text-emerald-400">+{neededGainToBreakevenCurrent}%</b> (từ 14.45 lên 15.918).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Thời gian dự kiến: <b>{estDaysCurrent} - {estDaysCurrent + 4} phiên</b> (khoảng 1.5 - 2 tuần) nếu dòng bank có sóng.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Kháng cự ngắn hạn: <b>15.20</b> (MA20) và <b>16.00</b> (vùng hòa vốn).</span>
              </li>
            </ul>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            💡 <b>Đánh giá:</b> Phù hợp nếu VN-Index giữ vững mốc 1780 điểm và không chịu áp lực lãi vay margin gấp.
          </div>
        </div>

        {/* KỊCH BẢN 2: MUA THÊM BÌNH QUÂN GIÁ */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                KỊCH BẢN 2: MUA BÌNH QUÂN
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white mt-2">Rút Ngắn Điểm Hòa Vốn</h3>
            <div className="space-y-2 text-xs text-slate-300 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Số lượng mua thêm:</label>
                  <select
                    value={extraQty}
                    onChange={(e) => setExtraQty(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                  >
                    <option value={500}>500 CP</option>
                    <option value={1000}>1,000 CP</option>
                    <option value={2000}>2,000 CP</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Giá mua thêm:</label>
                  <input
                    type="number"
                    value={extraPrice}
                    onChange={(e) => setExtraPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>Giá vốn mới sau mua:</span>
                  <b className="text-emerald-400">{formatNumber(newAvgPrice)} đ</b>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tăng cần thiết để hòa:</span>
                  <b className="text-emerald-400">+{neededGainToBreakevenNew}%</b>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Thời gian rút ngắn còn:</span>
                  <b className="text-cyan-400">{estDaysNew} phiên</b>
                </div>
              </div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            ⚠️ <b>Điều kiện mua:</b> Chỉ nạp tiền tươi gom khi TPB test hỗ trợ 14.0 - 14.2 và xuất hiện nến rút chân đảo chiều. <b>KHÔNG vay thêm margin để bắt đáy!</b>
          </div>
        </div>

        {/* KỊCH BẢN 3: PHÒNG THỦ & CẮT LỖ HẠ MARGIN */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                KỊCH BẢN 3: CẮT LỖ / HẠ NỢ
              </span>
              <ShieldCheck className="h-4 w-4 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-white mt-2">Bảo Toàn Vốn Khi Thủng 14.0</h3>
            <ul className="text-xs text-slate-300 space-y-2 mt-2">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Ngưỡng cắt lỗ kỷ luật: <b>13.80 - 14.00</b> (khi thủng hỗ trợ cứng).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Phương án tối ưu: <b>Bán hạ 500 CP</b> (50% vị thế) thu về <b>~7.1 triệu</b>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span><b>Tất toán 100% nợ Margin 6.89M</b> $\rightarrow$ Tài khoản về 100% tiền tươi, triệt tiêu hoàn toàn rủi ro Call Margin và lãi vay!</span>
              </li>
            </ul>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            🛡️ <b>Mục đích:</b> Giữ lại 500 CP bằng vốn tự có an toàn tuyệt đối, chờ tạo đáy gom lại không lo áp lực thời gian.
          </div>
        </div>
      </div>
    </div>
  );
};
