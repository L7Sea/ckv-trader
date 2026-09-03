import React, { useState, useEffect } from 'react';
import { thongBao } from '../lib/thongBao';
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
    if (newPrice <= 0) return thongBao.canhBao('Giá thị trường phải lớn hơn 0');
    await updatePrice(priceModalSymbol.toUpperCase().trim(), newPrice);
  };

  return (
    <div className="fixed inset-0 z-50 bg-nen backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-the border border-vien rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
        <button
          onClick={closePriceModal}
          className="absolute top-4 right-4 text-chu-phu hover:text-chu p-1 rounded-lg hover:bg-the2"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-vien">
          <div className="p-2.5 rounded-xl bg-tot-nen text-tot border border-vien">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-chu">Cập Nhật Giá Thị Trường</h3>
            <p className="text-xs text-chu-phu">Mã cổ phiếu: <span className="text-chu font-mono font-bold">{priceModalSymbol.toUpperCase()}</span> (Hiện tại: <b className="text-tot font-mono">{(priceModalCurrentPrice || 0).toLocaleString('vi-VN')} đ</b>)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-chu-phu uppercase tracking-wider mb-1.5">
              Giá Thị Trường Mới (VNĐ)
            </label>
            <input
              type="number"
              value={newPrice || ''}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              placeholder="VD: 28500"
              step="50"
              min="100"
              className="w-full bg-nen border border-vien rounded-xl px-4 py-2.5 text-base font-bold font-mono text-chu focus:outline-none focus:border-tot"
              required
              autoFocus
            />

            {/* Quick % preset buttons */}
            <div className="mt-2.5 space-y-1.5">
              <span className="text-[10px] text-chu-phu font-semibold block uppercase">Mô phỏng nhanh biến động:</span>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyPct(6.95)}
                  className="px-2 py-1.5 rounded-lg bg-the2 text-nhan-chu border border-vien hover:bg-the2 font-bold transition"
                >
                  +7% (Trần)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPct(3)}
                  className="px-2 py-1.5 rounded-lg bg-tot-nen text-tot border border-vien hover:bg-tot-nen font-bold transition"
                >
                  +3%
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPct(1)}
                  className="px-2 py-1.5 rounded-lg bg-tot-nen text-tot border border-vien hover:bg-tot-nen font-bold transition"
                >
                  +1%
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPct(-6.95)}
                  className="px-2 py-1.5 rounded-lg bg-the2 text-nhan-chu border border-vien hover:bg-the2 font-bold transition"
                >
                  -7% (Sàn)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPct(-3)}
                  className="px-2 py-1.5 rounded-lg bg-loi-nen text-loi border border-vien hover:bg-loi-nen font-bold transition"
                >
                  -3%
                </button>
                <button
                  type="button"
                  onClick={() => setNewPrice(basePrice)}
                  className="px-2 py-1.5 rounded-lg bg-the2 text-chu-phu border border-vien hover:bg-the2 font-bold transition"
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
              className="w-full py-3 rounded-xl font-bold text-sm bg-tot hover:bg-tot text-tren-nhan transition shadow-lg flex items-center justify-center gap-2"
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
