import type { GreetingStyle } from './greeting';

/* ═══════════════════════════════════════════════════════════════
   50 BIỂU CẢM CỦA BÉ CAPY

   KHÔNG vẽ 50 file ảnh rời. Dựng theo lối GHÉP THAM SỐ: một bộ mắt,
   một bộ miệng, một bộ phụ kiện (má hồng, giọt mồ hôi, tia giận...).
   Ghép lại ra 50 gương mặt khác nhau mà tổng dung lượng vẫn nhỏ, lại
   sửa 1 chỗ là cả 50 biểu cảm đổi theo — vẽ tay 50 file thì sửa mắt
   phải mở 50 file.

   ĐÂY LÀ THIẾT KẾ GỐC. Bộ sticker Zapy của Zalo có bản quyền thương
   mại nên không chép hay vẽ đồ theo được — app này dùng trong kinh
   doanh thật.
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

/** Nhóm cảm xúc — dùng để chọn câu thoại cho khớp */
export type Nhom =
  | 'vui' | 'yeu' | 'buonNgu' | 'gian' | 'so' | 'nguong'
  | 'chan' | 'tuHao' | 'toMo' | 'dau' | 'lamViec' | 'doi';

export interface BieuCam {
  ten: string;
  mat: Mat;
  mieng: Mieng;
  phu?: Phu[];
  nhom: Nhom;
  /** Nghiêng đầu (độ) — cho sinh động, không phải lúc nào cũng thẳng đơ */
  nghieng?: number;
}

/* ── 50 biểu cảm ── */
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
  { ten: 'Rung động',        mat: 'uotNuoc',   mieng: 'runRay',   phu: ['timBay'], nhom: 'yeu' },
  { ten: 'Ôm ấp',            mat: 'nhamChat',  mieng: 'cuoiNhe',  phu: ['maHong', 'timBay'], nhom: 'yeu', nghieng: 8 },

  // buồn ngủ (4)
  { ten: 'Ngủ gật',          mat: 'nhamChat',  mieng: 'chuO',     phu: ['zzz'], nhom: 'buonNgu', nghieng: 12 },
  { ten: 'Lim dim',          mat: 'lim',       mieng: 'thang',    nhom: 'buonNgu', nghieng: 6 },
  { ten: 'Ngáp dài',         mat: 'lim',       mieng: 'haToWow',  phu: ['nuocMat', 'zzz'], nhom: 'buonNgu', nghieng: 8 },
  { ten: 'Mơ màng',          mat: 'lim',       mieng: 'cuoiNhe',  phu: ['zzz', 'maHong'], nhom: 'buonNgu', nghieng: -10 },

  // giận (6)
  { ten: 'Cáu',              mat: 'lacDau',    mieng: 'meoXuong', phu: ['tiaGian'], nhom: 'gian' },
  { ten: 'Giận dỗi',         mat: 'nhamChat',  mieng: 'meoXuong', phu: ['tiaGian', 'khoiDau'], nhom: 'gian', nghieng: -9 },
  { ten: 'Bực mình',         mat: 'lacDau',    mieng: 'nhaiNhai', phu: ['tiaGian'], nhom: 'gian' },
  { ten: 'Nổi khùng',        mat: 'chuX',      mieng: 'haToWow',  phu: ['tiaGian', 'khoiDau'], nhom: 'gian' },
  { ten: 'Lườm',             mat: 'liecNgang', mieng: 'thang',    nhom: 'gian', nghieng: 4 },
  { ten: 'Phồng má',         mat: 'nhamChat',  mieng: 'thang',    phu: ['maHong', 'tiaGian'], nhom: 'gian' },

  // sợ (6)
  { ten: 'Hoảng hồn',        mat: 'kinhNgac',  mieng: 'oTron',    phu: ['chamThan'], nhom: 'so' },
  { ten: 'Sợ run',           mat: 'trongTron', mieng: 'runRay',   phu: ['giotMoHoi'], nhom: 'so' },
  { ten: 'Hét lên',          mat: 'chuX',      mieng: 'haToWow',  phu: ['chamThan', 'giotMoHoi'], nhom: 'so' },
  { ten: 'Né người',         mat: 'nhamChat',  mieng: 'runRay',   phu: ['giotMoHoi', 'bongDen'], nhom: 'so', nghieng: -14 },
  { ten: 'Giật mình',        mat: 'kinhNgac',  mieng: 'oTron',    phu: ['saoLapLanh', 'chamThan'], nhom: 'so' },
  { ten: 'Choáng váng',      mat: 'xoayTit',   mieng: 'nhaiNhai', phu: ['saoXoay'], nhom: 'so', nghieng: 16 },

  // ngượng (4)
  { ten: 'E thẹn',           mat: 'liecNgang', mieng: 'runRay',   phu: ['maHong'], nhom: 'nguong', nghieng: -8 },
  { ten: 'Mắc cỡ',           mat: 'nhamChat',  mieng: 'chuO',     phu: ['maHong', 'giotMoHoi'], nhom: 'nguong' },
  { ten: 'Bối rối',          mat: 'ngoNgac',   mieng: 'runRay',   phu: ['maHong', 'chamHoi'], nhom: 'nguong', nghieng: 7 },
  { ten: 'Thẹn thùng',       mat: 'nhinLen',   mieng: 'cuoiNhe',  phu: ['maHong', 'timBay'], nhom: 'nguong', nghieng: -5 },

  // chán (4)
  { ten: 'Chán đời',         mat: 'lim',       mieng: 'meoXuong', nhom: 'chan', nghieng: 10 },
  { ten: 'Thờ ơ',            mat: 'lim',       mieng: 'thang',    phu: ['khoiDau'], nhom: 'chan' },
  { ten: 'Uể oải',           mat: 'buon',      mieng: 'thang',    phu: ['khoiDau'], nhom: 'chan', nghieng: -6 },
  { ten: 'Mặt dày',          mat: 'nhamChat',  mieng: 'nhechMep', nhom: 'chan' },

  // tự hào (4)
  { ten: 'Vênh mặt',         mat: 'nhamCuoi',  mieng: 'nhechMep', phu: ['saoLapLanh'], nhom: 'tuHao', nghieng: -7 },
  { ten: 'Ngầu',             mat: 'liecNgang', mieng: 'nhechMep', phu: ['saoLapLanh'], nhom: 'tuHao', nghieng: -4 },
  { ten: 'Đắc ý',            mat: 'nhamCuoi',  mieng: 'cuoiToe',  phu: ['saoLapLanh', 'notNhac'], nhom: 'tuHao' },
  { ten: 'Ưỡn ngực',         mat: 'thuong',    mieng: 'nhechMep', phu: ['saoLapLanh'], nhom: 'tuHao', nghieng: 5 },

  // tò mò (4)
  { ten: 'Tò mò',            mat: 'ngoNgac',   mieng: 'chuO',     phu: ['chamHoi'], nhom: 'toMo', nghieng: 13 },
  { ten: 'Nghiêng đầu',      mat: 'thuong',    mieng: 'thang',    phu: ['chamHoi'], nhom: 'toMo', nghieng: -18 },
  { ten: 'Soi mói',          mat: 'nheoMot',   mieng: 'thang',    nhom: 'toMo', nghieng: 8 },
  { ten: 'Ngó nghiêng',      mat: 'liecNgang', mieng: 'chuO',     phu: ['chamHoi'], nhom: 'toMo' },

  // đau (3)
  { ten: 'Mếu',              mat: 'uotNuoc',   mieng: 'meoXuong', phu: ['nuocMat'], nhom: 'dau' },
  { ten: 'Khóc oà',          mat: 'nhamChat',  mieng: 'haToWow',  phu: ['nuocMat'], nhom: 'dau' },
  { ten: 'Tủi thân',         mat: 'buon',      mieng: 'runRay',   phu: ['nuocMat'], nhom: 'dau', nghieng: -11 },

  // làm việc (3)
  { ten: 'Tập trung',        mat: 'nheoMot',   mieng: 'thang',    phu: ['giotMoHoi'], nhom: 'lamViec' },
  { ten: 'Cày cuốc',         mat: 'chuX',      mieng: 'rangCua',  phu: ['giotMoHoi', 'khoiDau'], nhom: 'lamViec' },
  { ten: 'Nghĩ ngợi',        mat: 'nhinLen',   mieng: 'thang',    phu: ['chamHoi'], nhom: 'lamViec', nghieng: 9 },

  // đói (2)
  { ten: 'Đói bụng',         mat: 'buon',      mieng: 'theLuoi',  phu: ['giotMoHoi'], nhom: 'doi', nghieng: -7 },
  { ten: 'Thèm ăn',          mat: 'trongTron', mieng: 'theLuoi',  phu: ['saoLapLanh', 'maHong'], nhom: 'doi' },
];

/* ── Câu thoại theo PHONG CÁCH người dùng chọn ở Cài đặt ──
   Dùng lại đúng 4 phong cách của hệ lời chào (vui / troll / pro / gen_z)
   thay vì đẻ ra hệ tuỳ chọn thứ hai cho người dùng phải cấu hình 2 lần. */
export const THOAI: Record<GreetingStyle, Record<Nhom, string[]>> = {
  vui: {
    vui:      ['Nổ đơn rồi hả anh?', 'Hôm nay kho gọn ghê!', 'Cười lên anh ơi, sắp hết ngày rồi'],
    yeu:      ['Em quý anh nhất', 'Có anh em mới siêng canh phôi', 'Ôm cái nào!'],
    buonNgu:  ['Buồn ngủ quá à...', 'Em chợp mắt xíu nha', 'Ngáp... mấy giờ rồi anh'],
    gian:     ['Hứ! Em giận đó', 'Anh chọc em hoài à', 'Đừng có đụng vô em!'],
    so:       ['Á á á!', 'Hết hồn luôn á!', 'Anh làm em giật mình!'],
    nguong:   ['Ơ kìa... ngại quá à', 'Anh nhìn gì em vậy', 'Thôi em xấu hổ rồi'],
    chan:     ['Chán quá, chả ai gọi đặt đá', 'Kho im ru à', 'Hết chuyện làm rồi'],
    tuHao:    ['Em canh phôi không sót tấm nào!', 'Ngầu hông anh?', 'Khen em đi khen em đi'],
    toMo:     ['Anh đang báo giá mã nào đó?', 'Cho em coi với!', 'Khách nào mà xem lâu vậy?'],
    dau:      ['Huhu đau quá', 'Em tủi thân á', 'Anh dỗ em đi'],
    lamViec:  ['Cố lên anh, sắp xong rồi!', 'Em canh phôi giúp anh nha', 'Ghi nốt cái rồi nghỉ nhé'],
    doi:      ['Bụng em kêu rồi nè', 'Trưa chưa anh?', 'Đói quá đói quá'],
  },
  troll: {
    vui:      ['Ơ vui thế, trúng số à?', 'Hôm nay cười nhiều bất thường đó', 'Có gì mờ ám hông ta'],
    yeu:      ['Thôi đừng, em ngại', 'Nịnh em cũng không tăng lương đâu', 'Thương gì mà thương'],
    buonNgu:  ['Ngủ à? Phôi chưa nạp kìa', 'Mới 3 giờ mà đã gục', 'Em ngủ trước, anh ghi chép tiếp nha'],
    gian:     ['Đụng em lần nữa coi', 'Em nhớ mặt anh rồi đó', 'Hứ, nghỉ chơi'],
    so:       ['Á! Suýt rớt tim', 'Làm gì mà hung dữ vậy', 'Ném em nhẹ thôi anh ơi'],
    nguong:   ['Nhìn ít thôi, mòn em', 'Ơ hay, ngại thật đấy', 'Quay chỗ khác đi'],
    chan:     ['Chán như ngồi đợi Excel mở', 'Ngày dài ghê ha', 'Lại nữa hả'],
    tuHao:    ['Em nhớ hết mã đá, anh thì chưa chắc', 'Nể em chưa?', 'Đỉnh cao là đây'],
    toMo:     ['Ê, khách nào mà xem kỹ vậy?', 'Cho em hóng với', 'Có đơn ngon không chia em?'],
    dau:      ['Đau thật đó, không đùa', 'Anh ác quá đi', 'Em méc sếp cho coi'],
    lamViec:  ['Còn mấy dòng nữa thôi, ráng', 'Làm đi rồi than sau', 'Deadline nó không tự chạy đâu'],
    doi:      ['Đói. Đi ăn. Ngay.', 'Bụng em réo rồi đó', 'Anh ăn chưa mà bắt em ngồi đây'],
  },
  pro: {
    vui:      ['Tiến độ đang tốt.', 'Tồn kho khớp sổ.', 'Ghi nhận kết quả tích cực.'],
    yeu:      ['Rất vui được hỗ trợ anh.', 'Em luôn sẵn sàng.', 'Cảm ơn anh đã tin dùng.'],
    buonNgu:  ['Anh nên nghỉ giải lao.', 'Đã làm khá lâu rồi đó.', 'Nghỉ 5 phút rồi làm tiếp.'],
    gian:     ['Thao tác này chưa hợp lý.', 'Anh cân nhắc lại nhé.', 'Em không đồng tình lắm.'],
    so:       ['Có thay đổi đột ngột.', 'Anh thao tác nhẹ tay giúp em.', 'Đã ghi nhận sự cố.'],
    nguong:   ['Cảm ơn anh đã khen.', 'Em chỉ làm đúng việc thôi.', 'Không có gì đâu ạ.'],
    chan:     ['Chưa có việc mới.', 'Hàng chờ đang trống.', 'Em đang rảnh.'],
    tuHao:    ['Đã hoàn tất đúng hạn.', 'Số liệu phôi đã khớp.', 'Không có dòng nào lỗi.'],
    toMo:     ['Anh cần em hỗ trợ gì không?', 'Có công nợ nào cần kiểm tra?', 'Em xem giúp anh nhé.'],
    dau:      ['Có lỗi phát sinh.', 'Cần anh xem lại giúp.', 'Em chưa xử lý được việc này.'],
    lamViec:  ['Đang xử lý.', 'Còn vài mục chưa xong.', 'Em theo dõi tiến độ giúp anh.'],
    doi:      ['Đã tới giờ nghỉ trưa.', 'Anh nên ăn đúng giờ.', 'Nhắc anh nghỉ trưa.'],
  },
  gen_z: {
    vui:      ['Ét ô ét vui quá', 'Đỉnh nóc kịch trần!', 'Nổ đơn rồi anh zai ơi!'],
    yeu:      ['Anh là chân ái 💛', 'Ui thương xỉu', 'Cạ cứng của em nè'],
    buonNgu:  ['Pin em 1% rồi', 'Đi sạc pin cái đã', 'Buồn ngủ dã man con ngan'],
    gian:     ['Ơ kìa, hơi bị quá đó', 'Em quạo rồi nha', 'Toang, em nghỉ chơi'],
    so:       ['Á á, hết hồn chim én', 'Trời ơi tin được không', 'Em xỉu ngang luôn'],
    nguong:   ['Quê xỉu 🙈', 'Thôi em độn thổ đây', 'Ngại chết đi được'],
    chan:     ['Chán như con gián', 'Kho im ru, chán ghê', 'Nhạt nhẽo vô cùng'],
    tuHao:    ['Em cân hết mã đá', 'Không phải dạng vừa đâu', 'Cái này gọi là đỉnh'],
    toMo:     ['Hóng với hóng với!', 'Khách này có drama gì hong?', 'Kể em nghe đi'],
    dau:      ['Đau xỉu ngang', 'Em khum ổn', 'Huhu tổn thương'],
    lamViec:  ['Chiến thôi anh ơi!', 'Sắp xong rồi, gồng lên', 'Try hard tí nữa'],
    doi:      ['Đói xỉu, ăn gì chưa?', 'Cơm áo gạo tiền ơi', 'Bụng réo như trống làng'],
  },
};

/** Lấy 1 câu ngẫu nhiên hợp biểu cảm + phong cách */
export function layThoai(bc: BieuCam, style: GreetingStyle): string {
  const ds = THOAI[style][bc.nhom];
  return ds[Math.floor(Math.random() * ds.length)] ?? ds[0]!;
}

/** Chọn ngẫu nhiên 1 biểu cảm, có thể giới hạn trong vài nhóm */
export function bocBieuCam(nhom?: Nhom[]): BieuCam {
  const ds = nhom ? BIEU_CAM.filter((b) => nhom.includes(b.nhom)) : BIEU_CAM;
  return ds[Math.floor(Math.random() * ds.length)] ?? BIEU_CAM[0]!;
}
