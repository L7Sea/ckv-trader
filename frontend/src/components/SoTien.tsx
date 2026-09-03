import React, { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   SỐ TIỀN BIẾT MÌNH VỪA ĐỔI
   ───────────────────────────────────────────────────────────────────────────
   Skill `giao-dien-ui-design` xếp "số thay đổi" là chuyển động đáng làm thứ hai:
   "đếm lên/xuống, không nhảy phắt — mắt bắt được là nó vừa đổi".

   Với app này thì đó là chuyển động ĐÁNG GIÁ NHẤT. Sau mỗi lần đồng bộ, NAV và
   lãi/lỗ đổi số. Nhảy phắt thì người dùng không biết nó vừa đổi hay vẫn thế —
   mà đây đúng là câu hỏi duy nhất họ mở app để trả lời.

   Ba ràng buộc:
   - 240ms, dưới trần 250ms của skill cho app dùng hằng ngày.
   - Tôn trọng `prefers-reduced-motion`: nhảy thẳng tới số mới, không đếm.
   - Lần hiện đầu tiên KHÔNG đếm từ 0 — đếm từ 0 lên 7 triệu mỗi lần mở app là
     màn trình diễn, không phải thông tin.
   ═══════════════════════════════════════════════════════════════════════════ */

const THOI_GIAN = 240;

interface Props {
  giaTri: number;
  /** Cách hiển thị. Mặc định là số có phân cách hàng nghìn kiểu Việt Nam. */
  dinhDang?: (n: number) => string;
  className?: string;
  /** Che số (chế độ ẩn số dư) — khi che thì không đếm. */
  che?: boolean;
  chuoiChe?: string;
}

const macDinh = (n: number) => Math.round(n).toLocaleString('vi-VN');

export const SoTien: React.FC<Props> = ({
  giaTri,
  dinhDang = macDinh,
  className = '',
  che = false,
  chuoiChe = '•••••••• đ'
}) => {
  const [hienThi, setHienThi] = useState(giaTri);
  const truocRef = useRef(giaTri);
  const khungRef = useRef<number | null>(null);

  useEffect(() => {
    const tu = truocRef.current;
    truocRef.current = giaTri;

    if (tu === giaTri) return;

    const itChuyenDong =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (itChuyenDong || che) {
      setHienThi(giaTri);
      return;
    }

    const batDau = performance.now();
    const chay = (bayGio: number) => {
      const t = Math.min(1, (bayGio - batDau) / THOI_GIAN);
      // Chậm dần ở cuối: mắt bám được con số đích thay vì bị hẫng
      const muot = 1 - Math.pow(1 - t, 3);
      setHienThi(tu + (giaTri - tu) * muot);
      if (t < 1) khungRef.current = requestAnimationFrame(chay);
    };
    khungRef.current = requestAnimationFrame(chay);

    return () => {
      if (khungRef.current !== null) cancelAnimationFrame(khungRef.current);
    };
  }, [giaTri, che]);

  if (che) return <span className={`so ${className}`}>{chuoiChe}</span>;

  return (
    <span className={`so ${className}`} aria-live="polite">
      {dinhDang(hienThi)}
    </span>
  );
};
