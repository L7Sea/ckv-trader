import { useId } from 'react';
import type { BieuCam, Mat, Mieng, Phu } from '@/lib/capyBieuCam';
import { TU_THE, type TuThe } from '@/lib/capyTuThe';
import { PHU_KIEN, type TenPhuKien } from '@/lib/capyPhuKien';
import type { LopThem } from '@/lib/capyMemeSpec';

/* ═══════════════════════════════════════════════════════════════
   BÉ CAPY — vẽ theo ĐÚNG giải phẫu chuột lang nước.

   Anh Hải chỉ ra bản trước trông như con GẤU, và chỉ rõ sai ở đâu.
   Bản này sửa đúng 6 điểm đó:

     1. MẮT chỉ là CHẤM TRÒN hoặc GẠCH NHỎ. Không tròng trắng, không
        con ngươi, không đốm sáng — đó là mắt gấu/mèo hoạt hình.
     2. MŨI VÀ MIỆNG nằm chung trong MỘT VÙNG NÂU SẪM NHỎ, hình chữ T
        có chân chẻ đôi. Không phải mõm kem to chiếm nửa mặt.
     3. ĐẦU là QUẢ TRỨNG NẰM NGANG (rộng hơn cao), không phải hình tròn.
     4. THÂN gần CHỮ NHẬT, nối thẳng vào đầu, KHÔNG có đường ngấn cổ.
     5. TAY nhỏ xíu, chỉ là hai mẩu nhô ra hai bên.
     6. NÉT VIỀN ĐEN và DÀY, màu tô phẳng — không đổ bóng, không gradient.

   Cách nối đầu-thân không lộ ngấn: vẽ THÂN trước (có viền), rồi vẽ ĐẦU
   ĐÈ LÊN — phần tô của đầu che mất mép trên của thân. Đúng như trong
   ảnh mẫu: thấy vai nhô ra hai bên đầu, nhưng không có vạch ngang cổ.

   Đây là thiết kế gốc, vẽ theo mô tả giải phẫu chứ không đồ lại ảnh nào.
   ═══════════════════════════════════════════════════════════════ */

const LONG = '#cbab84';        // lông nâu tan, tô PHẲNG
const LONG_TOI = '#b8966f';    // tay/chân/tai — sẫm hơn một nấc
const VUNG_MOM = '#b5966f';    // vùng nâu sẫm chứa mũi + miệng
const NET = '#1c1c1c';         // nét viền ĐEN, dày
const AO_TREN = '#26344f';
const AO_DUOI = '#151f33';

const DAY_NET = 7;             // độ dày nét viền chính

/* Toạ độ mốc — mắt nằm CAO và XA nhau, đúng kiểu chuột lang nước */
const MAT_Y = 96, MAT_TRAI = 66, MAT_PHAI = 134;
/* Vùng mõm: hộp bo góc chứa cả mũi lẫn miệng */
const MOM_X = 78, MOM_Y = 104, MOM_W = 44, MOM_H = 56;
const MUI_Y = MOM_Y + 12;                       // thanh mũi ngang
const MIENG_Y = MUI_Y + 10;                     // chân chữ T bắt đầu

/* ═══ ĐẦU — quả trứng NẰM NGANG, có 2 bướu tai nhỏ trên đỉnh ═══ */
const DAU =
  'M 100 34 C 140 34 168 52 178 82 C 186 106 180 132 158 148 C 140 161 121 166 100 166 ' +
  'C 79 166 60 161 42 148 C 20 132 14 106 22 82 C 32 52 60 34 100 34 Z';
/* Tai: bướu nhỏ đặt CHỒNG lên mép đầu, không phải hình rời */
const TAI_T = 'M 46 60 C 38 44 50 34 62 44 C 68 49 70 55 68 60 Z';
const TAI_P = 'M 154 60 C 162 44 150 34 138 44 C 132 49 130 55 132 60 Z';

/* ── MẮT — chấm tròn hoặc gạch nhỏ, TẤT CẢ đều nhỏ ── */
function VeMat({ kieu, x }: { kieu: Mat; x: number }) {
  const y = MAT_Y;
  switch (kieu) {
    /* Mặc định trong ảnh mẫu: GẠCH NHỎ nằm ngang, bo tròn đầu */
    case 'thuong':
      return <rect x={x - 8} y={y - 3.5} width="16" height="7" rx="3.5" fill={NET} />;
    case 'nhamCuoi':
      return <path d={`M${x - 9} ${y + 3} Q${x} ${y - 7} ${x + 9} ${y + 3}`} stroke={NET} strokeWidth="6" fill="none" strokeLinecap="round" />;
    case 'nhamChat':
      return <line x1={x - 9} y1={y} x2={x + 9} y2={y} stroke={NET} strokeWidth="6" strokeLinecap="round" />;
    case 'lim':
      return <path d={`M${x - 9} ${y - 1} Q${x} ${y + 5} ${x + 9} ${y - 1}`} stroke={NET} strokeWidth="6" fill="none" strokeLinecap="round" />;
    /* "Trợn" vẫn chỉ là chấm to hơn một nấc — không thêm tròng trắng */
    case 'trongTron':
      return <circle cx={x} cy={y} r="8" fill={NET} />;
    case 'kinhNgac':
      return <>
        <circle cx={x} cy={y} r="10.5" fill={NET} />
        <circle cx={x + 3} cy={y - 3.5} r="2.6" fill="#fff" />
      </>;
    case 'lacDau':
      return <>
        <rect x={x - 8} y={y - 2} width="16" height="7" rx="3.5" fill={NET} />
        <path d={`M${x - 12} ${y - 12} L${x + 10} ${y - 7}`} stroke={NET} strokeWidth="5" strokeLinecap="round"
          transform={x < 100 ? '' : `scale(-1,1) translate(${-2 * x},0)`} />
      </>;
    case 'xoayTit':
      return <path d={`M${x} ${y} m0,-8 a8,8 0 1,1 -5.6,2.4 a5.4,5.4 0 1,0 3.8,-1.6`} stroke={NET} strokeWidth="3.4" fill="none" strokeLinecap="round" />;
    case 'tim':
      return <path d={`M${x} ${y + 7} C${x - 11} ${y - 3} ${x - 6} ${y - 11} ${x} ${y - 4} C${x + 6} ${y - 11} ${x + 11} ${y - 3} ${x} ${y + 7} Z`} fill="#e0455f" />;
    case 'chuX':
      return <>
        <line x1={x - 7} y1={y - 7} x2={x + 7} y2={y + 7} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <line x1={x + 7} y1={y - 7} x2={x - 7} y2={y + 7} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
      </>;
    case 'buon':
      return <>
        <circle cx={x} cy={y + 1} r="6" fill={NET} />
        <path d={`M${x - 12} ${y - 8} L${x + 10} ${y - 13}`} stroke={NET} strokeWidth="4.6" strokeLinecap="round"
          transform={x < 100 ? '' : `scale(-1,1) translate(${-2 * x},0)`} />
      </>;
    case 'liecNgang':
      return <rect x={x - 4} y={y - 4} width="14" height="8" rx="4" fill={NET} />;
    case 'nhinLen':
      return <rect x={x - 7} y={y - 8} width="14" height="8" rx="4" fill={NET} />;
    case 'nheoMot':
      return x < 100
        ? <path d={`M${x - 9} ${y + 3} Q${x} ${y - 6} ${x + 9} ${y + 3}`} stroke={NET} strokeWidth="6" fill="none" strokeLinecap="round" />
        : <circle cx={x} cy={y} r="7" fill={NET} />;
    case 'uotNuoc':
      return <>
        <circle cx={x} cy={y} r="9.5" fill={NET} />
        <circle cx={x + 3.4} cy={y - 3.4} r="3.2" fill="#fff" />
        <circle cx={x - 3.4} cy={y + 2.6} r="1.8" fill="#fff" opacity=".8" />
      </>;
    case 'ngoNgac':
      return <circle cx={x} cy={y} r={x < 100 ? 8.5 : 5.5} fill={NET} />;
    default:
      return <rect x={x - 8} y={y - 3.5} width="16" height="7" rx="3.5" fill={NET} />;
  }
}

/* ── MŨI + MIỆNG — chữ T có chân CHẺ ĐÔI, nằm trong vùng nâu sẫm ──
   Thanh ngang trên = mũi (luôn có). Phần dưới đổi theo biểu cảm. */
function VeMieng({ kieu }: { kieu: Mieng }) {
  const gx = 100;                        // trục giữa
  const chanY = MIENG_Y + 26;            // đáy chân chữ T

  /* Chân chữ T mặc định: một nét dọc, chẻ đôi ở đáy */
  const chanCheDoi = (
    <>
      <line x1={gx} y1={MIENG_Y} x2={gx} y2={chanY} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
      <path d={`M${gx} ${chanY} q-6 5 -8 2 M${gx} ${chanY} q6 5 8 2`} stroke={NET} strokeWidth="5" fill="none" strokeLinecap="round" />
    </>
  );

  switch (kieu) {
    case 'thang':
      return chanCheDoi;
    case 'cuoiNhe':
      return <>
        <line x1={gx} y1={MIENG_Y} x2={gx} y2={chanY - 6} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <path d={`M${gx - 11} ${chanY - 8} q11 11 22 0`} stroke={NET} strokeWidth="5" fill="none" strokeLinecap="round" />
      </>;
    case 'cuoiToe':
      return <>
        <line x1={gx} y1={MIENG_Y} x2={gx} y2={MIENG_Y + 8} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <path d={`M${gx - 15} ${MIENG_Y + 8} q15 20 30 0 Z`} fill={NET} />
      </>;
    case 'meoXuong':
      return <>
        <line x1={gx} y1={MIENG_Y} x2={gx} y2={chanY - 6} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <path d={`M${gx - 11} ${chanY} q11 -11 22 0`} stroke={NET} strokeWidth="5" fill="none" strokeLinecap="round" />
      </>;
    case 'chuO':
      return <>
        <line x1={gx} y1={MIENG_Y} x2={gx} y2={MIENG_Y + 6} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <ellipse cx={gx} cy={MIENG_Y + 15} rx="6.5" ry="8.5" fill={NET} />
      </>;
    case 'oTron':
      return <ellipse cx={gx} cy={MIENG_Y + 14} rx="10" ry="13" fill={NET} />;
    case 'haToWow':
      return <>
        <ellipse cx={gx} cy={MIENG_Y + 16} rx="15" ry="17" fill={NET} />
        <ellipse cx={gx} cy={MIENG_Y + 24} rx="7" ry="5.5" fill="#e0768a" />
      </>;
    case 'rangCua':
      return <>
        <line x1={gx} y1={MIENG_Y} x2={gx} y2={MIENG_Y + 6} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <path d={`M${gx - 14} ${MIENG_Y + 6} q14 17 28 0 Z`} fill={NET} />
        <rect x={gx - 6.5} y={MIENG_Y + 9} width="5.5" height="8" rx="1.6" fill="#fff" />
        <rect x={gx + 1} y={MIENG_Y + 9} width="5.5" height="8" rx="1.6" fill="#fff" />
      </>;
    case 'theLuoi':
      return <>
        {chanCheDoi}
        <ellipse cx={gx + 7} cy={chanY + 4} rx="6" ry="7.5" fill="#e0768a" stroke={NET} strokeWidth="3" />
      </>;
    case 'nhechMep':
      return <>
        <line x1={gx} y1={MIENG_Y} x2={gx} y2={chanY - 6} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <path d={`M${gx - 11} ${chanY - 2} q11 4 22 -9`} stroke={NET} strokeWidth="5" fill="none" strokeLinecap="round" />
      </>;
    case 'runRay':
      return <>
        <line x1={gx} y1={MIENG_Y} x2={gx} y2={chanY - 8} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <path d={`M${gx - 12} ${chanY - 6} q6 -7 12 0 q6 7 12 0`} stroke={NET} strokeWidth="4.6" fill="none" strokeLinecap="round" />
      </>;
    case 'nhaiNhai':
      return <>
        <line x1={gx} y1={MIENG_Y} x2={gx} y2={MIENG_Y + 5} stroke={NET} strokeWidth="5.5" strokeLinecap="round" />
        <rect x={gx - 15} y={MIENG_Y + 5} width="30" height="14" rx="4" fill={NET} />
        <line x1={gx - 15} y1={MIENG_Y + 12} x2={gx + 15} y2={MIENG_Y + 12} stroke="#fff" strokeWidth="2.4" />
        {[-7.5, 0, 7.5].map((d) => <line key={d} x1={gx + d} y1={MIENG_Y + 5} x2={gx + d} y2={MIENG_Y + 19} stroke="#fff" strokeWidth="2.2" />)}
      </>;
    default:
      return chanCheDoi;
  }
}

/* ── PHỤ TRỢ trên mặt ── */
function VePhu({ kieu }: { kieu: Phu }) {
  switch (kieu) {
    case 'maHong': return <>
      <ellipse cx="46" cy="122" rx="13" ry="7.5" fill="#e0768a" opacity=".5" />
      <ellipse cx="154" cy="122" rx="13" ry="7.5" fill="#e0768a" opacity=".5" />
    </>;
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
        <path d="M24 52 l2.8 5.8 5.8 2.8 -5.8 2.8 -2.8 5.8 -2.8 -5.8 -5.8 -2.8 5.8 -2.8 z" opacity=".8" />
      </g>;
    case 'zzz':
      return <g className="cp-bay" fill={NET} fontFamily="var(--font-main)" fontWeight="800">
        <text x="164" y="48" fontSize="26">z</text>
        <text x="182" y="30" fontSize="18" opacity=".7">z</text>
      </g>;
    case 'chamHoi':
      return <text className="cp-nhun" x="164" y="50" fontSize="42" fontWeight="800" fill="#f5a742" fontFamily="var(--font-main)">?</text>;
    case 'chamThan':
      return <text className="cp-giat" x="168" y="50" fontSize="42" fontWeight="800" fill="#e0455f" fontFamily="var(--font-main)">!</text>;
    case 'saoXoay':
      return <g className="cp-xoay" style={{ transformOrigin: '100px 26px' }} fill="#f5c542">
        {[0, 120, 240].map((d) => (
          <circle key={d} cx={100 + 30 * Math.cos(d * Math.PI / 180)} cy={26 + 11 * Math.sin(d * Math.PI / 180)} r="5.5" />
        ))}
      </g>;
    case 'nuocMat':
      return <g className="cp-roi" fill="#6ec5f0" stroke={NET} strokeWidth="3">
        <path d="M56 112 q7 13 0 17 a8.4 8.4 0 0 1 -7 -12 z" />
        <path d="M144 112 q7 13 0 17 a8.4 8.4 0 0 1 -7 -12 z" />
      </g>;
    case 'notNhac':
      return <g className="cp-bay" fill={NET}>
        <ellipse cx="168" cy="50" rx="6.6" ry="5.2" transform="rotate(-20 168 50)" />
        <rect x="173" y="26" width="3.4" height="24" />
        <path d="M176.4 26 q9.5 2 9.5 8.6 q-3.8 -4.8 -9.5 -3.8 z" />
      </g>;
    case 'khoiDau':
      return <g className="cp-bay" fill="#b9c2cf" opacity=".85">
        <circle cx="30" cy="46" r="7.4" /><circle cx="43" cy="35" r="5.8" /><circle cx="19" cy="35" r="5" />
      </g>;
    case 'bongDen':
      return <path d={DAU} fill="#2b3a5e" opacity=".22" />;
    default: return null;
  }
}

interface Props {
  bc: BieuCam;
  size: number;
  tuThe?: TuThe;
  phuKien?: TenPhuKien[];
  /** Lớp vẽ thêm từ công thức meme — ĐÃ qua locSvg() trước khi tới đây */
  lopThem?: LopThem[];
}

export default function CapyMat({ bc, size, tuThe = 'dung', phuKien = [], lopThem = [] }: Props) {
  /* ID gradient RIÊNG mỗi bản — 2 bé cùng trang mà trùng id thì cả hai
     cùng trỏ vào định nghĩa đầu tiên. */
  const uid = useId().replace(/:/g, '');
  const idAo = 'cpAo' + uid;

  const tt = TU_THE[tuThe] ?? TU_THE.dung;
  const [dx, dy] = tt.dauDich;

  const pkDau = phuKien.filter((p) => PHU_KIEN[p]?.neo === 'dau');
  const pkCanh = phuKien.filter((p) => PHU_KIEN[p]?.neo === 'canh');
  const pkDauDuoi = pkDau.filter((p) => !PHU_KIEN[p].tren);
  const pkDauTren = pkDau.filter((p) => PHU_KIEN[p].tren);
  const mau = (ds: TenPhuKien[]) => ds.map((p) => PHU_KIEN[p].hinh).join('');

  const netChinh = { stroke: NET, strokeWidth: DAY_NET, strokeLinejoin: 'round' as const };

  return (
    <svg viewBox="0 0 200 250" width={size} height={size * 1.25} aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={idAo} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={AO_TREN} />
          <stop offset="100%" stopColor={AO_DUOI} />
        </linearGradient>
      </defs>

      {lopThem.filter((l) => l.neo === 'canh' && l.z === 'sau').map((l, i) => (
        <g key={'ls' + i} dangerouslySetInnerHTML={{ __html: l.svg }} />
      ))}

      {tt.sau && <path d={tt.sau} fill={tt.mauSau ?? '#b3763c'} {...netChinh} />}

      {/* ══ TAY — NHỎ XÍU, chỉ là 2 mẩu nhô ra hai bên ══ */}
      {tt.tay && (
        <>
          <g className="cp-tay-trai" style={{ transformOrigin: '52px 186px' }}>
            <path d={tt.tay[0]} fill={LONG_TOI} {...netChinh} />
          </g>
          <g className="cp-tay-phai" style={{ transformOrigin: '148px 186px' }}>
            <path d={tt.tay[1]} fill={LONG_TOI} {...netChinh} />
          </g>
        </>
      )}

      {/* ══ CHÂN ══ */}
      {tt.chan.map((d, i) => <path key={'c' + i} d={d} fill={LONG_TOI} {...netChinh} />)}

      {/* ══ THÂN — vẽ TRƯỚC đầu, để đầu đè lên che mép trên
             → không có đường ngấn cổ, đúng như ảnh mẫu ══ */}
      <path d={tt.than} fill={LONG} {...netChinh} />

      {/* ══ ÁO ══ */}
      {tt.coAo && (
        <>
          <path d="M52 172 Q100 162 148 172 L145 218 Q100 228 55 218 Z"
            fill={`url(#${idAo})`} {...netChinh} strokeWidth="5" />
          <text x="100" y="206" fontFamily="var(--font-main), sans-serif" fontSize="38" fontWeight="800"
            fill="#fff" textAnchor="middle">T</text>
        </>
      )}

      {/* ══ ĐẦU + MẶT — cả cụm dời theo tư thế ══ */}
      <g transform={`translate(${dx} ${dy})`}>
        {/* Tai vẽ trước, đầu đè lên chân tai */}
        <path d={TAI_T} fill={LONG_TOI} {...netChinh} />
        <path d={TAI_P} fill={LONG_TOI} {...netChinh} />
        {/* Đầu: quả trứng NẰM NGANG */}
        <path d={DAU} fill={LONG} {...netChinh} />

        {/* Râu: 2 gạch ngắn bên má trái, đúng như ảnh mẫu */}
        <path d="M30 118 l14 -3 M31 130 l14 -4" stroke={NET} strokeWidth="4.6" fill="none" strokeLinecap="round" />

        {/* VÙNG NÂU SẪM chứa mũi + miệng — nhỏ, bo góc */}
        <rect x={MOM_X} y={MOM_Y} width={MOM_W} height={MOM_H} rx="15" fill={VUNG_MOM} />

        {(bc.phu ?? []).includes('bongDen') && <VePhu kieu="bongDen" />}

        <VeMat kieu={bc.mat} x={MAT_TRAI} />
        <VeMat kieu={bc.mat} x={MAT_PHAI} />

        {/* MŨI: thanh ngang bo tròn — nét trên của chữ T */}
        <rect x={MOM_X + 4} y={MUI_Y - 9} width={MOM_W - 8} height="18" rx="9" fill={NET} />
        <VeMieng kieu={bc.mieng} />

        {pkDauDuoi.length > 0 && <g dangerouslySetInnerHTML={{ __html: mau(pkDauDuoi) }} />}
        {pkDauTren.length > 0 && <g dangerouslySetInnerHTML={{ __html: mau(pkDauTren) }} />}
        {(bc.phu ?? []).filter((p) => p !== 'bongDen').map((p) => <VePhu key={p} kieu={p} />)}
        {lopThem.filter((l) => l.neo === 'dau').map((l, i) => (
          <g key={'ld' + i} dangerouslySetInnerHTML={{ __html: l.svg }} />
        ))}
      </g>

      {tt.truoc && (
        <path d={tt.truoc} fill={tt.mauTruoc ?? '#7cc4e8'} {...netChinh} fillRule="evenodd" />
      )}

      {pkCanh.length > 0 && <g dangerouslySetInnerHTML={{ __html: mau(pkCanh) }} />}

      {lopThem.filter((l) => l.neo === 'canh' && l.z !== 'sau').map((l, i) => (
        <g key={'lt' + i} dangerouslySetInnerHTML={{ __html: l.svg }} />
      ))}
    </svg>
  );
}
