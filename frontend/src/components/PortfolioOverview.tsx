import React from 'react';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  TrendingDown,
  Scale,
  Eye,
  EyeOff,
  CalendarCheck,
  Sparkles
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { useAuthStore } from '../store/useAuthStore';
import { DEAL_CONFIG, disbursedCapital } from '../services/dealModel';
import { SoTien } from './SoTien';

export const PortfolioOverview: React.FC = () => {
  const {
    portfolio,
    positions,
    isBalanceHidden,
    toggleBalanceVisibility,
    openCashModal
  } = useTradingStore();

  const { user } = useAuthStore();
  const isCashAccount = user?.subAccount === '01';
  const marginRate = user?.customMarginRate || DEAL_CONFIG.marginRateAnnual;
  const brokerageName = user?.brokerage || 'DNSE';

  const cash = portfolio?.cash || 0;
  const receivingCash = portfolio?.receiving_cash || 0;
  const rawMarginDebt = portfolio?.margin_debt || 0;
  const marginDebt = isCashAccount ? 0 : rawMarginDebt;

  const stockMarketValue = positions.reduce((sum, p) => sum + (p.market_value || 0), 0);
  const totalAssets = cash + receivingCash + stockMarketValue;
  const totalEquity = isCashAccount ? totalAssets : (totalAssets - marginDebt);

  const unrealizedPnL = positions.reduce((sum, p) => sum + (p.unrealized_pnl || 0), 0);
  /* Mẫu số phải TRÙNG với mẫu số dùng ở dòng vị thế, nếu không header và bảng sẽ
     hiện hai phần trăm khác nhau cho cùng một khoản lỗ (lỗi cũ: -7.16% vs -7.22%). */
  const holdsDeal = positions.some((p) => p.symbol === DEAL_CONFIG.symbol);
  const pnlDenominator = holdsDeal
    ? disbursedCapital()
    : positions.reduce((sum, p) => sum + p.total_quantity * p.avg_price, 0);
  const unrealizedPnLPct = pnlDenominator > 0 ? (unrealizedPnL / pnlDenominator) * 100 : 0;
  const equityRatio = totalAssets > 0 ? ((totalEquity / totalAssets) * 100).toFixed(2) : '100.00';

  /* Lãi vay ngày tính trên dư nợ GỐC (lãi đơn) đúng như cách DNSE ghi nhận,
     không tính trên dư nợ đã bao gồm lãi tích luỹ. */
  const dailyInterest =
    isCashAccount || marginDebt <= 0 ? 0 : Math.round((DEAL_CONFIG.principalLoan * (marginRate / 100)) / 365);

  const isProfit = unrealizedPnL >= 0;

  const dinhDangTien = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(val || 0));

  const formatVND = (val: number) => {
    if (isBalanceHidden) return '•••••••• đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(val || 0));
  };

  return (
    <div className="space-y-4">
      {/* ══ THẺ TÀI SẢN CHÍNH ══
          Bỏ hai khối phát sáng trang trí (`blur-3xl` tràn ra ngoài khung thẻ):
          giấy tài chính không phát sáng, và chúng là thứ đáng bỏ theo bước 7 của
          skill — "trước khi giao, bỏ đi một thứ trang trí". */}
      <div className="relative overflow-hidden rounded-lg bg-the border border-vien p-5 sm:p-6">
        <div className="relative space-y-5">
          {/* Top Row: Balance & Profit/Loss Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-vien">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-the2 text-nhan-chu border border-vien text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-canh-bao" />
                  {user?.role === 'ADMIN' ? 'VÍ TÀI SẢN TOÀN DIỆN (VIP MASTER)' : 'VÍ TÀI SẢN MÔ PHỎNG (KHÁCH TRẢI NGHIỆM)'}
                </span>
                <button
                  onClick={toggleBalanceVisibility}
                  className="p-1 rounded-lg text-chu-phu hover:text-chu hover:bg-the2 transition"
                  title={isBalanceHidden ? 'Hiện số dư' : 'Ẩn số dư bảo mật'}
                >
                  {isBalanceHidden ? <EyeOff className="h-4 w-4 text-chu-phu" /> : <Eye className="h-4 w-4 text-nhan-chu" />}
                </button>
              </div>

              <div>
                <span className="text-xs font-medium text-chu-phu">Tổng Tài Sản Ròng Thực Có (NAV)</span>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-chu mt-0.5 flex items-baseline gap-2">
                  <SoTien giaTri={totalEquity} dinhDang={dinhDangTien} che={isBalanceHidden} />
                </div>
              </div>
            </div>

            {/* Profit Pill & Margin Ratio */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-2 rounded-2xl border ${
                  isProfit
                    ? 'bg-tot-nen text-tot border-vien'
                    : 'bg-loi-nen text-loi border-vien'
                }`}
              >
                {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>
                  <span aria-hidden="true">{isProfit ? '▲' : '▼'}</span> Lãi/Lỗ:{' '}
                  <SoTien giaTri={unrealizedPnL} dinhDang={dinhDangTien} che={isBalanceHidden} />{' '}
                  ({isProfit ? '+' : ''}{unrealizedPnLPct.toFixed(2)}%)
                </span>
              </div>

              {(() => {
                const ratioNum = parseFloat(equityRatio);
                const isCallMargin = !isCashAccount && marginDebt > 0 && ratioNum < 35;
                const isForceSell = !isCashAccount && marginDebt > 0 && ratioNum < 30;
                return (
                  <div className={`px-3 py-2 rounded-2xl border text-xs font-mono flex items-center gap-1.5 ${
                    isForceSell
                      ? 'bg-loi-nen border-vien text-loi animate-pulse'
                      : isCallMargin
                      ? 'bg-canh-bao-nen border-vien text-canh-bao'
                      : 'bg-nen border-vien text-chu-phu'
                  }`}>
                    <span>Tỷ lệ tự có:</span>
                    <b className={isForceSell ? 'text-loi' : isCallMargin ? 'text-canh-bao' : 'text-tot'}>
                      {equityRatio}%
                    </b>
                    <span className="text-[11px] font-sans">
                      {isForceSell ? '(⚠️ Force Sell)' : isCallMargin ? '(⚠️ Call Margin)' : '(An toàn)'}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Bottom Row: 4 Balanced Sub-Balances (Cân đối 4 cột đồng đều) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {/* Box 1 - Tiền Mặt KhẢ Dụng (Có nút Nạp / Rút) */}
            <div
              onClick={openCashModal}
              className="p-3.5 rounded-2xl bg-nen border border-vien hover:border-vien cursor-pointer transition flex flex-col justify-between group"
              title="Nhấn để Nạp / Rút Tiền Mặt"
            >
              <div className="flex items-center justify-between text-chu-phu">
                <span className="font-sans text-[11px] group-hover:text-tot transition">Tiền Mặt Khả Dụng</span>
                <span className="text-[10px] text-tot font-sans font-bold bg-tot-nen px-1.5 py-0.5 rounded border border-vien">
                  Nạp / Rút
                </span>
              </div>
              <b className="text-base text-tot font-bold mt-1.5 block">{formatVND(cash)}</b>
              <span className="text-[10px] text-chu-mo font-sans mt-0.5 flex items-center justify-between">
                <span>Khả dụng tức thì</span>
                <span className="text-tot opacity-0 group-hover:opacity-100 transition text-[9px] font-bold">Mở ví →</span>
              </span>
            </div>

            {/* Box 2 */}
            <div className="p-3.5 rounded-2xl bg-nen border border-vien flex flex-col justify-between">
              <div className="flex items-center justify-between text-chu-phu">
                <span className="font-sans text-[11px]">Giá Trị Cổ Phiếu</span>
                <PieChart className="h-4 w-4 text-nhan-chu" />
              </div>
              <b className="text-base text-nhan-chu font-bold mt-1.5 block">{formatVND(stockMarketValue)}</b>
              <span className="text-[10px] text-chu-mo font-sans mt-0.5">
                {positions.length > 0
                  ? `${positions[0].total_quantity.toLocaleString()} ${positions[0].symbol} @ ${(positions[0].market_price / 1000).toFixed(2)}`
                  : '1,000 TPB @ 14.50'}
              </span>
            </div>

            {/* Box 3 */}
            <div className="p-3.5 rounded-2xl bg-nen border border-vien flex flex-col justify-between">
              <div className="flex items-center justify-between text-chu-phu">
                <span className="font-sans text-[11px]">Tiền Chờ Về T+2.5</span>
                <CalendarCheck className="h-4 w-4 text-canh-bao" />
              </div>
              <b className="text-base text-canh-bao font-bold mt-1.5 block">{formatVND(receivingCash)}</b>
              <span className="text-[10px] text-chu-mo font-sans mt-0.5">Đang trong chu kỳ bù trừ</span>
            </div>

            {/* Box 4 - Nợ Vay Margin & Lãi Suất Thực Tế hoặc Chế độ Thuần Tiền Mặt */}
            {isCashAccount ? (
              <div
                onClick={openCashModal}
                className="p-3.5 rounded-2xl bg-nen border border-vien hover:border-vien cursor-pointer transition flex flex-col justify-between group"
                title="Tiểu khoản 01: Giao dịch 100% Tiền mặt, không phát sinh nợ vay"
              >
                <div className="flex items-center justify-between text-tot">
                  <span className="font-sans text-[11px] font-semibold">Trạng Thái Ký Quỹ</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-tot-nen text-tot font-bold border border-vien font-mono">
                    TK 01 Thường
                  </span>
                </div>
                <b className="text-base text-tot font-bold mt-1.5 block">100% Tiền Mặt</b>
                <div className="flex flex-col text-[10px] text-chu-phu font-sans mt-0.5 space-y-0.5">
                  <span className="text-tot font-mono">Không nợ vay • 0đ lãi ngày</span>
                  <span className="text-chu-mo flex justify-between items-center">
                    <span>An toàn tuyệt đối</span>
                    <span className="text-tot opacity-0 group-hover:opacity-100 transition text-[9px] font-bold">Nạp tiền →</span>
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={openCashModal}
                className="p-3.5 rounded-2xl bg-nen border border-vien hover:border-vien cursor-pointer transition flex flex-col justify-between group"
                title="Nhấn để Trả Nợ Deal hoặc Hiệu chỉnh số dư"
              >
                <div className="flex items-center justify-between text-nhan-chu">
                  <span className="font-sans text-[11px] font-semibold group-hover:text-nhan-chu transition">
                    Nợ Margin ({brokerageName})
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-the2 text-nhan-chu font-bold border border-vien font-mono">
                    Trả Nợ Deal
                  </span>
                </div>
                <b className="text-base text-nhan-chu font-bold mt-1.5 block">{formatVND(marginDebt)}</b>
                <div className="flex flex-col text-[10px] text-chu-phu font-sans mt-0.5 space-y-0.5">
                  <span className="text-canh-bao font-mono">
                    Lãi: {marginRate}%/năm (~{dailyInterest.toLocaleString('vi-VN')} đ/ngày)
                  </span>
                  <span className="text-chu-mo flex justify-between items-center">
                    <span>Gốc: {formatVND(marginDebt)}</span>
                    <span className="text-nhan-chu opacity-0 group-hover:opacity-100 transition text-[9px] font-bold">Trả nợ →</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
