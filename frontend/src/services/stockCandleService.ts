/* ═══════════════════════════════════════════════════════════════════════════
   DỮ LIỆU NẾN NHẬT — LẤY THẬT TỪ SÀN, KHÔNG BỊA
   ───────────────────────────────────────────────────────────────────────────
   Bản cũ có hàm `generateCandleSeries()` dựng chuỗi nến bằng số giả ngẫu nhiên.
   Đã xoá bỏ hoàn toàn: một biểu đồ kỹ thuật vẽ từ dữ liệu bịa còn tệ hơn là
   không có biểu đồ, vì nó dẫn tới quyết định mua bán sai.

   Nguồn dữ liệu đi qua đúng proxy đã dùng cho giá: Pages Function cùng origin
   (/api/market/ohlc) → Worker riêng nếu có cấu hình → gọi thẳng Entrade.
   Không lấy được thì trả mảng RỖNG để giao diện báo rõ, tuyệt đối không bù bằng
   dữ liệu tự chế.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20?: number;
  ma50?: number;
  ema9?: number;
}

/** Khung thời gian hiển thị. W và M được gộp từ nến ngày. */
export type Timeframe = '15' | '60' | 'D' | 'W' | 'M';

const MARKET_PROXY_BASE = (import.meta.env?.VITE_MARKET_PROXY_URL || '').replace(/\/$/, '');

/** Độ phân giải gửi lên nguồn dữ liệu và số ngày lịch sử cần lấy. */
const RESOLUTION_MAP: Record<Timeframe, { resolution: string; days: number }> = {
  '15': { resolution: '15', days: 14 },
  '60': { resolution: '1H', days: 90 },
  D: { resolution: '1D', days: 400 },
  W: { resolution: '1D', days: 1400 },
  M: { resolution: '1D', days: 2600 }
};

/** Entrade trả giá theo nghìn đồng (14.7) với mã này, theo đồng (14700) với mã khác. */
const toVnd = (raw: number): number => (raw > 0 && raw < 1000 ? Math.round(raw * 1000) : Math.round(raw));

function labelFor(date: Date, timeframe: Timeframe): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  if (timeframe === '15' || timeframe === '60') {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  if (timeframe === 'M') return `T${mm}/${String(date.getFullYear()).slice(-2)}`;
  return `${dd}/${mm}`;
}

/** Gộp nến ngày thành nến tuần hoặc nến tháng. */
function aggregate(daily: Candle[], timeframe: 'W' | 'M'): Candle[] {
  const buckets = new Map<string, Candle[]>();

  for (const candle of daily) {
    const d = new Date(candle.timestamp);
    let key: string;
    if (timeframe === 'M') {
      key = `${d.getFullYear()}-${d.getMonth()}`;
    } else {
      // Khoá theo thứ Hai của tuần chứa ngày đó
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      key = monday.toISOString().slice(0, 10);
    }
    const bucket = buckets.get(key);
    if (bucket) bucket.push(candle);
    else buckets.set(key, [candle]);
  }

  return [...buckets.values()]
    .filter((group) => group.length > 0)
    .map((group) => {
      const first = group[0]!;
      const last = group[group.length - 1]!;
      return {
        time: labelFor(new Date(first.timestamp), timeframe),
        timestamp: first.timestamp,
        open: first.open,
        close: last.close,
        high: Math.max(...group.map((c) => c.high)),
        low: Math.min(...group.map((c) => c.low)),
        volume: group.reduce((sum, c) => sum + c.volume, 0)
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

/** Bổ sung MA20, MA50, EMA9 vào chuỗi nến. */
export function withIndicators(candles: Candle[]): Candle[] {
  const movingAverage = (index: number, period: number): number | undefined => {
    const start = index - period + 1;
    if (start < 0) return undefined;
    let sum = 0;
    for (let i = start; i <= index; i++) sum += candles[i]!.close;
    return Math.round(sum / period);
  };

  candles.forEach((candle, i) => {
    candle.ma20 = movingAverage(i, 20);
    candle.ma50 = movingAverage(i, 50);
  });

  const k = 2 / (9 + 1);
  let prevEma = candles[0]?.close ?? 0;
  for (const candle of candles) {
    prevEma = candle.close * k + prevEma * (1 - k);
    candle.ema9 = Math.round(prevEma);
  }

  return candles;
}

/**
 * Lấy chuỗi nến THẬT của một mã.
 * Trả về mảng rỗng nếu không nguồn nào phản hồi được — giao diện phải báo rõ
 * thay vì vẽ bừa.
 */
export async function fetchCandles(symbol: string, timeframe: Timeframe): Promise<Candle[]> {
  const sym = symbol.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,10}$/.test(sym)) return [];

  const { resolution, days } = RESOLUTION_MAP[timeframe];
  const to = Math.floor(Date.now() / 1000) + 3600;
  const from = to - 86400 * days;
  const query = `symbol=${sym}&resolution=${resolution}&from=${from}&to=${to}`;

  const endpoints = [
    `/api/market/ohlc?${query}`,
    MARKET_PROXY_BASE ? `${MARKET_PROXY_BASE}/api/market/ohlc?${query}` : null,
    `https://services.entrade.com.vn/chart-api/v2/ohlcs/stock?${query}`
  ].filter(Boolean) as string[];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;

      const data = await res.json();
      const { t, o, h, l, c, v } = data || {};
      if (!Array.isArray(t) || !Array.isArray(c) || t.length === 0) continue;

      const displayFrame: Timeframe = timeframe === 'W' || timeframe === 'M' ? 'D' : timeframe;
      const candles: Candle[] = [];

      for (let i = 0; i < t.length; i++) {
        const close = toVnd(Number(c[i]));
        if (!Number.isFinite(close) || close <= 0) continue;
        const date = new Date(Number(t[i]) * 1000);
        candles.push({
          time: labelFor(date, displayFrame),
          timestamp: date.getTime(),
          open: toVnd(Number(o?.[i] ?? c[i])),
          high: toVnd(Number(h?.[i] ?? c[i])),
          low: toVnd(Number(l?.[i] ?? c[i])),
          close,
          volume: Math.round(Number(v?.[i] ?? 0))
        });
      }

      if (candles.length === 0) continue;
      candles.sort((a, b) => a.timestamp - b.timestamp);

      const series = timeframe === 'W' || timeframe === 'M' ? aggregate(candles, timeframe) : candles;
      return withIndicators(series);
    } catch {
      // thử nguồn tiếp theo
    }
  }

  return [];
}
