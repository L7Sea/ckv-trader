import React, { useState } from 'react';
import { thongBao } from '../lib/thongBao';
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

    if (amount <= 0) return thongBao.canhBao('Số tiền phải lớn hơn 0');
    if (action === 'WITHDRAW' && currentCash < amount) {
      return thongBao.loi('Tiền mặt trong sổ không đủ để rút khoản này!');
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
    <div className="fixed inset-0 z-50 bg-nen backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-the border border-vien rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
        <button
          onClick={closeCashModal}
          className="absolute top-4 right-4 text-chu-phu hover:text-chu p-1 rounded-lg hover:bg-the2"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-vien">
          <div className="p-2.5 rounded-2xl bg-tot-nen text-tot border border-vien">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-chu">Hiệu Chỉnh Vốn & Nợ Trong Sổ</h3>
            <p className="text-xs text-chu-phu">
              Tiền mặt: <b className="text-tot font-mono">{formatVND(currentCash)}</b> • Nợ Deal: <b className="text-nhan-chu font-mono">{formatVND(currentMarginDebt)}</b>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 4 Tabs Chức Năng */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-nen rounded-2xl border border-vien text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setAction('DEPOSIT')}
              className={`py-1.5 rounded-xl transition flex flex-col items-center justify-center ${
                action === 'DEPOSIT' ? 'bg-tot text-tren-nhan font-black' : 'text-chu-phu hover:text-chu'
              }`}
            >
              <span>BỔ SUNG VỐN</span>
            </button>
            <button
              type="button"
              onClick={() => setAction('WITHDRAW')}
              className={`py-1.5 rounded-xl transition flex flex-col items-center justify-center ${
                action === 'WITHDRAW' ? 'bg-loi text-tren-nhan font-black' : 'text-chu-phu hover:text-chu'
              }`}
            >
              <span>RÚT VỐN</span>
            </button>
            <button
              type="button"
              onClick={() => setAction('REPAY_DEBT')}
              className={`py-1.5 rounded-xl transition flex flex-col items-center justify-center ${
                action === 'REPAY_DEBT' ? 'bg-nhan text-tren-nhan font-black' : 'text-chu-phu hover:text-chu'
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
                action === 'MANUAL_OVERRIDE' ? 'bg-canh-bao text-tren-nhan font-black' : 'text-chu-phu hover:text-chu'
              }`}
            >
              <span>SỬA SỐ DƯ</span>
            </button>
          </div>

          {action === 'MANUAL_OVERRIDE' ? (
            /* Tab Sửa Trực Tiếp Tiền Mặt & Nợ */
            <div className="space-y-3 p-3.5 rounded-2xl bg-nen border border-vien">
              <div className="flex items-center gap-1.5 text-xs text-canh-bao font-bold">
                <Edit3 className="h-4 w-4" />
                <span>Hiệu chỉnh trực tiếp số dư thực tế:</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-chu-phu block mb-1">Tiền mặt khả dụng (đ):</label>
                  <input
                    type="number"
                    value={customCash}
                    onChange={(e) => setCustomCash(Number(e.target.value))}
                    className="w-full bg-the border border-vien rounded-xl px-3 py-2 text-sm font-mono font-bold text-chu focus:outline-none focus:border-canh-bao"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-chu-phu block mb-1">Tổng Nợ Margin thực tế (đ):</label>
                  <input
                    type="number"
                    value={customDebt}
                    onChange={(e) => setCustomDebt(Number(e.target.value))}
                    className="w-full bg-the border border-vien rounded-xl px-3 py-2 text-sm font-mono font-bold text-chu focus:outline-none focus:border-nhan-chu"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Tabs Bổ sung / Rút vốn / Trả nợ */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-chu-phu uppercase tracking-wider mb-1.5">
                  {action === 'REPAY_DEBT' ? 'Số tiền trả nợ Margin (đ)' : 'Số vốn (đ)'}
                </label>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="VD: 10000000"
                  step="1000000"
                  min="0"
                  className="w-full bg-nen border border-vien rounded-xl px-4 py-2.5 text-base font-bold font-mono text-chu focus:outline-none focus:border-tot"
                  required
                />
                <div className="mt-1 flex items-center justify-between text-xs text-chu-phu font-mono">
                  <span>Quy đổi:</span>
                  <b className="text-tot font-bold">{formatVND(amount || 0)}</b>
                </div>
              </div>

              {/* Nút chọn nhanh */}
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {[10000000, 20000000, 50000000, 100000000, currentMarginDebt].map((quick, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAmount(quick)}
                    className="flex-1 py-1.5 px-2 text-xs font-mono rounded-lg bg-the2 hover:bg-the2 text-chu border border-vien hover:border-vien-ro transition"
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
                  ? 'bg-tot hover:bg-tot text-tren-nhan'
                  : action === 'WITHDRAW'
                  ? 'bg-loi hover:bg-loi text-tren-nhan'
                  : action === 'REPAY_DEBT'
                  ? 'bg-nhan hover:bg-nhan text-tren-nhan'
                  : 'bg-canh-bao hover:bg-canh-bao text-tren-nhan'
              }`}
            >
              {isLoading
                ? 'Đang xử lý...'
                : action === 'DEPOSIT'
                ? 'GHI BỔ SUNG VỐN'
                : action === 'WITHDRAW'
                ? 'GHI RÚT VỐN'
                : action === 'REPAY_DEBT'
                ? 'GHI TRẢ NỢ MARGIN'
                : 'LƯU HIỆU CHỈNH SỐ DƯ TÀI SẢN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
