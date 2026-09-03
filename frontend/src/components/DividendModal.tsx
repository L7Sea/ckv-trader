import React, { useState } from 'react';
import { thongBao } from '../lib/thongBao';
import { X, Gift, Percent, DollarSign, Layers, CheckCircle2 } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

interface DividendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DividendModal: React.FC<DividendModalProps> = ({ isOpen, onClose }) => {
  const { positions, placeOrder, adjustCash, isLoading } = useTradingStore();
  const [type, setType] = useState<'CASH' | 'SHARE'>('CASH');
  const [symbol, setSymbol] = useState(positions[0]?.symbol || '');
  const [cashPerShare, setCashPerShare] = useState<number>(1000); // 1000đ/CP (10%)
  const [shareRatioPct, setShareRatioPct] = useState<number>(15);  // 15% cổ phiếu thưởng
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  if (positions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-nen backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-the border border-vien rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-chu-phu hover:text-chu p-1.5 rounded-xl hover:bg-the2 transition"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="p-3 rounded-2xl bg-canh-bao-nen text-canh-bao border border-vien inline-block">
            <Gift className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-chu">Chưa Có Cổ Phiếu Nắm Giữ</h3>
          <p className="text-xs text-chu-phu">
            Tài khoản của bạn hiện tại chưa nắm giữ cổ phiếu nào để nhận quyền cổ tức tiền mặt hoặc cổ phiếu thưởng. Vui lòng khớp lệnh mua cổ phiếu trước!
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-the2 hover:bg-the2 text-chu font-bold text-xs transition"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    );
  }

  const currentPos = positions.find((p) => p.symbol === symbol) || positions[0];
  const totalQty = currentPos?.total_quantity || 0;

  // Tính toán cổ tức tiền
  const grossCash = totalQty * (cashPerShare || 0);
  const taxCash = Math.round(grossCash * 0.05); // Thuế cổ tức tiền mặt 5% theo luật VN
  const netCashReceived = grossCash - taxCash;

  // Tính toán cổ tức cổ phiếu
  const bonusShares = Math.floor(totalQty * ((shareRatioPct || 0) / 100));
  const newTotalShares = totalQty + bonusShares;
  const newAvgPrice = newTotalShares > 0 ? (totalQty * currentPos?.avg_price) / newTotalShares : 0;

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPos) return thongBao.canhBao('Vui lòng chọn một mã cổ phiếu đang sở hữu');

    if (type === 'CASH') {
      if (cashPerShare <= 0) return thongBao.canhBao('Số tiền cổ tức phải lớn hơn 0');
      // Nạp tiền cổ tức thực nhận vào tài khoản
      await adjustCash(netCashReceived, 'DEPOSIT');
      thongBao.tot(`Đã nhận ${formatNumber(netCashReceived)}đ cổ tức tiền mặt từ mã ${symbol} (đã trừ 5% thuế TNCN: ${formatNumber(taxCash)}đ)`);
    } else {
      if (bonusShares <= 0) return thongBao.canhBao('Tỷ lệ cổ phiếu thưởng phải lớn hơn 0');
      // Thêm cổ phiếu thưởng vào rổ
      await placeOrder({
        type: 'BUY',
        symbol,
        price: 0,
        quantity: bonusShares,
        fee: 0,
        tax: 0,
        notes: notes || `Nhận cổ tức cổ phiếu tỷ lệ ${shareRatioPct}% (${bonusShares} CP)`
      });
      thongBao.tot(`Đã nhận ${formatNumber(bonusShares)} CP cổ tức mã ${symbol}. Giá vốn tự điều chỉnh thành ${formatNumber(Math.round(newAvgPrice))}đ/CP.`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-nen backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-the border border-vien rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-chu-phu hover:text-chu p-1.5 rounded-xl hover:bg-the2 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-vien">
          <div className="p-3 rounded-2xl bg-canh-bao-nen text-canh-bao border border-vien">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-chu">Quản Lý Quyền Cổ Tức</h3>
            <p className="text-xs text-chu-phu">Tự động tính thuế 5% & điều chỉnh giá vốn</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Loại Cổ Tức */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-nen rounded-xl border border-vien">
            <button
              type="button"
              onClick={() => setType('CASH')}
              className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                type === 'CASH' ? 'bg-canh-bao text-tren-nhan shadow-md shadow-md' : 'text-chu-phu hover:text-chu'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              CỔ TỨC TIỀN MẶT
            </button>
            <button
              type="button"
              onClick={() => setType('SHARE')}
              className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                type === 'SHARE' ? 'bg-nhan text-tren-nhan shadow-md shadow-md' : 'text-chu-phu hover:text-chu'
              }`}
            >
              <Layers className="h-4 w-4" />
              CỔ TỨC CỔ PHIẾU
            </button>
          </div>

          {/* Chọn Mã Cổ Phiếu */}
          <div>
            <label className="block text-xs font-semibold text-chu-phu uppercase tracking-wider mb-1.5">
              Mã Cổ Phiếu Hưởng Quyền
            </label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-nen border border-vien rounded-xl px-4 py-2.5 text-sm font-bold font-mono text-chu focus:outline-none focus:border-canh-bao"
            >
              {positions.map((p) => (
                <option key={p.symbol} value={p.symbol}>
                  {p.symbol} (Đang giữ {formatNumber(p.total_quantity)} CP - Giá vốn {formatNumber(p.avg_price)}đ)
                </option>
              ))}
            </select>
          </div>

          {/* Nếu là Cổ tức tiền */}
          {type === 'CASH' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-chu-phu uppercase tracking-wider mb-1.5">
                  Số Tiền Cổ Tức / 1 Cổ Phiếu (VNĐ)
                </label>
                <input
                  type="number"
                  value={cashPerShare || ''}
                  onChange={(e) => setCashPerShare(Number(e.target.value))}
                  placeholder="VD: 1500 (tức 15%)"
                  step="100"
                  min="100"
                  className="w-full bg-nen border border-vien rounded-xl px-4 py-2.5 text-base font-bold font-mono text-chu focus:outline-none focus:border-canh-bao"
                  required
                />
              </div>

              {/* Tóm tắt tính toán tiền mặt */}
              <div className="p-3.5 bg-nen border border-vien rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between text-chu-phu">
                  <span>Tổng tiền trước thuế:</span>
                  <span className="text-chu">{formatNumber(grossCash)} đ</span>
                </div>
                <div className="flex justify-between text-chu-phu">
                  <span>Thuế TNCN (5%):</span>
                  <span className="text-loi">-{formatNumber(taxCash)} đ</span>
                </div>
                <div className="pt-2 border-t border-vien flex justify-between font-bold text-sm">
                  <span className="text-chu">Thực nhận về tài khoản:</span>
                  <span className="text-canh-bao font-bold">{formatNumber(netCashReceived)} đ</span>
                </div>
              </div>
            </>
          )}

          {/* Nếu là Cổ tức cổ phiếu */}
          {type === 'SHARE' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-chu-phu uppercase tracking-wider mb-1.5">
                  Tỷ Lệ Nhận Thêm (%)
                </label>
                <input
                  type="number"
                  value={shareRatioPct || ''}
                  onChange={(e) => setShareRatioPct(Number(e.target.value))}
                  placeholder="VD: 20 (tức tỷ lệ 100:20)"
                  step="1"
                  min="1"
                  className="w-full bg-nen border border-vien rounded-xl px-4 py-2.5 text-base font-bold font-mono text-chu focus:outline-none focus:border-nhan-chu"
                  required
                />
              </div>

              {/* Tóm tắt điều chỉnh giá vốn */}
              <div className="p-3.5 bg-nen border border-vien rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between text-chu-phu">
                  <span>Số CP nhận thêm:</span>
                  <span className="text-nhan-chu font-bold">+{formatNumber(bonusShares)} CP</span>
                </div>
                <div className="flex justify-between text-chu-phu">
                  <span>Tổng CP mới:</span>
                  <span className="text-chu font-bold">{formatNumber(newTotalShares)} CP</span>
                </div>
                <div className="pt-2 border-t border-vien flex justify-between font-bold text-xs">
                  <span className="text-chu-phu">Giá vốn sau điều chỉnh:</span>
                  <span className="text-tot">{formatNumber(Math.round(newAvgPrice))} đ/CP</span>
                </div>
              </div>
            </>
          )}

          <div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú đợt chia cổ tức (tuỳ chọn)..."
              className="w-full bg-nen border border-vien rounded-xl px-3.5 py-2 text-xs text-chu-phu placeholder:text-chu-mo focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-sm transition shadow-lg ${
                type === 'CASH'
                  ? 'bg-canh-bao hover:bg-canh-bao text-tren-nhan'
                  : 'bg-nhan hover:bg-nhan text-tren-nhan'
              }`}
            >
              {isLoading ? 'Đang xử lý...' : `XÁC NHẬN GHI NHẬN CỔ TỨC`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
