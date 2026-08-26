import React, { useState, useEffect } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const PriceUpdateModal: React.FC = () => {
  const { isPriceModalOpen, closePriceModal, priceModalSymbol, priceModalCurrentPrice, updatePrice, isLoading } = useTradingStore();
  const [newPrice, setNewPrice] = useState<number>(0);

  useEffect(() => {
    if (priceModalCurrentPrice) {
      setNewPrice(priceModalCurrentPrice);
    }
  }, [priceModalCurrentPrice, isPriceModalOpen]);

  if (!isPriceModalOpen) return null;

  const basePrice = priceModalCurrentPrice || 10000;

  const handleApplyPct = (pct: number) => {
    const calculated = Math.round(basePrice * (1 + pct / 100) / 50) * 50;
    setNewPrice(Math.max(100, calculated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrice <= 0) return alert('Giá thị trường phải lớn hơn 0');
    await updatePrice(priceModalSymbol.toUpperCase().trim(), newPrice);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
        <button
          onClick={closePriceModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Cập Nhật Giá Thị Trường</h3>
            <p className="text-xs text-slate-400">Mã cổ phiếu: <span className="text-white font-mono font-bold">{priceModalSymbol.toUpperCase()}</span> (Hiện tại: <b className="text-emerald-400 font-mono">{(priceModalCurrentPrice || 0).toLocaleString('vi-VN')} đ</b>)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Giá Thị Trường Mới (VNĐ)
            </label>
            <input
              type="number"
              value={newPrice || ''}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              placeholder="VD: 28500"
              step="50"
              min="100"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-base font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
              required
              autoFocus
            />

            {/* Quick % preset buttons */}
            <div className="mt-2.5 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Mô phỏng nhanh biến động:</span>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyPct(6.95)}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 font-bold transition"
                >
                  +7% (Trần)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPct(3)}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold transition"
                >
                  +3%
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPct(1)}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold transition"
                >
                  +1%
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPct(-6.95)}
                  className="px-2 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold transition"
                >
                  -7% (Sàn)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPct(-3)}
                  className="px-2 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-bold transition"
                >
                  -3%
                </button>
                <button
                  type="button"
                  onClick={() => setNewPrice(basePrice)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 font-bold transition"
                >
                  Về Gốc
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{isLoading ? 'Đang cập nhật...' : 'LƯU GIÁ MỚI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
