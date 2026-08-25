/**
 * CKV PRO TRADER - HỆ THỐNG DỮ LIỆU LÃI SUẤT VĨ MÔ & ĐỊNH LƯỢNG CHI PHÍ VỐN
 * Top 20 Ngân Hàng Việt Nam + Top 10 Ví Điện Tử / App Vay Nợ & Sinh Lời
 * Tích hợp vào 150 Thuật toán định giá, ERP (Equity Risk Premium) & Chi phí Margin.
 */

export interface BankInterestRate {
  id: string;
  name: string;
  shortName: string;
  group: 'BIG4' | 'TMCP_TOP1' | 'TMCP_MID';
  deposit1M: number;
  deposit3M: number;
  deposit6M: number;
  deposit12M: number; // Lãi suất chuẩn 12 tháng
  deposit24M: number;
  lendingRate: number; // Lãi suất cho vay bình quân (%/năm)
  marginRate?: number; // Lãi suất Margin công ty chứng khoán trực thuộc
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface EWalletFintechRate {
  id: string;
  name: string;
  provider: string;
  category: 'VI_DIEN_TU' | 'APP_TICH_LUY' | 'APP_VAY_TIEU_DUNG';
  savingRate: number; // Lãi suất sinh lời không kỳ hạn / có kỳ hạn (%/năm)
  borrowRate: number; // Lãi suất vay / thấu chi / trả sau (%/năm)
  feature: string;
  rating: number; // 1 - 5 sao
}

// 1. TOP 20 NGÂN HÀNG VIỆT NAM (DỮ LIỆU CHUẨN THỊ TRƯỜNG HIỆN TẠI)
export const TOP_20_BANKS: BankInterestRate[] = [
  // ── NHÓM BIG 4 (NHÀ NƯỚC) ──
  { id: 'VCB', name: 'Vietcombank', shortName: 'VCB', group: 'BIG4', deposit1M: 1.7, deposit3M: 2.0, deposit6M: 3.0, deposit12M: 4.8, deposit24M: 4.8, lendingRate: 7.2, marginRate: 10.5, trend: 'STABLE' },
  { id: 'BID', name: 'BIDV', shortName: 'BIDV', group: 'BIG4', deposit1M: 1.8, deposit3M: 2.1, deposit6M: 3.1, deposit12M: 4.9, deposit24M: 4.9, lendingRate: 7.4, marginRate: 10.8, trend: 'STABLE' },
  { id: 'CTG', name: 'VietinBank', shortName: 'VietinBank', group: 'BIG4', deposit1M: 1.8, deposit3M: 2.1, deposit6M: 3.1, deposit12M: 4.9, deposit24M: 4.9, lendingRate: 7.3, marginRate: 10.5, trend: 'STABLE' },
  { id: 'AGR', name: 'Agribank', shortName: 'Agribank', group: 'BIG4', deposit1M: 1.8, deposit3M: 2.2, deposit6M: 3.2, deposit12M: 4.9, deposit24M: 4.9, lendingRate: 7.5, marginRate: 11.0, trend: 'STABLE' },

  // ── NHÓM TMCP HÀNG ĐẦU ──
  { id: 'TCB', name: 'Techcombank', shortName: 'Techcombank', group: 'TMCP_TOP1', deposit1M: 3.2, deposit3M: 3.5, deposit6M: 4.6, deposit12M: 5.3, deposit24M: 5.3, lendingRate: 8.2, marginRate: 9.9, trend: 'UP' },
  { id: 'MBB', name: 'MBBank', shortName: 'MB', group: 'TMCP_TOP1', deposit1M: 3.0, deposit3M: 3.3, deposit6M: 4.3, deposit12M: 5.1, deposit24M: 5.8, lendingRate: 7.8, marginRate: 10.2, trend: 'STABLE' },
  { id: 'ACB', name: 'Ngân hàng Á Châu', shortName: 'ACB', group: 'TMCP_TOP1', deposit1M: 3.1, deposit3M: 3.4, deposit6M: 4.5, deposit12M: 5.2, deposit24M: 5.2, lendingRate: 7.9, marginRate: 9.8, trend: 'STABLE' },
  { id: 'VPB', name: 'VPBank', shortName: 'VPBank', group: 'TMCP_TOP1', deposit1M: 3.6, deposit3M: 3.9, deposit6M: 4.9, deposit12M: 5.6, deposit24M: 5.8, lendingRate: 9.2, marginRate: 11.5, trend: 'UP' },
  { id: 'TPB', name: 'TPBank', shortName: 'TPBank', group: 'TMCP_TOP1', deposit1M: 3.3, deposit3M: 3.6, deposit6M: 4.7, deposit12M: 5.4, deposit24M: 5.7, lendingRate: 8.4, marginRate: 9.99, trend: 'UP' },
  { id: 'HDB', name: 'HDBank', shortName: 'HDBank', group: 'TMCP_TOP1', deposit1M: 3.5, deposit3M: 3.7, deposit6M: 5.1, deposit12M: 5.7, deposit24M: 6.0, lendingRate: 8.9, marginRate: 10.9, trend: 'UP' },
  { id: 'STB', name: 'Sacombank', shortName: 'Sacombank', group: 'TMCP_TOP1', deposit1M: 3.2, deposit3M: 3.5, deposit6M: 4.6, deposit12M: 5.3, deposit24M: 5.6, lendingRate: 8.5, marginRate: 10.5, trend: 'STABLE' },
  { id: 'VIB', name: 'VIB Bank', shortName: 'VIB', group: 'TMCP_TOP1', deposit1M: 3.4, deposit3M: 3.7, deposit6M: 4.8, deposit12M: 5.5, deposit24M: 5.8, lendingRate: 8.8, marginRate: 10.8, trend: 'UP' },

  // ── NHÓM TMCP TẦM TRUNG & LÃI SUẤT CAO ──
  { id: 'SHB', name: 'SHB', shortName: 'SHB', group: 'TMCP_MID', deposit1M: 3.3, deposit3M: 3.6, deposit6M: 4.8, deposit12M: 5.5, deposit24M: 5.9, lendingRate: 8.6, marginRate: 11.2, trend: 'STABLE' },
  { id: 'LPB', name: 'LPBank', shortName: 'LPBank', group: 'TMCP_MID', deposit1M: 3.5, deposit3M: 3.8, deposit6M: 5.0, deposit12M: 5.7, deposit24M: 6.1, lendingRate: 9.0, marginRate: 11.5, trend: 'UP' },
  { id: 'MSB', name: 'MSB', shortName: 'MSB', group: 'TMCP_MID', deposit1M: 3.5, deposit3M: 3.7, deposit6M: 4.9, deposit12M: 5.6, deposit24M: 5.8, lendingRate: 8.7, marginRate: 10.9, trend: 'UP' },
  { id: 'OCB', name: 'OCB', shortName: 'OCB', group: 'TMCP_MID', deposit1M: 3.7, deposit3M: 3.9, deposit6M: 5.0, deposit12M: 5.8, deposit24M: 6.0, lendingRate: 9.1, marginRate: 11.8, trend: 'UP' },
  { id: 'SSB', name: 'SeABank', shortName: 'SeABank', group: 'TMCP_MID', deposit1M: 3.4, deposit3M: 3.6, deposit6M: 4.6, deposit12M: 5.4, deposit24M: 5.7, lendingRate: 8.8, marginRate: 11.0, trend: 'STABLE' },
  { id: 'EIB', name: 'Eximbank', shortName: 'Eximbank', group: 'TMCP_MID', deposit1M: 3.6, deposit3M: 3.9, deposit6M: 5.1, deposit12M: 5.7, deposit24M: 6.2, lendingRate: 9.3, marginRate: 11.6, trend: 'UP' },
  { id: 'BAB', name: 'BacABank', shortName: 'BacABank', group: 'TMCP_MID', deposit1M: 3.7, deposit3M: 4.0, deposit6M: 5.2, deposit12M: 5.9, deposit24M: 6.1, lendingRate: 9.5, marginRate: 12.0, trend: 'UP' },
  { id: 'NCB', name: 'NCB', shortName: 'NCB', group: 'TMCP_MID', deposit1M: 3.8, deposit3M: 4.1, deposit6M: 5.4, deposit12M: 6.1, deposit24M: 6.3, lendingRate: 9.8, marginRate: 12.5, trend: 'UP' },
];

// 2. TOP 10 VÍ ĐIỆN TỬ, FINTECH & APP VAY NỢ / SINH LỜI VIỆT NAM
export const TOP_10_FINTECH: EWalletFintechRate[] = [
  { id: 'MOMO', name: 'MoMo - Túi Thần Tài', provider: 'MoMo & Finsight', category: 'VI_DIEN_TU', savingRate: 4.8, borrowRate: 18.5, feature: 'Sinh lời theo ngày, rút tiền tức thì', rating: 4.8 },
  { id: 'ZALOPAY', name: 'ZaloPay - Tài Khoản Tích Lũy', provider: 'ZaloPay & RealStake', category: 'VI_DIEN_TU', savingRate: 5.0, borrowRate: 19.0, feature: 'Nhận lãi mỗi ngày, liên kết Zalo', rating: 4.7 },
  { id: 'VIETTELPAY', name: 'Viettel Money - Tiết Kiệm Số', provider: 'Viettel Telecom & MBBank', category: 'VI_DIEN_TU', savingRate: 5.2, borrowRate: 16.8, feature: 'Bảo mật chuẩn quân đội, nạp rút tiện', rating: 4.8 },
  { id: 'VNPAY', name: 'VNPAY - Ví Điện Tử Gia Đình', provider: 'VNPAY', category: 'VI_DIEN_TU', savingRate: 4.5, borrowRate: 17.0, feature: 'Hệ sinh thái thanh toán QR phủ toàn quốc', rating: 4.6 },
  { id: 'SHOPEEPAY', name: 'ShopeePay & SPayLater', provider: 'SeaMoney (Shopee)', category: 'VI_DIEN_TU', savingRate: 4.2, borrowRate: 24.0, feature: 'Mua trước trả sau, voucher mua sắm', rating: 4.5 },
  { id: 'TIKOP', name: 'Tikop - Tích Lũy Linh Hoạt', provider: 'Công ty CP Công Nghệ Techlab', category: 'APP_TICH_LUY', savingRate: 6.2, borrowRate: 14.5, feature: 'Gói Lộc Phát lãi suất cao, đầu tư chứng chỉ quỹ', rating: 4.6 },
  { id: 'FINHAY', name: 'Finhay - Đầu Tư & Tích Lũy', provider: 'Công ty CP Finhay Việt Nam', category: 'APP_TICH_LUY', savingRate: 5.8, borrowRate: 15.0, feature: 'Tích lũy thông minh, mua vàng nhẫn, hũ tài chính', rating: 4.7 },
  { id: 'HOMECREDIT', name: 'Home Credit Finance', provider: 'Home Credit VN', category: 'APP_VAY_TIEU_DUNG', savingRate: 0.0, borrowRate: 22.0, feature: 'Vay trả góp điện máy, thẻ tín dụng tiêu dùng', rating: 4.3 },
  { id: 'FECREDIT', name: 'FE Credit', provider: 'VPBank & SMBC', category: 'APP_VAY_TIEU_DUNG', savingRate: 0.0, borrowRate: 28.0, feature: 'Vay tiền mặt nhanh, hạn mức tiêu dùng lớn', rating: 4.1 },
  { id: 'CAKE', name: 'Cake by VPBank', provider: 'VPBank & Be Group', category: 'APP_TICH_LUY', savingRate: 5.4, borrowRate: 16.5, feature: 'Ngân hàng số không phí, lãi suất tiền gửi cạnh tranh', rating: 4.8 },
];

// LÃI SUẤT TIÊU CHUẨN THỊ TRƯỜNG BENCHMARK
export const BENCHMARK_RATES = {
  riskFreeRate12M: 5.15, // Trung bình lãi suất 12M Big4 + Top TMCP (%)
  avgLendingRate: 8.35,  // Lãi suất cho vay bình quân doanh nghiệp (%)
  dnseMarginRate: 9.99,  // Lãi suất Margin ưu đãi DNSE Entrade X (%)
  avgMarketMarginRate: 11.2, // Lãi suất Margin trung bình toàn ngành CTCK (%)
  overnightFintechYield: 4.85, // Lãi suất bình quân Túi thần tài MoMo / ZaloPay (%)
};

/**
 * HÀM TÍNH TOÁN ĐỊNH GIÁ KẾT HỢP VĨ MÔ & 150 THUẬT TOÁN ĐỊNH LƯỢNG
 */
export function calculateMacroStockValuation(stock: {
  symbol: string;
  pe: number;
  pb: number;
  roe: number;
  price: number;
  eps: number;
  consensusScore: number;
}) {
  const earningYield = (1 / Math.max(0.1, stock.pe)) * 100; // E/P = 1/PE (%)
  const equityRiskPremium = earningYield - BENCHMARK_RATES.riskFreeRate12M; // ERP = E/P - Rf

  // Định giá chiết khấu dòng tiền DDM / Gordon với chi phí vốn Ke
  const costOfEquity = BENCHMARK_RATES.riskFreeRate12M + 1.15 * 6.5; // CAPM: Ke = Rf + Beta*ERP (Beta~1.15, ERP thị trường 6.5%)
  const expectedGrowth = Math.min(18, Math.max(5, stock.roe * 0.65)); // Tốc độ tăng trưởng bền vững g = ROE * b

  // Định giá hợp lý P/E mục tiêu theo môi trường lãi suất
  const targetPE = 100 / (BENCHMARK_RATES.riskFreeRate12M + 3.5); // P/E mục tiêu vĩ mô
  const fairValue = Math.round(stock.eps * targetPE);
  const upsidePct = (((fairValue - stock.price) / stock.price) * 100).toFixed(1);

  // Khuyến nghị vĩ mô
  let macroVerdict: 'HOT_BUY' | 'ACCUMULATE' | 'HOLD' | 'REDUCE' = 'HOLD';
  let macroNote = '';

  if (equityRiskPremium > 4.5 && stock.roe > 18) {
    macroVerdict = 'HOT_BUY';
    macroNote = `Lợi suất E/P (${earningYield.toFixed(1)}%) vượt trội so với Lãi suất gửi tiết kiệm 12M (${BENCHMARK_RATES.riskFreeRate12M}%). Cổ phiếu được định giá cực rẻ!`;
  } else if (equityRiskPremium > 2.0 && stock.roe > 14) {
    macroVerdict = 'ACCUMULATE';
    macroNote = `Phần bù rủi ro vốn chủ (ERP = +${equityRiskPremium.toFixed(1)}%) hấp dẫn. Thích hợp gom tích sản vùng giá hiện tại.`;
  } else if (equityRiskPremium >= 0) {
    macroVerdict = 'HOLD';
    macroNote = `Lợi suất hòa nhịp với lãi suất ngân hàng. Nắm giữ và quan sát thêm tín hiệu dòng tiền.`;
  } else {
    macroVerdict = 'REDUCE';
    macroNote = `Định giá P/E cao khiến lợi suất E/P (${earningYield.toFixed(1)}%) thấp hơn gửi tiết kiệm ngân hàng (${BENCHMARK_RATES.riskFreeRate12M}%).`;
  }

  // Tối ưu hóa chi phí đòn bẩy Margin DNSE
  const marginNetSpread = earningYield - BENCHMARK_RATES.dnseMarginRate;
  const isMarginFeasible = marginNetSpread > 0;

  return {
    earningYield: earningYield.toFixed(2),
    equityRiskPremium: equityRiskPremium.toFixed(2),
    costOfEquity: costOfEquity.toFixed(2),
    expectedGrowth: expectedGrowth.toFixed(1),
    fairValue,
    upsidePct,
    macroVerdict,
    macroNote,
    marginNetSpread: marginNetSpread.toFixed(2),
    isMarginFeasible,
  };
}
