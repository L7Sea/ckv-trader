import type { GreetingStyle } from './greeting';

/* ═══════════════════════════════════════════════════════════════════
   KHO CÂU THOẠI BẮN PHÁO GUNNY — PHÂN TẦNG THEO % LỰC & SỐ LẦN NẢY
   4 Phong cách: Cà khịa (troll), Chuyên gia (pro), Gen Z (gen_z), Vui vẻ (vui)
   4 Cấp độ: Hụt (<15%), Nhẹ (15-35%), Vừa (35-65%), Siêu đại bác (65-100%)
   ═══════════════════════════════════════════════════════════════════ */

export interface GunnyQuoteTier {
  hut: string[];   // < 15% lực: Chưa tới tường, rơi bịch xuống nước
  nhe: string[];   // 15% - 35% lực: Chạm nhẹ tường 1 lần
  vua: string[];   // 35% - 65% lực: Đập nảy tường 2-3 lần
  max: string[];   // 65% - 100% lực: Bắn siêu thanh đập nảy 4-6 lần
}

export const KHO_THOAI_GUNNY: Record<GreetingStyle, GunnyQuoteTier> = {
  /* ══════════════ 1. CÀ KHỊA (TROLL) ══════════════ */
  troll: {
    hut: [
      'Bắn yếu xìu chưa chạm mép màn hình đã rụng, lêu lêu đồ yếu sinh lý!',
      'Bắn gì như gãi ngứa cho muỗi vậy sếp? Chưa kịp đụng tường đã tắt thở!',
      'Lực này thì lêu lêu 😜, về tập gym thêm rồi hãy ra bắn nha sếp!',
      'Ủa bắn chưa dợ? Tưởng đâu chiếc lá rụng không á, lêu lêu!',
      'Yếu nhớt à! Chưa tới được góc tường đã rơi cái bịch, quê xỉu!'
    ],
    nhe: [
      'Chạm nhẹ tường cái kêu "Á", tuổi tôm đòi đọ với Capy à!',
      'Đụng có 1 phát mà làm như ghê gớm, tuổi gì đòi làm Capy đau!',
      'Cú bắn tuổi tôm! Đập tường nhẹ như bông gòn thế này thì còn phèn lắm!',
      'Hắt xì hơi một cái khéo còn bay mạnh hơn cú bắn này của sếp!',
      'Va tường có một phát đã đuối, tuổi gì làm khó được em!'
    ],
    vua: [
      'Nảy 3 phát rồi đó sếp, đỡ hơn tí rồi nhưng vẫn chưa đỗ trạng nguyên đâu nha!',
      'Đập tường rầm rầm mà chưa lủng tường, kéo mạnh nữa lên sếp ơi!',
      'Có tiến bộ đó sếp, nhưng còn lâu mới đọ lại trình bắn súng nước của em!',
      'Nảy tưng tưng như cá mắc cạn, nhìn cũng tàm tạm đấy!',
      'Đập tường 3 nhát rồi đó, ráng thêm tí nữa cho vỡ đầu em luôn đi sếp!'
    ],
    max: [
      'Á a a a a! Sếp định ám sát em hay gì? Đập 6 phát nát cả mặt tiền rồi!',
      'Bắn như sấm sét, vỡ tường nứt gạch sếp đền tiền đi nha hu hu!',
      'Khiếp vía! Lực 100% làm em lộn 8 vòng tiền đình suýt ngất luôn rồi!',
      'Bắn cháy máy luôn sếp ơi, đập nát 4 góc tường thế này thì ai chịu nổi!',
      'Cứu bé vớiii! Bắn gì mà như nã pháo đại bác xuyên lục địa vậy trời!'
    ]
  },

  /* ══════════════ 2. CHUYÊN GIA (PRO) ══════════════ */
  pro: {
    hut: [
      'CẢNH BÁO: Động lượng sơ cấp không đủ thắng ma sát không khí, triệt tiêu trước khi tiếp cận biên.',
      'Hiệu suất phát động < 15% định mức, không đủ năng lượng hình thành chu kỳ phản xạ đàn hồi.',
      'Khuyến nghị: Tăng biên độ kéo ná tối thiểu 30px để đạt xung lực sơ cấp.'
    ],
    nhe: [
      'Đạt vận tốc cấp 1 (55 px/frame), ghi nhận 1 chu kỳ chạm biên độ đàn hồi thấp.',
      'Xung lực tiếp xúc đạt 25% công suất tối ưu, năng lượng suy hao nhanh sau va chạm đơn.'
    ],
    vua: [
      'Ghi nhận 3 chu kỳ phản xạ đàn hồi, bảo toàn 75% cơ năng động lực học.',
      'Quỹ đạo bay hình sin đối xứng góc 45 độ, đạt chuẩn thử tải gia tốc cấp 2.'
    ],
    max: [
      'CẢNH BÁO TỐC ĐỘ: Vận tốc cực đại 320 px/frame, va chạm 5 chu kỳ đàn hồi gia tốc cao.',
      'Hệ thống ghi nhận xung lực tối đa, đạt mức năng lượng cực hạn 100% công suất kỹ thuật.'
    ]
  },

  /* ══════════════ 3. GEN Z (GEN_Z) ══════════════ */
  gen_z: {
    hut: [
      'Ủa alo sếp? Bắn hay thả thính zạ? Chưa kịp bay đã ngất lịm!',
      'Flex lực ảo ma Canada, té cái ạch nhục quê xỉu ngang luôn á!',
      'Lêu lêu đồ hụt hơi, bắn nhẹ như lông hồng zậy ai chơi lại!',
      'Vibe này hơi phèn nha, kéo ná mà như vuốt ve mèo con zậy!'
    ],
    nhe: [
      'Chạm nhẹ bờ tường cái kêu "Á", tuổi L đòi làm bé đau nha anh zai!',
      'Đập tường có 1 nhát rồi tắt điện, hơi non và xanh đó nha!',
      'Vibe này chỉ mới khởi động sương sương, kéo căng nữa lên sếp ơi!'
    ],
    vua: [
      'U là trời nảy 3 phát liên tù tì, slay quá anh zai ơi!',
      'Đỉnh nóc kịch trần bay phấp phới, nảy tưng tưng như quả bóng bàn!',
      'Cũng gì và này nọ đấy sếp ơi, nhưng trùm cuối thì chưa tới đâu nha!'
    ],
    max: [
      'Ét ô ét! Bắn bay nóc nhà lủng tường luôn rồi, cứu pé vớiii!',
      'Cháy quá cháy! Vận tốc âm thanh bay mù mắt thiên hạ luôn á!',
      '100 điểm không có nhưng! Đập tường lia lịa muốn lú cái đầu luôn á sếp!'
    ]
  },

  /* ══════════════ 4. VUI VẺ (VUI) ══════════════ */
  vui: {
    hut: [
      'Bé rơi nhẹ nhàng như chiếc lá mùa thu nè sếp ơi, hi hi!',
      'Lần sau sếp kéo mạnh tay hơn một xíu nha, bé chưa kịp bay đã hạ cánh rùi!',
      'Khởi động nhẹ nhàng lấy cảm giác thôi đúng hông sếp?'
    ],
    nhe: [
      'Bé đập tường nhẹ nhàng 1 cái nè sếp ơi, êm ái quá đi!',
      'Một cú chạm vừa vặn, phát huy thêm ở lượt bắn sau nha sếp!'
    ],
    vua: [
      'Woa! Bé nảy tưng tưng 3 lần luôn nè sếp ơi, đã quá đi!',
      'Cú bắn rất chuẩn xác và đẹp mắt, chúc sếp luôn dồi dào năng lượng!'
    ],
    max: [
      'Aaaaa! Bé bay như tên lửa không gian luôn sếp ôi, siêu cấp phi thường!',
      'Cú bắn đỉnh cao tuyệt vời, sếp đúng là cao thủ bắn tỉa đại tài của vũ trụ!'
    ]
  }
};

/** Lấy câu thoại bắn Gunny chính xác theo % lực và phong cách */
export function layThoaiGunnyTheoLuc(pct: number, style: GreetingStyle): string {
  const kho = KHO_THOAI_GUNNY[style] ?? KHO_THOAI_GUNNY.vui;
  let ds: string[];
  if (pct < 15) {
    ds = kho.hut;
  } else if (pct < 38) {
    ds = kho.nhe;
  } else if (pct < 70) {
    ds = kho.vua;
  } else {
    ds = kho.max;
  }
  return ds[Math.floor(Math.random() * ds.length)] ?? ds[0]!;
}
