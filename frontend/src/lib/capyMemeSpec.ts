import { BIEU_CAM, type Mat, type Mieng, type Phu, type Nhom } from './capyBieuCam';
import { TU_THE, type TuThe } from './capyTuThe';
import { PHU_KIEN, type TenPhuKien } from './capyPhuKien';

/* ═══════════════════════════════════════════════════════════════
   CÔNG THỨC MEME — định dạng để MÔ TẢ một dáng Capy bằng chữ.

   Vì sao có file này: khả năng vẽ tay của tôi là nút thắt. Thay vì bắt
   tôi ngồi vẽ từng meme, app nhận CÔNG THỨC dạng JSON — anh thấy meme
   nào hay, đưa ảnh cho AI bất kỳ phân tích ra công thức, dán vào app,
   app dựng ra hình. Tôi ra khỏi vòng lặp.

   Công thức chỉ dùng những mảnh ĐÃ CÓ trong app (tư thế, mắt, miệng,
   phụ kiện) nên không tải gì từ mạng, không đụng bản quyền hình ai.
   Muốn thêm chi tiết lạ thì dùng `lopThem` — nhưng phải qua bộ lọc an
   toàn ở dưới.

   AN TOÀN: `lopThem` là SVG do người ngoài dán vào. Nếu nhét thẳng vào
   trang thì đó là lỗ hổng XSS — dán một thẻ <script> hay thuộc tính
   onclick là chạy được mã trong phiên đăng nhập của anh. Nên có
   `locSvg()` chỉ cho qua danh sách thẻ/thuộc tính vẽ hình thuần tuý.
   ═══════════════════════════════════════════════════════════════ */

export interface LopThem {
  /** 'dau' = dời theo đầu · 'canh' = toạ độ tuyệt đối trên khung 200×250 */
  neo: 'dau' | 'canh';
  /** 'sau' = dưới thân · 'truoc' = trên cùng */
  z?: 'sau' | 'truoc';
  svg: string;
}

export interface CongThucMeme {
  /** Tên hiển thị — không tính vào việc so trùng */
  ten: string;
  tuThe?: TuThe;
  mat: Mat;
  mieng: Mieng;
  /** Phụ trợ trên mặt: má hồng, giọt mồ hôi, tia giận... */
  phu?: Phu[];
  /** Món trong tủ đồ */
  phuKien?: TenPhuKien[];
  /** Chi tiết vẽ thêm (đã lọc an toàn) */
  lopThem?: LopThem[];
  /** Câu bé nói khi hiện dáng này */
  thoai?: string;
  /** Nhóm cảm xúc — để bé tự chọn dáng cho khớp tâm trạng */
  nhom?: Nhom;
}

/* ── Danh sách hợp lệ, lấy THẲNG từ các tủ đã có ── */
const MAT_HOP_LE = new Set(BIEU_CAM.map((b) => b.mat));
const MIENG_HOP_LE = new Set(BIEU_CAM.map((b) => b.mieng));
const PHU_HOP_LE = new Set(BIEU_CAM.flatMap((b) => b.phu ?? []));
const NHOM_HOP_LE = new Set(BIEU_CAM.map((b) => b.nhom));

/* ═══ LỌC SVG — danh sách TRẮNG, mặc định từ chối ═══ */
const THE_CHO_PHEP = new Set([
  'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'text',
]);
const THUOC_TINH_CHO_PHEP = new Set([
  'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
  'width', 'height', 'points', 'transform', 'opacity', 'fill', 'stroke',
  'fill-opacity', 'stroke-opacity', 'stroke-width', 'stroke-linecap',
  'stroke-linejoin', 'stroke-dasharray', 'fill-rule', 'font-size',
  'font-weight', 'font-family', 'text-anchor', 'letter-spacing',
]);

export interface KetQuaLoc {
  sach: string;
  boDi: string[];
}

/**
 * Lọc SVG do người ngoài dán vào: chỉ giữ thẻ vẽ hình thuần tuý.
 * Bỏ hết <script>, <foreignObject>, <image>, mọi thuộc tính on*, href,
 * style, và mọi giá trị có `javascript:` hay `url(`.
 */
export function locSvg(raw: string): KetQuaLoc {
  const boDi: string[] = [];
  let s = String(raw ?? '');

  /* Bỏ trọn nội dung các thẻ nguy hiểm, không chỉ bỏ thẻ mở */
  s = s.replace(/<\s*(script|style|foreignObject|iframe|use|image)\b[\s\S]*?<\/\s*\1\s*>/gi, (m) => {
    boDi.push(m.slice(0, 40) + '…'); return '';
  });
  s = s.replace(/<\s*(script|style|foreignObject|iframe|use|image)\b[^>]*\/?>/gi, (m) => {
    boDi.push(m.slice(0, 40) + '…'); return '';
  });

  /* Duyệt từng thẻ còn lại */
  s = s.replace(/<\s*\/?\s*([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)\/?>/g, (toanBo, ten: string, phan: string) => {
    const the = ten.toLowerCase();
    if (!THE_CHO_PHEP.has(the)) { boDi.push(`<${the}>`); return ''; }
    if (toanBo.startsWith('</')) return `</${the}>`;

    /* Lọc thuộc tính */
    const giu: string[] = [];
    for (const m of phan.matchAll(/([a-zA-Z][\w:-]*)\s*=\s*("[^"]*"|'[^']*')/g)) {
      const tt = m[1]!.toLowerCase();
      const gt = m[2]!.slice(1, -1);
      if (!THUOC_TINH_CHO_PHEP.has(tt)) { boDi.push(`${the}[${tt}]`); continue; }
      if (/javascript:|data:|url\s*\(|<|expression\s*\(/i.test(gt)) { boDi.push(`${the}[${tt}]=…`); continue; }
      giu.push(`${tt}="${gt.replace(/"/g, '&quot;')}"`);
    }
    const tuDong = toanBo.trimEnd().endsWith('/>');
    return `<${the}${giu.length ? ' ' + giu.join(' ') : ''}${tuDong ? '/' : ''}>`;
  });

  return { sach: s.trim(), boDi: [...new Set(boDi)] };
}

/* ═══ KIỂM TRA CÔNG THỨC ═══ */
export interface KetQuaKiem {
  ok: boolean;
  loi: string[];
  canhBao: string[];
  /** Công thức đã làm sạch, dùng được ngay */
  spec?: CongThucMeme;
}

/* ═══ SO TRÙNG ═══
   Hai công thức khác TÊN nhưng cùng mọi thành phần thì vẽ ra hình y hệt.
   Chuẩn hoá rồi băm: bỏ tên/thoại (không ảnh hưởng hình), sắp xếp các
   mảng (thứ tự phụ kiện không đổi hình), rồi ghép thành chuỗi. */
/** Trả về công thức đã có nếu trùng, ngược lại null */
