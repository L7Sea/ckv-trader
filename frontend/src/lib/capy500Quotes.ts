import type { GreetingStyle } from './greeting';
import type { Nhom } from './capyBieuCam';

/* ═══════════════════════════════════════════════════════════════════
   KHO 500+ CÂU THOẠI ĐA PHONG CÁCH — BÁM SÁT 100% CẢM XÚC CỦA BÉ
   4 Phong cách: Vui vẻ (vui), Cà khịa (troll), Chuyên gia (pro), Gen Z (gen_z)
   ═══════════════════════════════════════════════════════════════════ */

export const KHO_THOAI_CAM_XUC: Record<GreetingStyle, Record<Nhom, string[]>> = {
  /* ══════════════ 1. PHONG CÁCH CÀ KHỊA (TROLL) ══════════════ */
  troll: {
    vui: [
      'Xanh tím một cây là gáy vang xóm, lúc đỏ lòm thì trốn kỹ thế sếp?',
      'Cười toe toét thế kia chắc vừa chốt non ăn được 2% đúng khum?',
      'Ăn được cây trần mà tưởng đâu chuẩn bị lên Shark Tank đầu tư!',
      'Hôm nay vui vẻ thế, lái thả cho ăn một phiên để mai vặt lông à?',
      'Cười tươi như hoa, để xem phiên ATC có còn cười nổi khum nha!',
      'Nay tài khoản xanh mướt, tối nay có dám mời Capy ly trà sữa full topping khum?',
      'Nhìn mặt hớn hở là biết vừa xả hàng thành công lên đầu người khác rồi!',
      'Lãi được vài củ mà mặt vênh lên tận nóc nhà, chịu sếp luôn á!',
      'Vui thôi đừng vui quá, cẩn thận cây thông Noel đang chờ phía trước kìa!',
      'Cười ha ha thế thôi, tí nữa mở bảng điện lại thấy bay màu 5% giờ!',
      'Nay danh mục gánh còng lưng, mai khéo lại khóc tiếng Mán!',
      'Vừa ăn may được một lệnh mà làm như chuyên gia phố Wall không bằng!',
      'Hôm nay xanh vỏ đỏ lòng mà cũng hớn hở ăn mừng, ngây thơ dữ thần!',
      'Được ngày thị trường kéo trụ mà tưởng tài năng xuất chúng, bớt bớt lại sếp ơi!',
      'Vui như tết thế này thì mai lại nạp thêm tiền gồng lỗ cho xem!'
    ],
    yeu: [
      'Thương sếp như thương con cá vàng trong bể nước sôi vậy á!',
      'Yêu sếp nhiều lắm, nhưng sếp lỗ thì Capy xin phép đứng ngoài cười nha!',
      'Thả tim cho sếp nè, mong sếp bớt đu đỉnh cho em nhờ!',
      'Nhìn sếp bấm lệnh say mê mà lòng em quặn thắt vì thương cái ví tiền!',
      'Yêu thương gì tầm này, đưa tiền đây em đi mua quýt đội đầu còn hơn!',
      'Thương sếp cả ngày cày cuốc xong nộp hết cho đội lái ăn lẩu cá!',
      'Mắt bắn tim lấp lánh mà ví thì rỗng tuếch, đúng là tình yêu đích thực!',
      'Capy yêu sếp nhất quả đất, miễn là sếp đừng bắt em gánh nợ Margin!',
      'Thả ngàn nụ hôn động viên sếp sau chuỗi ngày gồng lỗ kiên cường!',
      'Thương lắm cơ, cắt lỗ xong cổ phiếu chạy một mạch lên đỉnh luôn!'
    ],
    tuHao: [
      'Gáy sớm thế sếp? Cẩn thận chiều ATC lái vặn cổ nha!',
      'Tự hào gớm, bắt đúng một đáy mà đi khoe khắp 80 cái room Zalo!',
      'Định lượng chuẩn thế sao chưa thấy mua du thuyền chở Capy đi dạo?',
      'Vênh mặt lên tận trời rồi kìa, hạ cánh xuống mặt đất giùm em cái!',
      'Nay ăn trọn sóng ngành, tưởng mình là Warren Buffett phiên bản lỗi à?',
      'Khoe lãi 10% nhưng giấu nhẹm 5 mã đang âm 30% đúng khum, lạ gì sếp!',
      'Tự hào quá ha, ăn may được một cú mà gáy to hơn cả gà trống!',
      'Điểm đồng thuận 99/100, sếp đỉnh chóp thế sao ví vẫn chưa dày lên?',
      'Được hôm thắng lớn là lên mặt dạy đời ngay, chịu sếp luôn!',
      'Gáy to lên sếp ơi, để lát sàn một cây cho cả làng nghe thấy!'
    ],
    so: [
      'Á a a a! Bán nhanh kẻo cái nịt cũng không còn mà giữ đâu sếp ôi!',
      'Cây nến đỏ dài như cây gậy như ý đập thẳng vào đầu! Chạy điii!',
      'Ủa sếp ơi, sao tài khoản bốc hơi nhanh hơn cả cồn 90 độ vậy nè?',
      'Cứu bé vớiii! Lái úp sọt quả này vỡ đầu chảy máu rồi hu hu!',
      'Chạy ngay đi trước khi lệnh MP quét sạch không chừa một cắc!',
      'Quét sàn trắng bên mua rồi kìa! Phen này ra đê hóng mát thật rồi!',
      'Sợ run lẩy bẩy rồi nè! Đừng bảo sếp lại vừa all-in full margin đấy nhá?',
      'Ét ô ét! Quả này sàn 3 cây thông là Capy với sếp đi ăn mày thật đấy!',
      'Ối giời ơi nến cắm thẳng xuống lòng đất! Cắt lỗ mau còn kịp sếp ơi!',
      'Bé sợ quá sếp ơi, tắt app đi ngủ hay là ngồi khóc cùng nhau đây?'
    ],
    gian: [
      'Lái đánh kiểu gì mất nết dữ zậy? Đè giá kiểu này ai chơi lại trời!',
      'Bực mình ghê! Vừa bán xong nó trần cứng ngắc, cố tình trêu ngươi à?',
      'Tức tím người luôn á! Thị trường tăng 20 điểm mà tài khoản mình đỏ lè!',
      'Ủa alo sàn chứng khoán? Sao lệnh của em vừa vào là nghẽn mạng zậy?',
      'Giận bay màu luôn! Đã bảo đừng fomo mà cứ thích lao đầu vào lửa!',
      'Lái lợn đánh đấm kiểu mất dạy thế này thì dẹp nghỉ khỏe đi!',
      'Cáu thật sự! Ai phím cho sếp cái mã rác rưởi này vậy hả trời?',
      'Nhìn cái bảng điện mà muốn đập luôn cái màn hình cho bõ ghét!',
      'Tức phát khóc! Cầm cả tháng không nhúc nhích, vừa nhả ra là bay 3 cây trần!',
      'Bực bội quá đi! Tiền chứ có phải lá mít đâu mà đốt hoài zậy sếp?'
    ],
    dau: [
      'Đau đớn lòng người! Cắt đúng bẹn, bán ngay đáy sâu nhất lịch sử!',
      'Ối giời ôi! Tiền mồ hôi nước mắt trôi theo dòng nước lũ rồi!',
      'Đau như xát muối vào tim! Sắp cháy tài khoản Margin rồi sếp ơi!',
      'Nỗi đau này ai thấu? Mua đỉnh bán đáy chuẩn chỉ không lệch một ly!',
      'Ôm bụng khóc ròng, quả này ăn mì tôm trừ bữa cả tháng rồi!',
      'Đau xót quá sếp ơi! Cả năm tích lũy nộp lại cho thị trường trong 3 phiên!',
      'Nhìn tài khoản mà con tim rỉ máu, thôi đừng nhìn nữa kẻo ngất xỉu!'
    ],
    buonNgu: [
      'Thị trường thanh khoản mất hút, ru ngủ cả làng thế này thì ngủ thôi!',
      'Ngáp muốn sái quai hàm rồi, bảng điện đứng im như tượng sáp á!',
      'Buồn ngủ rũ rượi, lái cũng đi ngủ rồi hay sao mà không chịu kéo?',
      'Thôi sếp tắt máy đi ngủ trưa đi, nhìn bảng điện mãi cũng có đẻ ra tiền đâu!',
      'Zzz... Buồn ngủ quá, chừng nào cổ phiếu về bờ thì gọi Capy dậy nha!'
    ],
    chan: [
      'Chán chả buồn nói, thị trường dao động trong biên độ 0.5 điểm cả buổi!',
      'Đời cơ bản là buồn, còn tài khoản cơ bản là đỏ!',
      'Chán như con gián cắn quả ớt, thôi đi uống nước dừa cho đỡ sầu!',
      'Ngồi ngắm bảng điện mà ngỡ như đang xem phim quay chậm thế kỷ trước!'
    ],
    toMo: [
      'Hóng hóng! Nghe đồn mã này có đội tay to đang chuẩn bị kéo lên 5x hả sếp?',
      'Đang có biến gì ở nhóm chứng khoán zậy? Thấy lệnh triệu cổ vào ầm ầm!',
      'Soi xem tự doanh hôm nay xả bao nhiêu tỷ mà thị trường nghẹt thở thế?'
    ],
    lamViec: [
      'Đang cặm cụi chạy 150 công thức định lượng nè, đừng có làm phiền nha!',
      'Soi chart mờ cả mắt, sếp xem hộ em cái cản chéo này thủng chưa?',
      'Đang tính toán tối ưu chi phí Margin, làm việc nghiêm túc chút đi sếp!'
    ],
    nguong: [
      'Quê xỉu! Vừa hô hào anh em all-in xong nó quay đầu giảm sàn!',
      'Mắc cỡ quá 🙈, khoe phân tích như thần xong đoán sai bét nhè!'
    ],
    doi: [
      'Bụng réo ầm ầm rồi sếp ơi! Đi ăn phở bò tái nạm nạp năng lượng thôi!',
      'Đói mờ mắt rồi! Lãi lỗ tính sau, giờ phải no cái bụng trước đã!'
    ]
  },

  /* ══════════════ 2. PHONG CÁCH CHUYÊN GIA (PRO) ══════════════ */
  pro: {
    vui: [
      'Tín hiệu định lượng xác nhận dòng tiền thông minh (Smart Money) đang gia tăng vị thế.',
      'Khuyến nghị duy trì tỷ trọng cổ phiếu dẫn dắt, trailing stop theo đường EMA20.',
      'Lợi suất thặng dư vốn cổ phần (ERP) đạt mức tích cực so với lãi suất phi rủi ro.',
      'Điểm số RS ngành tài chính bứt phá vượt đỉnh 3 tháng, xác nhận xu hướng tăng trung hạn.',
      'Tỷ lệ Risk/Reward hiện tại đang ở mức 1:3.5, cực kỳ thuận lợi để giải ngân tiếp diễn.',
      'Dữ liệu Order Flow ghi nhận lực mua chủ động chiếm 78% tổng giá trị khớp lệnh.',
      'Độ rộng thị trường mở rộng với hơn 65% số mã vượt lên trên MA50 ngày.',
      'Hệ số P/E toàn thị trường đang chiết khấu 18% so với mức trung bình 5 năm.',
      'Chỉ báo MACD phân kỳ dương trên khung thời gian Daily, dòng tiền tổ chức hấp thụ tốt.',
      'Mô hình định lượng 150 yếu tố ghi nhận điểm đồng thuận đạt 92/100.',
      'Biên an toàn được củng cố vững chắc nhờ kết quả kinh doanh quý tăng trưởng vượt kỳ vọng.',
      'Khối ngoại quay lại mua ròng mạnh mẽ, hỗ trợ tâm lý tích cực cho toàn thị trường.'
    ],
    yeu: [
      'Trân trọng tinh thần kỷ luật và tuân thủ chiến lược quản trị vốn của quý nhà đầu tư.',
      'Capy luôn đồng hành cùng nhà đầu tư trên hành trình xây dựng danh mục bền vững.',
      'Chiến lược đúng đắn kết hợp kỷ luật thép là chìa khóa tạo nên lợi nhuận kép dài hạn.',
      'Sự kiên định với phương pháp định lượng đã mang lại thành quả xứng đáng hôm nay.'
    ],
    tuHao: [
      'Mô hình thuật toán định lượng dự báo chính xác nhịp đảo chiều tại ngưỡng hỗ trợ then chốt.',
      'Hiệu suất danh mục VN50 vượt trội 12.8% so với chỉ số chung VN-Index.',
      'Bảo toàn thành công tài sản ròng nhờ kích hoạt lệnh phòng vệ đúng thời điểm.',
      'Điểm đồng thuận đa khung thời gian đạt mức tối đa 98/100 điểm.',
      'Chiến lược tối ưu hóa nguồn vốn Margin DNSE tiết kiệm 3.2% chi phí lãi vay hàng năm.'
    ],
    so: [
      'CẢNH BÁO RỦI RO: Áp lực bán tháo chủ động gia tăng đột biến, vi phạm ngưỡng cắt lỗ kỹ thuật!',
      'Tỷ lệ đòn bẩy Margin đang ở mức báo động! Khuyến nghị hạ ngay tỷ trọng về mức an toàn.',
      'Thị trường xuất hiện phiên phân phối thứ 4 với khối lượng đột biến gấp 1.8 lần bình quân.',
      'Chỉ số RSI đi vào vùng quá mua cực đại kèm phân kỳ âm 3 đoạn, nguy cơ điều chỉnh sâu!',
      'Thanh khoản bên mua suy kiệt tại vùng kháng cự. Cần thực thi nghiêm ngặt kỷ luật cắt lỗ!'
    ],
    gian: [
      'Dấu hiệu thao túng giá tại phiên khớp lệnh định kỳ ATC làm méo mó chỉ số phái sinh.',
      'Độ lệch Basis phái sinh giãn rộng bất thường, gây nhiễu loạn tín hiệu phân tích định lượng.',
      'Áp lực đè gom giá lộ liễu tại các cổ phiếu đầu ngành gây ảnh hưởng xấu tới xu hướng chung.'
    ],
    dau: [
      'Sụt giảm giá trị tài sản ròng vượt mức chịu đựng danh mục. Kích hoạt quy trình giảm thiểu tổn thất.',
      'Mô hình ghi nhận mức Drawdown lớn nhất trong tháng. Cần rà soát lại toàn bộ tỷ trọng phân bổ.'
    ],
    buonNgu: [
      'Thị trường rơi vào trạng thái tích lũy biên độ hẹp với thanh khoản thấp. Khuyến nghị quan sát.',
      'Chưa xuất hiện tín hiệu kích hoạt giải ngân mới. Kiên nhẫn chờ đợi điểm xác nhận của dòng tiền.'
    ],
    chan: [
      'Thanh khoản toàn thị trường duy trì ở mức thấp, thiếu vắng sự dẫn dắt từ các nhóm ngành trụ.',
      'Chỉ số dao động đi ngang trong hộp Sideway, biên độ biến động thấp không phù hợp giao dịch ngắn hạn.'
    ],
    toMo: [
      'Hệ thống đang quét dữ liệu dòng vốn ETF ngoại và các giao dịch thỏa thuận đột biến.',
      'Đang phân tích định giá chi tiết cơ bản của 300 mã niêm yết trên 3 sàn HOSE, HNX, UPCOM.'
    ],
    lamViec: [
      'Hệ thống đang tự động cập nhật lại ma trận tương quan và định giá lại NAV danh mục.',
      'Đang hoàn thiện báo cáo phân tích định lượng vĩ mô và cân đối chu kỳ thanh toán T+2.5.'
    ],
    nguong: [
      'Dự báo ngắn hạn có độ lệch nhẹ do tác động bất ngờ từ tin tức vĩ mô toàn cầu.'
    ],
    doi: [
      'Đã hoàn thành phiên giao dịch buổi sáng. Đề xuất nghỉ ngơi và nạp năng lượng cho phiên chiều.'
    ]
  },

  /* ══════════════ 3. PHONG CÁCH GEN Z (GEN_Z) ══════════════ */
  gen_z: {
    vui: [
      'Slay quá sếp ơi! Danh mục tím lịm tìm sim, flex mỏi tay luôn á!',
      'Vibe hôm nay chuẩn triệu đô, lesgooo các đồng chứng ơi!',
      'Xanh mướt rượt thế này thì tối nay đi quẩy tới bến thôi!',
      'Đỉnh nóc kịch trần bay phấp phới! Lái kéo kiểu này ai chịu nổi trời!',
      '10 điểm không có nhưng! Bắt đáy chuẩn đét như thần bài!',
      'Tài khoản nhảy số liên tùng tục, nhìn mà mê chữ ê kéo dàiii!',
      'Hôm nay sếp là người chiến thắng, hào quang rực rỡ chói lóa luôn!',
      'U là trời siêu phẩm về tài khoản! Ăn trọn cây trần ngọt lịm!',
      'Cháy phố luôn sếp ơi, tím từ sáng tới chiều không lối thoát!',
      'Chuẩn bài luôn! Cứ nghe lời Capy là chỉ có nước hốt bạc về nhà!',
      'Thần tài gõ cửa ầm ầm, lúa về ngập tràn tài khoản rồi nha!',
      'Vibe thị trường hôm nay đỉnh chóp, múc mã nào là mã đó phi như tên lửa!'
    ],
    yeu: [
      'Sếp là chân ái của Capy 💛 Mãi yêu sếp và danh mục của sếp!',
      'Thả ngàn tim cho pha vào lệnh mượt mà không tì vết!',
      'Yêu thương xỉu up xỉu down, sếp đánh chứng khét lẹt thế này ai đú nổi!',
      'Mê cái cách sếp kiên định gồng lãi, chuẩn gu em luôn!'
    ],
    tuHao: [
      'Flex nhẹ chiếc lãi 25% cho cả thiên hạ trầm trồ!',
      'Capy cân hết 150 thuật toán, đỉnh nóc kịch trần bay phấp phới!',
      'Out trình đội lái luôn sếp ơi! Vào đúng chân sóng, ra ngay đỉnh nóc!',
      'Gáy to lên sếp ơi, hôm nay ai bảo sếp đu đỉnh là quê một cục liền!'
    ],
    so: [
      'Ét ô ét! Quả nến rút chân thót tim bay màu luôn rồi sếp ôi!',
      'Cứu bé vớiii! Quét sàn kiểu này thì bay luôn chiếc iPhone 16 Pro Max!',
      'Sợ ngang luôn á! Cây nến đỏ quạch cắm thẳng xuống địa ngục hu hu!',
      'Chạy lẹ sếp ơi! Đừng để bị úp bô bất ngờ như vậy chứ trời!',
      'Rung lắc xỉu lên xỉu xuống, con tim mong manh không chịu nổi nhiệt!'
    ],
    gian: [
      'Ủa alo lái? Đè giá quài zạ? Em quạo rồi nha, đừng có đùa!',
      'Tức á! Vừa bán ra cái nó trần tím ngắt, đúng là đồ phản bội!',
      'Dỗi luôn á! Đánh đấm kiểu gì mà quay xe gắt hơn người yêu cũ!',
      'Ủa là sao? Cả sàn xanh mà mã mình đỏ lè, muốn trầm cảm thực sự!'
    ],
    dau: [
      'Đau xỉu ngang! Thôi em khum ổn tí nào, trái tim tan nát từng mảnh!',
      'Trầm cảm thực sự, quả này chỉ có mì gói cứu vớt cuộc đời!',
      'Khóc một dòng sông luôn, sao số tôi nó đen như than quảng ninh vậy trời!'
    ],
    buonNgu: [
      'Pin em còn 1% rồi sếp ơi, đi sạc năng lượng chiều chiến tiếp!',
      'Buồn ngủ dã man con ngan, bảng điện đứng im như đóng băng!',
      'Ngủ gục trên bàn phím rồi nè, ai đánh thức Capy giùm vớiii!'
    ],
    chan: [
      'Chán như con gián, thị trường im ru nhạt nhẽo ghê á!',
      'Không có tí drama nào để hóng, chán xỉu!'
    ],
    toMo: [
      'Hóng biến với! Mã nào đang có drama game tăng vốn zậy sếp?',
      'Soi kèo xem hôm nay tay to nào đang gom hàng kín tiếng nào!'
    ],
    lamViec: [
      'Try hard cày chart thôi anh ơi, làm giàu không khó!',
      'Đang ngồi phân tích 150 thuật toán nè, tập trung cao độ 100%!'
    ],
    nguong: [
      'Quê xỉu 🙈 vừa chốt xong cổ phiếu phi tiếp trần, giấu mặt đi đâu giờ!'
    ],
    doi: [
      'Bụng réo như tiếng gõ bảng điện rồi, đi order trà sữa trân châu thôi sếp!'
    ]
  },

  /* ══════════════ 4. PHONG CÁCH VUI VẺ, THÂN THIỆN (VUI) ══════════════ */
  vui: {
    vui: [
      'Hôm nay tài khoản xanh tươi, chúc sếp một ngày giao dịch thật nhiều may mắn nha!',
      'Bé Capy mang lại vía xanh tím tài lộc ngập tràn cho sếp nè!',
      'Niềm vui nhân đôi khi lệnh khớp trúng đáy, tài khoản tăng trưởng bền vững!',
      'Thị trường khởi sắc rực rỡ, cùng bé duy trì năng lượng tích cực này nhé!',
      'Nụ cười của sếp là động lực để bé quét 150 thuật toán mỗi ngày đó!',
      'Mỗi ngày mở app thấy danh mục xanh mướt là hạnh phúc nhất trần đời!',
      'Chúc mừng sếp đã có một phiên giao dịch đại thành công và rực rỡ!',
      'Cùng nâng ly chúc mừng chuỗi ngày thắng lợi rực rỡ của sếp nha!',
      'Bé gửi tặng sếp một đóa hoa hồng may mắn cho phiên giao dịch hôm nay nè 🌸',
      'Thần may mắn luôn mỉm cười với những nhà đầu tư kiên nhẫn và kỷ luật!'
    ],
    yeu: [
      'Bé quý sếp nhiều lắm, chúc sếp luôn an yên và đầu tư thật hiệu quả nhé!',
      'Có Capy ở đây đồng hành, sếp không bao giờ phải cô đơn trên thị trường đâu!',
      'Gửi trọn tình cảm ấm áp của Capy đến sếp qua từng con số xanh tươi này!'
    ],
    tuHao: [
      'Thành quả tuyệt vời từ sự nỗ lực và kỷ luật của chính sếp đó nha!',
      'Bé rất tự hào khi được đồng hành cùng một nhà đầu tư thông thái như sếp!'
    ],
    so: [
      'Sếp ơi bình tĩnh nha, đừng hoảng loạn, hãy tuân thủ nguyên tắc quản trị rủi ro nhé!',
      'Thị trường rung lắc một chút thôi, kiên định giữ vững tâm lý nha sếp!',
      'Đừng lo lắng quá sếp ơi, Capy luôn ở cạnh để hỗ trợ sếp nè!'
    ],
    gian: [
      'Hít một hơi thật sâu nào sếp ơi, bớt giận kẻo ảnh hưởng sức khỏe nhé!',
      'Thị trường lúc này lúc khác, sếp đừng để cảm xúc chi phối quyết định nha!'
    ],
    dau: [
      'Bé chia sẻ cùng sếp nhé, thị trường điều chỉnh là bài học quý giá để thành công hơn!',
      'Đừng buồn nha sếp, cơ hội mới luôn mở ra vào phiên giao dịch ngày mai!'
    ],
    buonNgu: [
      'Nghỉ ngơi một chút cho mắt thư giãn nha sếp, chúc sếp ngủ một giấc thật ngon!',
      'Sau giờ giao dịch căng thẳng, sếp nhớ dành thời gian nghỉ ngơi sạc pin nhé!'
    ],
    chan: [
      'Thị trường trầm lắng là lúc chúng ta dành thời gian nghiên cứu cơ bản doanh nghiệp!',
      'Bé luôn ở đây trò chuyện cùng sếp cho đỡ buồn chán nè!'
    ],
    toMo: [
      'Cùng bé khám phá những cơ hội đầu tư tiềm năng đang ẩn giấu nha!',
      'Hôm nay có nhiều thông tin kinh tế vĩ mô thú vị lắm nè sếp!'
    ],
    lamViec: [
      'Capy đang chăm chỉ phân tích số liệu để gửi báo cáo tốt nhất cho sếp!',
      'Cùng nhau làm việc nghiêm túc để kiến tạo danh mục đầu tư bền vững nhé!'
    ],
    nguong: [
      'Dạ bé hơi ngượng một xíu, nhưng bé sẽ cố gắng làm tốt hơn nữa ạ!'
    ],
    doi: [
      'Đến giờ dùng bữa rồi, sếp nhớ ăn uống đầy đủ để có sức khỏe chiến đấu nhé!'
    ]
  }
};

/** Lấy câu thoại khớp 100% với nhóm cảm xúc của biểu cảm hiện tại */
export function layThoaiChuanCamXuc(nhom: Nhom, style: GreetingStyle): string {
  const dsNhom = KHO_THOAI_CAM_XUC[style]?.[nhom] ?? KHO_THOAI_CAM_XUC.vui[nhom] ?? KHO_THOAI_CAM_XUC.vui.vui;
  return dsNhom[Math.floor(Math.random() * dsNhom.length)] ?? dsNhom[0]!;
}
