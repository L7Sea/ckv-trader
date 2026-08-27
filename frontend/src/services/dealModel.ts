/* ═══════════════════════════════════════════════════════════════════════════
   MÔ HÌNH DEAL MARGIN — NGUỒN SỰ THẬT DUY NHẤT VỀ TIỀN (SINGLE SOURCE OF TRUTH)
   ───────────────────────────────────────────────────────────────────────────
   Mọi con số tiền trong app (Nợ, NAV, Lãi/Lỗ, Giá hòa vốn) BẮT BUỘC suy ra từ
   file này. Cấm hardcode ảnh chụp số dư ở bất kỳ nơi nào khác.

   Tham số dưới đây được hiệu chỉnh (calibrate) bằng hồi quy trên 3 mốc số dư
   thực tế do chủ tài khoản cung cấp từ app DNSE — khớp tới từng đồng:

     Mốc         N    Nợ thực      Mô hình      NAV thực     Mô hình
     26/8 13:53  44   7,002,051    7,002,051    7,598,120    7,598,120
     27/8 15:43  45   7,004,413    7,004,413    7,695,758    7,695,758
     28/8 06:26  46   7,006,776    7,006,776    7,693,395    7,693,395

     Lãi chưa chốt 27/8: thực -1,220,541 (-7.73%) | mô hình -1,220,541 (-7.73%)
     Lãi chưa chốt 28/8: thực -1,223,158 (-7.75%) | mô hình -1,223,158 (-7.75%)

   Hai phát hiện từ hiệu chỉnh:
   1. Lãi suất vay Deal thực tế là 12.5%/năm, KHÔNG phải 11.5% như phiên bản cũ
      giả định (11.5% cho 2,173đ/ngày, thực tế DNSE ghi nhận 2,362đ/ngày).
   2. Ngoài lãi vay, DNSE còn cộng thêm ~255đ/ngày chi phí Deal vào giá vốn.
      Tổng chi phí đội vào giá vốn là 2,617đ/ngày (2,362 lãi vay + 255 phí Deal).
   ═══════════════════════════════════════════════════════════════════════════ */

export interface DealConfig {
  /** Mã cổ phiếu của Deal đang mở */
  symbol: string;
  /** Khối lượng nắm giữ */
  quantity: number;
  /** Ngày Deal được giải ngân đầy đủ — mốc N=0 để tính lãi vay */
  openDate: string;
  /** Vốn tự có đã bỏ vào Deal */
  ownCapital: number;
  /** Dư nợ gốc vay Margin (KHÔNG bao gồm lãi tích luỹ) */
  principalLoan: number;
  /** Giá vốn Deal tại N=0: tiền giải ngân + phí mua + phí mở Deal */
  costBasisAtOpen: number;
  /** Lãi suất vay Margin danh nghĩa (%/năm), cơ sở 365 ngày */
  marginRateAnnual: number;
  /** Tổng chi phí Deal đội vào giá vốn mỗi ngày (lãi vay + phí Deal) */
  dailyDealCost: number;
  /** Tiền mặt khả dụng trong tài khoản */
  cash: number;
}

/** Cấu hình Deal TPB thực tế của chủ tài khoản (DNSE tiểu khoản 06). */
export const DEAL_CONFIG: DealConfig = {
  symbol: 'TPB',
  quantity: 1000,
  openDate: '2026-07-13',
  ownCapital: 8891893,
  principalLoan: 6898107,
  costBasisAtOpen: 15802776,
  marginRateAnnual: 12.5,
  dailyDealCost: 2617,
  cash: 171
};

/** Tổng tiền đã giải ngân ban đầu = vốn tự có + vốn vay. Mẫu số của % lãi/lỗ. */
export const disbursedCapital = (cfg: DealConfig = DEAL_CONFIG): number =>
  cfg.ownCapital + cfg.principalLoan;

/**
 * Ngày lịch theo múi giờ Việt Nam (UTC+7) dưới dạng YYYY-MM-DD.
 *
 * Bắt buộc dùng giờ VN chứ không phải UTC: lúc 06:26 sáng 28/08 ở Việt Nam thì UTC
 * mới là 23:26 ngày 27/08 — đếm theo UTC sẽ thiếu đúng 1 ngày lãi vay (2,363đ) và
 * làm lệch cả Nợ lẫn NAV so với app DNSE.
 */
export function vnDateString(value: string | Date = new Date()): string {
  if (typeof value === 'string') return value.slice(0, 10);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(value);
}

/** Số ngày lịch (giờ Việt Nam) trôi qua kể từ ngày mở Deal. Không âm. */
export function daysSinceOpen(asOf: string | Date = new Date(), cfg: DealConfig = DEAL_CONFIG): number {
  const midnight = (isoDate: string) => Date.parse(isoDate + 'T00:00:00Z');
  const diff = midnight(vnDateString(asOf)) - midnight(cfg.openDate);
  return Math.max(0, Math.round(diff / 86400000));
}

/** Lãi vay Margin tích luỹ sau N ngày. Lãi đơn trên dư nợ GỐC, cơ sở 365 ngày. */
export function accruedInterest(days: number, cfg: DealConfig = DEAL_CONFIG): number {
  return Math.round((cfg.principalLoan * (cfg.marginRateAnnual / 100)) / 365 * Math.max(0, days));
}

/** Tổng dư nợ Margin phải trả = gốc vay + lãi tích luỹ. */
export function marginDebtAt(days: number, cfg: DealConfig = DEAL_CONFIG): number {
  return cfg.principalLoan + accruedInterest(days, cfg);
}

/** Giá vốn Deal (tổng chi phí đã bỏ ra) sau N ngày, tính bằng đồng. */
export function dealCostAt(days: number, cfg: DealConfig = DEAL_CONFIG): number {
  return cfg.costBasisAtOpen + cfg.dailyDealCost * Math.max(0, days);
}

/** Giá hòa vốn mỗi cổ phiếu sau N ngày (làm tròn đồng). */
export function breakevenPriceAt(days: number, cfg: DealConfig = DEAL_CONFIG): number {
  return Math.round(dealCostAt(days, cfg) / cfg.quantity);
}

export interface DealSnapshot {
  days: number;
  marketPrice: number;
  quantity: number;
  cash: number;
  stockValue: number;
  marginDebt: number;
  accruedInterest: number;
  dealCost: number;
  breakevenPrice: number;
  netAssetValue: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  equityRatioPct: number;
}

/**
 * Chụp toàn bộ trạng thái tiền của Deal tại một mức giá và một ngày.
 * Đây là hàm DUY NHẤT được phép sinh ra Nợ / NAV / Lãi lỗ / Giá hòa vốn.
 */
export function computeDealSnapshot(
  marketPrice: number,
  asOf: string | Date = new Date(),
  cfg: DealConfig = DEAL_CONFIG
): DealSnapshot {
  const days = daysSinceOpen(asOf, cfg);
  const stockValue = cfg.quantity * marketPrice;
  const debt = marginDebtAt(days, cfg);
  const cost = dealCostAt(days, cfg);
  const pnl = stockValue - cost;
  const totalAssets = cfg.cash + stockValue;

  return {
    days,
    marketPrice,
    quantity: cfg.quantity,
    cash: cfg.cash,
    stockValue,
    marginDebt: debt,
    accruedInterest: accruedInterest(days, cfg),
    dealCost: cost,
    breakevenPrice: breakevenPriceAt(days, cfg),
    netAssetValue: cfg.cash + stockValue - debt,
    unrealizedPnL: pnl,
    unrealizedPnLPct: Number(((pnl / disbursedCapital(cfg)) * 100).toFixed(2)),
    equityRatioPct: totalAssets > 0 ? Number((((totalAssets - debt) / totalAssets) * 100).toFixed(2)) : 100
  };
}

/**
 * Lãi/lỗ cho một vị thế BẤT KỲ.
 * Deal đang mở dùng giá vốn động theo ngày; các mã khác dùng giá vốn bình quân.
 * Thay thế hoàn toàn 3 công thức mâu thuẫn trước đây.
 */
export function computePositionPnL(
  symbol: string,
  quantity: number,
  avgPrice: number,
  marketPrice: number,
  asOf: string | Date = new Date(),
  cfg: DealConfig = DEAL_CONFIG
): { pnl: number; pnlPct: number; costBasis: number; breakevenPrice: number } {
  const marketValue = quantity * marketPrice;

  if (symbol === cfg.symbol && quantity === cfg.quantity) {
    const days = daysSinceOpen(asOf, cfg);
    const costBasis = dealCostAt(days, cfg);
    const pnl = marketValue - costBasis;
    return {
      pnl,
      pnlPct: Number(((pnl / disbursedCapital(cfg)) * 100).toFixed(2)),
      costBasis,
      breakevenPrice: breakevenPriceAt(days, cfg)
    };
  }

  const costBasis = quantity * avgPrice;
  const pnl = marketValue - costBasis;
  return {
    pnl,
    pnlPct: costBasis > 0 ? Number(((pnl / costBasis) * 100).toFixed(2)) : 0,
    costBasis,
    breakevenPrice: quantity > 0 ? Math.round(costBasis / quantity) : 0
  };
}
