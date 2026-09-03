import React, { useEffect, useState } from 'react';
import { Candle, fetchCandles } from '../services/stockCandleService';
import { DEAL_CONFIG } from '../services/dealModel';

/* ═══════════════════════════════════════════════════════════════════════════
   HÌNH CHO MÀN ĐẦU TIÊN — VẼ BẰNG DỮ LIỆU THẬT
   ───────────────────────────────────────────────────────────────────────────
   Skill `giao-dien-ui-design` bắt buộc: "màn hình đầu tiên phải có MỘT HÌNH",
   và hình đó phải nói cho người ta biết đây là cái gì nhanh hơn mọi câu chữ.

   Với app chứng khoán, thứ đặc trưng nhất là ĐƯỜNG GIÁ ĐANG CHẠY. Nên hình ở
   đây không phải ảnh tải về mà là chính đường giá thật của mã đang nắm giữ:
   không bản quyền, không nặng, và nó tự chứng minh app đang sống.

   Ba ràng buộc bắt buộc:
   1. Chữ TUYỆT ĐỐI không đặt trực tiếp lên hình (sàn chất lượng mục 9) — nếu
      không, tương phản phụ thuộc vào hình dạng đường giá hôm đó, không tính
      trước được. Mọi chữ ở đây nằm trong thẻ nền đặc.
   2. Không lấy được dữ liệu thì hiện lưới trống, KHÔNG vẽ đường giả.
   3. Chuyển động chỉ chạy một lần khi hiện ra, không lặp vô tận.
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  /** Mã muốn vẽ. Mặc định lấy mã của Deal đang mở. */
  symbol?: string;
  className?: string;
}

const W = 800;
const H = 420;

export const NenBieuDoThat: React.FC<Props> = ({ symbol = DEAL_CONFIG.symbol, className = '' }) => {
  const [nen, setNen] = useState<Candle[]>([]);
  const [xong, setXong] = useState(false);

  useEffect(() => {
    let huy = false;
    fetchCandles(symbol, 'D').then((duLieu) => {
      if (huy) return;
      setNen(duLieu.slice(-120));
      setXong(true);
    });
    return () => {
      huy = true;
    };
  }, [symbol]);

  const hinh = (() => {
    if (nen.length < 2) return null;

    const gia = nen.map((c) => c.close);
    const cao = Math.max(...gia);
    const thap = Math.min(...gia);
    const bien = cao - thap || cao * 0.02 || 1;

    const x = (i: number) => (i / (nen.length - 1)) * W;
    const y = (g: number) => H - ((g - thap) / bien) * (H * 0.7) - H * 0.15;

    const diem = nen.map((c, i) => `${x(i).toFixed(1)},${y(c.close).toFixed(1)}`);

    return {
      duong: `M${diem.join(' L')}`,
      vung: `M0,${H} L${diem.join(' L')} L${W},${H} Z`,
      cuoiX: x(nen.length - 1),
      cuoiY: y(gia[gia.length - 1]!),
      dau: gia[0]!,
      chot: gia[gia.length - 1]!
    };
  })();

  const tang = hinh ? hinh.chot >= hinh.dau : true;
  const mau = tang ? 'var(--tot)' : 'var(--loi)';
  const bienDong = hinh ? ((hinh.chot - hinh.dau) / hinh.dau) * 100 : 0;

  return (
    <div className={`relative overflow-hidden bg-the2 ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* Lưới giá — luôn có, kể cả khi chưa tải được dữ liệu */}
        {[0.2, 0.4, 0.6, 0.8].map((t) => (
          <line key={t} x1={0} y1={H * t} x2={W} y2={H * t} stroke="var(--vien)" strokeWidth={1} />
        ))}

        {hinh && (
          <>
            <defs>
              <linearGradient id="do-day-duong-gia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={mau} stopOpacity="0.20" />
                <stop offset="100%" stopColor={mau} stopOpacity="0" />
              </linearGradient>
            </defs>

            <path d={hinh.vung} fill="url(#do-day-duong-gia)" className="animate-in" />
            <path
              d={hinh.duong}
              fill="none"
              stroke={mau}
              strokeWidth={2}
              strokeLinejoin="round"
              className="animate-in"
            />

            {/* Chấm ở phiên gần nhất — cho mắt biết đâu là "bây giờ" */}
            <circle cx={hinh.cuoiX} cy={hinh.cuoiY} r={10} fill={mau} opacity={0.2} />
            <circle cx={hinh.cuoiX} cy={hinh.cuoiY} r={5} fill={mau} />
          </>
        )}
      </svg>

      {/* Nhãn dữ liệu — nằm trong thẻ NỀN ĐẶC, không đặt chữ thẳng lên hình */}
      <div className="relative flex h-full flex-col justify-end p-5 sm:p-7">
        <div className="the inline-flex w-fit max-w-full flex-col gap-1 p-3">
          <span className="text-xs text-chu-mo">Diễn biến 120 phiên gần nhất</span>

          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-tieu-de text-xl font-bold text-chu">{symbol}</span>

            {xong && hinh ? (
              <>
                <span className="so text-lg text-chu">{hinh.chot.toLocaleString('vi-VN')}</span>
                <span className={`so text-sm ${tang ? 'text-tot' : 'text-loi'}`}>
                  {/* Kèm dấu ▲▼: màu không bao giờ được là dấu hiệu duy nhất */}
                  {tang ? '▲' : '▼'} {Math.abs(bienDong).toFixed(2)}%
                </span>
              </>
            ) : (
              <span className="khung-xuong inline-block h-5 w-28" aria-label="Đang tải dữ liệu" />
            )}
          </div>

          {xong && !hinh && (
            <span className="text-xs text-chu-mo">
              Chưa lấy được dữ liệu — app không vẽ đường giả để lấp chỗ trống.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
