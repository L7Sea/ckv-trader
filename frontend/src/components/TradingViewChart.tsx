import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   BIỂU ĐỒ NẾN TRADINGVIEW — GẮN ĐÚNG MÃ ĐANG CHỌN
   ───────────────────────────────────────────────────────────────────────────
   Bản cũ nhúng iframe `s.tradingview.com/widgetembed/?symbol=...&symboledit=1`.
   Đây là endpoint nội bộ không có tài liệu, và `symboledit=1` cho phép widget
   TỰ GHI NHỚ mã cuối cùng vào localStorage của chính tradingview.com. Khi mã
   trong URL không khớp thứ nó nhớ (hoặc không phân giải được), nó lặng lẽ hiện
   lại mã cũ — đó là lý do chọn VCB nhưng biểu đồ vẫn là Apple Inc.

   Ở đây dùng widget CHÍNH THỨC (embed-widget-advanced-chart.js): mã được truyền
   qua cấu hình JSON và widget được DỰNG LẠI mỗi khi đổi mã, nên không còn trạng
   thái cũ nào ghi đè.
   ═══════════════════════════════════════════════════════════════════════════ */

const WIDGET_SRC = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';

interface Props {
  /** Mã cổ phiếu, ví dụ TPB */
  symbol: string;
  /** Sàn niêm yết dùng làm tiền tố TradingView: HOSE / HNX / UPCOM */
  exchange: string;
  height?: number;
}

export const TradingViewChart: React.FC<Props> = ({ symbol, exchange, height = 560 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const tvSymbol = `${exchange}:${symbol}`;

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    setFailed(false);
    // Dựng lại từ đầu mỗi lần đổi mã — không tái dùng widget cũ
    host.innerHTML = '';

    const widgetHolder = document.createElement('div');
    widgetHolder.className = 'tradingview-widget-container__widget';
    widgetHolder.style.height = '100%';
    host.appendChild(widgetHolder);

    const script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.type = 'text/javascript';
    script.async = true;
    script.onerror = () => setFailed(true);
    script.innerHTML = JSON.stringify({
      symbol: tvSymbol,
      interval: 'D',
      timezone: 'Asia/Ho_Chi_Minh',
      theme: 'dark',
      style: '1',
      locale: 'vi_VN',
      autosize: true,
      allow_symbol_change: true,
      withdateranges: true,
      hide_side_toolbar: false,
      save_image: true,
      details: false,
      backgroundColor: 'rgba(12, 16, 23, 1)',
      gridColor: 'rgba(33, 38, 54, 0.6)'
    });
    host.appendChild(script);

    // Widget không tải được (chặn mạng, offline) thì báo rõ thay vì để trống
    const timer = window.setTimeout(() => {
      if (!widgetHolder.querySelector('iframe')) setFailed(true);
    }, 8000);

    return () => {
      window.clearTimeout(timer);
      host.innerHTML = '';
    };
  }, [tvSymbol]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#212636] bg-[#0c1017]" style={{ height }}>
      <div ref={containerRef} className="tradingview-widget-container h-full w-full" />

      {/* Luôn hiện mã ĐÃ YÊU CẦU ngay trên biểu đồ. Nếu TradingView vẽ mã khác
          (không có mã Việt Nam đó, hoặc người dùng tự đổi trong widget) thì nhìn
          là thấy ngay, thay vì âm thầm hiện nhầm công ty như bản cũ. */}
      {!failed && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 pointer-events-auto">
          <span className="px-2 py-1 rounded-lg bg-slate-950/85 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold backdrop-blur">
            Đang yêu cầu: {tvSymbol}
          </span>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSymbol)}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Mở ${tvSymbol} trên trang TradingView`}
            className="p-1.5 rounded-lg bg-slate-950/85 border border-[#2b3245] text-slate-400 hover:text-emerald-300 transition backdrop-blur"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0c1017] text-center px-6">
          <AlertTriangle className="h-8 w-8 text-amber-400" />
          <p className="text-sm text-slate-300 font-semibold">
            Không tải được biểu đồ TradingView cho <span className="font-mono text-white">{tvSymbol}</span>
          </p>
          <p className="text-xs text-slate-500 max-w-md">
            Có thể do mạng bị chặn, hoặc TradingView chưa niêm yết mã này. Bấm nút dưới để mở
            trực tiếp trên trang TradingView.
          </p>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSymbol)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Mở {tvSymbol} trên TradingView
          </a>
        </div>
      )}
    </div>
  );
};
