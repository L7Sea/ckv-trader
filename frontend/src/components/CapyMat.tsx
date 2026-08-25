import { useId } from 'react';
import type { BieuCam, Mat, Mieng, Phu } from '@/lib/capyBieuCam';
import { TU_THE, type TuThe } from '@/lib/capyTuThe';
import { PHU_KIEN, type TenPhuKien } from '@/lib/capyPhuKien';
import type { LopThem } from '@/lib/capyMemeSpec';

/* ═══════════════════════════════════════════════════════════════
   BÉ CAPY CHUẨN GỐC — DỰA 100% THEO ẢNH GỐC CỦA ANH HẢI (L7Sea).
   
   ĐẶC TRƯNG NHẬN DIỆN KHÔNG THỂ NHẦM LẪN:
     1. ĐẦU hình ổ bánh mì dẹt ngang, má phính bầu bĩnh.
     2. MŨI VÀ MIỆNG: Chữ T (mũi thanh ngang + thân dọc) kết hợp
        với chữ Y NGƯỢC (hai nhánh rẽ xuống) nằm gọn trong MÕM NÂU SẪM.
     3. MẮT: Hai gạch ngang nhỏ bo tròn, lim dim thần thái siêu chill.
     4. MÁ HỒNG: 3 gạch chéo /// màu hồng xinh xắn hai bên má.
     5. RÂU: 3 gạch ngắn phác thảo bên má trái.
     6. PHỤ KIỆN GỐC: Quả quýt nhỏ đội đầu có cuống lá xanh.
     7. ÁO: Áo polo xanh dương tươi sáng, cổ viền trắng + 2 cúc áo.
     8. NÉT VẼ: Nét viền đen dày dặn đậm chất truyện tranh/sticker.
   ═══════════════════════════════════════════════════════════════ */

const LONG_GOC = '#C4A47C';       // Màu lông nâu tan gốc chuẩn
const LONG_TOI = '#8F6E4E';       // Tai và chi tiết sẫm
const VUNG_MOM = '#9E744A';       // Vùng mõm nâu sẫm hình bầu dục đứng
const NET = '#231F20';            // Nét vẽ đen than dày dặn
const HONG_MA = '#F48FB1';        // Hồng má 3 gạch
const AO_XANH = '#0288D1';        // Xanh dương tươi áo polo
const AO_VIEN = '#29B6F6';        // Màu mặt cổ áo
const CAM_QUA = '#FF8A00';        // Quả quýt đội đầu
const LA_XANH = '#4CAF50';        // Lá cây trên quả quýt

const DAY_NET = 6.5;

/* Toạ độ mốc chuẩn */
const MAT_Y = 96, MAT_TRAI = 72, MAT_PHAI = 128;
const MOM_X = 80, MOM_Y = 98, MOM_W = 40, MOM_H = 64;
const MUI_Y = 105;

/* ═══ ĐẦU — Hình ổ bánh mì dẹt ngang, má phính ═══ */
const DAU_GOC =
  'M 70 38 C 120 36, 150 40, 172 65 C 188 88, 185 125, 175 146 C 160 168, 138 174, 100 174 ' +
  'C 62 174, 40 168, 25 146 C 15 125, 12 88, 28 65 C 50 40, 80 36, 100 38 Z';

/* Tai đặt tự nhiên ở hai góc trên */
const TAI_TRAI = 'M 40 58 C 30 40, 44 30, 58 40 C 64 46, 64 54, 60 60 Z';
const TAI_PHAI = 'M 160 58 C 170 40, 156 30, 142 40 C 136 46, 136 54, 140 60 Z';

/* ── MẮT ── */
function VeMat({ kieu, x }: { kieu: Mat; x: number }) {
  const y = MAT_Y;
  switch (kieu) {
    case 'thuong':
      return <rect x={x - 8} y={y - 3.5} width="16" height="7" rx="3.5" fill={NET} />;
    case 'nhamCuoi':
      return <path d={`M${x - 9} ${y + 3} Q${x} ${y - 7} ${x + 9} ${y + 3}`} stroke={NET} strokeWidth="6" fill="none" strokeLinecap="round" />;
    case 'nhamChat':
      return <line x1={x - 9} y1={y} x2={x + 9} y2={y} stroke={NET} strokeWidth="6" strokeLinecap="round" />;
    case 'lim':
      return <path d={`M${x - 9} ${y - 1} Q${x} ${y + 5} ${x + 9} ${y - 1}`} stroke={NET} strokeWidth="6" fill="none" strokeLinecap="round" />;
    case 'trongTron':
      return <circle cx={x} cy={y} r="8.5" fill={NET} />;
    case 'kinhNgac':
      return <>
        <circle cx={x} cy={y} r="10.5" fill={NET} />
        <circle cx={x + 3} cy={y - 3.5} r="2.8" fill="#fff" />
      </>;
    case 'tim':
      return <path d={`M${x} ${y + 7} C${x - 11} ${y - 3} ${x - 6} ${y - 11} ${x} ${y - 4} C${x + 6} ${y - 11} ${x + 11} ${y - 3} ${x} ${y + 7} Z`} fill="#e0455f" />;
    case 'chuX':
      return <>
        <line x1={x - 7} y1={y - 7} x2={x + 7} y2={y + 7} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <line x1={x + 7} y1={y - 7} x2={x - 7} y2={y + 7} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
      </>;
    default:
      return <rect x={x - 8} y={y - 3.5} width="16" height="7" rx="3.5" fill={NET} />;
  }
}

/* ── MŨI + MIỆNG GỐC: CHỮ T + CHỮ Y NGƯỢC ── */
function VeMieng({ kieu }: { kieu: Mieng }) {
  const gx = 100;
  const chanY = 144;

  // Cấu trúc miệng gốc: Chữ T kết hợp chữ Y ngược
  const miengGocTYNguoc = (
    <g>
      {/* Thân dọc chữ T */}
      <line x1={gx} y1={MUI_Y + 7} x2={gx} y2={chanY} stroke={NET} strokeWidth="6" strokeLinecap="round" />
      {/* Nhánh chữ Y ngược rẽ sang 2 bên */}
      <path d={`M ${gx} ${chanY} L ${gx - 9} ${chanY + 11} M ${gx} ${chanY} L ${gx + 9} ${chanY + 11}`} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
    </g>
  );

  switch (kieu) {
    case 'thang':
      return miengGocTYNguoc;
    case 'cuoiNhe':
      return (
        <g>
          <line x1={gx} y1={MUI_Y + 7} x2={gx} y2={chanY - 4} stroke={NET} strokeWidth="6" strokeLinecap="round" />
          <path d={`M ${gx - 11} ${chanY - 4} Q ${gx} ${chanY + 8} ${gx + 11} ${chanY - 4}`} stroke={NET} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'cuoiToe':
      return (
        <g>
          <line x1={gx} y1={MUI_Y + 7} x2={gx} y2={chanY - 6} stroke={NET} strokeWidth="6" strokeLinecap="round" />
          <path d={`M ${gx - 13} ${chanY - 6} Q ${gx} ${chanY + 16} ${gx + 13} ${chanY - 6} Z`} fill={NET} />
        </g>
      );
    case 'meoXuong':
      return (
        <g>
          <line x1={gx} y1={MUI_Y + 7} x2={gx} y2={chanY - 2} stroke={NET} strokeWidth="6" strokeLinecap="round" />
          <path d={`M ${gx - 11} ${chanY + 6} Q ${gx} ${chanY - 6} ${gx + 11} ${chanY + 6}`} stroke={NET} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'chuO':
      return (
        <g>
          <line x1={gx} y1={MUI_Y + 7} x2={gx} y2={chanY - 4} stroke={NET} strokeWidth="6" strokeLinecap="round" />
          <ellipse cx={gx} cy={chanY + 5} rx="6.5" ry="8" fill={NET} />
        </g>
      );
    case 'theLuoi':
      return (
        <g>
          {miengGocTYNguoc}
          <ellipse cx={gx + 6} cy={chanY + 8} rx="6" ry="7" fill="#E0768A" stroke={NET} strokeWidth="3" />
        </g>
      );
    default:
      return miengGocTYNguoc;
  }
}

/* ── MÁ HỒNG 3 GẠCH /// CHUẨN THEO ẢNH GỐC ── */
function VeMaHong() {
  return (
    <g stroke={HONG_MA} strokeWidth="3.2" strokeLinecap="round">
      {/* Má trái: 3 gạch chéo */}
      <line x1="46" y1="122" x2="43" y2="133" />
      <line x1="52" y1="122" x2="49" y2="133" />
      <line x1="58" y1="122" x2="55" y2="133" />

      {/* Má phải: 3 gạch chéo */}
      <line x1="142" y1="122" x2="139" y2="133" />
      <line x1="148" y1="122" x2="145" y2="133" />
      <line x1="154" y1="122" x2="151" y2="133" />
    </g>
  );
}

/* ── QUẢ QUÝT ĐỘI ĐẦU CHUẨN GỐC ── */
function VeQuaCam() {
  return (
    <g id="cp-quacam-goc">
      {/* Thân quả cam */}
      <circle cx="100" cy="27" r="14" fill={CAM_QUA} stroke={NET} strokeWidth="4.5" />
      <ellipse cx="96" cy="23" rx="4" ry="2.2" fill="#FFA726" transform="rotate(-30 96 23)" />
      {/* Cuống và lá xanh */}
      <path d="M 100 13 Q 102 7 106 6" stroke="#5D4037" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 102 9 Q 112 7 111 15 Q 104 14 102 9 Z" fill={LA_XANH} stroke={NET} strokeWidth="2.2" />
    </g>
  );
}

/* ── RÂU MÁ TRÁI CHUẨN ẢNH GỐC ── */
function VeRauGoc() {
  return (
    <g stroke={NET} strokeWidth="4.2" strokeLinecap="round" fill="none">
      <path d="M 23 118 l 12 -2" />
      <path d="M 21 129 l 13 -1" />
      <path d="M 24 140 l 11 0" />
    </g>
  );
}

/* ── HIỆU ỨNG PHỤ TRỢ ── */
function VePhuTro({ kieu }: { kieu: Phu }) {
  switch (kieu) {
    case 'giotMoHoi':
      return <path className="cp-nhun" d="M172 52 q9 14 0 19 a9.5 9.5 0 0 1 -9 -14 z" fill="#6ec5f0" stroke={NET} strokeWidth="3" />;
    case 'tiaGian':
      return <g className="cp-giat" stroke="#e0455f" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M158 40 l12 -9 M158 40 l14 3.5 M158 40 l5.5 14" />
      </g>;
    case 'timBay':
      return <g className="cp-bay">
        <path d="M170 46 C160 32 174 22 178 34 C182 22 196 32 186 46 L178 56 Z" fill="#e0455f" />
        <path d="M26 40 C21 32 28 27 30 33 C32 27 39 32 34 40 L30 46 Z" fill="#e0455f" opacity=".7" />
      </g>;
    case 'saoLapLanh':
      return <g className="cp-nhay" fill="#f5c542">
        <path d="M174 36 l4.4 9 9 4.4 -9 4.4 -4.4 9 -4.4 -9 -9 -4.4 9 -4.4 z" />
      </g>;
    case 'zzz':
      return <g className="cp-bay" fill={NET} fontFamily="sans-serif" fontWeight="800">
        <text x="164" y="48" fontSize="26">z</text>
        <text x="182" y="30" fontSize="18" opacity=".7">z</text>
      </g>;
    case 'chamHoi':
      return <text className="cp-nhun" x="164" y="50" fontSize="42" fontWeight="800" fill="#f5a742" fontFamily="sans-serif">?</text>;
    case 'chamThan':
      return <text className="cp-giat" x="168" y="50" fontSize="42" fontWeight="800" fill="#e0455f" fontFamily="sans-serif">!</text>;
    default: return null;
  }
}

interface Props {
  bc: BieuCam;
  size: number;
  tuThe?: TuThe;
  phuKien?: TenPhuKien[];
  lopThem?: LopThem[];
}

export default function CapyMat({ bc, size, tuThe = 'dung', phuKien = [], lopThem = [] }: Props) {
  const tt = TU_THE[tuThe] ?? TU_THE.dung;
  const [dx, dy] = tt.dauDich;

  const netChinh = { stroke: NET, strokeWidth: DAY_NET, strokeLinejoin: 'round' as const };

  return (
    <svg viewBox="0 0 200 250" width={size} height={size * 1.25} aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}>

      {/* ══ 1. TAY / CÁNH TAY RA PHÍA SAU (NẰM DƯỚI THÂN) ══ */}
      <g stroke={NET} strokeWidth={DAY_NET} strokeLinejoin="round" fill={LONG_TOI}>
        {/* Cánh tay thu về sau lưng đúng thần thái ảnh mẫu */}
        <path d="M 36 178 Q 25 200 36 220" strokeLinecap="round" />
        <path d="M 164 178 Q 175 200 164 220" strokeLinecap="round" />
      </g>

      {/* ══ 2. THÂN & ÁO POLO XANH DƯƠNG CHUẨN GỐC ══ */}
      <g>
        {/* Thân áo polo */}
        <path d="M 38 160 L 36 244 Q 100 252 164 244 L 162 160 Z" fill={AO_XANH} {...netChinh} />

        {/* Cổ áo polo trắng & viền xanh */}
        <path d="M 100 174 Q 65 168 46 186 Q 72 202 94 184 Z" fill={AO_VIEN} stroke="#FFFFFF" strokeWidth="4.5" />
        <path d="M 100 174 Q 65 168 46 186 Q 72 202 94 184 Z" fill="none" stroke={NET} strokeWidth="4" />

        <path d="M 100 174 Q 135 168 154 186 Q 128 202 106 184 Z" fill={AO_VIEN} stroke="#FFFFFF" strokeWidth="4.5" />
        <path d="M 100 174 Q 135 168 154 186 Q 128 202 106 184 Z" fill="none" stroke={NET} strokeWidth="4" />

        {/* Nẹp áo và 2 cúc trắng */}
        <rect x="94" y="182" width="12" height="28" rx="3.5" fill="#01579B" stroke={NET} strokeWidth="2.8" />
        <circle cx="100" cy="190" r="2.4" fill="#FFFFFF" />
        <circle cx="100" cy="202" r="2.4" fill="#FFFFFF" />
      </g>

      {/* ══ 3. ĐẦU & MẶT (CHỒNG LÊN THÂN ĐỂ KHÔNG BỊ NGẤN CỔ) ══ */}
      <g transform={`translate(${dx} ${dy})`}>
        {/* Tai trái & phải */}
        <path d={TAI_TRAI} fill={LONG_TOI} {...netChinh} />
        <path d={TAI_PHAI} fill={LONG_TOI} {...netChinh} />
        {/* Lớp lòng tai đậm hơn */}
        <path d="M 44 54 C 38 45 46 38 52 45 Z" fill="#6D4C41" />
        <path d="M 156 54 C 162 45 154 38 148 45 Z" fill="#6D4C41" />

        {/* Quả quýt đội đầu chuẩn gốc */}
        <VeQuaCam />

        {/* Đầu bánh mì dẹt ngang má phính */}
        <path d={DAU_GOC} fill={LONG_GOC} {...netChinh} />

        {/* Râu má trái */}
        <VeRauGoc />

        {/* Vùng mõm nâu sẫm hình bầu dục đứng */}
        <rect x={MOM_X} y={MOM_Y} width={MOM_W} height={MOM_H} rx="18" fill={VUNG_MOM} />

        {/* Mắt trái & Mắt phải */}
        <VeMat kieu={bc.mat} x={MAT_TRAI} />
        <VeMat kieu={bc.mat} x={MAT_PHAI} />

        {/* Mũi ngang hình chữ T */}
        <rect x={MOM_X + 4} y={MUI_Y} width={MOM_W - 8} height="13" rx="6.5" fill={NET} />

        {/* Miệng chữ T + Y ngược */}
        <VeMieng kieu={bc.mieng} />

        {/* Má hồng 3 gạch /// */}
        <VeMaHong />

        {/* Hiệu ứng cảm xúc phụ trợ nếu có */}
        {(bc.phu ?? []).map((p) => <VePhuTro key={p} kieu={p} />)}
      </g>
    </svg>
  );
}
