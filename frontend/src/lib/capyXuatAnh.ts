/* ═══════════════════════════════════════════════════════════════
   XUẤT BÉ CAPY RA ẢNH PNG — nền TRONG SUỐT, 1080 hoặc 2K.

   Bé vẽ bằng SVG nên KHÔNG có độ phân giải cố định: phóng lên bao nhiêu
   cũng nét. Hàm này vẽ SVG lên canvas ở cỡ anh chọn rồi xuất PNG.

   Vì sao làm được mà không cần thư viện: SVG của bé KHÔNG tham chiếu
   file ngoài nào (không <image>, không font tải về, không CSS ngoài) —
   toàn bộ nét nằm trong chính chuỗi SVG. Nhờ vậy nạp được bằng data URI
   và canvas không bị "nhiễm bẩn" (tainted), nên toBlob() chạy bình thường.

   Nếu sau này có ai nhét <image href="http://..."> vào công thức meme,
   canvas sẽ bị nhiễm bẩn và toBlob() ném lỗi bảo mật — nhưng locSvg()
   đã chặn thẻ <image> từ đầu, nên chuyện đó không xảy ra.
   ═══════════════════════════════════════════════════════════════ */

export type CoAnh = 1080 | 2048;

export interface TuyChonXuat {
  /** Chiều rộng ảnh ra. Chiều cao tự tính theo tỉ lệ khung 200×250 */
  co?: CoAnh;
  /** Câu thoại in dưới chân ảnh. Bỏ trống thì không in. */
  thoai?: string;
  /** Nền: mặc định TRONG SUỐT. Truyền mã màu nếu muốn nền đặc. */
  nen?: string;
}

const TI_LE = 250 / 200;          // khung SVG cao gấp 1.25 lần rộng

/**
 * Đổi một phần tử <svg> đang có trên trang thành PNG.
 * Trả về Blob để gọi tiếp `taiVe()` hoặc làm gì tuỳ ý.
 */
export async function svgSangPng(svg: SVGSVGElement, opt: TuyChonXuat = {}): Promise<Blob> {
  const co = opt.co ?? 2048;
  const cao = Math.round(co * TI_LE);
  /* Chừa chỗ in thoại nếu có */
  const caoThoai = opt.thoai ? Math.round(co * 0.13) : 0;

  /* Nhân bản để không đụng vào bé đang chạy trên màn hình */
  const ban = svg.cloneNode(true) as SVGSVGElement;
  ban.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  ban.setAttribute('width', String(co));
  ban.setAttribute('height', String(cao));
  /* overflow:visible cho phép nét tràn mép — khi xuất ảnh phải nới khung
     ra một chút, nếu không viền ngoài cùng bị cắt cụt. */
  ban.setAttribute('viewBox', '-10 -10 220 270');
  ban.removeAttribute('style');

  /* Font hệ thống: canvas không nạp được webfont từ CSS ngoài, nên ép
     về font có sẵn để chữ "T" trên áo không biến thành ô vuông. */
  ban.querySelectorAll('text').forEach((t) => {
    t.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
  });

  const chuoi = new XMLSerializer().serializeToString(ban);
  const uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(chuoi);

  const img = new Image();
  await new Promise<void>((xong, hong) => {
    img.onload = () => xong();
    img.onerror = () => hong(new Error('Không nạp được hình bé để xuất ảnh'));
    img.src = uri;
  });

  const canvas = document.createElement('canvas');
  canvas.width = co;
  canvas.height = cao + caoThoai;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ canvas');

  if (opt.nen) { ctx.fillStyle = opt.nen; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  ctx.drawImage(img, 0, 0, co, cao);

  if (opt.thoai) {
    const cx = co / 2;
    const cyChu = cao + caoThoai * 0.62;
    const cuChu = Math.round(co * 0.055);
    ctx.font = `700 ${cuChu}px Arial, Helvetica, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    /* Viền trắng quanh chữ để đọc được trên mọi nền — ảnh nền trong suốt
       có thể được dán lên nền tối hay sáng, không biết trước. */
    ctx.lineWidth = Math.max(4, cuChu * 0.22);
    ctx.strokeStyle = '#ffffff';
    ctx.lineJoin = 'round';
    ctx.strokeText(opt.thoai, cx, cyChu);
    ctx.fillStyle = '#1c1c1c';
    ctx.fillText(opt.thoai, cx, cyChu);
  }

  return new Promise<Blob>((xong, hong) => {
    canvas.toBlob((b) => (b ? xong(b) : hong(new Error('Không tạo được file PNG'))), 'image/png');
  });
}

/** Bung hộp thoại lưu file */
export function taiVe(blob: Blob, ten: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ten.replace(/[\\/:*?"<>|]/g, '-') + '.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  /* Thu hồi ngay sẽ huỷ cú tải ở vài trình duyệt — chờ một nhịp */
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Tiện dụng: từ phần tử svg → tải thẳng file PNG về máy */
export async function xuatVaTai(svg: SVGSVGElement, ten: string, opt: TuyChonXuat = {}): Promise<void> {
  const blob = await svgSangPng(svg, opt);
  taiVe(blob, `${ten}-${opt.co ?? 2048}px`);
}
