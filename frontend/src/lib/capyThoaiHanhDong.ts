import type { GreetingStyle } from './greeting';

/* ═══════════════════════════════════════════════════════════════
   THOẠI THEO HÀNH ĐỘNG — khác với thoại theo tâm trạng.

   Học từ góp ý anh Hải gửi: lúc bị tóm hay bị ném, câu nói phải khớp
   ĐÚNG việc vừa xảy ra. Bốc câu theo tâm trạng chung ("Chán quá đi
   mất") ngay lúc bé đang bay giữa không trung thì nghe lạc đề hẳn.

   Chạm nhẹ thì VẪN dùng THOAI theo tâm trạng trong capyBieuCam.ts —
   chỗ đó cần bất ngờ, 52 biểu cảm mỗi lần một khác. Còn 3 mốc dưới
   đây là phản xạ tức thì nên phải bám sát hành động.
   ═══════════════════════════════════════════════════════════════ */

export type HanhDong =
  | 'nhac'   // vừa bị nhấc bổng lên khỏi chỗ
  | 'nem'    // đang bay sau cú ném
  | 'rot';   // vừa tiếp đất, nằm dỗi

export const THOAI_HANH_DONG: Record<GreetingStyle, Record<HanhDong, string[]>> = {
  vui: {
    nhac: ['Ơ ơ, anh nhấc em lên làm gì!', 'Bỏ em xuống, chóng mặt!', 'Á, em sợ độ cao!'],
    nem: ['Á á á bay lên như một vị thần!', 'Em bay rồiiii!', 'Chóng mặt quá sếp ơiii'],
    rot: ['Ui da, rớt cái nết luôn!', 'Cho em nghỉ mệt xíu nha...', 'Đầu em quay quay rồi'],
  },
  troll: {
    nhac: ['Buông trẫm ra!', 'Ê ê, đụng vào người ta đấy', 'Định làm gì đó, khai mau'],
    nem: ['Ném nhẹ thôi, xước hết vân đá bây giờ!', 'Ném ác thế, em nhớ đó', 'Ơ hay, ném người là sao!'],
    rot: ['Ném ác thế, trừ lương anh cho coi', 'Em nằm đây, không dậy nữa', 'Nhớ mặt anh rồi nha'],
  },
  pro: {
    nhac: ['Đang di chuyển trợ lý.', 'Vâng, em nhường chỗ ạ.', 'Xin lỗi vì đã che tầm nhìn.'],
    nem: ['Đang thay đổi vị trí.', 'Ghi nhận thao tác di chuyển.', 'Em sẽ đứng chỗ khác.'],
    rot: ['Đã cập nhật vị trí mới.', 'Em ổn, cảm ơn anh.', 'Sẵn sàng hỗ trợ tiếp.'],
  },
  gen_z: {
    nhac: ['Ủa alo? Buông em ra!', 'Cứu pé, bị bắt cóc!', 'Ê ê thả em xuống'],
    nem: ['Cứu pé Ét ô ét!', 'Bay xa quá trờiii', 'Em xỉu ngang trên không'],
    rot: ['Tổn thương sâu sắc, trầm cảm 5 giây', 'Rớt cái nết luôn á', 'Em khum ổn đâu nha'],
  },
};

/** Câu khớp đúng hành động vừa xảy ra */
export function layThoaiHanhDong(hd: HanhDong, style: GreetingStyle): string {
  const ds = THOAI_HANH_DONG[style][hd];
  return ds[Math.floor(Math.random() * ds.length)] ?? ds[0]!;
}
