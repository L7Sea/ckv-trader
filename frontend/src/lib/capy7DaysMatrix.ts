import type { GreetingStyle } from './greeting';

/* ═══════════════════════════════════════════════════════════════
   MA TRẬN 7 NGÀY × 6 BUỔI × HÀNG TRĂM CÂU THOẠI CAPY CHỨNG KHOÁN
   (Được tối ưu chuẩn phong cách L7Sea & Trần Long Sale)
   
   • 7 Ngày: Thứ 2 (t2) -> Chủ Nhật (cn)
   • 6 Buổi: Rạng sáng (rang) · Sáng (sang) · Trưa (trua) · Chiều (chieu) · Tối (toi) · Đêm (dem)
   • Phong cách: Vui vẻ (vui) · Cà khịa thị trường (troll) · Trader Chuyên nghiệp (pro) · Gen Z (gen_z)
   ═══════════════════════════════════════════════════════════════ */

export type ThuTrongTuan = 't2' | 't3' | 't4' | 't5' | 't6' | 't7' | 'cn';
export type BuoiTrongNgay = 'rang' | 'sang' | 'trua' | 'chieu' | 'toi' | 'dem';

export function layThuHienTai(d = new Date()): ThuTrongTuan {
  const day = d.getDay(); // 0 = CN, 1 = T2, 2 = T3...
  if (day === 1) return 't2';
  if (day === 2) return 't3';
  if (day === 3) return 't4';
  if (day === 4) return 't5';
  if (day === 5) return 't6';
  if (day === 6) return 't7';
  return 'cn';
}

export function layBuoiHienTai(h = new Date().getHours()): BuoiTrongNgay {
  if (h < 5) return 'rang';
  if (h < 11) return 'sang';
  if (h < 14) return 'trua';
  if (h < 18) return 'chieu';
  if (h < 22) return 'toi';
  return 'dem';
}

/* ═══════════════════════════════════════════════════════════════
   KHO CÂU THOẠI MA TRẬN 7 NGÀY × 6 BUỔI
   ═══════════════════════════════════════════════════════════════ */

export const MA_TRAN_7_NGAY: Record<ThuTrongTuan, Record<BuoiTrongNgay, string[]>> = {
  // ══ THỨ 2: MỞ BÁT TUẦN MỚI ══
  t2: {
    rang: [
      'Thứ Hai rạng sáng rồi, anh L7Sea chuẩn bị mở bát tuần mới rực rỡ nhé!',
      '04:00 Thứ 2: Soi trước danh sách cổ phiếu tiềm năng đón sóng tuần này.',
      'Bình minh đầu tuần tinh khôi, năng lượng tràn đầy để săn deal hời!',
      'Thức sớm đầu tuần để đón nhịp rung lắc ATO gom hàng giá tốt.',
      'Sáng Thứ Hai mát lành, Capy chúc danh mục tuần này nở hoa tím ngắt!'
    ],
    sang: [
      'Thứ Hai mở phiên ATO: Sắc tím ngập tràn cả rổ VN50 nào sếp ơi!',
      'Chào Thứ Hai đầu tuần! Cà phê sáng thơm phức, sẵn sàng bắt sóng lớn.',
      '09:00 Thứ 2: Dòng tiền luân chuyển mạnh mẽ, kiên nhẫn canh đúng điểm mua.',
      'Chúc anh L7Sea tuần mới giao dịch đại thắng, mã nào vào là tím mã đó!',
      'Mở bát tuần mới thuận buồm xuôi gió, tâm lý vững vàng trước mọi nhịp đè.'
    ],
    trua: [
      'Khép lại phiên sáng Thứ 2, ăn trưa no nê lấy sức chiến đấu phiên chiều nào!',
      'Trưa Thứ Hai nghỉ ngơi thảnh thơi, tạm gác bảng điện cho mắt nghỉ ngơi.',
      'Ăn miếng dưa hấu mát lạnh, nạp năng lượng chờ nhịp bùng nổ 14h00!',
      'Phiên sáng đầu tuần dòng tiền ổn định, trưa nay nghỉ ngơi hồi sức nhé anh.',
      'Capy ngâm bồn gỗ nghỉ trưa, chúc anh bữa trưa ngon miệng!'
    ],
    chieu: [
      '14:00 Chiều Thứ Hai: Khung giờ vàng quyết định xu hướng cả tuần!',
      'Canh lệnh ATC Thứ 2 thật chuẩn, chúc NAV hôm nay tăng vọt!',
      'Chiều đầu tuần dòng tiền ngoại mua ròng tích cực, giữ chặt hàng chiến lược.',
      'Khép phiên Thứ Hai rực rỡ, khởi đầu một tuần mới tràn đầy hy vọng!',
      'Lái kéo phiên ATC Thứ 2 quá đẹp, chuẩn bị bia ăn mừng thôi anh ơi!'
    ],
    toi: [
      'Tối Thứ Hai: Thong thả mở sổ nhật ký CKV tổng kết lại diễn biến ngày mở bát.',
      'Uống ngụm trà nóng buổi tối, rà soát lại danh mục 30 mã VN50.',
      'Tối đầu tuần nhẹ nhàng, lên sẵn kịch bản hành động cho phiên Thứ Ba.',
      'NAV đầu tuần tăng trưởng tốt, ngủ ngon để giữ tinh thần sảng khoái.',
      'Thư giãn tối Thứ Hai cùng Capy, không fomo không hoang mang.'
    ],
    dem: [
      'Đêm Thứ Hai thanh tĩnh, tắt máy đi ngủ để mai dậy sớm săn hàng nhé anh!',
      'Khò khò... Capy chúc anh L7Sea ngủ ngon, mơ thấy bảng điện tím trần.',
      'Đêm muộn đầu tuần, giữ sức khỏe là chìa khóa đầu tư bền vững nhất.',
      'Khép lại ngày Thứ 2 trọn vẹn, chúc anh giấc ngủ thật an lành.'
    ]
  },

  // ══ THỨ 3: TĂNG TỐC & BẮT NHỊP ══
  t3: {
    rang: [
      'Rạng sáng Thứ Ba, không khí trong lành, tinh thần minh mẫn!',
      'Sớm Thứ 3: Đọc lướt qua chỉ số Dow Jones và giá dầu thế giới.',
      'Chuẩn bị sẵn sàng cho phiên giao dịch Thứ Ba đầy kịch tính.',
      'Sáng sớm tĩnh lặng là lúc đầu óc phân tích chuẩn xác nhất.'
    ],
    sang: [
      'Chào Thứ Ba! Hôm nay tiếp tục đà hưng phấn vượt kháng cự nhé!',
      '09:15 Thứ 3: Theo dõi sát dòng tiền nhóm Ngân hàng và Thép.',
      'Sáng Thứ Ba tràn đầy tự tin, đúng điểm mua chuẩn phương pháp là vào lệnh.',
      'Cà phê sáng Thứ Ba, chúc danh mục của anh L7Sea tăng trưởng vượt bậc!'
    ],
    trua: [
      'Trưa Thứ Ba rồi, thưởng thức bữa trưa ngon lành thôi anh ơi!',
      'Nghỉ ngơi nạp lại năng lượng, chiều nay 14h00 thị trường sẽ rất sôi động.',
      'Vừa ăn cơm vừa chill với Capy, không cần dán mắt vào bảng điện liên tục.'
    ],
    chieu: [
      'Phiên chiều Thứ Ba: Nhịp rung lắc mở ra cơ hội cơ cấu danh mục giá hời.',
      'Canh ATC Thứ Ba: Chốt lời từng phần nếu cổ phiếu đã chạm mục tiêu.',
      'Khép lại phiên Thứ Ba thành công, tài khoản ngày càng vững chắc!'
    ],
    toi: [
      'Tối Thứ Ba: Cập nhật dữ liệu tự doanh và khối ngoại mua bán ròng.',
      'Làm ly nước mát, kiểm tra lại tỷ lệ an toàn ký quỹ vốn tự có.',
      'Tối Thứ 3 an lành, chuẩn bị cho ngày giữa tuần quan trọng.'
    ],
    dem: [
      'Khuya Thứ Ba rồi, nghỉ ngơi thôi anh, mai là ngày T+2.5 hàng về!',
      'Capy đắp chăn đi ngủ đây, chúc sếp ngủ say không mộng mị.'
    ]
  },

  // ══ THỨ 4: GIỮA TUẦN HÀNG T+2.5 VỀ ══
  t4: {
    rang: [
      'Rạng sáng Thứ Tư giữa tuần, tâm thế vững vàng đón sóng mới!',
      'Sớm Thứ 4: Lô hàng mua phiên Thứ 2 hôm nay sẽ về tài khoản.',
      'Bình minh Thứ Tư tươi đẹp, chuẩn bị sẵn kế hoạch chốt lời T+2.5.'
    ],
    sang: [
      'Chào Thứ Tư giữa tuần! Hàng T+2.5 về tài khoản, chủ động vị thế nhé anh.',
      '09:00 Thứ 4: Quan sát lực hấp thụ cung chốt lời của thị trường.',
      'Sáng Thứ Tư nắng đẹp, chúc các mã chiến lược của anh bứt phá đỉnh cũ!'
    ],
    trua: [
      'Trưa Thứ Tư nghỉ ngơi thoải mái, buổi sáng dòng tiền hấp thụ rất tốt.',
      'Nghỉ trưa chút xíu, chiều nay hàng T+2.5 về tha hồ xử lý lệnh.',
      'Cơm trưa ấm cúng, tinh thần thoải mái gặt hái thành công.'
    ],
    chieu: [
      '14:00 Chiều Thứ Tư: Giờ cao điểm giao dịch T+2.5 bùng nổ!',
      'Canh ATC Thứ Tư: Quyết đoán chốt lãi theo đúng kỷ luật đề ra.',
      'Chúc mừng anh L7Sea đã hiện thực hóa lợi nhuận phiên giữa tuần!'
    ],
    toi: [
      'Tối Thứ Tư: Ghi chép cẩn thận các giao dịch thành công vào sổ CKV PRO.',
      'Xem lại biểu đồ kỹ thuật và hiệu suất NAV sau phiên giữa tuần.',
      'Tối Thứ Tư thư thái, mọi việc đều đang đi đúng lộ trình.'
    ],
    dem: [
      'Đêm Thứ Tư yên bình, nghỉ ngơi lấy sức đón phiên đáo hạn Thứ Năm.',
      'Chúc anh L7Sea ngủ ngon, tái tạo năng lượng cho những quyết định lớn!'
    ]
  },

  // ══ THỨ 5: ĐÁO HẠN PHÁI SINH & TRANH CHẤP ══
  t5: {
    rang: [
      'Rạng sáng Thứ Năm: Ngày quan sát kỹ lưỡng các cổ phiếu trụ VN30.',
      'Sớm Thứ 5: Giữ tâm lý bình thản, không dao động trước các nhịp rung lắc ảo.',
      'Bình minh Thứ Năm, chuẩn bị kế hoạch quản trị rủi ro chặt chẽ.'
    ],
    sang: [
      'Chào Thứ Năm! Phiên giao dịch nhiều biến động, bình tĩnh quan sát bảng.',
      '09:00 Thứ 5: Nhóm trụ đang giằng co, cơ hội gom hàng cơ bản giá chiết khấu.',
      'Kiên định với chiến lược đầu tư giá trị, không bị cuốn theo tâm lý đám đông.'
    ],
    trua: [
      'Trưa Thứ Năm: Tạm gác biến động phái sinh, ăn trưa thư giãn nào anh!',
      'Uống ly trà thanh mát, giữ cái đầu lạnh cho phiên chiều kịch tính.',
      'Capy đội cam ngắm cảnh, chúc anh buổi trưa an lành.'
    ],
    chieu: [
      '14:15 Chiều Thứ Năm: Các đội tay to trả điểm, thị trường cân bằng trở lại.',
      'Khép phiên Thứ Năm an toàn, bảo vệ nguyên vẹn thành quả lợi nhuận!',
      'ATC Thứ Năm đầy cảm xúc, vị thế của anh vẫn giữ vững phong độ.'
    ],
    toi: [
      'Tối Thứ Năm: Thư thả soi lại bảng giá 52 mã VN50 sau nhịp rung lắc.',
      'Tổng kết tài sản, chuẩn bị cho phiên giao dịch cuối tuần Thứ Sáu.',
      'Tối Thứ Năm nhẹ nhàng, không khí gia đình ấm cúng.'
    ],
    dem: [
      'Khuya Thứ Năm rồi, chúc anh ngủ ngon để mai chốt sổ tuần rực rỡ!',
      'Capy chúc anh L7Sea giấc ngủ sâu và nhiều năng lượng tích cực.'
    ]
  },

  // ══ THỨ 6: CHỐT SỔ CUỐI TUẦN ══
  t6: {
    rang: [
      'Rạng sáng Thứ Sáu: Phiên giao dịch cuối cùng của tuần đã đến!',
      'Sớm Thứ 6: Đón chào ngày chốt sổ tuần với tâm thế tự tin nhất.',
      'Chuẩn bị sẵn sàng để thu hoạch trái ngọt cả tuần lao động.'
    ],
    sang: [
      'Chào Thứ Sáu cuối tuần! Chúc toàn bộ danh mục của anh bùng nổ sắc tím!',
      '09:00 Thứ 6: Phiên sáng tích cực, dòng tiền chốt tuần đổ vào mạnh mẽ.',
      'Cà phê sáng Thứ Sáu thật ngon, chuẩn bị hoàn tất các mục tiêu tuần.'
    ],
    trua: [
      'Trưa Thứ Sáu rồi! Ăn mừng nhẹ chuẩn bị đón 2 ngày nghỉ cuối tuần nào!',
      'Nghỉ trưa vui vẻ, chiều nay chốt phiên là có thể thảnh thơi xả hơi.',
      'Capy cầm miếng dưa hấu chúc anh bữa trưa Thứ Sáu tuyệt vời!'
    ],
    chieu: [
      '14:30 Chiều Thứ Sáu: Kéo nến tuần đóng cửa cao nhất tuần nào các anh lái!',
      'Khép lại tuần giao dịch thành công rực rỡ! Hoàn thành xuất sắc chỉ tiêu.',
      'Chúc mừng anh L7Sea đã kết thúc tuần làm việc với NAV tăng trưởng vững chắc!'
    ],
    toi: [
      'Tối Thứ Sáu: Cuối tuần rồi, gác lại bảng điện và tận hưởng niềm vui trọn vẹn!',
      'Làm bữa tối thịnh soạn ăn mừng thành quả đầu tư cả tuần.',
      'Tối Thứ 6 thảnh thơi, không lo nghĩ về giá cổ phiếu ngày mai.'
    ],
    dem: [
      'Đêm Thứ Sáu: Ngủ nướng không cần hẹn giờ báo thức luôn sếp ơi!',
      'Capy chúc anh một đêm cuối tuần thật êm đềm và hạnh phúc.'
    ]
  },

  // ══ THỨ 7: NGHỈ DƯỠNG & TÁI TẠO NĂNG LƯỢNG ══
  t7: {
    rang: [
      'Rạng sáng Thứ Bảy yên bình, ngủ thêm chút nữa cho đẫy giấc anh ơi!',
      'Sớm Thứ 7: Không có tiếng chuông ATO, tha hồ tận hưởng không khí trong lành.',
      'Chào bình minh cuối tuần đầy thư thái cùng Capy.'
    ],
    sang: [
      'Chào sáng Thứ Bảy! Cà phê sáng thong dong cùng bạn bè và người thân.',
      'Thứ Bảy không có bảng điện, tâm hồn nhẹ tênh như Capy ngâm suối khoáng.',
      'Chúc anh một ngày Thứ Bảy vui vẻ, tràn ngập tiếng cười và hạnh phúc!'
    ],
    trua: [
      'Trưa Thứ Bảy ăn uống thả ga, nạp lại 100% năng lượng sau tuần cày cuốc.',
      'Capy ngâm bồn Onsen đắp khăn vuông chúc anh bữa trưa sum vầy!',
      'Nghỉ trưa cuối tuần mát mẻ, thảnh thơi nghe bản nhạc yêu thích.'
    ],
    chieu: [
      'Chiều Thứ Bảy dạo phố, tập thể thao hoặc đi chơi giải tỏa căng thẳng.',
      'Gió chiều cuối tuần mát rượi, tận hưởng cuộc sống tươi đẹp!',
      'Capy cưỡi rùa đi dạo chúc sếp buổi chiều ngập tràn niềm vui.'
    ],
    toi: [
      'Tối Thứ Bảy ấm cúng bên gia đình, xem một bộ phim hay.',
      'Thư giãn tối cuối tuần, không stress, không áp lực số liệu.',
      'Capy thổi kèn Saxophone góp vui cho buổi tối Thứ Bảy của anh!'
    ],
    dem: [
      'Đêm Thứ Bảy ngủ thật ngon, mai là Chủ Nhật tha hồ nghỉ ngơi.',
      'Chúc anh L7Sea giấc ngủ êm đềm, ngập tràn giấc mơ đẹp.'
    ]
  },

  // ══ CHỦ NHẬT: THƯ THÁI & CHUẨN BỊ TUẦN MỚI ══
  cn: {
    rang: [
      'Rạng sáng Chủ Nhật: Tiếng chim hót ríu rít chào ngày mới an lành.',
      'Sớm Chủ Nhật trong trẻo, hít thở sâu tận hưởng trọn vẹn bình yên.',
      'Chào buổi sớm cuối tuần cùng bé Capy siêu chill!'
    ],
    sang: [
      'Chào sáng Chủ Nhật! Làm tách trà ấm, đọc vài trang sách tài chính yêu thích.',
      'Chủ Nhật thong thả rà soát lại vĩ mô và xu hướng tuần mới.',
      'Chúc anh L7Sea ngày Chủ Nhật ngập tràn năng lượng và bình an!'
    ],
    trua: [
      'Trưa Chủ Nhật thưởng thức bữa cơm ấm cúng bên gia đình.',
      'Capy ăn miếng bánh kem chúc anh một bữa trưa ngon miệng!',
      'Nghỉ trưa thảnh thơi, tái tạo trọn vẹn thể lực và trí lực.'
    ],
    chieu: [
      'Chiều Chủ Nhật: Dành chút thời gian ngắm lại đồ thị tuần các siêu cổ.',
      'Lên sẵn danh sách cổ phiếu theo dõi và chiến lược cho phiên Thứ Hai.',
      'Chuẩn bị kỹ lưỡng là bí quyết nắm chắc 80% phần thắng tuần mới.'
    ],
    toi: [
      'Tối Chủ Nhật: Mở app CKV PRO kiểm tra lại trạng thái tài khoản trước giờ G.',
      'Mọi kế hoạch đã sẵn sàng, tự tin bước vào tuần giao dịch mới đại thắng!',
      'Capy chúc anh buổi tối Chủ Nhật ấm áp, tâm thái đĩnh đạc tự tin.'
    ],
    dem: [
      'Đêm Chủ Nhật: Đi ngủ sớm để mai 08:30 sẵn sàng đón phiên ATO mở bát!',
      'Chúc anh L7Sea ngủ thật ngon, mai Thứ Hai danh mục lại tím lịm tìm sim!',
      'Capy chúc sếp ngủ say, sẵn sàng chinh phục mọi đỉnh cao tuần mới!'
    ]
  }
};

/**
 * Lấy câu thoại ngẫu nhiên theo đúng THỨ trong tuần và BUỔI trong ngày
 */
export function layThoaiTheoMaTran7Ngay(): string {
  const thu = layThuHienTai();
  const buoi = layBuoiHienTai();
  const danhSach = MA_TRAN_7_NGAY[thu]?.[buoi] ?? MA_TRAN_7_NGAY.t2.sang;
  return danhSach[Math.floor(Math.random() * danhSach.length)];
}
