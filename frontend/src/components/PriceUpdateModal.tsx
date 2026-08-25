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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrice <= 0) return alert('Giá thị trường phải lớn hơn 0');
    await updatePrice(priceModalSymbol, newPrice);
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
            <p className="text-xs text-slate-400">Mã cổ phiếu: <span className="text-white font-mono font-bold">{priceModalSymbol}</span></p>
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
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg"
            >
              {isLoading ? 'Đang cập nhật...' : 'LƯU GIÁ MỚI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
