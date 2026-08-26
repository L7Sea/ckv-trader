# 📘 TÀI LIỆU BỐI CẢNH DỰ ÁN CKV PRO TRADER (REALTIME CONTEXT)
*Cập nhật thời gian thực: 26/08/2026*

---

## 1. 🎯 TỔNG QUAN HỆ THỐNG CKV PRO TRADER
**CKV Pro Trader** là nền tảng giao dịch và phân tích định lượng chứng khoán Việt Nam chuyên sâu dành cho nhà đầu tư chuyên nghiệp (VIP Trader).

### Trọng Tâm Kiến Trúc & Tính Năng Trọng Yếu:
1. **Kiến Trúc 8 Trang Độc Lập (`/src/pages/`)**:
   - `TradePositionsPage.tsx`: Sổ lệnh & Danh mục vị thế nắm giữ.
   - `PositionRiskPage.tsx`: Quản trị vị thế & Điểm hòa vốn linh hoạt cho mọi mã.
   - `RadarAlgorithmsPage.tsx`: Radar quét dòng tiền & Hệ thống thuật toán định lượng & AI Alpha.
   - `MarketBoardChartPage.tsx`: Bảng giá thực tế 300 mã (HOSE, HNX, UPCOM) & Biểu đồ nến Pro + Sổ lệnh 3 cấp.
   - `MacroRatesPage.tsx`: Lãi suất vĩ mô 20 Ngân hàng, 10 FinTech & Định giá ERP.
   - `MarketIntelligencePage.tsx`: Phân tích thị trường, Gợi ý hàng ngày & Tin tức BCTC.
   - `PortfolioAllocationPage.tsx`: Phân bổ tài sản & Đường tăng trưởng NAV.
   - `PerformanceAnalyticsPage.tsx`: Báo cáo hiệu suất đầu tư & Xuất Excel.

2. **Hệ Thống Đồng Bộ Toàn Diện Tất-Cả-Trong-Một (Master Unified Sync)**:
   - Một cú nhấp đồng bộ đồng thời: Giá 300 mã sàn HOSE/HNX/UPCOM + Lãi suất 20 Ngân hàng & FinTech + Tài sản thực có NAV và trích lập lãi vay Margin ngày.

3. **Mạng Lưới Điều Hướng Chéo (Cross-Navigation Engine)**:
   - `navigateToStock(symbol, targetTab, action, targetPrice)` kết nối tức thì giữa Tin tức / Gợi ý AI / Radar / Danh mục / Vĩ mô sang Bảng Giá & Nến Kỹ Thuật hoặc Sổ Lệnh / Hòa Vốn.

4. **Dữ Liệu Tài Sản Thực Tế & Lãi Suất Vay Margin Deal (DNSE 26/08/2026 - 13h53 Phiên Chiều)**:
   - **Vị thế**: 1,000 cổ phiếu TPB (Khả dụng: 1,000 CP).
   - **Thị giá**: 14.60 (14,600 đ/CP) $\rightarrow$ Giá trị CP: **14,600,000 đ** (+150,000 đ).
   - **Giá vốn mua bình quân ban đầu (Avg Cost)**: **15.790 (15,790 đ/CP)** (Tổng tiền 5 lệnh mua: 15,790,000 đ).
   - **Giá hòa vốn Deal thực tế (Breakeven Price)**: **15.920 (15,920 đ/CP)** (Đã bù đắp đủ 15.79tr vốn + 103.9k lãi vay Margin + 24.1k thuế phí đóng deal).
   - **Tiền mặt**: **171 đ**.
   - **Gốc vay Deal ban đầu**: **6,898,107 đ** (tổng ứng 6,997,221đ - đã trả 99,114đ).
   - **Lãi suất vay Margin Deal thực tế**: **11.50% / năm** ($\approx \mathbf{2,173 \text{ đ/ngày}}$).
   - **Lãi vay tích luỹ qua các ngày**: **103,944 đ** (Lãi đã trả trước đó: 1,256đ, Phí thuế deal: 22,916đ).
   - **Tổng Nợ Margin thực tế**: $6,898,107 + 103,944 = \mathbf{7,002,051 \text{ đ}}$.
   - **Tài Sản Ròng Thực Có (NAV)**: $14,600,171 - 7,002,051 = \mathbf{7,598,120 \text{ đ}}$.
   - **Lãi/Lỗ chưa chốt Deal**: **-1,418,116 đ (-8.98%)**.
   - **Tỷ lệ tự có thực tế**: **52.04%**.
   - **TradingView Pro Interactive Widget**: Tích hợp trực tiếp widget TradingView Advanced Realtime với toàn bộ công cụ kỹ thuật, khung thời gian (1m, 5m, 15m, 1h, 1D, 1W, 1M), bộ chỉ báo (RSI, MACD, MA, Bollinger Bands), và sàn HOSE, HNX, UPCOM.
   - **Cơ chế Auto-Migration Cache**: Khóa phiên bản `ckv_data_version_lock` (`2026-08-26-1353-v6`) tự động đồng bộ LocalStorage client.

---

## 2. 🗄️ CẤU TRÚC DỮ LIỆU SQL & QUY TẮC RÀNG BUỘC
- Bảng `positions`: Lưu trữ danh mục cổ phiếu, giá vốn bình quân gia quyền, khối lượng khả dụng, khối lượng chờ về (T1, T2).
- Bảng `stock_orders`: Quản lý sổ lệnh mua/bán, trạng thái khớp lệnh (PENDING, FILLED, CANCELLED).
- Bảng `transactions`: Nhật ký giao dịch tiền mặt, khấu trừ thuế 0.1% + phí 0.15% (tổng 0.25% khi bán).
- Bảng `margin_accounts`: Quản lý hạn mức vay Margin DNSE, tỷ lệ ký quỹ an toàn $R_{margin} = NAV / Total\_Assets$.

---

## 3. 🧪 TIÊU CHUẨN KIỂM THỬ & PHÂN LUỒNG MỆNH LỆNH
- **Chế độ Báo cáo / Tìm lỗi (Inspect Mode)**: Khi người dùng hỏi "báo cáo lỗi", "chỉ ra lỗi sai", "tại sao lệch" $\rightarrow$ AI chỉ tập trung phân tích chuyên môn và đề xuất hướng xử lý, tuyệt đối không tự ý sửa code hay push.
- **Chế độ Thực thi (Execution Mode)**: Khi người dùng ra lệnh "sửa và push", "sửa cho tôi đi", "tiến hành sửa toàn bộ" $\rightarrow$ AI sửa code, chạy test suites, build và tự động commit/push Cloudflare Pages.
- `node scripts/test-trading-formulas.cjs`: **15/15 bài test toán học định lượng & vĩ mô đạt chuẩn 100%** (bao gồm CTCK tùy chỉnh VPS/TCBS/DNSE, Thuần Tiền Mặt 01, Realized PnL khi bán, SettleDay lãi động, Sizing 1.5% NAV và Stress-Test -21% sập sàn).
- `node scripts/test-sql-schema.cjs`: **18/18 bài test toàn vẹn mô hình dữ liệu SQL** (bao gồm multi-user auth, private 1-1 support threads & backup/restore).
- `npm --prefix frontend run build`: 100% sạch cảnh báo và 0 lỗi TypeScript.
- **Triển khai thường trực**: Tự động commit chuẩn Conventional Commits và đẩy thẳng lên Cloudflare Pages / GitHub (`git push origin master`) sau mỗi lần cập nhật.

---

## 4. 👥 KIẾN TRÚC ĐA NGƯỜI DÙNG, TÙY CHỌN CTCK & TRUNG TÂM HƯỚNG DẪN
- **👑 Tài khoản Chủ Nhân (Admin VIP)**: Giữ trọn vẹn số dư tài sản thực tế (1,000 TPB, nợ Margin 7.002tr, NAV 7.448tr). Có quyền mở Admin Panel để giám sát danh sách người dùng và trả lời tin nhắn trực tiếp.
- **👤 Người Dùng Mới (Guest / New Trader)**: Tự do tạo tài khoản bằng Email/Mật khẩu hoặc Đăng nhập 1-Click Google. Khởi tạo sạch sẽ từ 0đ (Tiền mặt: 0đ, Nợ: 0đ, Danh mục: Rỗng) để tự trải nghiệm độc lập.
- **🏦 Tùy Chọn CTCK & Lãi Suất Margin**: Tùy chỉnh lãi suất gói vay theo DNSE (11.5%), VPS (13.5%), TCBS (10.5%), SSI (12.0%), VNDirect (12.8%) hoặc tỷ lệ tùy ý.
- **🛡️ Chế Độ Thuần Tiền Mặt (Tiểu khoản 01)**: Tự động triệt tiêu toàn bộ nợ Margin, tiền lãi vay = 0đ/ngày, giá hòa vốn thuần túy chỉ gồm thuế phí 0.25%.
- **🔍 Nạp Mã Lạ & Sàn UPCOM**: Tự động fetch live giá từ sàn Entrade/TCBS API hoặc cho phép nhập/chỉnh giá thủ công linh hoạt.
- **📖 Trung Tâm Hướng Dẫn & Cẩm Nang Tương Tác (Help Center)**: Hướng dẫn chi tiết 4 chuyên đề, FAQ, và nút gọi lại Onboarding Tour / Chat Admin.
- **💬 Live Support Chat**: Kênh nhắn tin 2 chiều trực tuyến giữa User và Admin qua bảng `support_messages`.
- **🔗 Production URL**: `https://ckv-trader.pages.dev` (Cloudflare Pages).

---

## 6. 🖼️ MODULE LƯU TRỮ & ĐỒNG BỘ HÌNH NỀN ĐA THIẾT BỊ (`wallpaperService.ts`)
- **Quản lý tập trung**: File `src/services/wallpaperService.ts` là Single Source of Truth cho toàn bộ hình nền & chủ đề hiển thị.
- **Xóa bỏ triệt để chuỗi Base64 cũ**: Loại bỏ hoàn toàn việc lưu trữ file blob Base64 vài Megabyte vào `localStorage`, giải phóng 100% dung lượng tránh lỗi `QuotaExceededError`.
- **Kho 5 Preset 4K CDN Pro Trader**:
  1. `cyberpunk`: Cyberpunk Trading (Đa sắc neon)
  2. `wallstreet`: Wall Street Bull (Bò tót phố Wall)
  3. `bloomberg`: Bloomberg Dark (Bảng điện tử tối giản)
  4. `deepsea`: Deep Sea Obsidian (Đại dương tĩnh lặng)
  5. `aurora`: Emerald Matrix (Xanh tím thịnh vượng)
- **Đồng bộ đa thiết bị (Máy tính $\leftrightarrow$ Điện thoại)**: Hỗ trợ nạp trực tiếp Direct Image URL và đóng gói cấu hình nền vào file sao lưu `exportDataAsJson()` / `importDataFromJson()`.

---

## 7. 🛡️ MÔ HÌNH BẢO MẬT & PHÂN QUYỀN (GUEST 0Đ VS ADMIN MASTER VIP)
- **Mặc định khi mở link (`https://ckv-trader.pages.dev`) trên bất kỳ máy/trình duyệt mới**:
  - Hệ thống tự động gán là **Khách Trải Nghiệm (Guest Trader)**.
  - Số dư tiền mặt: **0 đ**, Nợ Margin: **0 đ**, NAV: **0 đ**, Danh mục cổ phiếu: **Trống (0 CP)**.
  - Tuyệt đối không nhìn thấy tên hay số dư 1,000 TPB của Chủ nhân.
- **Tài khoản Admin Master của Chủ nhân**:
  - Đăng nhập riêng bằng **Gmail / Google Account** hoặc mã PIN bảo mật `542463`.
  - Khi xác thực thành công, toàn bộ danh mục thực tế của Chủ nhân (**1,000 TPB @ 14.60, NAV 7,598,120 đ, Nợ Margin 7,002,051 đ, Tiền mặt 171 đ**) được kích hoạt trên phiên làm việc của Chủ nhân.
- **Cơ chế Kích Phiên Cũ (Session Reset Lock)**:
  - Nâng cấp key lưu trữ lên `v5` (`ckv_registered_users_v5`, `ckv_active_user_id_v5`), tự động đăng xuất tất cả thiết bị lạ về chế độ Khách 0đ.


