import React, { useState, useEffect } from 'react';
import { ShoppingCart, Tag, AlertCircle, Calculator } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

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
  const feeRate = 0.15; // 0.15% phí giao dịch chuẩn
  const taxRate = 0.1;  // 0.1% thuế bán chứng khoán
  const [notes, setNotes] = useState('');

  // Tự động đồng bộ khi click "Bán nhanh" hoặc chọn từ bảng
  useEffect(() => {
    if (selectedSymbol) {
      setSymbol(selectedSymbol);
      if (selectedPrice > 0) setPrice(selectedPrice);
      if (selectedAction) setType(selectedAction);
    }
  }, [selectedSymbol, selectedPrice, selectedAction]);

  const cleanSymbol = symbol.trim().toUpperCase();
  const currentPos = positions.find((p) => p.symbol === cleanSymbol);

  // Tính toán số liệu theo thời gian thực
  const tradeValue = (price || 0) * (quantity || 0);
  const fee = Math.round((tradeValue * feeRate) / 100);
  const tax = type === 'SELL' ? Math.round((tradeValue * taxRate) / 100) : 0;

  // BUY: Giá trị khớp + Phí | SELL: Giá trị khớp - Phí - Thuế
  const netAmount = type === 'BUY' ? tradeValue + fee : tradeValue - fee - tax;

  // Kiểm tra điều kiện hợp lệ
  const cash = portfolio?.cash || 0;
  const availableShares = currentPos?.available_quantity || 0;
  const t1Shares = currentPos?.t1_quantity || 0;
  const t2Shares = currentPos?.t2_quantity || 0;

  const isBuyValid = type === 'BUY' && price > 0 && quantity > 0 && cash >= netAmount;
  const isSellValid = type === 'SELL' && price > 0 && quantity > 0 && availableShares >= quantity;

  const formatNumber = (num: number) => num.toLocaleString('vi-VN');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanSymbol) return alert('Vui lòng nhập mã cổ phiếu');
    if (price <= 0) return alert('Giá phải lớn hơn 0');
    if (quantity <= 0) return alert('Khối lượng phải lớn hơn 0');

    if (type === 'BUY' && cash < netAmount) {
      return alert(`Không đủ sức mua! Cần ${formatNumber(netAmount)}đ, hiện có ${formatNumber(cash)}đ`);
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
      notes
    });

    if (success) {
      setQuantity(100);
      setNotes('');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calculator className="h-5 w-5 text-emerald-400" />
          <span>Sổ Đặt Lệnh (Trading Ticket)</span>
        </h2>
        <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
          Tuân thủ T+2.5
        </span>
      </div>

      {/* Tabs MUA / BÁN */}
      <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
        <button
          type="button"
          onClick={() => setType('BUY')}
          className={`py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${
            type === 'BUY'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>LỆNH MUA (BUY)</span>
        </button>
        <button
          type="button"
          onClick={() => setType('SELL')}
          className={`py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${
            type === 'SELL'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>LỆNH BÁN (SELL)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Mã Cổ Phiếu */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Mã Cổ Phiếu (Symbol)
          </label>
          <div className="relative">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="VD: HPG, SSI, FPT, MWG..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-base font-bold font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              required
            />
            {currentPos && (
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                Giá vốn: {formatNumber(currentPos.avg_price)}đ
              </span>
            )}
          </div>
        </div>

        {/* Khung thông tin T+2.5 của Mã đang chọn */}
        {cleanSymbol && currentPos && (
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Khả dụng (Bán được ngay):</span>
              <span className="font-bold text-emerald-400">{formatNumber(availableShares)} CP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hàng chờ về T+1:</span>
              <span className="text-amber-400">{formatNumber(t1Shares)} CP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hàng chờ về T+2 (Mua hôm nay):</span>
              <span className="text-sky-400">{formatNumber(t2Shares)} CP</span>
            </div>
          </div>
        )}

        {/* Giá khớp & Khối lượng */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Giá Khớp (VNĐ)
            </label>
            <input
              type="number"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="VD: 25000"
              step="50"
              min="0"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-bold font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Khối Lượng (CP)
            </label>
            <input
              type="number"
              value={quantity || ''}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="VD: 1000"
              step="100"
              min="1"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-bold font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>
        </div>

        {/* Nút chọn khối lượng nhanh */}
        <div className="flex gap-1.5">
          {[100, 500, 1000, 2000, 5000].map((qty) => (
            <button
              key={qty}
              type="button"
              onClick={() => setQuantity(qty)}
              className="flex-1 py-1 text-[11px] font-mono font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              +{qty >= 1000 ? `${qty / 1000}k` : qty}
            </button>
          ))}
          {type === 'SELL' && availableShares > 0 && (
            <button
              type="button"
              onClick={() => setQuantity(availableShares)}
              className="px-2 py-1 text-[11px] font-mono font-bold rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition"
            >
              Max All
            </button>
          )}
        </div>

        {/* Phí & Thuế */}
        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Giá trị giao dịch:</span>
            <span className="font-mono text-slate-200 font-semibold">{formatNumber(tradeValue)} đ</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Phí GD ({feeRate}%):</span>
            <span className="font-mono text-slate-300">{formatNumber(fee)} đ</span>
          </div>
          {type === 'SELL' && (
            <div className="flex justify-between items-center text-slate-400">
              <span>Thuế TNCN ({taxRate}%):</span>
              <span className="font-mono text-slate-300">{formatNumber(tax)} đ</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
            <span className="text-white">
              {type === 'BUY' ? 'Tổng tiền cần thanh toán:' : 'Thực nhận (Về T+2.5):'}
            </span>
            <span className={`font-mono text-base ${type === 'BUY' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {formatNumber(netAmount)} đ
            </span>
          </div>
        </div>

        {/* Cảnh báo Sức mua / Cổ phiếu khả dụng */}
        {type === 'BUY' && cash < netAmount && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Không đủ sức mua! Còn thiếu {formatNumber(netAmount - cash)}đ.</span>
          </div>
        )}

        {type === 'SELL' && availableShares < quantity && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Không đủ cổ phiếu khả dụng để bán! (Có {formatNumber(availableShares)} CP sẵn sàng).</span>
          </div>
        )}

        {/* Ghi chú */}
        <div>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú lý do vào lệnh (tuỳ chọn)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-slate-600"
          />
        </div>

        {/* Nút Đặt Lệnh */}
        <button
          type="submit"
          disabled={isLoading || (type === 'BUY' && !isBuyValid) || (type === 'SELL' && !isSellValid)}
          className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
            type === 'BUY'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20 active:scale-[0.99]'
              : 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/20 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <span>Đang xử lý giao dịch...</span>
          ) : (
            <span>XÁC NHẬN ĐẶT LỆNH {type === 'BUY' ? 'MUA' : 'BÁN'} {cleanSymbol || ''}</span>
          )}
        </button>
      </form>
    </div>
  );
};
