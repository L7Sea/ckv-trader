import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Candle, Timeframe, fetchCandles } from '../services/stockCandleService';

/* ═══════════════════════════════════════════════════════════════════════════
   BIỂU ĐỒ NẾN NHẬT DỰNG NGAY TRONG APP (SVG THUẦN)
   ───────────────────────────────────────────────────────────────────────────
   Vì sao không dùng TradingView làm biểu đồ chính:
   - Widget nhúng là iframe khác origin, app không kiểm soát được nó vẽ mã nào;
     bản cũ chọn VCB mà biểu đồ vẫn hiện Apple Inc.
   - Script nhúng của TradingView có thể bị chặn (mạng, trình chặn quảng cáo),
     khi đó người dùng không có biểu đồ nào để xem.

   Biểu đồ này vẽ từ CHÍNH dữ liệu nến thật mà app đã lấy qua proxy, nên luôn
   đúng mã đang chọn và luôn hiển thị được. TradingView giữ lại như một liên kết
   phụ để xem sâu hơn.
   ═══════════════════════════════════════════════════════════════════════════ */

const TIMEFRAMES: { id: Timeframe; label: string }[] = [
  { id: '15', label: '15 phút' },
  { id: '60', label: '1 giờ' },
  { id: 'D', label: 'Ngày' },
  { id: 'W', label: 'Tuần' },
  { id: 'M', label: 'Tháng' }
];

const MAX_CANDLES = 90;

interface Props {
  symbol: string;
  exchange: string;
  height?: number;
}

export const CandleChart: React.FC<Props> = ({ symbol, exchange, height = 560 }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('D');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading');
  const [hovered, setHovered] = useState<number | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setHovered(null);

    fetchCandles(symbol, timeframe).then((data) => {
      if (cancelled) return;
      const series = data.slice(-MAX_CANDLES);
      setCandles(series);
      setStatus(series.length > 0 ? 'ready' : 'empty');
    });

    return () => {
      cancelled = true;
    };
  }, [symbol, timeframe, reloadToken]);

  // Khung vẽ: phần trên là nến, phần dưới là khối lượng
  const W = 1000;
  const H = 420;
  const PAD = { left: 8, right: 62, top: 12, bottom: 26 };
  const priceH = H * 0.74;
  const volTop = priceH + 16;
  const volH = H - volTop - PAD.bottom;

  const geometry = useMemo(() => {
    if (candles.length === 0) return null;

    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const maxPrice = Math.max(...highs);
    const minPrice = Math.min(...lows);
    const span = maxPrice - minPrice || maxPrice * 0.02 || 1;
    const padSpan = span * 0.08;
    const top = maxPrice + padSpan;
    const bottom = Math.max(0, minPrice - padSpan);

    const innerW = W - PAD.left - PAD.right;
    const slot = innerW / candles.length;
    const bodyW = Math.max(1.5, Math.min(14, slot * 0.62));
    const maxVol = Math.max(...candles.map((c) => c.volume), 1);

    const xOf = (i: number) => PAD.left + slot * (i + 0.5);
    const yOf = (price: number) => PAD.top + ((top - price) / (top - bottom)) * (priceH - PAD.top);
    const volOf = (vol: number) => (vol / maxVol) * volH;

    const linePath = (key: 'ma20' | 'ma50' | 'ema9') => {
      const points = candles
        .map((c, i) => (c[key] === undefined ? null : `${xOf(i).toFixed(1)},${yOf(c[key]!).toFixed(1)}`))
        .filter(Boolean) as string[];
      return points.length > 1 ? `M${points.join(' L')}` : '';
    };

    const gridLines = Array.from({ length: 5 }, (_, i) => {
      const price = bottom + ((top - bottom) * i) / 4;
      return { price: Math.round(price), y: yOf(price) };
    });

    return { top, bottom, slot, bodyW, xOf, yOf, volOf, linePath, gridLines };
  }, [candles]);

  const last = candles[candles.length - 1];
  const active = hovered !== null ? candles[hovered] : last;
  const fmt = (n: number) => (n || 0).toLocaleString('vi-VN');
  const fmtVol = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : fmt(n));

  return (
    <div
      className="w-full rounded-2xl border border-vien bg-the flex flex-col overflow-hidden"
      style={{ height }}
    >
      {/* Thanh công cụ: khung thời gian + thông tin nến đang trỏ */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-vien">
        <div className="flex items-center gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-sans transition ${
                timeframe === tf.id
                  ? 'bg-tot text-tren-nhan'
                  : 'text-chu-phu hover:text-chu hover:bg-the'
              }`}
            >
              {tf.label}
            </button>
          ))}
          <button
            onClick={() => setReloadToken((n) => n + 1)}
            title="Tải lại dữ liệu nến"
            className="ml-1 p-1.5 rounded-lg text-chu-phu hover:text-tot hover:bg-the transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {active && (
          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <span className="text-chu-mo">{active.time}</span>
            <span className="text-chu-phu">
              M <span className="text-chu">{fmt(active.open)}</span>
            </span>
            <span className="text-chu-phu">
              C <span className="text-tot">{fmt(active.high)}</span>
            </span>
            <span className="text-chu-phu">
              T <span className="text-loi">{fmt(active.low)}</span>
            </span>
            <span className="text-chu-phu">
              Đ <span className="text-chu font-bold">{fmt(active.close)}</span>
            </span>
            <span className="text-chu-phu hidden sm:inline">
              KL <span className="text-nhan-chu">{fmtVol(active.volume)}</span>
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-canh-bao">MA20</span>
          <span className="text-nhan-chu">MA50</span>
          <span className="text-nhan-chu">EMA9</span>
        </div>
      </div>

      {/* Vùng vẽ */}
      <div className="relative flex-1 min-h-0">
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-chu-phu text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tải nến {exchange}:{symbol}...
          </div>
        )}

        {status === 'empty' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
            <AlertTriangle className="h-8 w-8 text-canh-bao" />
            <p className="text-sm text-chu-phu font-semibold">
              Chưa lấy được dữ liệu nến cho <span className="font-mono text-chu">{symbol}</span>
            </p>
            <p className="text-xs text-chu-mo max-w-md">
              Nguồn dữ liệu không phản hồi. App KHÔNG vẽ nến giả để lấp chỗ trống — thà không có
              biểu đồ còn hơn có biểu đồ sai.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReloadToken((n) => n + 1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tot-nen border border-vien text-tot text-xs font-bold hover:bg-tot-nen transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Thử lại
              </button>
              <a
                href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(`${exchange}:${symbol}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-the2 border border-vien text-chu-phu text-xs font-bold hover:text-chu transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Mở trên TradingView
              </a>
            </div>
          </div>
        )}

        {status === 'ready' && geometry && (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="w-full h-full"
            onMouseLeave={() => setHovered(null)}
          >
            {/* Lưới giá + nhãn trục phải */}
            {geometry.gridLines.map((g) => (
              <g key={g.price}>
                <line x1={PAD.left} y1={g.y} x2={W - PAD.right} y2={g.y} stroke="var(--vien)" strokeWidth={1} />
                <text x={W - PAD.right + 6} y={g.y + 3.5} fill="var(--chu-mo)" fontSize={10} fontFamily="monospace">
                  {fmt(g.price)}
                </text>
              </g>
            ))}

            {/* Khối lượng */}
            {candles.map((c, i) => {
              const h = geometry.volOf(c.volume);
              return (
                <rect
                  key={`v${c.timestamp}`}
                  x={geometry.xOf(i) - geometry.bodyW / 2}
                  y={volTop + volH - h}
                  width={geometry.bodyW}
                  height={Math.max(0.5, h)}
                  fill={c.close >= c.open ? 'var(--tot)' : 'var(--loi)'}
                  opacity={0.35}
                />
              );
            })}

            {/* Đường trung bình */}
            <path d={geometry.linePath('ma20')} fill="none" stroke="var(--canh-bao)" strokeWidth={1.4} opacity={0.9} />
            <path d={geometry.linePath('ma50')} fill="none" stroke="var(--vien)" strokeWidth={1.4} opacity={0.9} />
            <path d={geometry.linePath('ema9')} fill="none" stroke="var(--vien)" strokeWidth={1.2} opacity={0.75} />

            {/* Nến */}
            {candles.map((c, i) => {
              const up = c.close >= c.open;
              const color = up ? 'var(--tot)' : 'var(--loi)';
              const x = geometry.xOf(i);
              const yHigh = geometry.yOf(c.high);
              const yLow = geometry.yOf(c.low);
              const yOpen = geometry.yOf(c.open);
              const yClose = geometry.yOf(c.close);
              const bodyTop = Math.min(yOpen, yClose);
              const bodyH = Math.max(1, Math.abs(yClose - yOpen));

              return (
                <g key={c.timestamp}>
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth={1.1} />
                  <rect
                    x={x - geometry.bodyW / 2}
                    y={bodyTop}
                    width={geometry.bodyW}
                    height={bodyH}
                    fill={color}
                  />
                  {/* Vùng bắt chuột rộng hơn thân nến để dễ trỏ */}
                  <rect
                    x={x - geometry.slot / 2}
                    y={0}
                    width={geometry.slot}
                    height={H}
                    fill="transparent"
                    onMouseEnter={() => setHovered(i)}
                  />
                </g>
              );
            })}

            {/* Vạch dọc theo nến đang trỏ */}
            {hovered !== null && (
              <line
                x1={geometry.xOf(hovered)}
                y1={0}
                x2={geometry.xOf(hovered)}
                y2={H - PAD.bottom}
                stroke="var(--chu-mo)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}

            {/* Vạch giá hiện tại */}
            {last && (
              <g>
                <line
                  x1={PAD.left}
                  y1={geometry.yOf(last.close)}
                  x2={W - PAD.right}
                  y2={geometry.yOf(last.close)}
                  stroke={last.close >= last.open ? 'var(--tot)' : 'var(--loi)'}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  opacity={0.8}
                />
                <rect
                  x={W - PAD.right + 2}
                  y={geometry.yOf(last.close) - 8}
                  width={PAD.right - 4}
                  height={16}
                  rx={3}
                  fill={last.close >= last.open ? 'var(--tot)' : 'var(--loi)'}
                />
                <text
                  x={W - PAD.right + 6}
                  y={geometry.yOf(last.close) + 3.5}
                  fill="var(--the)"
                  fontSize={10}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {fmt(last.close)}
                </text>
              </g>
            )}

            {/* Nhãn thời gian: chỉ vẽ thưa cho đỡ rối */}
            {candles.map((c, i) =>
              i % Math.ceil(candles.length / 8) === 0 ? (
                <text
                  key={`t${c.timestamp}`}
                  x={geometry.xOf(i)}
                  y={H - 8}
                  fill="var(--chu-mo)"
                  fontSize={10}
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {c.time}
                </text>
              ) : null
            )}
          </svg>
        )}
      </div>

      {status === 'ready' && (
        <div className="px-3 py-1.5 border-t border-vien flex items-center justify-between text-[10px] text-chu-mo font-mono">
          <span>
            {candles.length} nến · dữ liệu thật từ sàn · {exchange}:{symbol}
          </span>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(`${exchange}:${symbol}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-tot transition"
          >
            <ExternalLink className="h-3 w-3" />
            Xem sâu trên TradingView
          </a>
        </div>
      )}
    </div>
  );
};
