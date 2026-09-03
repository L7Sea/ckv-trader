/* ═══════════════════════════════════════════════════════════════
   duongDan.ts — BẢNG ĐỊA CHỈ CỦA 8 MÀN HÌNH (module thuần, test được)

   VÌ SAO SINH RA (03/09/2026):
   App này chạy nhiều tháng KHÔNG có router. 8 "trang" chỉ là component đổi
   qua biến `activeTab` trong store. `GEMINI.md` gọi đó là "Kiến trúc 8 Trang
   Độc Lập" — nhưng đó là Ý ĐỊNH, không phải hiện trạng.

   Bốn thứ người dùng MẤT vì chuyện đó, đều là mất mát thật:

     · Không có địa chỉ riêng cho từng màn → không lưu dấu trang được,
       không gửi link "xem cái này" cho ai được.
     · Nút BACK của trình duyệt THOÁT HẲN app thay vì quay lại màn trước.
       Trên điện thoại đây là nút người ta bấm theo phản xạ.
     · Tải lại trang (F5) là mất chỗ đang xem, quay về tab mặc định.
     · Không mở hai màn cạnh nhau để so sánh danh mục với biểu đồ.

   CÁCH LÀM ÍT RỦI RO NHẤT: giữ nguyên `activeTab` làm thứ quyết định render,
   chỉ NỐI nó hai chiều với địa chỉ. Nhờ vậy 8 component không phải sửa một
   dòng nào, và mọi chỗ đang đọc `activeTab` vẫn chạy y như cũ.
   ═══════════════════════════════════════════════════════════════ */

export type TabType =
  | 'TRADE' | 'DECISION' | 'ALGORITHMS' | 'MARKET'
  | 'MACRO' | 'INTELLIGENCE' | 'CHARTS' | 'ANALYTICS' | 'NHATKY';

export interface ManHinh {
  tab: TabType;
  duong: string;
  ten: string;
}

/* Địa chỉ đặt bằng tiếng Việt không dấu — người dùng nhìn thanh địa chỉ là
   hiểu mình đang ở đâu, không phải đoán từ chữ viết tắt tiếng Anh. */
export const MAN_HINH: ManHinh[] = [
  { tab: 'TRADE',        duong: '/dat-lenh',    ten: 'Đặt lệnh & Danh mục' },
  { tab: 'DECISION',     duong: '/rui-ro',      ten: 'Quyết định & Rủi ro' },
  { tab: 'ALGORITHMS',   duong: '/thuat-toan',  ten: 'Radar thuật toán' },
  { tab: 'MARKET',       duong: '/bang-gia',    ten: 'Bảng giá & Biểu đồ' },
  { tab: 'MACRO',        duong: '/lai-suat',    ten: 'Lãi suất vĩ mô' },
  { tab: 'INTELLIGENCE', duong: '/tin-tuc',     ten: 'Tin tức thị trường' },
  { tab: 'CHARTS',       duong: '/phan-bo',     ten: 'Phân bổ danh mục' },
  { tab: 'ANALYTICS',    duong: '/hieu-suat',   ten: 'Hiệu suất đầu tư' },
  { tab: 'NHATKY',       duong: '/nhat-ky',     ten: 'Nhật ký nhận định' },
];

const THEO_TAB = new Map(MAN_HINH.map((m) => [m.tab, m]));
const THEO_DUONG = new Map(MAN_HINH.map((m) => [m.duong, m]));

export const TAB_MAC_DINH: TabType = 'TRADE';

export function duongCuaTab(tab: TabType): string {
  return THEO_TAB.get(tab)?.duong ?? MAN_HINH[0].duong;
}

/* Địa chỉ lạ → về màn mặc định thay vì màn trắng.
   Bỏ dấu `/` cuối và tham số truy vấn trước khi tra. */
export function tabCuaDuong(duong: string): TabType {
  const sach = duong.split('?')[0].replace(/\/+$/, '') || '/';
  return THEO_DUONG.get(sach)?.tab ?? TAB_MAC_DINH;
}

export function tenCuaTab(tab: TabType): string {
  return THEO_TAB.get(tab)?.ten ?? '';
}
