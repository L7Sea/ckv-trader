import React, { useState, useEffect } from 'react';
import { ShoppingCart, Tag, AlertCircle, Calculator, Calendar, Target, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { TradeStrategy } from '../types';
import { VN50_WATCHLIST } from './MarketBoard';

export const OrderForm: React.FC = () => {
  const {
    portfolio,
    positions,
    placeOrder,
    isLoading,
    selectedSymbol,
    selectedPrice,
    selectedAction
  } = useTradingStore();

  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(100);
  const [fundingSource, setFundingSource] = useState<'CASH' | 'MARGIN_DEAL' | 'HYBRID'>('MARGIN_DEAL');
  const feeRate = 0.15; // 0.15% phí giao dịch chuẩn
  const taxRate = 0.1;  // 0.1% thuế bán chứng khoán
  const [strategy, setStrategy] = useState<TradeStrategy>('PULLBACK_MA20');
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [tradeDate, setTradeDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  // Tự động đồng bộ khi click từ bảng giá hoặc danh mục
  useEffect(() => {
    if (selectedSymbol) {
      setSymbol(selectedSymbol);
      if (selectedPrice > 0) {
        setPrice(selectedPrice);
        setTargetPrice(Math.round(selectedPrice * 1.1)); // Target mặc định +10%
        setStopLoss(Math.round(selectedPrice * 0.93));   // Cutloss mặc định -7%
      }
      if (selectedAction) setType(selectedAction);
    }
  }, [selectedSymbol, selectedPrice, selectedAction]);

  const cleanSymbol = symbol.trim().toUpperCase();
  const currentPos = positions.find((p) => p.symbol === cleanSymbol);

  // Tính toán số liệu
  const tradeValue = (price || 0) * (quantity || 0);
  const fee = Math.round((tradeValue * feeRate) / 100);
  const tax = type === 'SELL' ? Math.round((tradeValue * taxRate) / 100) : 0;
  const netAmount = type === 'BUY' ? tradeValue + fee : tradeValue - fee - tax;

  // Tính tỷ lệ Risk / Reward (R:R)
  const potentialProfit = targetPrice > price ? targetPrice - price : 0;
  const potentialLoss = price > stopLoss && stopLoss > 0 ? price - stopLoss : 0;
  const rrRatio = potentialLoss > 0 ? (potentialProfit / potentialLoss).toFixed(2) : 'N/A';

  const cash = portfolio?.cash || 0;
  const availableShares = currentPos?.available_quantity || 0;
  const t1Shares = currentPos?.t1_quantity || 0;
  const t2Shares = currentPos?.t2_quantity || 0;

  // Sức mua tối đa có thể giải ngân (Tiền mặt + Sức mua nở ra từ Đòn bẩy Margin 1:1)
  const maxCashBuyQty = price > 0 ? Math.floor(cash / (price * 1.0015)) : 0;
  const maxMarginBuyQty = price > 0 ? Math.floor((cash * 2 + 50000000) / (price * 1.0015)) : 0;

  const isBuyValid = price > 0 && quantity > 0 && (fundingSource !== 'CASH' || cash >= netAmount);
  const isSellValid = price > 0 && quantity > 0 && availableShares >= quantity;

  const formatNumber = (num: number) => num.toLocaleString('vi-VN');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanSymbol) return alert('Vui lòng nhập mã cổ phiếu');
    if (price <= 0) return alert('Giá phải lớn hơn 0');
    if (quantity <= 0) return alert('Khối lượng phải lớn hơn 0');

    if (type === 'BUY' && fundingSource === 'CASH' && cash < netAmount) {
      return alert(`Không đủ tiền mặt khả dụng! Cần ${formatNumber(netAmount)}đ, hiện có ${formatNumber(cash)}đ. Anh có thể chọn 'Vay Margin Deal (11.5%)' để giải ngân!`);
    }

    if (type === 'SELL' && availableShares < quantity) {
      return alert(`Không đủ cổ phiếu khả dụng để bán! Yêu cầu: ${formatNumber(quantity)}, Khả dụng: ${formatNumber(availableShares)} (Cổ phiếu T1: ${formatNumber(t1Shares)}, T2: ${formatNumber(t2Shares)} chưa về)`);
    }

    const success = await placeOrder({
      type,
      symbol: cleanSymbol,
      price,
      quantity,
      fee,
      tax,
      funding_source: fundingSource,
      strategy,
      target_price: targetPrice > 0 ? targetPrice : undefined,
      stop_loss: stopLoss > 0 ? stopLoss : undefined,
      trade_date: tradeDate,
      notes: notes || (fundingSource === 'MARGIN_DEAL' ? 'Giải ngân bằng Vốn Vay Margin Deal (11.5%)' : fundingSource === 'HYBRID' ? 'Giải ngân Hỗn Hợp (50% Tiền Mặt + 50% Margin)' : 'Mua bằng Tiền Mặt')
    });

    if (success) {
      setNotes('');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <span>Ghi Nhật Ký Lệnh & Đề Xuất</span>
        </h2>
        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
          Chuẩn T+2.5
        </span>
      </div>

      {/* Tabs MUA / BÁN */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setType('BUY')}
          className={`py-2 rounded-xl text-xs font-bold transition ${
            type === 'BUY'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          GHI MUA (VÀO LỆNH)
        </button>
        <button
          type="button"
          onClick={() => setType('SELL')}
          className={`py-2 rounded-xl text-xs font-bold transition ${
            type === 'SELL'
              ? 'bg-rose-500 text-white font-black shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          GHI BÁN (CHỐT / CẮT)
        </button>
      </div>

      {/* Tùy Chọn Nguồn Vốn Khi MUA */}
      {type === 'BUY' && (
        <div className="p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
          <label className="text-[11px] text-slate-400 font-semibold block">Nguồn Vốn Giải Ngân:</label>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono font-bold">
            <button
              type="button"
              onClick={() => setFundingSource('CASH')}
              className={`py-1.5 px-2 rounded-xl border transition flex flex-col items-center justify-center gap-0.5 ${
                fundingSource === 'CASH'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>100% Tiền Mặt</span>
              <span className="text-[9px] font-normal text-slate-400 font-sans">Tiểu khoản 01</span>
            </button>
            <button
              type="button"
              onClick={() => setFundingSource('MARGIN_DEAL')}
              className={`py-1.5 px-2 rounded-xl border transition flex flex-col items-center justify-center gap-0.5 ${
                fundingSource === 'MARGIN_DEAL'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>100% Vay Deal</span>
              <span className="text-[9px] font-normal text-purple-300/80 font-sans">Margin 11.5%</span>
            </button>
            <button
              type="button"
              onClick={() => setFundingSource('HYBRID')}
              className={`py-1.5 px-2 rounded-xl border transition flex flex-col items-center justify-center gap-0.5 ${
                fundingSource === 'HYBRID'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>Hỗn Hợp (50-50)</span>
              <span className="text-[9px] font-normal text-amber-300/80 font-sans">Tự có + Vay</span>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Ngày Giao Dịch */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            <span>Ngày giao dịch (Khớp lệnh):</span>
          </label>
          <input
            type="date"
            value={tradeDate}
            onChange={(e) => setTradeDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Mã Cổ Phiếu & Giá Khớp */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold">Mã Cổ Phiếu:</label>
            <input
              type="text"
              placeholder="VD: HPG, FPT..."
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold">Giá Đề Xuất / Khớp:</label>
            <input
              type="number"
              step="50"
              placeholder="VND"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Khối Lượng (Lô 100) */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="font-semibold">Khối lượng (Lô 100):</span>
            <span className="font-mono text-emerald-400">{formatNumber(quantity)} CP</span>
          </div>
          <input
            type="number"
            step="100"
            min="100"
            value={quantity || ''}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
          />
          {/* Quick Quantity Shortcuts */}
          <div className="grid grid-cols-4 gap-1 pt-1">
            {[100, 500, 1000, 2000].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantity(q)}
                className="py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px] font-mono text-slate-400 hover:text-white"
              >
                +{formatNumber(q)}
              </button>
            ))}
          </div>
        </div>

        {/* Chiến Lược & Lý Do Vào Lệnh */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-amber-400" />
            <span>Chiến lược / Lý do giao dịch:</span>
          </label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as TradeStrategy)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="PULLBACK_MA20">📈 Bắt đáy / Chạm hỗ trợ MA20</option>
            <option value="BREAKOUT">🚀 Mua vượt đỉnh (Breakout)</option>
            <option value="ACCUMULATION">🧱 Tích lũy nền giá chặt chẽ</option>
            <option value="DIVIDEND">🎁 Săn quyền nhận cổ tức</option>
            <option value="TAKE_PROFIT">🎯 Chốt lời đạt kỳ vọng</option>
            <option value="STOP_LOSS">🛑 Cắt lỗ kỷ luật (-5% / -7%)</option>
            <option value="OTHER">💡 Lý do khác</option>
          </select>
        </div>

        {/* Giá Mục Tiêu & Cắt Lỗ (Kế hoạch quản trị rủi ro) */}
        {type === 'BUY' && (
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Kế Hoạch Quản Trị Rủi Ro (R:R)</span>
              <span className="font-mono text-emerald-400 font-bold">R:R = {rrRatio}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-emerald-400">Target (Mục tiêu):</label>
                <input
                  type="number"
                  placeholder="Giá chốt lời"
                  value={targetPrice || ''}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-emerald-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-rose-400">Stop Loss (Cắt lỗ):</label>
                <input
                  type="number"
                  placeholder="Giá cắt lỗ"
                  value={stopLoss || ''}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-rose-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Ghi chú nhật ký tâm lý */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-semibold">Ghi chú & Tâm lý vào lệnh:</label>
          <textarea
            rows={2}
            placeholder="Ghi lại lý do, nhận định thị trường hoặc bài học..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Tóm tắt dòng tiền */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Giá trị giao dịch:</span>
            <span className="text-white">{formatNumber(tradeValue)} VND</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Thuế & Phí (0.15% - 0.25%):</span>
            <span className="text-slate-300">{formatNumber(fee + tax)} VND</span>
          </div>
          <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800">
            <span>Tổng thanh toán ({type === 'BUY' ? 'Trừ tiền' : 'Tiền về'}):</span>
            <span className={type === 'BUY' ? 'text-emerald-400' : 'text-cyan-400'}>
              {formatNumber(netAmount)} VND
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || (type === 'BUY' && !isBuyValid) || (type === 'SELL' && !isSellValid)}
          className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-lg ${
            type === 'BUY'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 disabled:opacity-40'
              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20 disabled:opacity-40'
          }`}
        >
          {isLoading ? 'ĐANG GHI SỔ CÁI...' : type === 'BUY' ? 'GHI SỔ LỆNH MUA' : 'GHI SỔ LỆNH BÁN'}
        </button>
      </form>
    </div>
  );
};
