import type { GreetingStyle } from './greeting';

/* ═══════════════════════════════════════════════════════════════
   MA TRẬN ĐẦY ĐỦ: 4 PHONG CÁCH × 7 NGÀY × 6 BUỔI (168 Ô THOẠI ĐỘC BẢN)
   
   • 4 Phong cách: Vui vẻ (vui) · Troll/Cà khịa (troll) · Chuyên gia (pro) · Gen Z (gen_z)
   • 7 Ngày: Thứ 2 (t2) -> Chủ Nhật (cn)
   • 6 Buổi: Rạng sáng (rang) · Sáng (sang) · Trưa (trua) · Chiều (chieu) · Tối (toi) · Đêm (dem)
   ═══════════════════════════════════════════════════════════════ */

export type ThuTrongTuan = 't2' | 't3' | 't4' | 't5' | 't6' | 't7' | 'cn';
export type BuoiTrongNgay = 'rang' | 'sang' | 'trua' | 'chieu' | 'toi' | 'dem';

export function layThuHienTai(d = new Date()): ThuTrongTuan {
  const day = d.getDay();
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

export const FULL_MATRIX_4x7x6: Record<GreetingStyle, Record<ThuTrongTuan, Record<BuoiTrongNgay, string[]>>> = {
  // ═══════════════ 1. PHONG CÁCH VUI VẺ (VUI) ═══════════════
  vui: {
    t2: {
      rang: ['Thứ 2 rạng sáng rồi, anh L7Sea chuẩn bị mở bát tuần mới rực rỡ nhé!', 'Bình minh đầu tuần tinh khôi, chúc danh mục tuần này tím lịm!'],
      sang: ['Thứ 2 mở phiên ATO: Sắc tím ngập tràn cả rổ VN50 nào sếp ơi!', 'Chào Thứ 2 đầu tuần! Cà phê sáng thơm nồng đón sóng tăng!'],
      trua: ['Khép phiên sáng Thứ 2, ăn trưa no nê lấy sức chiều bùng nổ!', 'Trưa Thứ 2 nghỉ ngơi thảnh thơi cùng Capy ngâm bồn nhé anh.'],
      chieu: ['14:00 Chiều Thứ 2: Khung giờ vàng đón nhịp kéo ATC tăng vọt!', 'Khép phiên Thứ 2 rực rỡ, khởi đầu một tuần đầy thuận lợi!'],
      toi: ['Tối Thứ 2: Thong thả mở sổ CKV tổng kết lại diễn biến ngày mở bát.', 'Uống ngụm trà nóng buổi tối, rà soát lại danh mục chiến lược.'],
      dem: ['Đêm Thứ 2 thanh tĩnh, chúc anh L7Sea ngủ ngon mơ thấy siêu cổ!', 'Khò khò... mai Thứ 3 danh mục lại tiếp tục tăng tốc.']
    },
    t3: {
      rang: ['Rạng sáng Thứ 3, không khí trong lành, tinh thần minh mẫn!', 'Sớm Thứ 3: Đón nhịp tăng tốc của các mã dẫn dắt.'],
      sang: ['Chào Thứ 3! Hôm nay tiếp tục đà hưng phấn vượt kháng cự nhé!', '09:00 Thứ 3: Dòng tiền luân chuyển tích cực qua nhóm Ngân hàng.'],
      trua: ['Trưa Thứ 3 rồi, thưởng thức bữa cơm ấm cúng thôi anh!', 'Nghỉ ngơi nạp năng lượng chờ phiên chiều 14h00 sôi động.'],
      chieu: ['Phiên chiều Thứ 3: Cơ cấu danh mục gom thêm hàng giá hời.', 'Khép lại phiên Thứ 3 thành công, tài sản ròng ngày càng nở hoa!'],
      toi: ['Tối Thứ 3: Cập nhật dữ liệu khối ngoại mua ròng tích cực.', 'Thư giãn tối Thứ 3, chuẩn bị cho ngày giữa tuần quan trọng.'],
      dem: ['Khuya Thứ 3 rồi, nghỉ ngơi thôi anh, mai hàng T+2.5 về tài khoản!', 'Capy đắp chăn chúc sếp ngủ say không mộng mị.']
    },
    t4: {
      rang: ['Rạng sáng Thứ 4 giữa tuần, tâm thế vững vàng đón sóng mới!', 'Bình minh Thứ 4 tươi đẹp, chuẩn bị sẵn kế hoạch chốt lời T+2.5.'],
      sang: ['Chào Thứ 4 giữa tuần! Hàng T+2.5 về, chủ động vị thế nhé anh.', 'Sáng Thứ 4 chúc các mã chiến lược của anh bứt phá đỉnh cũ!'],
      trua: ['Trưa Thứ 4 nghỉ ngơi thoải mái, buổi sáng dòng tiền hấp thụ rất tốt.', 'Cơm trưa ấm cúng, tinh thần thoải mái gặt hái thành công.'],
      chieu: ['14:00 Chiều Thứ 4: Giờ cao điểm giao dịch T+2.5 bùng nổ!', 'Chúc mừng anh L7Sea đã hiện thực hóa lợi nhuận phiên giữa tuần!'],
      toi: ['Tối Thứ 4: Ghi chép cẩn thận các giao dịch thành công vào sổ CKV.', 'Xem lại biểu đồ kỹ thuật và hiệu suất NAV sau phiên giữa tuần.'],
      dem: ['Đêm Thứ 4 yên bình, chúc anh ngủ ngon chuẩn bị phiên Thứ 5.', 'Capy chúc anh L7Sea giấc ngủ sâu và nhiều năng lượng.']
    },
    t5: {
      rang: ['Rạng sáng Thứ 5: Giữ tâm lý vững vàng trước phiên biến động.', 'Bình minh Thứ 5, chuẩn bị kế hoạch quản trị rủi ro chặt chẽ.'],
      sang: ['Chào Thứ 5! Phiên giao dịch nhiều cơ hội gom hàng cơ bản.', '09:00 Thứ 5: Nhóm trụ giằng co mở ra vùng giá chiết khấu đẹp.'],
      trua: ['Trưa Thứ 5: Tạm gác biến động, ăn trưa thư giãn nào anh!', 'Uống ly trà thanh mát, giữ tinh thần sảng khoái cho phiên chiều.'],
      chieu: ['14:15 Chiều Thứ 5: Thị trường cân bằng, kéo điểm tăng trở lại.', 'ATC Thứ 5 đầy cảm xúc, vị thế của anh vẫn giữ vững phong độ!'],
      toi: ['Tối Thứ 5: Thư thả soi lại 150 thuật toán & danh mục VN50 sau phiên.', 'Tổng kết tài sản, chuẩn bị cho phiên giao dịch cuối tuần Thứ 6.'],
      dem: ['Khuya Thứ 5 rồi, chúc anh ngủ ngon để mai chốt sổ tuần rực rỡ!', 'Capy chúc anh L7Sea giấc ngủ êm đềm và an lành.']
    },
    t6: {
      rang: ['Rạng sáng Thứ 6: Phiên giao dịch cuối cùng của tuần đã đến!', 'Đón chào ngày chốt sổ tuần với tâm thế tự tin nhất.'],
      sang: ['Chào Thứ 6 cuối tuần! Chúc toàn bộ danh mục của anh bùng nổ sắc tím!', 'Cà phê sáng Thứ 6 thật ngon, hoàn tất các mục tiêu tuần.'],
      trua: ['Trưa Thứ 6 rồi! Ăn mừng nhẹ chuẩn bị đón 2 ngày nghỉ cuối tuần!', 'Capy cầm miếng dưa hấu chúc anh bữa trưa tuyệt vời!'],
      chieu: ['14:30 Chiều Thứ 6: Kéo nến tuần đóng cửa cao nhất tuần rực rỡ!', 'Chúc mừng anh L7Sea đã kết thúc tuần với NAV tăng trưởng vững chắc!'],
      toi: ['Tối Thứ 6: Cuối tuần rồi, gác lại bảng điện và tận hưởng niềm vui!', 'Làm bữa tối thịnh soạn ăn mừng thành quả đầu tư cả tuần.'],
      dem: ['Đêm Thứ 6: Ngủ nướng không cần báo thức luôn sếp ơi!', 'Capy chúc anh một đêm cuối tuần thật êm đềm và hạnh phúc.']
    },
    t7: {
      rang: ['Rạng sáng Thứ 7 yên bình, ngủ thêm chút nữa cho đẫy giấc anh ơi!', 'Chào bình minh cuối tuần đầy thư thái cùng Capy.'],
      sang: ['Chào sáng Thứ 7! Cà phê sáng thong dong cùng bạn bè và người thân.', 'Thứ 7 không có bảng điện, tâm hồn nhẹ tênh như Capy ngâm suối khoáng.'],
      trua: ['Trưa Thứ 7 ăn uống thả ga, nạp lại 100% năng lượng sau tuần cày cuốc.', 'Capy ngâm bồn Onsen đắp khăn vuông chúc anh bữa trưa sum vầy!'],
      chieu: ['Chiều Thứ 7 dạo phố, tập thể thao hoặc đi chơi giải tỏa căng thẳng.', 'Capy cưỡi rùa đi dạo chúc sếp buổi chiều ngập tràn niềm vui.'],
      toi: ['Tối Thứ 7 ấm cúng bên gia đình, xem một bộ phim hay.', 'Capy thổi kèn Saxophone góp vui cho buổi tối Thứ 7 của anh!'],
      dem: ['Đêm Thứ 7 ngủ thật ngon, mai là Chủ Nhật tha hồ nghỉ ngơi.', 'Chúc anh L7Sea giấc ngủ êm đềm, ngập tràn giấc mơ đẹp.']
    },
    cn: {
      rang: ['Rạng sáng Chủ Nhật: Tiếng chim hót ríu rít chào ngày mới an lành.', 'Chào buổi sớm cuối tuần cùng bé Capy siêu chill!'],
      sang: ['Chào sáng Chủ Nhật! Làm tách trà ấm, đọc vài trang sách tài chính.', 'Chủ Nhật thong thả rà soát lại vĩ mô và xu hướng tuần mới.'],
      trua: ['Trưa Chủ Nhật thưởng thức bữa cơm ấm cúng bên gia đình.', 'Nghỉ trưa thảnh thơi, tái tạo trọn vẹn thể lực và trí lực.'],
      chieu: ['Chiều Chủ Nhật: Dành chút thời gian ngắm lại đồ thị tuần các siêu cổ.', 'Chuẩn bị kỹ lưỡng là bí quyết nắm chắc 80% phần thắng tuần mới.'],
      toi: ['Tối Chủ Nhật: Mở app CKV kiểm tra lại trạng thái tài khoản trước giờ G.', 'Mọi kế hoạch đã sẵn sàng, tự tin bước vào tuần mới đại thắng!'],
      dem: ['Đêm Chủ Nhật: Đi ngủ sớm để mai 08:30 sẵn sàng đón ATO mở bát!', 'Chúc anh L7Sea ngủ thật ngon, mai Thứ 2 danh mục lại tím lịm!']
    }
  },

  // ═══════════════ 2. PHONG CÁCH TROLL / CÀ KHỊA (TROLL) ═══════════════
  troll: {
    t2: {
      rang: ['03:00 sáng Thứ 2 còn mở app? Định đặt lệnh ATO sớm cho đỡ lag à?', 'Sớm đầu tuần đã soi chart, tính bắt đáy hay lại sợ đu đỉnh vậy sếp?'],
      sang: ['Mở bát Thứ 2, hôm nay tính gồng lãi hay lại tiếp tục cưa chân bàn?', 'Sáng sớm ngắm bảng, nếu ngắm mà ra tiền thì anh giàu nhất xóm rồi!'],
      trua: ['Nghỉ trưa Thứ 2 đi anh, ngắm hoài lái có kéo trần thêm % nào đâu!', 'Ăn cơm trưa đi, đừng để mấy cây nến đỏ làm mất ngon!'],
      chieu: ['14:00 rồi kìa, giờ vàng lái ép hay lái kéo đây?', 'Canh ATC dữ quá, định múc thêm hay chuẩn bị chạy làng vậy sếp?'],
      toi: ['Tối Thứ 2 mà vẫn vào ngắm NAV, có nở thêm được đồng nào đâu!', 'Soi lịch sử lệnh thấy toàn mua đỉnh bán đáy vậy nè, kháy xíu thôi nha!'],
      dem: ['Khuya Thứ 2 rồi tắt máy đi ngủ đi anh, mai thị trường vẫn còn đó mà!']
    },
    t3: {
      rang: ['Rạng sáng Thứ 3 còn thức, tính canh sàn chứng khoán Mỹ hả sếp?', 'Ngủ đi anh ơi, thức đêm chỉ tổ bạc tóc chứ cổ phiếu chưa chạy đâu!'],
      sang: ['Thứ 3 lại vào ngắm bảng, hôm nay có fomo đua lệnh mã nào không đó?', 'Nhắc nhẹ: Đua lệnh giá xanh là chiều dễ ăn đòn của lái nha!'],
      trua: ['Ăn cơm trưa đi sếp, nhìn tài khoản hoài tiền nó có tự đẻ ra đâu!', 'Trưa Thứ 3 chill chill, đừng để bảng điện thao túng tâm lý!'],
      chieu: ['Chiều Thứ 3 rung lắc tí mà mặt xanh như tàu lá chuối rồi!', 'Đừng bán đúng đáy nha anh zai, bán xong lái kéo trần là khóc ròng đó!'],
      toi: ['Tối Thứ 3 lại bật app soi, mê CKV hơn mê người yêu rồi đúng không?', 'Xem báo cáo thấy lãi nhẹ, có mời Capy ly trà sữa không nào?'],
      dem: ['Khuya rồi, đi ngủ để não nghỉ ngơi mai còn chiến tiếp với lái sếp ơi!']
    },
    t4: {
      rang: ['Sớm Thứ 4: Hàng T+2.5 sắp về, run tay hay tự tin chốt lời đây?', 'Thức sớm làm gì, 9h bảng mới mở cửa mà sếp!'],
      sang: ['Thứ 4 hàng về tài khoản, xem anh L7Sea quyết đoán chốt hay ôm tiếp!', 'Đừng để lãi thành lỗ nha, bài học số 1 không bao giờ cũ!'],
      trua: ['Nghỉ trưa ăn dưa hấu đi, chiều nay 14h hàng về tha hồ rung lắc!', 'Capy ngâm bồn đây, anh không ăn trưa là chiều tụt huyết áp đó!'],
      chieu: ['14:15 hàng T+2.5 xả như lũ, anh đã kịp bấm nút chốt chưa?', 'Lái đánh khét quá, giữ chặt tay lái kẻo rớt hàng nha sếp!'],
      toi: ['Tối Thứ 4 tổng kết: Nay có chốt lời trúng đỉnh hay lại ôm mộng dài hạn?', 'Soi sổ lệnh thấy kỷ luật ghê ha, Capy chấm 9 điểm!'],
      dem: ['Đêm Thứ 4 ngủ ngon, đừng mơ thấy nến đỏ quét Stop Loss nha!']
    },
    t5: {
      rang: ['Thứ 5 đáo hạn phái sinh tới rồi, chuẩn bị mũ bảo hiểm chưa anh?', 'Sáng sớm tĩnh tâm, nay biến động lớn đừng để bị say sóng nha!'],
      sang: ['09:00 Thứ 5: Nhìn trụ giật cục đừng tưởng bở mà fomo nha sếp!', 'Đáo hạn phái sinh, các anh tay to múa may quay cuồng ghê lắm!'],
      trua: ['Ăn trưa no nê đi, chiều nay 14h20 các anh lái mới biểu diễn xiếc!', 'Uống ngụm trà hạ hỏa, đừng cay cú với thị trường!'],
      chieu: ['ATC Thứ 5 trả điểm chóng cả mặt, ai yếu tim là xỉu ngang!', 'Xong phiên đáo hạn rồi, tài khoản vẫn nguyên vẹn chứ sếp?'],
      toi: ['Tối Thứ 5 thở phào nhẹ nhõm, vượt qua tâm bão an toàn rồi nhé!', 'Mở app xem lại NAV, hú hồn chim én chưa!'],
      dem: ['Khuya Thứ 5 ngủ say, mai Thứ 6 chốt tuần nhẹ nhàng thôi!']
    },
    t6: {
      rang: ['Rạng sáng Thứ 6: Phiên cuối tuần rồi, chuẩn bị thu tiền về đi chơi!', 'Thức sớm đón phiên chốt nến tuần rực rỡ nào!'],
      sang: ['Thứ 6 chốt sổ: Nay lái kéo trần là anh có tiền đi nhậu cuối tuần!', 'Cà phê sáng Thứ 6, đừng để phiên cuối tuần bị úp sọt nha!'],
      trua: ['Trưa Thứ 6: Ăn cơm chuẩn bị tinh thần chiều nay đếm tiền lãi!', 'Nghỉ ngơi lấy sức chiều 14h30 xả hơi cuối tuần!'],
      chieu: ['14:30 chốt phiên tuần: Xong việc rồi, tắt bảng điện đi quẩy thôi anh!', 'Chúc mừng đã sống sót qua một tuần giao dịch đầy sóng gió!'],
      toi: ['Tối Thứ 6 không có bảng điện, mở CKV ra ngắm làm chi nữa sếp ơi!', 'Đi chơi với gia đình đi, Capy giữ nhà cho!'],
      dem: ['Đêm Thứ 6 ngủ xả láng, mai Thứ 7 ngủ tới trưa cũng không ai gọi!']
    },
    t7: {
      rang: ['Thứ 7 rồi mà mở app sớm thế? Nhớ bảng điện quá rồi à sếp?', 'Hôm nay sàn nghỉ giao dịch nha, ngủ tiếp đi anh!'],
      sang: ['Sáng Thứ 7 thong thả đi cà phê đi, ngồi soi chart hoài mòn màn hình!', 'Thứ 7 không có lệnh khớp đâu, xả hơi đi anh zai!'],
      trua: ['Trưa Thứ 7 ăn lẩu ăn nướng tưng bừng đi, tuần sau cày tiếp!', 'Capy tắm bồn đây, anh đi ăn gì ngon nhớ chừa phần em!'],
      chieu: ['Chiều Thứ 7 đi dạo phố giải tỏa stress, đừng nghĩ tới cổ phiếu nữa!', 'Gió mát trăng thanh, tận hưởng cuộc sống đi sếp!'],
      toi: ['Tối Thứ 7 đi quẩy thôi, mai Chủ Nhật tha hồ ngủ bù!', 'Capy chúc sếp tối Thứ 7 vui vẻ bên người thương!'],
      dem: ['Đêm Thứ 7 ngủ say, không cần bận tâm nến xanh nến đỏ!']
    },
    cn: {
      rang: ['Chủ Nhật trong lành, rạng sáng tĩnh lặng ngủ thêm chút đi anh!', 'Bình minh Chủ Nhật nhẹ nhàng, không tiếng chuông khớp lệnh.'],
      sang: ['Sáng Chủ Nhật uống cà phê ngắm phố, chuẩn bị tinh thần cho tuần mới.', 'Chủ Nhật thảnh thơi, lên sẵn kế hoạch Thứ 2 săn hàng hời.'],
      trua: ['Trưa Chủ Nhật sum vầy bên mâm cơm gia đình ấm áp.', 'Nạp đầy năng lượng để mai bắt đầu một tuần giao dịch mới!'],
      chieu: ['Chiều Chủ Nhật: Mở CKV PRO soi trước 150 thuật toán định lượng cho chắc cú.', 'Kế hoạch đã lên, mai Thứ 2 chỉ việc bấm nút theo kỷ luật.'],
      toi: ['Tối Chủ Nhật: Rà soát lại tỷ lệ margin và tài sản ròng trước giờ G.', 'Mai mở bát tuần mới, chúc sếp L7Sea bách chiến bách thắng!'],
      dem: ['Đêm Chủ Nhật: Tắt đèn đi ngủ sớm, 08:30 mai gặp lại ở ATO nha!']
    }
  },

  // ═══════════════ 3. PHONG CÁCH CHUYÊN GIA (PRO) ═══════════════
  pro: {
    t2: {
      rang: ['Chuẩn bị kế hoạch phân bổ vốn và vị thế cho tuần giao dịch mới.', 'Rà soát các mốc hỗ trợ và kháng cự then chốt của VN-Index.'],
      sang: ['Chào buổi sáng. Hệ thống T+2.5 sẵn sàng hỗ trợ ghi nhận vị thế.', '09:00 Thứ 2: Kiểm soát tâm lý ATO, tuân thủ nguyên tắc giải ngân từng phần.'],
      trua: ['Tổng kết phiên sáng Thứ 2: Dòng tiền phân hóa, duy trì tỷ trọng an toàn.', 'Tạm dừng giao dịch giờ nghỉ trưa theo đúng quy chuẩn quản trị.'],
      chieu: ['14:00 Chiều Thứ 2: Theo dõi sát biến động ATC và khối lượng khớp lệnh.', 'Khép phiên đầu tuần: Ghi nhận kết quả và rà soát lại tỷ lệ ký quỹ.'],
      toi: ['Tối Thứ 2: Đối chiếu số liệu tự doanh, khối ngoại và biến động vĩ mô.', 'Lưu trữ nhật ký giao dịch và thiết lập ngưỡng Stop Loss kỷ luật.'],
      dem: ['Đêm Thứ 2: Hệ thống đã bảo mật an toàn. Chúc nhà đầu tư nghỉ ngơi tốt.']
    },
    t3: {
      rang: ['Rạng sáng Thứ 3: Cập nhật chỉ số tương lai quốc tế và giá hàng hóa.', 'Duy trì kỷ luật đầu tư trước các biến động ngắn hạn.'],
      sang: ['Chào Thứ 3: Xác định nhóm ngành dẫn dắt dòng tiền thị trường.', 'Thực hiện lệnh mua khi giá tiệm cận đường trung bình MA20 vững chắc.'],
      trua: ['Trưa Thứ 3: Đánh giá thanh khoản phiên sáng và sức mạnh tương đối RSI.', 'Nghỉ ngơi theo lịch trình để đảm bảo sự tỉnh táo trong ra quyết định.'],
      chieu: ['Phiên chiều Thứ 3: Quan sát lực hấp thụ cung tại các vùng cản kỹ thuật.', 'Cân đối danh mục, bảo đảm tỷ lệ Lợi nhuận / Rủi ro R:R trên 2.0.'],
      toi: ['Tối Thứ 3: Rà soát dữ liệu tài chính doanh nghiệp và báo cáo phân tích.', 'Ghi nhận đầy đủ lý do chiến lược cho từng vị thế mở mới.'],
      dem: ['Khuya Thứ 3: Hệ thống sẵn sàng cho phiên giao dịch T+2.5 ngày mai.']
    },
    t4: {
      rang: ['Rạng sáng Thứ 4: Chuẩn bị phương án xử lý lô hàng T+2.5 về tài khoản.', 'Định giá lại vị thế nắm giữ theo các mô hình định lượng.'],
      sang: ['Chào Thứ 4 giữa tuần: Chủ động hiện thực hóa lợi nhuận khi chạm Target.', 'Quản trị rủi ro chặt chẽ, không gia tăng đòn bẩy khi chưa có xác nhận.'],
      trua: ['Trưa Thứ 4: Tổng kết thanh khoản phiên sáng và phân bổ dòng tiền.', 'Duy trì trạng thái cân bằng cho danh mục đầu tư.'],
      chieu: ['14:00 Thứ 4: Khối lượng giao dịch T+2.5 tăng cao, thực thi kế hoạch chốt lời.', 'Kết thúc phiên giữa tuần với kết quả tăng trưởng ổn định.'],
      toi: ['Tối Thứ 4: Đánh giá lại hiệu suất danh mục so với chỉ số chuẩn VN-Index.', 'Cập nhật sổ cái tài sản ròng và phân bổ tài sản.'],
      dem: ['Chúc nhà đầu tư L7Sea nghỉ ngơi tốt, chuẩn bị cho phiên Thứ 5.']
    },
    t5: {
      rang: ['Rạng sáng Thứ 5: Đánh giá tác động của phiên đáo hạn hợp đồng tương lai.', 'Giữ vững vị thế nắm giữ trung và dài hạn trước các nhiễu động giá.'],
      sang: ['Chào Thứ 5: Tập trung vào giá trị cốt lõi doanh nghiệp thay vì biến động ngắn.', 'Kiểm soát đòn bẩy Margin ở mức an toàn tuyệt đối.'],
      trua: ['Trưa Thứ 5: Đánh giá mức độ biến động của rổ chỉ số VN30.', 'Thời gian nghỉ trưa tái tạo năng lượng cho các quyết định chiến lược.'],
      chieu: ['14:15 Thứ 5: Theo dõi lực cân bằng của các quỹ và tổ chức lớn tại ATC.', 'Hoàn thành phiên giao dịch phái sinh an toàn, bảo vệ thành quả vốn.'],
      toi: ['Tối Thứ 5: Phân tích lại xu hướng trung hạn sau các nhịp rung lắc.', 'Thiết lập danh mục cho phiên chốt tuần Thứ 6.'],
      dem: ['Đêm Thứ 5: Chúc nhà đầu tư có giấc ngủ an lành và phục hồi thể lực.']
    },
    t6: {
      rang: ['Rạng sáng Thứ 6: Chuẩn bị tổng kết tuần giao dịch và rà soát vị thế.', 'Xác định các mục tiêu cốt lõi cho phiên đóng nến tuần.'],
      sang: ['Chào Thứ 6 cuối tuần: Thực thi kế hoạch chốt sổ tuần theo nguyên tắc.', 'Theo dõi sát diễn biến dòng tiền lớn trước kỳ nghỉ 2 ngày.'],
      trua: ['Trưa Thứ 6: Đánh giá tổng quan hiệu suất tuần và các mã dẫn sóng.', 'Nghỉ trưa hồi phục thể lực chuẩn bị phiên chiều.'],
      chieu: ['14:30 Thứ 6: Khép lại tuần giao dịch, xác nhận nến tuần tích cực.', 'Tổng kết tài sản ròng NAV tuần tăng trưởng đạt kỳ vọng.'],
      toi: ['Tối Thứ 6: Hoàn tất báo cáo phân tích hiệu suất và nhật ký giao dịch tuần.', 'Chúc nhà đầu tư kỳ nghỉ cuối tuần trọn vẹn và an yên.'],
      dem: ['Đêm Thứ 6: Toàn bộ dữ liệu sổ lệnh đã được mã hóa an toàn.']
    },
    t7: {
      rang: ['Rạng sáng Thứ 7: Thời gian nghỉ ngơi phục hồi sức khỏe thể chất.', 'Tận hưởng không gian tĩnh lặng ngày cuối tuần.'],
      sang: ['Chào sáng Thứ 7: Dành thời gian cho gia đình và tái tạo năng lượng.', 'Tách biệt công việc giao dịch để duy trì sự cân bằng cuộc sống.'],
      trua: ['Trưa Thứ 7: Thưởng thức bữa ăn dinh dưỡng và nghỉ ngơi hợp lý.', 'Tâm trí thư thái là nền tảng cho sự minh mẫn trong đầu tư.'],
      chieu: ['Chiều Thứ 7: Rèn luyện thể chất và thư giãn tinh thần.', 'Cân bằng giữa sức khỏe, gia đình và sự nghiệp tài chính.'],
      toi: ['Tối Thứ 7: Tận hưởng buổi tối ấm cúng cùng những người thân yêu.', 'Chúc nhà đầu tư một buổi tối cuối tuần tràn đầy năng lượng tích cực.'],
      dem: ['Đêm Thứ 7: Giấc ngủ sâu và an lành cho một tinh thần khỏe mạnh.']
    },
    cn: {
      rang: ['Rạng sáng Chủ Nhật: Chuẩn bị tư duy chiến lược cho tuần mới.', 'Không gian thanh tịnh để chiêm nghiệm các bài học thị trường.'],
      sang: ['Chào sáng Chủ Nhật: Đọc báo cáo kinh tế vĩ mô và phân tích ngành.', 'Lọc danh mục 150 thuật toán tìm kiếm cơ hội đầu tư giá trị.'],
      trua: ['Trưa Chủ Nhật: Bữa cơm ấm áp cùng gia đình ngày cuối tuần.', 'Duy trì năng lượng tích cực và sự tự tin đĩnh đạc.'],
      chieu: ['Chiều Chủ Nhật: Hoàn thiện kế hoạch giao dịch chi tiết cho tuần mới.', 'Xác định rõ ràng: Điểm Mua, Điểm Cắt Lỗ và Mục Tiêu Chốt Lời.'],
      toi: ['Tối Chủ Nhật: Kiểm tra lại các thiết lập tài khoản và chuẩn bị sẵn sàng.', 'Tự tin bước vào phiên mở bát Thứ 2 với tâm thế chủ động.'],
      dem: ['Đêm Chủ Nhật: Nghỉ ngơi sớm để bảo đảm sự tập trung cao độ ngày mai.']
    }
  },

  // ═══════════════ 4. PHONG CÁCH GEN Z (GEN_Z) ═══════════════
  gen_z: {
    t2: {
      rang: ['3AM grind Thứ 2! Check chart hunt siêu cổ xịn sò nè bestie!', 'Sớm đầu tuần năng lượng 100%, tuần này nhất định phải slay!'],
      sang: ['GM Thứ 2! Sáng nay all-in hay chill chill săn hàng tím? Lesgooo!', 'Mở bát đầu tuần cháy phố, danh mục tím lịm flex mỏi tay!'],
      trua: ['Lunch time Thứ 2! Ăn no nê lấy sức chiều combat với lái nha!', 'Trưa chill, NAV hôm nay đỉnh nóc kịch trần quá đi!'],
      chieu: ['Afternoon combat Thứ 2! Canh ATC flex lãi tưng bừng nào sếp ơi!', 'Khép phiên đầu tuần 10 điểm không có nhưng!'],
      toi: ['Tối Thứ 2 chill, mở app check NAV flex nhẹ với anh em!', 'Tối nay không fomo, bảo toàn vốn là chân ái!'],
      dem: ['Khuya rồi ngủ thôi bestie, mai dậy sớm hốt deal hời!']
    },
    t3: {
      rang: ['Sớm Thứ 3 thức dậy thấy đời đẹp như màu tím trần!', 'Vibe sáng Thứ 3 triệu đô, sẵn sàng bứt phá!'],
      sang: ['Chào Thứ 3! Hôm nay bank kéo là bay nóc luôn á sếp!', 'Đúng điểm mua là múc liền, không nói nhiều!'],
      trua: ['Ăn trưa đi nè, chiều nay lại bung lụa tiếp lo gì!', 'Trưa Thứ 3 uống trà sữa trân châu full topping!'],
      chieu: ['Chiều Thứ 3 quẩy banh nóc, tài khoản nở hoa tưng bừng!', 'ATC kéo nến đẹp xỉu, quá đỉnh anh L7Sea ơi!'],
      toi: ['Tối Thứ 3 check lại danh mục, đúng là hết nước chấm!', 'Thư giãn tối Thứ 3 cùng Capy siêu cute!'],
      dem: ['Ngủ thôi bestie ơi, mai săn hàng T+2.5 về tài khoản!']
    },
    t4: {
      rang: ['Sớm Thứ 4 giữa tuần, năng lượng tích cực ngập tràn!', 'Hàng T+2.5 về hôm nay, chuẩn bị flex lãi thôi!'],
      sang: ['Chào Thứ 4! Chốt lời không bao giờ sai nha bestie!', 'Sáng nay mã nào chạm target là bấm nút lụm tiền liền!'],
      trua: ['Nghỉ trưa Thứ 4, ăn no nê chiều nay đếm tiền mỏi tay!', 'Trưa chill cùng Capy, không áp lực!'],
      chieu: ['14:00 Thứ 4: Chốt lời bỏ túi, tiền tươi thóc thật là chân ái!', 'Chúc mừng sếp L7Sea chốt lời thành công rực rỡ!'],
      toi: ['Tối Thứ 4 flex nhẹ thành quả cả tuần, quá đã!', 'Ghi nhật ký lệnh xịn sò trên CKV PRO!'],
      dem: ['Đêm Thứ 4 ngủ ngon lành, mai chiến tiếp!']
    },
    t5: {
      rang: ['Sớm Thứ 5 đáo hạn: Đội mũ bảo hiểm vô rồi chiến nha sếp!', 'Tâm bất biến giữa dòng đời vạn biến!'],
      sang: ['Thứ 5 đáo hạn phái sinh, không fomo không hoang mang!', 'Bình tĩnh quan sát, cơ hội gom hàng rẻ là đây!'],
      trua: ['Trưa Thứ 5 ăn cơm nạp năng lượng, chiều combat tiếp!', 'Uống ngụm nước ép cho da dẻ hồng hào nha!'],
      chieu: ['ATC Thứ 5 trả điểm đẹp xỉu, vượt bão thành công!', 'Tài khoản vẫn xanh mướt, đỉnh của chóp!'],
      toi: ['Tối Thứ 5 thở phào nhẹ nhõm, quẩy nhẹ ăn mừng thôi!', 'Thư giãn tối Thứ 5 cùng Capy!'],
      dem: ['Khuya Thứ 5 ngủ say, mai chốt tuần hoành tráng!']
    },
    t6: {
      rang: ['Sớm Thứ 6: Phiên cuối tuần rồi, năng lượng bùng nổ!', 'Sẵn sàng chốt sổ tuần triệu đô!'],
      sang: ['Chào Thứ 6! Danh mục hôm nay tím lịm cho cuối tuần vui vẻ nào!', 'Cà phê sáng Thứ 6 thơm lừng!'],
      trua: ['Trưa Thứ 6: Ăn mừng tuần làm việc thành công xuất sắc!', 'Chiều nay chốt phiên là có thể đi chill rồi!'],
      chieu: ['14:30 chốt tuần: Slayyy! Nến tuần đóng đẹp như tranh vẽ!', 'Chúc mừng anh L7Sea đã hoàn thành xuất sắc tuần này!'],
      toi: ['Tối Thứ 6 đi quẩy thôi anh ơi, cuối tuần là để xả hơi!', 'Không bàn chuyện chứng khoán tối nay nữa, tận hưởng thôi!'],
      dem: ['Đêm Thứ 6 ngủ xả láng không lo báo thức!']
    },
    t7: {
      rang: ['Sáng Thứ 7 ngủ nướng đẫy giấc thôi bestie!', 'Không khí cuối tuần thanh bình nhẹ nhàng.'],
      sang: ['Chào sáng Thứ 7! Đi cà phê sống ảo cùng hội bạn thân nào!', 'Thứ 7 chill chill ngắm phố phường!'],
      trua: ['Trưa Thứ 7 ăn uống thả ga, tiệc tùng tưng bừng!', 'Capy tắm bồn Onsen chúc anh cuối tuần vui vẻ!'],
      chieu: ['Chiều Thứ 7 dạo phố shopping, giải tỏa 100% stress!', 'Tận hưởng từng khoảnh khắc tươi đẹp!'],
      toi: ['Tối Thứ 7 quẩy tung nóc hoặc xem phim ấm áp bên người yêu!', 'Capy thổi kèn Saxophone góp vui nè!'],
      dem: ['Đêm Thứ 7 ngủ ngon, mai Chủ Nhật tha hồ nghỉ dưỡng!']
    },
    cn: {
      rang: ['Sớm Chủ Nhật trong lành, hít thở sâu tận hưởng cuộc sống!', 'Chào bình minh Chủ Nhật cùng Capy siêu đáng yêu.'],
      sang: ['Sáng Chủ Nhật làm tách trà matcha thơm ngon, đọc sách chill chill!', 'Nạp lại 100% năng lượng chuẩn bị tuần mới.'],
      trua: ['Trưa Chủ Nhật ăn cơm gia đình ấm áp sum vầy!', 'Nghỉ trưa thảnh thơi nạp năng lượng.'],
      chieu: ['Chiều Chủ Nhật: Soi chart 150 thuật toán chuẩn bị săn siêu cổ Thứ 2!', 'Kế hoạch đã sẵn sàng, tuần mới lại slay tiếp!'],
      toi: ['Tối Chủ Nhật: Check lại app CKV PRO tự tin bước vào tuần mới!', 'Chúc sếp L7Sea tuần mới lại gom đầy tài lộc!'],
      dem: ['Đêm Chủ Nhật: Đi ngủ sớm mai 08:30 sẵn sàng combat ATO nha bestie!']
    }
  }
};

/**
 * Lấy câu thoại ngẫu nhiên theo đúng 4 phong cách x 7 ngày x 6 buổi (168 ô)
 */
export function layThoaiTheoMaTran4x7x6(style: GreetingStyle = 'vui'): string {
  const thu = layThuHienTai();
  const buoi = layBuoiHienTai();
  const ds = FULL_MATRIX_4x7x6[style]?.[thu]?.[buoi] ?? FULL_MATRIX_4x7x6.vui.t2.sang;
  return ds[Math.floor(Math.random() * ds.length)];
}
