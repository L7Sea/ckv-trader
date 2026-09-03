/* ═══════════════════════════════════════════════════════════════
   VẬT LÝ CỦA BÉ CAPY — tách riêng để TEST ĐƯỢC.

   Vì sao tách: phần này chạy trong requestAnimationFrame, mà rAF chỉ
   chạy khi trang đang được vẽ ra màn hình. Nằm trong component thì
   không có cách nào kiểm bằng máy — chỉ còn cách mở app ngồi nhìn,
   và mắt không thấy được "sau 400 khung hình bé có lọt ra ngoài màn
   hình không".

   Hàm thuần, không đụng DOM, không đụng React → chạy thẳng bằng Node.
   ═══════════════════════════════════════════════════════════════ */

export const MA_SAT = 0.982;     // hãm từ từ cho tốc độ siêu cao
export const NAY_LAI = 0.86;     // nảy mạnh liên tục quanh 4 cạnh
export const TOC_BOI = 0.55;     // tốc độ bơi lững thững (px/khung)
export const NGUONG_BAY = 0.40;  // dưới mức này coi như đã dừng, chuyển sang bơi

export interface TrangThaiVatLy {
  x: number; y: number;
  vx: number; vy: number;
  xoay: number; vXoay: number;
  dichX: number; dichY: number;
}

/** Bé còn đang bay do lực ném hay đã dừng hẳn? */
export function dangBay(s: TrangThaiVatLy): boolean {
  return Math.abs(s.vx) > NGUONG_BAY || Math.abs(s.vy) > NGUONG_BAY;
}

/**
 * Tiến 1 khung hình với sub-stepping khi tốc độ cực đại để không xuyên tường.
 */
export function buocVatLy(
  s: TrangThaiVatLy,
  maxX: number,
  maxY: number,
  khung: number,
  chonDich: () => { x: number; y: number },
): void {
  if (dangBay(s)) {
    /* ── Bay sau cú nã pháo Gunny siêu mạnh (Sub-stepping) ── */
    const speed = Math.hypot(s.vx, s.vy);
    const steps = Math.min(4, Math.max(1, Math.ceil(speed / 30)));
    const dt = 1 / steps;

    for (let i = 0; i < steps; i++) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vx *= Math.pow(MA_SAT, dt);
      s.vy *= Math.pow(MA_SAT, dt);
      s.xoay += s.vXoay * dt;
      s.vXoay *= Math.pow(0.975, dt);

      if (s.x < 0)    { s.x = 0;    s.vx = -s.vx * NAY_LAI; s.vXoay = -s.vXoay; }
      if (s.x > maxX) { s.x = maxX; s.vx = -s.vx * NAY_LAI; s.vXoay = -s.vXoay; }
      if (s.y < 0)    { s.y = 0;    s.vy = -s.vy * NAY_LAI; }
      if (s.y > maxY) { s.y = maxY; s.vy = -s.vy * NAY_LAI; }
    }
    return;
  }

  /* Đã dừng hẳn → dọn vận tốc thừa cho sạch */
  s.vx = 0; s.vy = 0;

  /* ── Bơi lững thững tới điểm đích ──
     Chỉ nhích ở khung CHẴN → nửa tốc độ mà không cần số thập phân bé tí. */
  if (khung % 2 === 0) {
    const dx = s.dichX - s.x, dy = s.dichY - s.y;
    const kc = Math.hypot(dx, dy);
    if (kc < 12) {
      const d = chonDich();
      s.dichX = d.x; s.dichY = d.y;
    } else {
      s.x += (dx / kc) * TOC_BOI;
      s.y += (dy / kc) * TOC_BOI;
    }
  }

  /* Nhấp nhô như đang nổi trên nước */
  s.xoay = Math.sin(khung / 44) * 7;

  /* Lưới an toàn: đổi cỡ cửa sổ có thể đẩy bé ra ngoài khung mới */
  s.x = Math.max(0, Math.min(maxX, s.x));
  s.y = Math.max(0, Math.min(maxY, s.y));
}
