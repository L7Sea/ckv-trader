import type { GreetingStyle } from './greeting';
import { layThoaiTheoMaTran4x7x6 } from './capy7DaysMatrix';

/* ═══════════════════════════════════════════════════════════════
   50 BIỂU CẢM CỦA BÉ CAPY + KHO THOẠI 7 NGÀY × 6 BUỔI CHỨNG KHOÁN
   ═══════════════════════════════════════════════════════════════ */

export type Mat =
  | 'thuong' | 'nhamCuoi' | 'nhamChat' | 'trongTron' | 'lacDau' | 'xoayTit'
  | 'tim' | 'chuX' | 'buon' | 'liecNgang' | 'nhinLen' | 'nheoMot'
  | 'uotNuoc' | 'kinhNgac' | 'ngoNgac' | 'lim';

export type Mieng =
  | 'cuoiNhe' | 'cuoiToe' | 'meoXuong' | 'chuO' | 'oTron' | 'rangCua'
  | 'theLuoi' | 'nhechMep' | 'runRay' | 'thang' | 'nhaiNhai' | 'haToWow';

export type Phu =
  | 'maHong' | 'giotMoHoi' | 'tiaGian' | 'timBay' | 'saoLapLanh' | 'zzz'
  | 'chamHoi' | 'chamThan' | 'saoXoay' | 'nuocMat' | 'notNhac' | 'khoiDau'
  | 'bongDen';

export type Nhom =
  | 'vui' | 'yeu' | 'buonNgu' | 'gian' | 'so' | 'nguong'
  | 'chan' | 'tuHao' | 'toMo' | 'dau' | 'lamViec' | 'doi';

export interface BieuCam {
  ten: string;
  mat: Mat;
  mieng: Mieng;
  phu?: Phu[];
  nhom: Nhom;
  nghieng?: number;
}

/* ── 50 biểu cảm gốc ghép SVG ── */
export const BIEU_CAM: BieuCam[] = [
  // vui (7)
  { ten: 'Cười tươi',        mat: 'nhamCuoi',  mieng: 'cuoiToe',  nhom: 'vui', nghieng: -6 },
  { ten: 'Hớn hở',           mat: 'thuong',    mieng: 'cuoiToe',  phu: ['saoLapLanh'], nhom: 'vui' },
  { ten: 'Cười mím',         mat: 'nhamCuoi',  mieng: 'cuoiNhe',  nhom: 'vui', nghieng: 5 },
  { ten: 'Hát nghêu ngao',   mat: 'nhamCuoi',  mieng: 'chuO',     phu: ['notNhac'], nhom: 'vui', nghieng: -8 },
  { ten: 'Nhảy múa',         mat: 'nhamCuoi',  mieng: 'haToWow',  phu: ['notNhac', 'saoLapLanh'], nhom: 'vui', nghieng: 10 },
  { ten: 'Khoái chí',        mat: 'nheoMot',   mieng: 'nhechMep', nhom: 'vui' },
  { ten: 'Toe toét',         mat: 'trongTron', mieng: 'rangCua',  phu: ['saoLapLanh'], nhom: 'vui', nghieng: -4 },

  // yêu (5)
  { ten: 'Mắt tim',          mat: 'tim',       mieng: 'cuoiToe',  phu: ['timBay'], nhom: 'yeu' },
  { ten: 'Thả tim',          mat: 'nhamCuoi',  mieng: 'chuO',     phu: ['timBay', 'maHong'], nhom: 'yeu', nghieng: -7 },
  { ten: 'Mến quá',          mat: 'nhamCuoi',  mieng: 'cuoiNhe',  phu: ['maHong'], nhom: 'yeu' },
  { ten: 'Mắt ướt xúc động', mat: 'uotNuoc',   mieng: 'cuoiNhe',  phu: ['maHong'], nhom: 'yeu', nghieng: 4 },
  { ten: 'Ngưỡng mộ',        mat: 'nhinLen',   mieng: 'cuoiToe',  phu: ['saoLapLanh'], nhom: 'yeu', nghieng: -5 },

  // buồn ngủ (4)
  { ten: 'Ngái ngủ',         mat: 'lim',       mieng: 'thang',    nhom: 'buonNgu', nghieng: -8 },
  { ten: 'Ngủ say',          mat: 'nhamChat',  mieng: 'cuoiNhe',  phu: ['zzz'], nhom: 'buonNgu', nghieng: -12 },
  { ten: 'Gật gà',           mat: 'nhamChat',  mieng: 'oTron',    nhom: 'buonNgu', nghieng: 10 },
  { ten: 'Ngáp dài',         mat: 'lim',       mieng: 'haToWow',  nhom: 'buonNgu', nghieng: 6 },

  // giận (4)
  { ten: 'Phụng phịu',       mat: 'lacDau',    mieng: 'meoXuong', nhom: 'gian', nghieng: -6 },
  { ten: 'Bốc hỏa',          mat: 'lacDau',    mieng: 'rangCua',  phu: ['tiaGian'], nhom: 'gian' },
  { ten: 'Xì khói',          mat: 'lacDau',    mieng: 'meoXuong', phu: ['khoiDau', 'tiaGian'], nhom: 'gian', nghieng: 8 },
  { ten: 'Lườm nhẹ',         mat: 'liecNgang', mieng: 'nhechMep', nhom: 'gian', nghieng: -5 },

  // sợ (4)
  { ten: 'Hốt hoảng',        mat: 'kinhNgac',  mieng: 'runRay',   phu: ['giotMoHoi', 'chamThan'], nhom: 'so', nghieng: 6 },
  { ten: 'Toát mồ hôi',      mat: 'trongTron', mieng: 'meoXuong', phu: ['giotMoHoi'], nhom: 'so' },
  { ten: 'Tròn mắt',         mat: 'kinhNgac',  mieng: 'haToWow',  phu: ['chamThan'], nhom: 'so' },
  { ten: 'Rùng mình',        mat: 'nhamChat',  mieng: 'runRay',   nhom: 'so', nghieng: -8 },

  // ngượng (4)
  { ten: 'Má hồng thẹn',     mat: 'nhamCuoi',  mieng: 'cuoiNhe',  phu: ['maHong'], nhom: 'nguong', nghieng: 8 },
  { ten: 'Gãi đầu',          mat: 'liecNgang', mieng: 'cuoiNhe',  phu: ['maHong', 'giotMoHoi'], nhom: 'nguong', nghieng: -10 },
  { ten: 'Mắt chớp chớp',    mat: 'thuong',    mieng: 'cuoiNhe',  phu: ['maHong'], nhom: 'nguong' },
  { ten: 'Lúng túng',        mat: 'nhinLen',   mieng: 'oTron',    phu: ['maHong', 'giotMoHoi'], nhom: 'nguong', nghieng: 6 },

  // chán (4)
  { ten: 'Mặt đơ',           mat: 'thuong',    mieng: 'thang',    nhom: 'chan' },
  { ten: 'Thờ ơ',            mat: 'liecNgang', mieng: 'thang',    nhom: 'chan', nghieng: -6 },
  { ten: 'Chống cằm',        mat: 'lim',       mieng: 'meoXuong', nhom: 'chan', nghieng: 12 },
  { ten: 'Mệt mỏi',          mat: 'nhamChat',  mieng: 'thang',    nhom: 'chan', nghieng: -8 },

  // tự hào (4)
  { ten: 'Mũi hếch',         mat: 'nhamCuoi',  mieng: 'nhechMep', phu: ['saoLapLanh'], nhom: 'tuHao', nghieng: -8 },
  { ten: 'Vênh mặt',         mat: 'nheoMot',   mieng: 'cuoiToe',  nhom: 'tuHao', nghieng: 10 },
  { ten: 'Tự tin 100%',      mat: 'thuong',    mieng: 'nhechMep', phu: ['saoLapLanh'], nhom: 'tuHao' },
  { ten: 'Đắc thắng',        mat: 'nhamCuoi',  mieng: 'cuoiToe',  phu: ['timBay', 'saoLapLanh'], nhom: 'tuHao', nghieng: -5 },

  // tò mò (4)
  { ten: 'Ngó nghiêng',      mat: 'ngoNgac',   mieng: 'oTron',    phu: ['chamHoi'], nhom: 'toMo', nghieng: 14 },
  { ten: 'Chấm hỏi to đùng', mat: 'trongTron', mieng: 'chuO',     phu: ['chamHoi'], nhom: 'toMo', nghieng: -10 },
  { ten: 'Hóng chuyện',      mat: 'liecNgang', mieng: 'oTron',    nhom: 'toMo' },
  { ten: 'Nghi vấn',         mat: 'nheoMot',   mieng: 'thang',    phu: ['chamHoi'], nhom: 'toMo', nghieng: 6 },

  // đau (3)
  { ten: 'Mắt chữ X',        mat: 'chuX',      mieng: 'meoXuong', nhom: 'dau', nghieng: -8 },
  { ten: 'Chóng mặt hoa mắt',mat: 'xoayTit',   mieng: 'runRay',   phu: ['saoXoay'], nhom: 'dau' },
  { ten: 'Khóc ròng',        mat: 'buon',      mieng: 'meoXuong', phu: ['nuocMat'], nhom: 'dau', nghieng: 6 },

  // làm việc (4)
  { ten: 'Tập trung cao độ', mat: 'trongTron', mieng: 'thang',    nhom: 'lamViec' },
  { ten: 'Đeo kính tri thức',mat: 'thuong',    mieng: 'cuoiNhe',  nhom: 'lamViec', nghieng: -4 },
  { ten: 'Nảy ra ý tưởng',   mat: 'trongTron', mieng: 'oTron',    phu: ['bongDen'], nhom: 'lamViec', nghieng: 8 },
  { ten: 'Chăm chỉ',         mat: 'nhinLen',   mieng: 'thang',    nhom: 'lamViec' },

  // đói (3)
  { ten: 'Chảy nước miếng',  mat: 'tim',       mieng: 'nhaiNhai', nhom: 'doi', nghieng: -6 },
  { ten: 'Nhai tóp tép',     mat: 'nhamCuoi',  mieng: 'nhaiNhai', nhom: 'doi' },
  { ten: 'Đòi ăn dưa hấu',   mat: 'uotNuoc',   mieng: 'haToWow',  nhom: 'doi', nghieng: 8 },
];

/* ══ BẢNG LỜI THOẠI CHỨNG KHOÁN THEO PHONG CÁCH & CẢM XÚC ══ */
const THOAI: Record<GreetingStyle, Record<Nhom, string[]>> = {
  vui: {
    vui:      ['Tím lịm tìm sim cả danh mục rồi anh L7Sea ơi!', 'Hôm nay nến xanh mướt mát, gồng lãi tự tin nhé!', 'Capy chúc sếp một ngày thắng lớn!'],
    yeu:      ['Thương danh mục của anh nhất trần đời!', 'Cổ tức về tài khoản thơm phức luôn!', 'Anh L7Sea chuẩn bị chốt lời nào!'],
    buonNgu:  ['Buồn ngủ chút thôi, tới giờ ATO là Capy thức liền', 'Ngủ trưa lấy sức chiều gồng lãi anh ơi', 'Khò khò... mơ thấy VN-Index vượt 1800 điểm'],
    gian:     ['Ai vừa đè giá cổ phiếu của anh L7Sea vậy? Quạo nha!', 'Lái đánh kiểu này là không thương Capy rồi!', 'Tức á, đừng hòng ép bán đáy!'],
    so:       ['Rung lắc ghê quá, nhưng anh em mình có kỷ luật thép!', 'Suýt rớt hàng, may mà giữ vững tay lái!', 'Bình tĩnh, hỗ trợ cứng 14.0 vẫn nguyên vẹn!'],
    nguong:   ['Được anh khen phân tích chuẩn mà em ngại ghê', 'Capy tài ba nhưng vẫn khiêm tốn học hỏi nha', 'Hihi, lộc lá đầy nhà rồi sếp ơi!'],
    chan:     ['Bảng điện sideways đứng im chán như con gián', 'Lái ngủ quên hay sao mà chưa thấy kéo trần ta', 'Đợi khớp lệnh mà sốt cả ruột'],
    tuHao:    ['52 thuật toán của em phân tích chuẩn bài chưa sếp?', 'Bắt đáy ngay chân sóng, quá tự hào!', 'Hệ thống CKV PRO số 1 thị trường!'],
    toMo:     ['Khối ngoại hôm nay đang âm thầm gom mã nào ta?', 'Anh L7Sea chuẩn bị giải ngân siêu cổ nào bật mí em với?', 'Hóng phiên ATC chiều nay quá!'],
    dau:      ['Cắt lỗ đau như cắt từng khúc ruột, nhưng bảo vệ vốn là trên hết!', 'Thị trường quay xe chóng cả mặt', 'Uống ngụm nước ấm rồi làm lại nào anh!'],
    lamViec:  ['Đang soi chart 52 mã VN50 thần tốc!', 'Ghi chép nhật ký lệnh cẩn thận để rèn giũa kỷ luật', 'Phân tích kỹ lưỡng trước khi bấm nút!'],
    doi:      ['Đói bụng rồi, cho Capy xin miếng dưa hấu giải nhiệt nào!', 'Ăn trưa no nê chiều nay mới có sức đè lái chứ!', 'Uống ly trà sữa trân châu mừng cổ tức về!'],
  },
  troll: {
    vui:      ['Ơ kìa, mới xanh có 1% mà cười toe toét như trúng số vậy?', 'Lãi nhẹ vài chục củ mà flex khắp xóm!', 'Cười nhiều cẩn thận lái úp sọt nha anh!'],
    yeu:      ['Nịnh Capy thì cổ phiếu cũng không tự tím trần đâu sếp ơi!', 'Thương gì mà thương, có chia lãi cho em đồng nào đâu!'],
    buonNgu:  ['Ngủ gật hả? Lái vừa kéo trần kìa thức dậy chốt nhanh!', 'Mới 14:00 mà đã gục, tính để tài khoản cho lái chăm à?'],
    gian:     ['Đụng vào Capy lần nữa là em báo lái đè giá ráng chịu nha!', 'Hứ, đừng tưởng có margin nhiều mà muốn ném em đi đâu thì ném!'],
    so:       ['Á á! Thấy cây nến đỏ dài ngoằng cái run tay liền!', 'Tính bán hoảng loạn đúng đáy nữa hay gì mà mặt xanh như đít nhái vậy sếp?'],
    nguong:   ['Khoe lãi vừa thôi sếp ơi, lái nghe thấy là lái đạp về tham chiếu giờ!', 'Ngại ghê á, nhìn em hoài mòn hết lông!'],
    chan:     ['Thị trường đi ngang như rùa bò, buồn ngủ hơn cả Capy ngâm bồn!', 'Thanh khoản lèo tèo, chán không buồn nói!'],
    tuHao:    ['Em nhớ hết 52 mã VN50, anh thì nhớ được bao nhiêu mã nè?', 'Nể thuật toán của em chưa? Không khen là em dỗi đó!'],
    toMo:     ['Lại đang tính đu đỉnh mã nào nữa đó anh zai?', 'Soi chart chăm chú ghê, có tìm ra kho báu không chia em xíu?'],
    dau:      ['Đau thật chứ đùa, ai bảo không đặt Stop Loss chi!', 'Lần sau nhớ nghe lời Capy cắt lỗ 7% nha sếp!'],
    lamViec:  ['Cày cuốc ghi nhật ký đi, không ghi là tháng sau quên sạch lý do mua!', 'Deadline chốt sổ tuần tới nơi rồi kìa!'],
    doi:      ['Đói. Cơm trưa đâu. Không có dưa hấu là em đình công không soi chart nữa!'],
  },
  pro: {
    vui:      ['Hiệu suất danh mục đang tăng trưởng đúng theo kế hoạch.', 'Vị thế cổ phiếu vận động tích cực trên đường MA20.', 'Đạt tỷ lệ Lợi nhuận / Rủi ro R:R tối ưu.'],
    yeu:      ['Hân hạnh đồng hành cùng anh L7Sea trên con đường đầu tư chuyên nghiệp.', 'Hệ thống luôn sẵn sàng hỗ trợ dữ liệu 24/7.'],
    buonNgu:  ['Đã đến giờ nghỉ ngơi theo nguyên tắc quản trị sức khỏe.', 'Thư giãn trí não để duy trì sự tỉnh táo cao độ.'],
    gian:     ['Thao tác không tuân thủ kế hoạch giao dịch ban đầu.', 'Cần kiềm chế cảm xúc FOMO và tuân thủ kỷ luật.'],
    so:       ['Độ biến động thị trường gia tăng. Kiểm tra lại tỷ lệ an toàn vốn ký quỹ.'],
    nguong:   ['Cảm ơn sự tín nhiệm của nhà đầu tư L7Sea.'],
    chan:     ['Thị trường trong pha tích lũy thanh khoản thấp. Kiên nhẫn chờ đợi điểm bứt phá.'],
    tuHao:    ['52 mô hình định lượng đã xác nhận điểm đảo chiều chính xác.', 'Bảo toàn thành công tài sản ròng trước nhịp chỉnh.'],
    toMo:     ['Đang quét dữ liệu dòng tiền khối ngoại và tự doanh.'],
    dau:      ['Mức sụt giảm vi phạm ngưỡng kỹ thuật. Khuyến nghị thực thi kỷ luật cắt lỗ bảo toàn vốn.'],
    lamViec:  ['Đang phân tích 52 mã VN50 theo các mô hình định lượng.', 'Nhật ký giao dịch đã được đồng bộ chuẩn T+2.5.'],
    doi:      ['Đã đến giờ ăn trưa và nghỉ ngơi theo lịch trình giao dịch.'],
  },
  gen_z: {
    vui:      ['Slay quá anh L7Sea ơi, danh mục tím lịm flex mỏi tay!', 'Vibe hôm nay chuẩn triệu đô, lesgooo!'],
    yeu:      ['Anh là chân ái của Capy 💛', 'U là trời siêu phẩm về tài khoản thương xỉu!'],
    buonNgu:  ['Pin em còn 1% rồi, đi sạc năng lượng chiều chiến tiếp!', 'Buồn ngủ dã man con ngan!'],
    gian:     ['Ủa alo lái, đè giá quài zạ? Em quạo rồi nha!'],
    so:       ['Ét ô ét, quả nến rút chân thót tim bay màu!'],
    nguong:   ['Quê xỉu 🙈 vừa chốt xong cổ phiếu phi tiếp trần!'],
    chan:     ['Chán như con gián, thị trường im ru nhạt nhẽo ghê!'],
    tuHao:    ['Capy cân hết 52 mã VN50, đỉnh nóc kịch trần bay phấp phới!'],
    toMo:     ['Hóng biến với! Mã nào đang có drama game tăng vốn zậy sếp?'],
    dau:      ['Đau xỉu ngang, thôi em khum ổn tí nào!'],
    lamViec:  ['Try hard cày chart thôi anh ơi, làm giàu không khó!'],
    doi:      ['Bụng réo như tiếng gõ bảng điện rồi, đi trà sữa thôi!'],
  },
};

/** Lấy câu thoại: Kết hợp ma trận 7 ngày x 6 buổi + kho biểu cảm */
export function layThoai(bc: BieuCam, style: GreetingStyle): string {
  // 60% lấy theo ma trận 4 phong cách x 7 ngày x 6 buổi (rất phong phú và đúng thời điểm)
  if (Math.random() < 0.6) {
    return layThoaiTheoMaTran4x7x6(style);
  }
  const ds = THOAI[style]?.[bc.nhom] ?? THOAI.vui[bc.nhom];
  return ds[Math.floor(Math.random() * ds.length)] ?? ds[0]!;
}

export function bocBieuCam(nhom?: Nhom[]): BieuCam {
  const ds = nhom ? BIEU_CAM.filter((b) => nhom.includes(b.nhom)) : BIEU_CAM;
  return ds[Math.floor(Math.random() * ds.length)] ?? BIEU_CAM[0]!;
}
