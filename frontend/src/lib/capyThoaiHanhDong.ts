import type { GreetingStyle } from './greeting';

/* ═══════════════════════════════════════════════════════════════
   THOẠI THEO HÀNH ĐỘNG VẬT LÝ — CỦA BÉ CAPY CKV PRO TRADER
   Khớp chính xác từng phản xạ tức thì khi bị:
     - 'nhac': Bị nhấc bổng lên khỏi màn hình
     - 'nem': Đang bay với vận tốc quán tính sau cú ném
     - 'rot': Tiếp đất, nằm dỗi / nghỉ ngơi
   ═══════════════════════════════════════════════════════════════ */

export type HanhDong =
  | 'nhac'   // vừa bị nhấc bổng lên khỏi chỗ
  | 'nem'    // đang bay sau cú ném
  | 'rot';   // vừa tiếp đất, nằm dỗi

export const THOAI_HANH_DONG: Record<GreetingStyle, Record<HanhDong, string[]>> = {
  vui: {
    nhac: [
      'Ơ ơ, anh nhấc em lên xem nến à!',
      'Bỏ em xuống, chóng mặt quá sếp ơi!',
      'Á á, em sợ độ cao hơn sợ đu đỉnh!',
      'Thả em xuống em soi mã tím cho!'
    ],
    nem: [
      'Á á á bay lên như cổ phiếu trần tím!',
      'Em bay rồiiii, to the moon luôn!',
      'Bay như tên lửa vượt đỉnh 1.800 điểm!',
      'Chóng mặt quá sếp ơiii!'
    ],
    rot: [
      'Ui da, rớt cái nết luôn!',
      'Cho em nằm nghỉ mệt xíu nha...',
      'Đầu em quay quay như VN-Index rũ cung!',
      'Hạ cánh an toàn rồi, hú hồn!'
    ],
  },
  troll: {
    nhac: [
      'Buông trẫm ra! Đụng vào người ta trừ 5% NAV đấy!',
      'Đang soi lệnh mà nhấc hoài, lỗ ráng chịu nha!',
      'Định làm gì đó? Khai mau không em bán tháo đấy!',
      'Ê ê, đụng vào là mất vía trần tím đấy!'
    ],
    nem: [
      'Ném nhẹ thôi! Rớt mất quả cam phong thủy bây giờ!',
      'Ném ác thế, chúc hôm nay đu đỉnh nha sếp!',
      'Ơ hay! Lỗ chứng khoán xong ném em là sao?!',
      'Ném bay xa thế này mai trừ lương nha!'
    ],
    rot: [
      'Ném ác thế, ghim thù này vào nhật ký lệnh nha!',
      'Em nằm đây ăn vạ, không soi mã cho nữa đâu!',
      'Nhớ mặt sếp rồi nha, mai khỏi phím hàng!',
      'Rớt xuống đất rồi, đền cho em ly trà sữa mau!'
    ],
  },
  pro: {
    nhac: [
      'Đang di chuyển trợ lý giao dịch.',
      'Vâng, em nhường tầm nhìn biểu đồ nến ạ.',
      'Xin lỗi vì đã che sổ lệnh bước giá.',
      'Ghi nhận thao tác thay đổi vị trí.'
    ],
    nem: [
      'Đang thay đổi vị trí trên màn hình.',
      'Ghi nhận gia tốc di chuyển của người dùng.',
      'Em sẽ đứng ở vị trí khác để không che nến.',
      'Điều hướng lại toạ độ trợ lý.'
    ],
    rot: [
      'Đã cập nhật vị trí mới an toàn.',
      'Em ổn, cảm ơn anh. Sẵn sàng hỗ trợ soi lệnh tiếp.',
      'Hạ cánh hoàn tất. Danh mục vẫn được theo dõi 24/7.',
      'Toạ độ ổn định, tiếp tục giám sát rủi ro.'
    ],
  },
  gen_z: {
    nhac: [
      'Ủa alo? Bắt cóc người ta hả sếp!',
      'Cứu pé! Bị tóm cổ rồi!',
      'Ê ê thả em xuống kẻo xỉu ngang bây giờ!',
      'Gì dọ? Nhấc em lên tính gank mã nào?'
    ],
    nem: [
      'Cứu pé Ét ô ét!',
      'Bay xa quá trờiii, to the moon thật rồi!',
      'Em xỉu ngang trên không trung á á!',
      'Ném em bay như chart dựng đứng zậy trời!'
    ],
    rot: [
      'Tổn thương sâu sắc, trầm cảm 5 giây fr fr!',
      'Rớt cái nết luôn á trời!',
      'Em khum ổn đâu nha, đền tinh thần đi sếp!',
      'Hạ cánh cái éc, sang chấn tâm lý luôn!'
    ],
  },
};

/** Lấy câu thoại khớp đúng hành động vừa xảy ra */
export function layThoaiHanhDong(hd: HanhDong, style: GreetingStyle): string {
  const ds = THOAI_HANH_DONG[style]?.[hd] || THOAI_HANH_DONG.vui[hd];
  return ds[Math.floor(Math.random() * ds.length)] ?? ds[0]!;
}
