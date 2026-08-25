/* ═══════════════════════════════════════════════════════════════
   VẬT LÝ CỦA BÉ CAPY — tách riêng để TEST ĐƯỢC.

   Vì sao tách: phần này chạy trong requestAnimationFrame, mà rAF chỉ
   chạy khi trang đang được vẽ ra màn hình. Nằm trong component thì
   không có cách nào kiểm bằng máy — chỉ còn cách mở app ngồi nhìn,
   và mắt không thấy được "sau 400 khung hình bé có lọt ra ngoài màn
   hình không".

   Hàm thuần, không đụng DOM, không đụng React → chạy thẳng bằng Node.
   ═══════════════════════════════════════════════════════════════ */

export const MA_SAT = 0.972;     // hãm từ từ để đập tường 3-4 lần
export const NAY_LAI = 0.82;     // hệ số nảy mạnh khi đập mép màn hình
export const TOC_BOI = 0.55;     // tốc độ bơi lững thững (px/khung)
export const NGUONG_BAY = 0.35;  // dưới mức này coi như đã dừng, chuyển sang bơi

export interface TrangThaiVatLy {
  x: number; y: number;
  vx: number; vy: number;
  xoay: number; vXoay: number;
  dichX: number; dichY: number;
}

export function taoTrangThai(x = 0, y = 0): TrangThaiVatLy {
  return { x, y, vx: 0, vy: 0, xoay: 0, vXoay: 0, dichX: x, dichY: y };
}

/** Bé còn đang bay do lực ném hay đã dừng hẳn? */
export function dangBay(s: TrangThaiVatLy): boolean {
  return Math.abs(s.vx) > NGUONG_BAY || Math.abs(s.vy) > NGUONG_BAY;
}

/**
 * Tiến 1 khung hình. SỬA TRỰC TIẾP `s` (không tạo object mới) vì hàm này
 * chạy 60 lần/giây — cấp phát object mỗi khung là rác cho bộ dọn bộ nhớ.
 *
 * `chonDich` được gọi khi bé bơi tới nơi và cần điểm đến mới. Truyền vào
 * thay vì gọi Math.random() bên trong, để test cắm được số cố định.
 */
export function buocVatLy(
  s: TrangThaiVatLy,
  maxX: number,
  maxY: number,
  khung: number,
  chonDich: () => { x: number; y: number },
): void {
  if (dangBay(s)) {
    /* ── Bay sau cú ném ── */
    s.x += s.vx; s.y += s.vy;
    s.vx *= MA_SAT; s.vy *= MA_SAT;
    s.xoay += s.vXoay;
    s.vXoay *= 0.97;

    /* Đập mép thì nảy lại. PHẢI kẹp toạ độ về trong khung TRƯỚC khi đảo
       vận tốc, nếu không bé lún ra ngoài rồi mỗi khung lại nảy một lần,
       kẹt luôn ngoài màn hình. */
    if (s.x < 0)    { s.x = 0;    s.vx = -s.vx * NAY_LAI; s.vXoay = -s.vXoay; }
    if (s.x > maxX) { s.x = maxX; s.vx = -s.vx * NAY_LAI; s.vXoay = -s.vXoay; }
    if (s.y < 0)    { s.y = 0;    s.vy = -s.vy * NAY_LAI; }
    if (s.y > maxY) { s.y = maxY; s.vy = -s.vy * NAY_LAI; }
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
