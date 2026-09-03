import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTradingStore } from '@/store/useTradingStore';
import { duongCuaTab, tabCuaDuong } from './duongDan';

/* ═══════════════════════════════════════════════════════════════
   useDongBoDiaChi — NỐI địa chỉ trình duyệt ↔ biến `activeTab`

   Vì sao không viết lại 8 trang thành <Route>: 8 component và mọi chỗ đọc
   `activeTab` (thanh tab trên, thanh dưới cho điện thoại, Capy, store) đều
   đang chạy tốt. Viết lại hết là rủi ro lớn để đổi lấy đúng một thứ — địa chỉ.

   Cách ít rủi ro hơn: giữ `activeTab` làm thứ quyết định render, chỉ nối nó
   HAI CHIỀU với địa chỉ. Không component nào phải sửa.

   ⚠ Hai chiều nối nhau rất dễ thành VÒNG LẶP VÔ HẠN: địa chỉ đổi → tab đổi →
   lại đẩy địa chỉ → tab đổi… Chặn bằng cách CHỈ hành động khi hai bên thật sự
   lệch nhau, và nhớ lần đẩy cuối để không đẩy lại chính nó.
   ═══════════════════════════════════════════════════════════════ */
export function useDongBoDiaChi() {
  const loc = useLocation();
  const nav = useNavigate();
  const activeTab = useTradingStore((s) => s.activeTab);
  const setActiveTab = useTradingStore((s) => s.setActiveTab);

  /* Nhớ giá trị vừa đồng bộ, để không đẩy ngược lại chính thứ mình vừa nhận */
  const vuaDongBo = useRef<string>('');

  /* Chiều 1: ĐỊA CHỈ → TAB.
     Gồm cả lần mở app đầu tiên (người dùng dán link, hoặc mở dấu trang),
     và mỗi lần bấm nút Back/Forward của trình duyệt. */
  useEffect(() => {
    const tabTuDuong = tabCuaDuong(loc.pathname);
    if (tabTuDuong !== activeTab) {
      vuaDongBo.current = loc.pathname;
      setActiveTab(tabTuDuong);
    }
  }, [loc.pathname]);   // eslint-disable-line react-hooks/exhaustive-deps

  /* Chiều 2: TAB → ĐỊA CHỈ.
     Bấm nút tab ở thanh trên hoặc thanh dưới vẫn gọi setActiveTab như cũ;
     chỗ này bắt lấy và cập nhật địa chỉ theo. */
  useEffect(() => {
    const duongCanCo = duongCuaTab(activeTab);
    if (loc.pathname !== duongCanCo && vuaDongBo.current !== loc.pathname) {
      nav(duongCanCo);
    }
    vuaDongBo.current = '';
  }, [activeTab]);      // eslint-disable-line react-hooks/exhaustive-deps
}
