/**
 * CKV PRO TRADER - HỆ THỐNG DỮ LIỆU LÃI SUẤT VĨ MÔ & ĐỊNH LƯỢNG CHI PHÍ VỐN
 * Top 20 Ngân Hàng Việt Nam + Top 10 Ví Điện Tử / App Vay Nợ & Sinh Lời
 * Chi tiết theo từng tháng, hạn mức tiền gửi, lãi vay kinh doanh/mua nhà/tín chấp.
 */

export type DepositTier = 'UNDER_1B' | 'TIER_1B_5B' | 'OVER_5B' | 'ONLINE';
export type LoanType = 'BUSINESS_SHORT' | 'BUSINESS_MID' | 'MORTGAGE_PROMO' | 'MORTGAGE_FLOAT' | 'CONSUMER_UNSECURED' | 'MARGIN';

export interface BankInterestRate {
  id: string;
  name: string;
  shortName: string;
  group: 'BIG4' | 'TMCP_TOP1' | 'TMCP_MID';
  
  // ── 1. LÃI SUẤT TIỀN GỬI THEO TỪNG THÁNG (%/năm) ──
  depositKKH: number; // Không kỳ hạn / Tài khoản thanh toán
  deposit1M: number;
  deposit3M: number;
  deposit6M: number;
  deposit9M: number;
  deposit12M: number; // Chuẩn 12 tháng
  deposit18M: number;
  deposit24M: number;
  deposit36M: number;

  // ── 2. CỘNG THÊM THEO HẠN MỨC TIỀN & KÊNH GỬI (%/năm) ──
  tierBonus1B_5B: number; // Khách ưu tiên 1-5 tỷ (+0.2 - +0.3%)
  tierBonusOver5B: number; // Khách VIP > 5 tỷ (+0.4 - +0.6%)
  onlineBonus: number; // Gửi Online (+0.2 - +0.35%)

  // ── 3. CHI TIẾT LÃI SUẤT CHO VAY (%/năm) ──
  loanBusinessShort: number; // Vay SXKD ngắn hạn (3-6 tháng)
  loanBusinessMid: number; // Vay trung dài hạn đầu tư
  loanMortgagePromo: number; // Vay mua nhà ưu đãi năm đầu
  loanMortgageFloat: number; // Vay mua nhà thả nổi sau ưu đãi
  loanConsumerUnsecured: number; // Vay tín chấp / thấu chi
  marginRate: number; // Lãi Margin CTCK trực thuộc

  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface EWalletFintechRate {
  id: string;
  name: string;
  provider: string;
  category: 'VI_DIEN_TU' | 'APP_TICH_LUY' | 'APP_VAY_TIEU_DUNG';
  
  savingRateDay: number; // Lãi suất sinh lời không kỳ hạn theo ngày (%/năm)
  savingRateTerm?: number; // Lãi suất có kỳ hạn 3-12 tháng (%/năm)
  borrowRate: number; // Lãi suất vay / thấu chi / Ví trả sau / BNPL (%/năm)
  limitMax: number; // Hạn mức tối đa (VND)
  withdrawalSpeed: string; // Tốc độ rút tiền
  feature: string;
  rating: number; // 1 - 5 sao
}

// ── 1. BẢNG DỮ LIỆU CHI TIẾT TOP 20 NGÂN HÀNG VIỆT NAM (2026) ──
export const TOP_20_BANKS: BankInterestRate[] = [
  // ── BIG 4 NHÀ NƯỚC (AN TOÀN TUYỆT ĐỐI, CHI PHÍ VỐN RẺ) ──
  {
    id: 'VCB', name: 'Ngân hàng Ngoại thương Việt Nam (Vietcombank)', shortName: 'Vietcombank', group: 'BIG4',
    depositKKH: 0.1, deposit1M: 1.7, deposit3M: 2.0, deposit6M: 3.0, deposit9M: 3.0, deposit12M: 4.8, deposit18M: 4.8, deposit24M: 4.8, deposit36M: 4.8,
    tierBonus1B_5B: 0.15, tierBonusOver5B: 0.3, onlineBonus: 0.2,
    loanBusinessShort: 5.8, loanBusinessMid: 7.2, loanMortgagePromo: 6.0, loanMortgageFloat: 9.2, loanConsumerUnsecured: 13.5, marginRate: 10.5,
    trend: 'STABLE'
  },
  {
    id: 'BID', name: 'Ngân hàng Đầu tư & Phát triển Việt Nam (BIDV)', shortName: 'BIDV', group: 'BIG4',
    depositKKH: 0.1, deposit1M: 1.8, deposit3M: 2.1, deposit6M: 3.1, deposit9M: 3.1, deposit12M: 4.9, deposit18M: 4.9, deposit24M: 4.9, deposit36M: 4.9,
    tierBonus1B_5B: 0.2, tierBonusOver5B: 0.35, onlineBonus: 0.2,
    loanBusinessShort: 6.0, loanBusinessMid: 7.4, loanMortgagePromo: 6.2, loanMortgageFloat: 9.5, loanConsumerUnsecured: 14.0, marginRate: 10.8,
    trend: 'STABLE'
  },
  {
    id: 'CTG', name: 'Ngân hàng TMCP Công thương Việt Nam (VietinBank)', shortName: 'VietinBank', group: 'BIG4',
    depositKKH: 0.1, deposit1M: 1.8, deposit3M: 2.1, deposit6M: 3.1, deposit9M: 3.1, deposit12M: 4.9, deposit18M: 4.9, deposit24M: 4.9, deposit36M: 4.9,
    tierBonus1B_5B: 0.2, tierBonusOver5B: 0.35, onlineBonus: 0.2,
    loanBusinessShort: 5.9, loanBusinessMid: 7.3, loanMortgagePromo: 6.1, loanMortgageFloat: 9.4, loanConsumerUnsecured: 13.8, marginRate: 10.5,
    trend: 'STABLE'
  },
  {
    id: 'AGR', name: 'Ngân hàng Nông nghiệp & Phát triển Nông thôn (Agribank)', shortName: 'Agribank', group: 'BIG4',
    depositKKH: 0.2, deposit1M: 1.8, deposit3M: 2.2, deposit6M: 3.2, deposit9M: 3.2, deposit12M: 4.9, deposit18M: 4.9, deposit24M: 4.9, deposit36M: 4.9,
    tierBonus1B_5B: 0.15, tierBonusOver5B: 0.3, onlineBonus: 0.15,
    loanBusinessShort: 6.2, loanBusinessMid: 7.5, loanMortgagePromo: 6.5, loanMortgageFloat: 9.8, loanConsumerUnsecured: 14.5, marginRate: 11.0,
    trend: 'STABLE'
  },

  // ── TMCP HÀNG ĐẦU (TIỀN GỬI CẠNH TRANH, DỊCH VỤ SỐ TỐT) ──
  {
    id: 'TCB', name: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)', shortName: 'Techcombank', group: 'TMCP_TOP1',
    depositKKH: 0.05, deposit1M: 3.2, deposit3M: 3.5, deposit6M: 4.6, deposit9M: 4.6, deposit12M: 5.3, deposit18M: 5.3, deposit24M: 5.3, deposit36M: 5.3,
    tierBonus1B_5B: 0.25, tierBonusOver5B: 0.5, onlineBonus: 0.3,
    loanBusinessShort: 6.5, loanBusinessMid: 8.2, loanMortgagePromo: 6.8, loanMortgageFloat: 10.5, loanConsumerUnsecured: 15.0, marginRate: 9.9,
    trend: 'UP'
  },
  {
    id: 'MBB', name: 'Ngân hàng TMCP Quân Đội (MBBank)', shortName: 'MB', group: 'TMCP_TOP1',
    depositKKH: 0.1, deposit1M: 3.0, deposit3M: 3.3, deposit6M: 4.3, deposit9M: 4.3, deposit12M: 5.1, deposit18M: 5.5, deposit24M: 5.8, deposit36M: 5.8,
    tierBonus1B_5B: 0.2, tierBonusOver5B: 0.45, onlineBonus: 0.25,
    loanBusinessShort: 6.4, loanBusinessMid: 7.8, loanMortgagePromo: 6.5, loanMortgageFloat: 10.2, loanConsumerUnsecured: 14.2, marginRate: 10.2,
    trend: 'STABLE'
  },
  {
    id: 'ACB', name: 'Ngân hàng TMCP Á Châu (ACB)', shortName: 'ACB', group: 'TMCP_TOP1',
    depositKKH: 0.05, deposit1M: 3.1, deposit3M: 3.4, deposit6M: 4.5, deposit9M: 4.5, deposit12M: 5.2, deposit18M: 5.2, deposit24M: 5.2, deposit36M: 5.2,
    tierBonus1B_5B: 0.2, tierBonusOver5B: 0.4, onlineBonus: 0.25,
    loanBusinessShort: 6.3, loanBusinessMid: 7.9, loanMortgagePromo: 6.6, loanMortgageFloat: 10.0, loanConsumerUnsecured: 14.8, marginRate: 9.8,
    trend: 'STABLE'
  },
  {
    id: 'VPB', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)', shortName: 'VPBank', group: 'TMCP_TOP1',
    depositKKH: 0.1, deposit1M: 3.6, deposit3M: 3.9, deposit6M: 4.9, deposit9M: 4.9, deposit12M: 5.6, deposit18M: 5.8, deposit24M: 5.8, deposit36M: 5.8,
    tierBonus1B_5B: 0.3, tierBonusOver5B: 0.6, onlineBonus: 0.35,
    loanBusinessShort: 7.2, loanBusinessMid: 9.2, loanMortgagePromo: 7.2, loanMortgageFloat: 11.5, loanConsumerUnsecured: 16.5, marginRate: 11.5,
    trend: 'UP'
  },
  {
    id: 'TPB', name: 'Ngân hàng TMCP Tiên Phong (TPBank)', shortName: 'TPBank', group: 'TMCP_TOP1',
    depositKKH: 0.1, deposit1M: 3.3, deposit3M: 3.6, deposit6M: 4.7, deposit9M: 4.7, deposit12M: 5.4, deposit18M: 5.7, deposit24M: 5.7, deposit36M: 5.7,
    tierBonus1B_5B: 0.25, tierBonusOver5B: 0.5, onlineBonus: 0.3,
    loanBusinessShort: 6.8, loanBusinessMid: 8.4, loanMortgagePromo: 6.9, loanMortgageFloat: 10.8, loanConsumerUnsecured: 15.5, marginRate: 9.99,
    trend: 'UP'
  },
  {
    id: 'HDB', name: 'Ngân hàng TMCP Phát triển TP.HCM (HDBank)', shortName: 'HDBank', group: 'TMCP_TOP1',
    depositKKH: 0.1, deposit1M: 3.5, deposit3M: 3.7, deposit6M: 5.1, deposit9M: 5.1, deposit12M: 5.7, deposit18M: 6.0, deposit24M: 6.0, deposit36M: 6.0,
    tierBonus1B_5B: 0.3, tierBonusOver5B: 0.6, onlineBonus: 0.3,
    loanBusinessShort: 7.0, loanBusinessMid: 8.9, loanMortgagePromo: 7.0, loanMortgageFloat: 11.2, loanConsumerUnsecured: 16.0, marginRate: 10.9,
    trend: 'UP'
  },
  {
    id: 'STB', name: 'Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)', shortName: 'Sacombank', group: 'TMCP_TOP1',
    depositKKH: 0.1, deposit1M: 3.2, deposit3M: 3.5, deposit6M: 4.6, deposit9M: 4.6, deposit12M: 5.3, deposit18M: 5.6, deposit24M: 5.6, deposit36M: 5.6,
    tierBonus1B_5B: 0.2, tierBonusOver5B: 0.45, onlineBonus: 0.25,
    loanBusinessShort: 6.7, loanBusinessMid: 8.5, loanMortgagePromo: 6.8, loanMortgageFloat: 10.6, loanConsumerUnsecured: 15.2, marginRate: 10.5,
    trend: 'STABLE'
  },
  {
    id: 'VIB', name: 'Ngân hàng TMCP Quốc Tế Việt Nam (VIB)', shortName: 'VIB', group: 'TMCP_TOP1',
    depositKKH: 0.1, deposit1M: 3.4, deposit3M: 3.7, deposit6M: 4.8, deposit9M: 4.8, deposit12M: 5.5, deposit18M: 5.8, deposit24M: 5.8, deposit36M: 5.8,
    tierBonus1B_5B: 0.25, tierBonusOver5B: 0.5, onlineBonus: 0.3,
    loanBusinessShort: 6.9, loanBusinessMid: 8.8, loanMortgagePromo: 7.0, loanMortgageFloat: 11.0, loanConsumerUnsecured: 15.8, marginRate: 10.8,
    trend: 'UP'
  },

  // ── TMCP TẦM TRUNG & LÃI SUẤT TIỀN GỬI CAO ──
  {
    id: 'SHB', name: 'Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)', shortName: 'SHB', group: 'TMCP_MID',
    depositKKH: 0.1, deposit1M: 3.3, deposit3M: 3.6, deposit6M: 4.8, deposit9M: 4.8, deposit12M: 5.5, deposit18M: 5.9, deposit24M: 5.9, deposit36M: 5.9,
    tierBonus1B_5B: 0.25, tierBonusOver5B: 0.5, onlineBonus: 0.3,
    loanBusinessShort: 6.8, loanBusinessMid: 8.6, loanMortgagePromo: 7.1, loanMortgageFloat: 10.9, loanConsumerUnsecured: 15.5, marginRate: 11.2,
    trend: 'STABLE'
  },
  {
    id: 'LPB', name: 'Ngân hàng TMCP Lộc Phát Việt Nam (LPBank)', shortName: 'LPBank', group: 'TMCP_MID',
    depositKKH: 0.1, deposit1M: 3.5, deposit3M: 3.8, deposit6M: 5.0, deposit9M: 5.0, deposit12M: 5.7, deposit18M: 6.1, deposit24M: 6.1, deposit36M: 6.1,
    tierBonus1B_5B: 0.3, tierBonusOver5B: 0.55, onlineBonus: 0.3,
    loanBusinessShort: 7.1, loanBusinessMid: 9.0, loanMortgagePromo: 7.2, loanMortgageFloat: 11.4, loanConsumerUnsecured: 16.0, marginRate: 11.5,
    trend: 'UP'
  },
  {
    id: 'MSB', name: 'Ngân hàng TMCP Hàng Hải Việt Nam (MSB)', shortName: 'MSB', group: 'TMCP_MID',
    depositKKH: 0.1, deposit1M: 3.5, deposit3M: 3.7, deposit6M: 4.9, deposit9M: 4.9, deposit12M: 5.6, deposit18M: 5.8, deposit24M: 5.8, deposit36M: 5.8,
    tierBonus1B_5B: 0.25, tierBonusOver5B: 0.5, onlineBonus: 0.3,
    loanBusinessShort: 6.9, loanBusinessMid: 8.7, loanMortgagePromo: 7.0, loanMortgageFloat: 11.1, loanConsumerUnsecured: 15.8, marginRate: 10.9,
    trend: 'UP'
  },
  {
    id: 'OCB', name: 'Ngân hàng TMCP Phương Đông (OCB)', shortName: 'OCB', group: 'TMCP_MID',
    depositKKH: 0.1, deposit1M: 3.7, deposit3M: 3.9, deposit6M: 5.0, deposit9M: 5.0, deposit12M: 5.8, deposit24M: 6.0, deposit18M: 6.0, deposit36M: 6.0,
    tierBonus1B_5B: 0.3, tierBonusOver5B: 0.6, onlineBonus: 0.35,
    loanBusinessShort: 7.2, loanBusinessMid: 9.1, loanMortgagePromo: 7.3, loanMortgageFloat: 11.6, loanConsumerUnsecured: 16.2, marginRate: 11.8,
    trend: 'UP'
  },
  {
    id: 'SSB', name: 'Ngân hàng TMCP Đông Nam Á (SeABank)', shortName: 'SeABank', group: 'TMCP_MID',
    depositKKH: 0.1, deposit1M: 3.4, deposit3M: 3.6, deposit6M: 4.6, deposit9M: 4.6, deposit12M: 5.4, deposit18M: 5.7, deposit24M: 5.7, deposit36M: 5.7,
    tierBonus1B_5B: 0.2, tierBonusOver5B: 0.45, onlineBonus: 0.25,
    loanBusinessShort: 7.0, loanBusinessMid: 8.8, loanMortgagePromo: 7.1, loanMortgageFloat: 11.0, loanConsumerUnsecured: 15.5, marginRate: 11.0,
    trend: 'STABLE'
  },
  {
    id: 'EIB', name: 'Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam (Eximbank)', shortName: 'Eximbank', group: 'TMCP_MID',
    depositKKH: 0.1, deposit1M: 3.6, deposit3M: 3.9, deposit6M: 5.1, deposit9M: 5.1, deposit12M: 5.7, deposit18M: 6.2, deposit24M: 6.2, deposit36M: 6.2,
    tierBonus1B_5B: 0.3, tierBonusOver5B: 0.6, onlineBonus: 0.3,
    loanBusinessShort: 7.3, loanBusinessMid: 9.3, loanMortgagePromo: 7.4, loanMortgageFloat: 11.8, loanConsumerUnsecured: 16.8, marginRate: 11.6,
    trend: 'UP'
  },
  {
    id: 'BAB', name: 'Ngân hàng TMCP Bắc Á (BacABank)', shortName: 'BacABank', group: 'TMCP_MID',
    depositKKH: 0.1, deposit1M: 3.7, deposit3M: 4.0, deposit6M: 5.2, deposit9M: 5.2, deposit12M: 5.9, deposit18M: 6.1, deposit24M: 6.1, deposit36M: 6.1,
    tierBonus1B_5B: 0.35, tierBonusOver5B: 0.65, onlineBonus: 0.35,
    loanBusinessShort: 7.5, loanBusinessMid: 9.5, loanMortgagePromo: 7.6, loanMortgageFloat: 12.0, loanConsumerUnsecured: 17.0, marginRate: 12.0,
    trend: 'UP'
  },
  {
    id: 'NCB', name: 'Ngân hàng TMCP Quốc Dân (NCB)', shortName: 'NCB', group: 'TMCP_MID',
    depositKKH: 0.1, deposit1M: 3.8, deposit3M: 4.1, deposit6M: 5.4, deposit9M: 5.4, deposit12M: 6.1, deposit18M: 6.3, deposit24M: 6.3, deposit36M: 6.3,
    tierBonus1B_5B: 0.4, tierBonusOver5B: 0.7, onlineBonus: 0.4,
    loanBusinessShort: 7.8, loanBusinessMid: 9.8, loanMortgagePromo: 7.9, loanMortgageFloat: 12.5, loanConsumerUnsecured: 17.5, marginRate: 12.5,
    trend: 'UP'
  },
];

// ── 2. BẢNG DỮ LIỆU TOP 10 VÍ ĐIỆN TỬ & APP VAY NỢ / TÍCH LŨY FINTECH ──
export const TOP_10_FINTECH: EWalletFintechRate[] = [
  { id: 'MOMO', name: 'MoMo - Túi Thần Tài & Ví Trả Sau', provider: 'MoMo & Finsight / TPBank', category: 'VI_DIEN_TU', savingRateDay: 4.8, savingRateTerm: 5.8, borrowRate: 18.5, limitMax: 200000000, withdrawalSpeed: 'T+0 (Ngay lập tức 24/7)', feature: 'Sinh lời theo ngày, hạn mức ví trả sau 20Tr, rút tiền mua sắm tự do', rating: 4.8 },
  { id: 'ZALOPAY', name: 'ZaloPay - Tài Khoản Tích Lũy & PayLater', provider: 'ZaloPay & RealStake / CIMB Bank', category: 'VI_DIEN_TU', savingRateDay: 5.0, savingRateTerm: 6.0, borrowRate: 19.0, limitMax: 100000000, withdrawalSpeed: 'T+0 (Tức thì)', feature: 'Nhận lãi mỗi ngày, liên kết ví chat Zalo, miễn phí thanh toán QR', rating: 4.7 },
  { id: 'VIETTELPAY', name: 'Viettel Money - Tiết Kiệm & Easy Vay', provider: 'Viettel Digital & MBBank / EasyCredit', category: 'VI_DIEN_TU', savingRateDay: 5.2, savingRateTerm: 6.3, borrowRate: 16.8, limitMax: 500000000, withdrawalSpeed: 'T+0 (Toàn quốc)', feature: 'Bảo mật quân đội, điểm giao dịch nạp rút tiền mặt rộng khắp cả nước', rating: 4.8 },
  { id: 'TIKOP', name: 'Tikop - Hũ Tích Lũy & Gói Lộc Phát', provider: 'Techlab & Techcom Securities / BIDV', category: 'APP_TICH_LUY', savingRateDay: 5.5, savingRateTerm: 6.8, borrowRate: 14.5, limitMax: 1000000000, withdrawalSpeed: 'T+0 (Gói linh hoạt)', feature: 'Lãi suất gói kỳ hạn cao top đầu, hợp tác kiểm toán PwC, nạp rút tiện', rating: 4.7 },
  { id: 'FINHAY', name: 'Finhay - Tích Lũy & Đầu Tư Chứng Khoán', provider: 'Công ty CP Finhay & VCSC / TVSI', category: 'APP_TICH_LUY', savingRateDay: 5.0, savingRateTerm: 6.2, borrowRate: 15.0, limitMax: 500000000, withdrawalSpeed: 'T+0 - T+1', feature: 'Tích lũy thông minh, mua vàng nhẫn Doji, chứng chỉ quỹ mở', rating: 4.6 },
  { id: 'CAKE', name: 'Cake by VPBank - Tiền Gửi Sinh Lời Super', provider: 'VPBank & Be Financial', category: 'APP_TICH_LUY', savingRateDay: 4.5, savingRateTerm: 6.0, borrowRate: 16.5, limitMax: 2000000000, withdrawalSpeed: 'T+0 (Ngân hàng số)', feature: 'Tài khoản thanh toán tự sinh lời theo số dư cuối ngày, miễn phí trọn đời', rating: 4.8 },
  { id: 'VNPAY', name: 'VNPAY - Ví Điện Tử & Thẻ Thấu Chi', provider: 'VNPAY & Agribank / Vietcombank', category: 'VI_DIEN_TU', savingRateDay: 4.5, savingRateTerm: 5.5, borrowRate: 17.0, limitMax: 100000000, withdrawalSpeed: 'T+0', feature: 'Thanh toán VNPAY-QR 300.000 điểm chấp nhận, đặt vé máy bay, tàu xe', rating: 4.6 },
  { id: 'SHOPEEPAY', name: 'ShopeePay & SPayLater (BNPL)', provider: 'SeaMoney & TPBank / VPBank', category: 'VI_DIEN_TU', savingRateDay: 4.0, savingRateTerm: 5.0, borrowRate: 24.0, limitMax: 50000000, withdrawalSpeed: 'T+0', feature: 'Mua sắm trước trả sau 0% lãi đến 30 ngày, voucher độc quyền Shopee', rating: 4.5 },
  { id: 'HOMECREDIT', name: 'Home Credit Finance', provider: 'Home Credit Việt Nam (Siam Commercial Bank)', category: 'APP_VAY_TIEU_DUNG', savingRateDay: 0.0, borrowRate: 22.0, limitMax: 100000000, withdrawalSpeed: 'Duyệt vay 10 phút', feature: 'Vay trả góp điện máy, xe máy 0% lãi suất, thẻ tín dụng tiêu dùng', rating: 4.3 },
  { id: 'FECREDIT', name: 'FE Credit - Vay Tiêu Dùng Nhanh', provider: 'VPBank & SMBC Nhật Bản', category: 'APP_VAY_TIEU_DUNG', savingRateDay: 0.0, borrowRate: 28.0, limitMax: 70000000, withdrawalSpeed: 'Giải ngân 24/7', feature: 'Vay tiền mặt qua CCCD gắn chip, hạn mức lớn, phủ sóng cả nước', rating: 4.1 },
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
 * HÀM TÍNH TIỀN LÃI TIẾT KIỆM THỰC TẾ THEO SỐ TIỀN & KỲ HẠN
 */
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

  const costOfEquity = BENCHMARK_RATES.riskFreeRate12M + 1.15 * 6.5; // CAPM
  const expectedGrowth = Math.min(18, Math.max(5, stock.roe * 0.65));

  const targetPE = 100 / (BENCHMARK_RATES.riskFreeRate12M + 3.5);
  const fairValue = Math.round(stock.eps * targetPE);
  const upsidePct = (((fairValue - stock.price) / stock.price) * 100).toFixed(1);

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

