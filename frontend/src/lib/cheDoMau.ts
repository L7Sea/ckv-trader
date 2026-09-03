/* ═══════════════════════════════════════════════════════════════════════════
   CHẾ ĐỘ SÁNG / TỐI
   ───────────────────────────────────────────────────────────────────────────
   Chủ tài khoản đã chọn diện mạo "giấy tài chính" (nền sáng) làm BẢN SẮC của
   app. Nên mặc định phải là SÁNG, không phải chạy theo cài đặt máy.

   Lỗi của bản trước: chỉ dựa vào `prefers-color-scheme`. Máy chủ tài khoản đang
   đặt chế độ tối, nên app hiện bảng TỐI và anh tưởng bản mới chưa deploy — dù
   CSS đã lên đúng. Bản sắc app phải thắng cài đặt hệ điều hành.

   Vẫn giữ đủ ba lựa chọn (skill bắt buộc có chế độ tối):
     'sang'    — luôn sáng. MẶC ĐỊNH.
     'toi'     — luôn tối.
     'theo-may'— nghe theo cài đặt hệ điều hành.

   Cách hoạt động, khớp với các khối trong index.css:
     data-theme="light" → chặn cả @media, luôn dùng bảng sáng
     data-theme="dark"  → luôn dùng bảng tối
     không có data-theme → @media quyết định
   ═══════════════════════════════════════════════════════════════════════════ */

export type CheDoMau = 'sang' | 'toi' | 'theo-may';

const KHOA = 'ckv_che_do_mau';

/** Nhãn hiển thị cho người dùng. */
export const NHAN_CHE_DO: Record<CheDoMau, string> = {
  sang: 'Sáng',
  toi: 'Tối',
  'theo-may': 'Theo máy'
};

/** Chế độ đang lưu. Mặc định SÁNG — bản sắc app, không phải cài đặt máy. */
export function docCheDo(): CheDoMau {
  try {
    const luu = localStorage.getItem(KHOA);
    if (luu === 'sang' || luu === 'toi' || luu === 'theo-may') return luu;
  } catch {
    // Trình duyệt chặn localStorage thì dùng mặc định
  }
  return 'sang';
}

/** Gắn chế độ lên thẻ <html>. Gọi càng sớm càng tốt để tránh nháy màu. */
export function apCheDo(cheDo: CheDoMau): void {
  const goc = document.documentElement;
  if (cheDo === 'sang') goc.setAttribute('data-theme', 'light');
  else if (cheDo === 'toi') goc.setAttribute('data-theme', 'dark');
  else goc.removeAttribute('data-theme');
}

/** Lưu lựa chọn và áp ngay. */
export function luuCheDo(cheDo: CheDoMau): void {
  try {
    localStorage.setItem(KHOA, cheDo);
  } catch {}
  apCheDo(cheDo);
}

/** Chế độ kế tiếp khi bấm nút gạt: Sáng → Tối → Theo máy → Sáng. */
export function cheDoKeTiep(hienTai: CheDoMau): CheDoMau {
  return hienTai === 'sang' ? 'toi' : hienTai === 'toi' ? 'theo-may' : 'sang';
}
