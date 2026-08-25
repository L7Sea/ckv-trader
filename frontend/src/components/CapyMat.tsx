import { useId } from 'react';
import type { BieuCam, Mat, Mieng, Phu } from '@/lib/capyBieuCam';
import { TU_THE, type TuThe } from '@/lib/capyTuThe';
import { PHU_KIEN, type TenPhuKien } from '@/lib/capyPhuKien';
import type { LopThem } from '@/lib/capyMemeSpec';
import type { KieuAo } from '@/lib/capyBoDo';

/* ═══════════════════════════════════════════════════════════════
   BÉ CAPY CHUẨN GỐC — DỰA 100% THEO ẢNH GỐC CỦA ANH HẢI (L7Sea).
   
   ĐẶC TRƯNG NHẬN DIỆN:
     1. ĐẦU hình ổ bánh mì dẹt ngang, má phính bầu bĩnh.
     2. MŨI VÀ MIỆNG: Chữ T kết hợp với chữ Y NGƯỢC (chữ lambda).
     3. MẮT: Hai gạch ngang nhỏ bo tròn, lim dim thần thái siêu chill.
     4. MÁ HỒNG: 3 gạch chéo /// màu hồng xinh xắn hai bên má.
     5. RÂU: 3 gạch ngắn phác thảo bên má trái.
     6. PHỤ KIỆN GỐC: Quả quýt nhỏ đội đầu có cuống lá xanh.
     7. QUY ĐỊNH MẶC ĐỒ THEO BUỔI:
        - 1 Buổi chỉ mặc 1 dạng áo duy nhất (Polo xanh, Áo đỏ tím, Vest, Hoodie, Không mặc đồ).
   ═══════════════════════════════════════════════════════════════ */

const LONG_GOC = '#C4A47C';       // Màu lông nâu tan gốc chuẩn
const LONG_TOI = '#8F6E4E';       // Tai và chi tiết sẫm
const VUNG_MOM = '#9E744A';       // Vùng mõm nâu sẫm hình bầu dục đứng
const NET = '#231F20';            // Nét vẽ đen than dày dặn
const HONG_MA = '#F48FB1';        // Hồng má 3 gạch
const AO_XANH = '#0288D1';        // Xanh dương tươi áo polo
const AO_VIEN = '#29B6F6';        // Màu mặt cổ áo
const AO_DO = '#E11D48';          // Áo đỏ tài lộc
const AO_VEST = '#1E293B';        // Áo vest trader
const AO_HOODIE = '#F59E0B';      // Áo hoodie vàng ấm
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

/* ── MẮT CHUẨN GỐC: CHỈ CÓ CHẤM TRÒN HOẶC 2 GẠCH NHỎ ── */
function VeMat({ kieu, x }: { kieu: Mat; x: number }) {
  const y = MAT_Y;
  // Dạng 2: Gạch nhỏ (khi nhắm mắt, cười, ngủ, chớp mắt)
  if (kieu === 'nhamCuoi' || kieu === 'nhamChat' || kieu === 'lim' || kieu === 'thuong' || kieu === 'buon') {
    return <line x1={x - 7} y1={y} x2={x + 7} y2={y} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />;
  }
  // Dạng 1: Chấm tròn đen đặc trưng (khi mở mắt, nhìn, ngơ ngác, tập trung)
  return <circle cx={x} cy={y} r="6" fill={NET} />;
}

/* ── MŨI + MIỆNG GỐC: CHỮ T + CHỮ Y NGƯỢC ── */
function VeMieng({ kieu }: { kieu: Mieng }) {
  const gx = 100;
  const chanY = 144;

  const miengGocTYNguoc = (
    <g>
      <line x1={gx} y1={MUI_Y + 7} x2={gx} y2={chanY} stroke={NET} strokeWidth="6" strokeLinecap="round" />
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
      <line x1="46" y1="122" x2="43" y2="133" />
      <line x1="52" y1="122" x2="49" y2="133" />
      <line x1="58" y1="122" x2="55" y2="133" />

      <line x1="142" y1="122" x2="139" y2="133" />
      <line x1="148" y1="122" x2="145" y2="133" />
      <line x1="154" y1="122" x2="151" y2="133" />
    </g>
  );
}

/* ── RÂU MÁ TRÁI ── */
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
  kieuAo?: KieuAo;
}

export default function CapyMat({ bc, size, tuThe = 'dung', phuKien = [], lopThem = [], kieuAo = 'poloXanh' }: Props) {
  const tt = TU_THE[tuThe] ?? TU_THE.dung;
  const [dx, dy] = tt.dauDich;

  const netChinh = { stroke: NET, strokeWidth: DAY_NET, strokeLinejoin: 'round' as const };
  const pkDau = phuKien.filter((p) => PHU_KIEN[p]?.neo === 'dau');
  const pkCanh = phuKien.filter((p) => PHU_KIEN[p]?.neo === 'canh');
  const mau = (ds: TenPhuKien[]) => ds.map((p) => PHU_KIEN[p].hinh).join('');

  const coMacAo = tt.coAo && kieuAo !== 'khongMac';

  return (
    <svg viewBox="0 0 200 250" width={size} height={size * 1.25} aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}>

      {/* ══ 1. CẢNH PHÍA SAU (BỒN GỖ/PHAO) ══ */}
      {tt.sau && <path d={tt.sau} fill={tt.mauSau ?? '#78350f'} {...netChinh} />}

      {/* ══ 2. TAY VẼ PHÍA SAU THÂN ══ */}
      {tt.tay && (
        <g stroke={NET} strokeWidth={DAY_NET} strokeLinejoin="round" fill={LONG_TOI}>
          <path d={tt.tay[0]} />
          <path d={tt.tay[1]} />
        </g>
      )}

      {/* ══ 3. CHÂN ══ */}
      {tt.chan.map((d, i) => <path key={'c' + i} d={d} fill={LONG_TOI} {...netChinh} />)}

      {/* ══ 4. THÂN & ÁO THEO QUY ĐỊNH BUỔI ══ */}
      <g>
        {/* Nền thân */}
        <path d={tt.than} fill={LONG_GOC} {...netChinh} />

        {/* Trang phục theo buổi */}
        {coMacAo && (
          <>
            {/* KIỂU 1: ÁO POLO XANH CMC GỐC */}
            {kieuAo === 'poloXanh' && (
              <>
                <path d="M 38 160 L 36 244 Q 100 252 164 244 L 162 160 Z" fill={AO_XANH} {...netChinh} />
                <path d="M 100 174 Q 65 168 46 186 Q 72 202 94 184 Z" fill={AO_VIEN} stroke="#FFFFFF" strokeWidth="4.5" />
                <path d="M 100 174 Q 65 168 46 186 Q 72 202 94 184 Z" fill="none" stroke={NET} strokeWidth="4" />
                <path d="M 100 174 Q 135 168 154 186 Q 128 202 106 184 Z" fill={AO_VIEN} stroke="#FFFFFF" strokeWidth="4.5" />
                <path d="M 100 174 Q 135 168 154 186 Q 128 202 106 184 Z" fill="none" stroke={NET} strokeWidth="4" />
                <rect x="94" y="182" width="12" height="28" rx="3.5" fill="#01579B" stroke={NET} strokeWidth="2.8" />
                <circle cx="100" cy="190" r="2.4" fill="#FFFFFF" />
                <circle cx="100" cy="202" r="2.4" fill="#FFFFFF" />
              </>
            )}

            {/* KIỂU 2: ÁO ĐỎ TÍM TÀI LỘC */}
            {kieuAo === 'aoDoTim' && (
              <>
                <path d="M 38 160 L 36 244 Q 100 252 164 244 L 162 160 Z" fill={AO_DO} {...netChinh} />
                <path d="M 70 172 Q 100 184 130 172" stroke="#FFFFFF" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                <circle cx="100" cy="204" r="8" fill="#FBBF24" stroke={NET} strokeWidth="2.5" />
                <text x="100" y="208" fontSize="11" fontWeight="900" fill={NET} textAnchor="middle">★</text>
              </>
            )}

            {/* KIỂU 3: ÁO VEST TRADER DOANH NHÂN */}
            {kieuAo === 'vestTrader' && (
              <>
                <path d="M 38 160 L 36 244 Q 100 252 164 244 L 162 160 Z" fill={AO_VEST} {...netChinh} />
                <polygon points="100,172 82,212 118,212" fill="#FFFFFF" />
                <polygon points="97,174 103,174 106,204 100,214 94,204" fill="#E11D48" stroke={NET} strokeWidth="2" />
              </>
            )}

            {/* KIỂU 4: ÁO HOODIE VÀNG ẤM ÁP */}
            {kieuAo === 'hoodie' && (
              <>
                <path d="M 38 160 L 36 244 Q 100 252 164 244 L 162 160 Z" fill={AO_HOODIE} {...netChinh} />
                <ellipse cx="100" cy="174" rx="30" ry="10" fill="#D97706" stroke={NET} strokeWidth="3" />
                <rect x="68" y="212" width="64" height="22" rx="8" fill="#D97706" stroke={NET} strokeWidth="3" />
              </>
            )}
          </>
        )}
      </g>

      {/* ══ 5. ĐẦU & MẶT ══ */}
      <g transform={`translate(${dx} ${dy})`}>
        {/* Tai trái & phải */}
        <path d={TAI_TRAI} fill={LONG_TOI} {...netChinh} />
        <path d={TAI_PHAI} fill={LONG_TOI} {...netChinh} />
        <path d="M 44 54 C 38 45 46 38 52 45 Z" fill="#6D4C41" />
        <path d="M 156 54 C 162 45 154 38 148 45 Z" fill="#6D4C41" />

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

        {/* Phụ kiện trên đầu */}
        {pkDau.length > 0 && <g dangerouslySetInnerHTML={{ __html: mau(pkDau) }} />}

        {/* Hiệu ứng cảm xúc */}
        {(bc.phu ?? []).map((p) => <VePhuTro key={p} kieu={p} />)}
      </g>

      {/* ══ 6. CẢNH PHÍA TRƯỚC (NƯỚC/THÀNH BỒN/LAPTOP) ══ */}
      {tt.truoc && <path d={tt.truoc} fill={tt.mauTruoc ?? '#38bdf8'} {...netChinh} fillRule="evenodd" />}

      {/* ══ 7. PHỤ KIỆN BÊN CẠNH ══ */}
      {pkCanh.length > 0 && <g dangerouslySetInnerHTML={{ __html: mau(pkCanh) }} />}
    </svg>
  );
}
