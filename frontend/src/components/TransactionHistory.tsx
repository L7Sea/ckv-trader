import React from 'react';
import { History, ArrowDownLeft, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';

export const TransactionHistory: React.FC = () => {
  const { transactions } = useTradingStore();

  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Nhật Ký Khớp Lệnh (Transaction History)</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {transactions.length} giao dịch
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="py-10 text-center text-slate-500">
          <FileSpreadsheet className="h-9 w-9 mx-auto stroke-1 opacity-40 mb-2" />
          <p className="text-sm">Chưa có dữ liệu giao dịch nào.</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4 max-h-96">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-slate-900 z-10">
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-sans font-semibold">
                <th className="pb-3 px-2">Thời Gian</th>
                <th className="pb-3 px-2">Loại</th>
                <th className="pb-3 px-2">Mã CP</th>
                <th className="pb-3 px-2 text-right">Khối Lượng</th>
                <th className="pb-3 px-2 text-right">Giá Khớp</th>
                <th className="pb-3 px-2 text-right">Tổng GT</th>
                <th className="pb-3 px-2 text-right">Phí & Thuế</th>
                <th className="pb-3 px-2 text-right">Lãi/Lỗ Chốt</th>
                <th className="pb-3 px-2">Ghi Chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {transactions.map((tx) => {
                const isBuy = tx.type === 'BUY';
                const totalFeeTax = (tx.fee || 0) + (tx.tax || 0);
                const hasPnl = tx.realized_pnl !== undefined && tx.realized_pnl !== null;
                const isProfit = (tx.realized_pnl || 0) >= 0;

                return (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                    {/* Thời gian */}
                    <td className="py-3 px-2 text-slate-400 text-[11px]">
                      {tx.timestamp ? new Date(tx.timestamp).toLocaleString('vi-VN') : tx.trade_date}
                    </td>

                    {/* Loại lệnh */}
                    <td className="py-3 px-2 font-sans font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                          isBuy
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isBuy ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                        {isBuy ? 'MUA' : 'BÁN'}
                      </span>
                    </td>

                    {/* Mã CP */}
                    <td className="py-3 px-2 font-bold text-white text-sm">
                      {tx.symbol}
                    </td>

                    {/* Khối lượng */}
                    <td className="py-3 px-2 text-right font-bold text-slate-200">
                      {formatNumber(tx.quantity)}
                    </td>

                    {/* Giá khớp */}
                    <td className="py-3 px-2 text-right text-slate-300">
                      {formatNumber(tx.price)}
                    </td>

                    {/* Tổng giá trị */}
                    <td className="py-3 px-2 text-right font-semibold text-slate-200">
                      {formatNumber(tx.total_amount)}
                    </td>

                    {/* Phí & Thuế */}
                    <td className="py-3 px-2 text-right text-slate-400 text-[11px]">
                      {formatNumber(totalFeeTax)}
                    </td>

                    {/* Lãi / Lỗ Chốt */}
                    <td className="py-3 px-2 text-right font-bold">
                      {hasPnl ? (
                        <span className={isProfit ? 'text-emerald-400' : 'text-rose-400'}>
                          {isProfit ? '+' : ''}{formatNumber(tx.realized_pnl!)}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    {/* Ghi chú */}
                    <td className="py-3 px-2 text-slate-400 text-[11px] max-w-[150px] truncate font-sans">
                      {tx.notes || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
