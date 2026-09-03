import React from 'react';
import {
  Award,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Percent,
  Receipt,
  Scale
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTradingStore } from '../store/useTradingStore';

export const AnalyticsReport: React.FC = () => {
  const { portfolio, positions, transactions } = useTradingStore();

  const sellTrades = transactions.filter((t) => t.type === 'SELL');
  const winTrades = sellTrades.filter((t) => (t.realized_pnl || 0) > 0);
  const lossTrades = sellTrades.filter((t) => (t.realized_pnl || 0) < 0);

  const totalWinAmount = winTrades.reduce((s, t) => s + (t.realized_pnl || 0), 0);
  const totalLossAmount = Math.abs(lossTrades.reduce((s, t) => s + (t.realized_pnl || 0), 0));

  const winRate = sellTrades.length > 0 ? (winTrades.length / sellTrades.length) * 100 : 0;
  const profitFactor = totalLossAmount > 0 ? totalWinAmount / totalLossAmount : totalWinAmount > 0 ? 99.9 : 0;

  const maxWinTrade = winTrades.reduce((max, t) => Math.max(max, t.realized_pnl || 0), 0);
  const maxLossTrade = lossTrades.reduce((min, t) => Math.min(min, t.realized_pnl || 0), 0);

  const totalFeesPaid = transactions.reduce((s, t) => s + (t.fee || 0), 0);
  const totalTaxesPaid = transactions.reduce((s, t) => s + (t.tax || 0), 0);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };
  const formatNumber = (num: number) => (num || 0).toLocaleString('vi-VN');

  // Hàm Xuất File Excel (.xlsx) Chuyên Nghiệp
  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Danh mục cổ phiếu
      const positionsData = positions.map((p) => ({
        'Mã CP': p.symbol,
        'Tổng Khối Lượng': p.total_quantity,
        'Khả Dụng': p.available_quantity,
        'Chờ Về T+1': p.t1_quantity,
        'Chờ Về T+2': p.t2_quantity,
        'Giá Vốn (VNĐ)': p.avg_price,
        'Giá Thị Trường (VNĐ)': p.market_price,
        'Tổng Giá Trị (VNĐ)': p.market_value,
        'Lãi / Lỗ Tạm Tính (VNĐ)': p.unrealized_pnl,
        'Tỷ Suất (%)': `${p.unrealized_pnl_pct.toFixed(2)}%`
      }));
      const wsPositions = XLSX.utils.json_to_sheet(positionsData);
      XLSX.utils.book_append_sheet(wb, wsPositions, 'Danh Mục Cổ Phiếu');

      // Sheet 2: Sổ cái giao dịch
      const txData = transactions.map((t) => ({
        'Mã Giao Dịch': t.id,
        'Thời Gian': t.timestamp ? new Date(t.timestamp).toLocaleString('vi-VN') : t.trade_date,
        'Loại Lệnh': t.type,
        'Mã CP': t.symbol,
        'Khối Lượng': t.quantity,
        'Giá Khớp (VNĐ)': t.price,
        'Tổng Giá Trị': t.total_amount,
        'Phí GD': t.fee,
        'Thuế TNCN': t.tax,
        'Lãi / Lỗ Đã Chốt': t.realized_pnl || 0,
        'Ghi Chú': t.notes || ''
      }));
      const wsTx = XLSX.utils.json_to_sheet(txData);
      XLSX.utils.book_append_sheet(wb, wsTx, 'Lịch Sử Khớp Lệnh');

      // Sheet 3: Tổng quan tài sản
      const summaryData = [
        { 'Chỉ Tiêu': 'Tiền Mặt Khả Dụng', 'Giá Trị (VNĐ)': portfolio?.cash || 0 },
        { 'Chỉ Tiêu': 'Tiền Chờ Về (T+2.5)', 'Giá Trị (VNĐ)': portfolio?.receiving_cash || 0 },
        { 'Chỉ Tiêu': 'Tổng Giá Trị Cổ Phiếu', 'Giá Trị (VNĐ)': positions.reduce((s, p) => s + p.market_value, 0) },
        { 'Chỉ Tiêu': 'Tổng Nợ Vay Margin', 'Giá Trị (VNĐ)': portfolio?.margin_debt || 0 },
        { 'Chỉ Tiêu': 'Tổng Tài Sản Ròng (NAV)', 'Giá Trị (VNĐ)': portfolio?.total_equity || 0 },
        { 'Chỉ Tiêu': 'Tổng Lãi/Lỗ Đã Chốt', 'Giá Trị (VNĐ)': portfolio?.total_profit_loss || 0 },
        { 'Chỉ Tiêu': 'Tổng Phí GD Đã Trả', 'Giá Trị (VNĐ)': totalFeesPaid },
        { 'Chỉ Tiêu': 'Tổng Thuế TNCN Đã Nộp', 'Giá Trị (VNĐ)': totalTaxesPaid }
      ];
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng Quan Tài Sản');

      const fileName = `Bao_Cao_CKV_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
      alert(`Đã xuất báo cáo kiểm toán thành công file: ${fileName}`);
    } catch (err: any) {
      alert('Lỗi xuất Excel: ' + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-the border border-vien rounded-3xl p-6 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-vien">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-tot to-tot text-chu font-bold shadow-lg shadow-md">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-chu">Báo Cáo Hiệu Suất & Xuất Dữ Liệu</h2>
            <p className="text-xs text-chu-phu">Đo lường các chỉ số giao dịch định lượng chuẩn Quant</p>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-tot hover:bg-tot text-tren-nhan text-xs font-bold transition shadow-md shadow-md active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Xuất File Excel (.xlsx)</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-the2 hover:bg-the2 text-chu text-xs font-medium border border-vien transition active:scale-95"
          >
            <Printer className="h-4 w-4 text-chu-phu" />
            <span>In Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* 4 Chỉ Số Cốt Lõi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Win Rate */}
        <div className="p-4 bg-nen border border-vien rounded-2xl">
          <div className="flex items-center justify-between text-xs text-chu-phu">
            <span className="font-semibold uppercase tracking-wider">Tỷ Lệ Thắng (Win Rate)</span>
            <CheckCircle2 className="h-4 w-4 text-tot" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-tot">{winRate.toFixed(1)}%</span>
            <span className="text-[11px] text-chu-mo font-mono">({winTrades.length}/{sellTrades.length} lệnh)</span>
          </div>
          <div className="w-full bg-the2 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-tot h-full rounded-full transition-all" style={{ width: `${winRate}%` }} />
          </div>
        </div>

        {/* Profit Factor */}
        <div className="p-4 bg-nen border border-vien rounded-2xl">
          <div className="flex items-center justify-between text-xs text-chu-phu">
            <span className="font-semibold uppercase tracking-wider">Hệ Số Lợi Nhuận</span>
            <Scale className="h-4 w-4 text-nhan-chu" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-nhan-chu">{profitFactor.toFixed(2)}</span>
            <span className="text-[11px] text-chu-mo">Lãi / Lỗ</span>
          </div>
          <p className="text-[11px] text-chu-phu mt-3 truncate">
            Tổng lãi: <span className="text-tot font-mono">{formatVND(totalWinAmount)}</span>
          </p>
        </div>

        {/* Lệnh Lãi Lớn Nhất */}
        <div className="p-4 bg-nen border border-vien rounded-2xl">
          <div className="flex items-center justify-between text-xs text-chu-phu">
            <span className="font-semibold uppercase tracking-wider">Lệnh Lãi Lớn Nhất</span>
            <TrendingUp className="h-4 w-4 text-tot" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-tot">+{formatVND(maxWinTrade)}</span>
          </div>
          <p className="text-[11px] text-chu-phu mt-3">
            Lỗ lớn nhất: <span className="text-loi font-mono">{formatVND(maxLossTrade)}</span>
          </p>
        </div>

        {/* Tổng Thuế & Phí Đã Nộp */}
        <div className="p-4 bg-nen border border-vien rounded-2xl">
          <div className="flex items-center justify-between text-xs text-chu-phu">
            <span className="font-semibold uppercase tracking-wider">Tổng Thuế & Phí</span>
            <Receipt className="h-4 w-4 text-canh-bao" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-canh-bao">{formatVND(totalFeesPaid + totalTaxesPaid)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-chu-phu mt-3 font-mono">
            <span>Phí: {formatNumber(totalFeesPaid)}đ</span>
            <span>Thuế: {formatNumber(totalTaxesPaid)}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
