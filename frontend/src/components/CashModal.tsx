import React, { useState } from 'react';
import { X, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const CashModal: React.FC = () => {
  const { isCashModalOpen, closeCashModal, adjustCash, portfolio, isLoading } = useTradingStore();
  const [action, setAction] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [amount, setAmount] = useState<number>(10000000);

  if (!isCashModalOpen) return null;

  const currentCash = portfolio?.cash || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert('Số tiền phải lớn hơn 0');
    if (action === 'WITHDRAW' && currentCash < amount) {
      return alert('Số dư tiền mặt không đủ để rút!');
    }
    await adjustCash(amount, action);
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={closeCashModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Quản Lý Tiền Mặt</h3>
            <p className="text-xs text-slate-400">Số dư hiện tại: <span className="text-emerald-400 font-mono font-bold">{formatVND(currentCash)}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setAction('DEPOSIT')}
              className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                action === 'DEPOSIT' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownRight className="h-4 w-4" />
              NẠP TIỀN
            </button>
            <button
              type="button"
              onClick={() => setAction('WITHDRAW')}
              className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                action === 'WITHDRAW' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
              RÚT TIỀN
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Số Tiền (VNĐ)
            </label>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="VD: 50000000"
              step="1000000"
              min="100000"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-base font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Nút chọn nhanh */}
          <div className="flex gap-2">
            {[10000000, 50000000, 100000000, 200000000].map((quick) => (
              <button
                key={quick}
                type="button"
                onClick={() => setAmount(quick)}
                className="flex-1 py-1 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                +{quick / 1000000}Tr
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-sm transition shadow-lg ${
                action === 'DEPOSIT'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-rose-500 hover:bg-rose-400 text-white'
              }`}
            >
              {isLoading ? 'Đang xử lý...' : `XÁC NHẬN ${action === 'DEPOSIT' ? 'NẠP' : 'RÚT'} TIỀN`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
