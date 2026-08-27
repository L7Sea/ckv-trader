import React, { useState } from 'react';
import { X, Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, Edit3 } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const CashModal: React.FC = () => {
  const { isCashModalOpen, closeCashModal, adjustCash, repayMarginDebt, directUpdateAssets, portfolio, isLoading } = useTradingStore();
  const [action, setAction] = useState<'DEPOSIT' | 'WITHDRAW' | 'REPAY_DEBT' | 'MANUAL_OVERRIDE'>('DEPOSIT');
  const [amount, setAmount] = useState<number>(10000000);
  const [customCash, setCustomCash] = useState<number>(portfolio?.cash || 171);
  const [customDebt, setCustomDebt] = useState<number>(portfolio?.margin_debt || 0);

  if (!isCashModalOpen) return null;

  const currentCash = portfolio?.cash || 0;
  const currentMarginDebt = portfolio?.margin_debt || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'MANUAL_OVERRIDE') {
      await directUpdateAssets(customCash, customDebt);
      closeCashModal();
      return;
    }

    if (amount <= 0) return alert('Số tiền phải lớn hơn 0');
    if (action === 'WITHDRAW' && currentCash < amount) {
      return alert('Số dư tiền mặt không đủ để rút!');
    }
    
    if (action === 'REPAY_DEBT') {
      await repayMarginDebt(amount);
      closeCashModal();
      return;
    }

    await adjustCash(amount, action);
    closeCashModal();
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
        <button
          onClick={closeCashModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Quản Lý Nguồn Vốn & Nợ Margin</h3>
            <p className="text-xs text-slate-400">
              Tiền mặt: <b className="text-emerald-400 font-mono">{formatVND(currentCash)}</b> • Nợ Deal: <b className="text-purple-400 font-mono">{formatVND(currentMarginDebt)}</b>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 4 Tabs Chức Năng */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setAction('DEPOSIT')}
              className={`py-1.5 rounded-xl transition flex flex-col items-center justify-center ${
                action === 'DEPOSIT' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>NẠP TIỀN</span>
            </button>
            <button
              type="button"
              onClick={() => setAction('WITHDRAW')}
              className={`py-1.5 rounded-xl transition flex flex-col items-center justify-center ${
                action === 'WITHDRAW' ? 'bg-rose-500 text-white font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>RÚT TIỀN</span>
            </button>
            <button
              type="button"
              onClick={() => setAction('REPAY_DEBT')}
              className={`py-1.5 rounded-xl transition flex flex-col items-center justify-center ${
                action === 'REPAY_DEBT' ? 'bg-purple-500 text-white font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>TRẢ NỢ</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAction('MANUAL_OVERRIDE');
                setCustomCash(currentCash);
                setCustomDebt(currentMarginDebt);
              }}
              className={`py-1.5 rounded-xl transition flex flex-col items-center justify-center ${
                action === 'MANUAL_OVERRIDE' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>SỬA SỐ DƯ</span>
            </button>
          </div>

          {action === 'MANUAL_OVERRIDE' ? (
            /* Tab Sửa Trực Tiếp Tiền Mặt & Nợ */
            <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/20">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                <Edit3 className="h-4 w-4" />
                <span>Hiệu chỉnh trực tiếp số dư thực tế:</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Tiền mặt khả dụng (đ):</label>
                  <input
                    type="number"
                    value={customCash}
                    onChange={(e) => setCustomCash(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Tổng Nợ Margin thực tế (đ):</label>
                  <input
                    type="number"
                    value={customDebt}
                    onChange={(e) => setCustomDebt(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Tabs Nạp / Rút / Trả Nợ Tiêu Chuẩn */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {action === 'REPAY_DEBT' ? 'Số Tiền Trả Nợ Margin (VNĐ)' : 'Số Tiền (VNĐ)'}
                </label>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="VD: 10000000"
                  step="1000000"
                  min="0"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-base font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Quy đổi:</span>
                  <b className="text-emerald-400 font-bold">{formatVND(amount || 0)}</b>
                </div>
              </div>

              {/* Nút chọn nhanh */}
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {[10000000, 20000000, 50000000, 100000000, currentMarginDebt].map((quick, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAmount(quick)}
                    className="flex-1 py-1.5 px-2 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition"
                  >
                    {idx === 4 ? 'Tất toán nợ' : `+${quick / 1000000}Tr`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-2xl font-bold text-sm transition shadow-lg ${
                action === 'DEPOSIT'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : action === 'WITHDRAW'
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : action === 'REPAY_DEBT'
                  ? 'bg-purple-500 hover:bg-purple-400 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isLoading
                ? 'Đang xử lý...'
                : action === 'DEPOSIT'
                ? 'XÁC NHẬN NẠP TIỀN'
                : action === 'WITHDRAW'
                ? 'XÁC NHẬN RÚT TIỀN'
                : action === 'REPAY_DEBT'
                ? 'XÁC NHẬN TRẢ NỢ DEAL MARGIN'
                : 'LƯU HIỆU CHỈNH SỐ DƯ TÀI SẢN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
