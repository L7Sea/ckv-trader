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

4. **MÔ HÌNH TIỀN CỦA DEAL — NGUỒN SỰ THẬT DUY NHẤT**

   Toàn bộ Nợ / NAV / Lãi lỗ / Giá hòa vốn được TÍNH từ `frontend/src/services/dealModel.ts`.
   **Cấm hardcode ảnh chụp số dư ở bất kỳ file nào khác** — đó chính là nguyên nhân
   khiến 4 nơi trong app từng hiện 4 con số khác nhau cho cùng một khoản tiền.

   **Tham số gốc (bất biến của Deal):**
   | Tham số | Giá trị | Nguồn |
   |---|---|---|
   | Mã / khối lượng | TPB / 1,000 CP | Sổ lệnh 5 lệnh khớp |
   | Vốn tự có | 8,891,893 đ | Tab Deal DNSE |
   | Dư nợ gốc vay | 6,898,107 đ | Tab Deal DNSE |
   | Tổng giải ngân | 15,790,000 đ | 8,891,893 + 6,898,107 |
   | Ngày mốc N=0 | 13/07/2026 | Ngày khớp 3 lệnh DCA cuối |
   | Giá vốn Deal tại N=0 | 15,802,776 đ | Hồi quy từ số dư thật |
   | Lãi suất vay | **12.5%/năm** (365 ngày) | Đo từ chênh lệch nợ 3 ngày liên tiếp |
   | Chi phí Deal/ngày | 2,617 đ (2,362 lãi vay + 255 phí) | Hồi quy từ số dư thật |
   | Tiền mặt | 171 đ | Tab Tài sản DNSE |

   **Công thức (N = số ngày lịch kể từ 13/07/2026):**
   - Lãi vay tích luỹ = `round(6,898,107 × 12.5% / 365 × N)` — lãi ĐƠN trên dư nợ GỐC
   - Tổng nợ Margin = `6,898,107 + lãi vay tích luỹ`
   - Giá vốn Deal = `15,802,776 + 2,617 × N`
   - Lãi/Lỗ chưa chốt = `KL × Thị giá − Giá vốn Deal`
   - % Lãi/Lỗ = `Lãi lỗ / 15,790,000` (mẫu số là VỐN GIẢI NGÂN, đúng quy ước DNSE)
   - NAV = `Tiền mặt + KL × Thị giá − Tổng nợ Margin`
   - Giá hòa vốn = `Giá vốn Deal / KL`

   **Đối chiếu 3 mốc số dư thật (khớp tới từng đồng):**
   | Mốc | N | Thị giá | Nợ thật / mô hình | NAV thật / mô hình | Lãi lỗ thật / mô hình |
   |---|---|---|---|---|---|
   | 26/08/2026 13:53 | 44 | 14,600 | 7,002,051 = 7,002,051 | 7,598,120 = 7,598,120 | (không có ảnh) |
   | 27/08/2026 15:43 | 45 | 14,700 | 7,004,413 = 7,004,413 | 7,695,758 = 7,695,758 | −1,220,541 = −1,220,541 (−7.73%) |
   | 28/08/2026 06:26 | 46 | 14,700 | 7,006,776 = 7,006,776 | 7,693,395 = 7,693,395 | −1,223,158 = −1,223,158 (−7.75%) |

   **Hai hiệu chỉnh quan trọng so với tài liệu cũ:**
   1. Lãi suất vay thật là **12.5%/năm (2,362 đ/ngày)**, không phải 11.5% (2,173 đ/ngày).
   2. Ngoài lãi vay, DNSE còn cộng **~255 đ/ngày** phí Deal vào giá vốn. Bằng chứng: ngày
      27/8 và 28/8 giá TPB đứng yên 14,700 nhưng lãi chưa chốt vẫn xấu đi 2,617 đ.

   - **TradingView Pro Interactive Widget**: widget chính thức để XEM biểu đồ. Không đọc được
     dữ liệu giá từ widget (Same-Origin Policy) — giá thực lấy qua proxy, xem mục 9 và 11.1.
   - **Cơ chế Auto-Migration Cache**: Khóa phiên bản `ckv_data_version_lock` (`2026-08-28-dealmodel-v7`).

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
- `npm run test:all` chạy trọn bộ. Riêng lẻ:
- `node scripts/test-deal-model.mjs`: **17/17 bài test mô hình tiền**, đối chiếu số dư thật DNSE.
- `node scripts/test-auto-sync.mjs`: **8/8 bài test lịch tự động đồng bộ**.
- `node scripts/test-trading-formulas.cjs`: **20/20 bài test toán học định lượng & vĩ mô đạt chuẩn 100%** (bao gồm CTCK tùy chỉnh VPS/TCBS/DNSE, Thuần Tiền Mặt 01, Realized PnL khi bán, SettleDay lãi động, Sizing 1.5% NAV và Stress-Test -21% sập sàn).
- `node scripts/test-sql-schema.cjs`: **17/17 bài test toàn vẹn mô hình dữ liệu SQL** (bao gồm multi-user auth, private 1-1 support threads & backup/restore).
- `npm --prefix frontend run build`: 100% sạch cảnh báo và 0 lỗi TypeScript.
- **Triển khai thường trực**: Tự động commit chuẩn Conventional Commits và đẩy thẳng lên Cloudflare Pages / GitHub (`git push origin master`) sau mỗi lần cập nhật.

---

## 4. 👥 KIẾN TRÚC ĐA NGƯỜI DÙNG, TÙY CHỌN CTCK & TRUNG TÂM HƯỚNG DẪN
- **👑 Tài khoản Chủ Nhân (Admin VIP)**: Giữ trọn vẹn số dư tài sản thực tế (1,000 TPB; Nợ và NAV tính động theo `dealModel.ts`, không hardcode). Có quyền mở Admin Panel để giám sát danh sách người dùng và trả lời tin nhắn trực tiếp.
- **👤 Người Dùng Mới (Guest / New Trader)**: Tự do tạo tài khoản bằng Email/Mật khẩu hoặc Đăng nhập 1-Click Google. Khởi tạo sạch sẽ từ 0đ (Tiền mặt: 0đ, Nợ: 0đ, Danh mục: Rỗng) để tự trải nghiệm độc lập.
- **🏦 Tùy Chọn CTCK & Lãi Suất Margin**: Tùy chỉnh lãi suất gói vay theo DNSE (12.5% - mức đo được từ dư nợ thực tế), VPS (13.5%), TCBS (10.5%), SSI (12.0%), VNDirect (12.8%) hoặc tỷ lệ tùy ý.
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

## 7. 🛡️ MÔ HÌNH BẢO MẬT & PHÂN QUYỀN (TỰ ĐỘNG NHẬN DIỆN ADMIN VS THÀNH VIÊN ĐĂNG KÝ)
- **Giao Diện Mã PIN 6 Ô Vuông To Rời Nhau (`Pin6Input`)**:
  - Gồm 6 ô vuông kích thước lớn (44x50px) với ký tự/dấu `*` hoặc số màu vàng amber to đùng nằm chính giữa mỗi ô.
  - Tự động nhảy focus sang ô tiếp theo khi nhập số, phím Backspace tự động lùi ô.
  - Không hiển thị placeholder lộ liễu mã PIN mẫu.
- **Cô Lập Dữ Liệu Tài Khoản Phụ Tuyệt Đối (Zero-Balance Isolation)**:
  - Tài khoản thành viên phụ khi đăng ký/đăng nhập mặc định Tiền mặt = 0 đ, Nợ Margin = 0 đ, NAV = 0 đ, Danh mục rỗng.
  - Supabase chỉ nạp dữ liệu TPB thực tế cho Admin Master, chặn hoàn toàn không để tài khoản thành viên tải dữ liệu của Admin.
- **Modal Chọn Tài Khoản Google (`GoogleAuthPickerModal`)**:
  - Giao diện chuẩn Google Sign-In (`accounts.google.com`) với logo Google 4 màu.
  - Hiển thị danh sách tài khoản Google có sẵn trên máy (Lê Minh Hải - `leminhhaia5890@gmail.com`, tài khoản thành viên khác) và tùy chọn `+ Sử dụng một tài khoản khác`.
  - Chọn tài khoản Admin $\rightarrow$ Xác thực mật khẩu bảo mật `542463` để vào thẳng Master.
  - Chọn tài khoản thành viên $\rightarrow$ 1-Click đăng nhập ngay.
- **Hướng Dẫn Chơi Đùa Cùng Trợ Lý Thú Cưng Capy Gunny (`OnboardingTourModal`)**:
  - Hướng dẫn trực quan 4 cơ chế game tương tác của Capy Gunny:
    1. Chạm 1 lần: Đổi 4 biểu cảm cảm xúc (vui vẻ, ngầu, ngạc nhiên, troll) & thoại dí dỏm.
    2. Nhấp đúp (Double click): Đổi trang phục và phụ kiện độc quyền (Nón cam, Mũ cối, Kính Cyberpunk, Vương miện VIP, Đồ Gunny).
    3. Kéo thả & quăng ném: Mô phỏng vật lý nảy bật 4 cạnh tường và rơi tự do theo trọng lực.
    4. Giữ chuột 3 giây: Đếm ngược 3..2..1 kích hoạt "Gunny Mode" với thước laser đo góc bắn và thanh kéo lực Power % bắn đại bác.
- **Tích Hợp Hướng Dẫn Capy Vào Trung Tâm Cẩm Nang (`HelpCenterModal`) & Tinh Gọn Header**:
  - Hướng dẫn Capy được tích hợp trực tiếp làm 1 tab trong Cẩm Nang, cho phép khởi chạy tour bất kỳ lúc nào.
  - Xóa bỏ hoàn toàn các nút trùng lặp giữa Header bar và Dropdown Menu.
- **Tính Năng Xóa Người Dùng (Admin Master Control)**:
  - Admin có quyền xóa vĩnh viễn bất kỳ tài khoản thành viên nào trong `AdminPanelModal`.
  - Khi xóa, toàn bộ dữ liệu storage, danh mục, sổ lệnh và tin nhắn của thành viên đó sẽ bị thanh lọc triệt để.
  - Hệ thống bảo vệ tuyệt đối: Không cho phép xóa tài khoản Admin Master của Chủ nhân.
- **Tự động nhận diện Chủ Nhân Admin VIP qua Email**:
  - Email Master độc quyền: **`leminhhaia5890@gmail.com`**.
  - Mã tài khoản độc quyền của Admin: **`026A00000`**.
  - Toàn bộ danh mục thực tế của Chủ nhân (**1,000 TPB, Tiền mặt 171 đ**, Nợ/NAV tính động theo `dealModel.ts`) được bảo vệ độc quyền 100%.
- **Quy luật tạo Mã Số Tài Khoản Thành Viên (Năm Động + Chữ Cái Đầu Tên Chính + 5 Số Ngẫu Nhiên)**:
  - **Tiền tố năm**: 3 số cuối của năm đăng ký (Năm 2026 là `026`, Năm 2027 là `027`, Năm 2123 là `123`...).
  - **Chữ cái Tên Chính**: Lấy chữ cái in hoa đầu tiên của **Tên Chính** (từ cuối cùng trong họ tên, hoặc từ duy nhất nếu chỉ có 1 tên như "Minh", khử dấu tiếng Việt):
    - *Minh* (2123) $\rightarrow$ `123M` + 5 số ngẫu nhiên (VD: `123M67819`).
    - *Lê Hải* (2026) $\rightarrow$ `026H` + 5 số ngẫu nhiên (VD: `026H58291`).
    - *Lê Nguyễn Minh Thiên Bá* (2026) $\rightarrow$ `026B` + 5 số ngẫu nhiên (VD: `026B74819`).
  - 5 số ngẫu nhiên nằm trong dải $10001 - 99999$, tuyệt đối không bao giờ trùng `00000` của Admin.
- **Mã PIN 6 Số Biến Đổi Tự Động Hàng Ngày (`getDailyAccessPin()`)**:
  - Biến đổi mỗi ngày 1 mã duy nhất (VD: Ngày 26/08/2026 là `861482`). Thành viên mới đăng ký bắt buộc phải có mã PIN ngày do Admin cung cấp.
- **Cô Lập Kênh Chat 1-1 Tuyệt Đối**:
  - Thành viên chỉ gửi tin trực tiếp tới Admin, không thấy nhau. Admin chọn từng thành viên để trả lời riêng tư 1-1.

---

## 8. 🧪 BẢN GHI ĐỢT RÀ SOÁT & XỬ LÝ TRIỆT ĐỂ 20 ĐIỂM LỖI HỆ THỐNG (26/08/2026)
Đã rà soát và khắc phục toàn diện 20 điểm lỗi, sai lệch toán học và bất cập trải nghiệm trên toàn bộ nền tảng:
1. **DCA Giá Vốn & Hòa Vốn Động**: Xóa bỏ hoàn toàn fallback hardcode TPB (`15790` và `15920`) khi mua thêm mã mới, chuyển sang tính động theo giá khớp lệnh thực tế của từng mã.
2. **Phân Bổ Lãi Vay Margin Theo Tỷ Trọng Vốn**: Sửa đổi cơ chế chia đều sang phân bổ tiền lãi vay hàng ngày dựa trên tỷ trọng giá trị thị trường của từng mã nắm giữ (`posWeight = posVal / totalStockValuation`).
3. **Chu Kỳ T+2.5 Chuẩn Lịch Chứng Khoán**: Chốt ngày T+2.5 tự động bỏ qua Thứ 7 và Chủ Nhật khi tính toán ngày làm việc tiếp theo.
4. **Chuẩn Hóa Hệ Số Giá Hòa Vốn Tối Thiểu**: Nâng hệ số ước tính hòa vốn tối thiểu từ `1.0025` lên `1.004016` (bù đủ 0.15% phí mua + 0.15% phí bán + 0.1% thuế bán).
5. **Cảnh Báo An Toàn Tỷ Lệ Tự Có (Margin Risk Alert)**: Tự động phát hiện và hiển thị cảnh báo nhấp nháy `(⚠️ Force Sell)` khi tỷ lệ tự có < 30% và `(⚠️ Call Margin)` khi < 35%.
6. **Bảo Lưu Tùy Chọn Ẩn/Hiện Số Dư**: Ghi nhớ trạng thái `isBalanceHidden` vào `localStorage` của trình duyệt.
11. **Popup Chọn 4 Phong Cách Trợ Lý Capy Ngay Khi Vào App (`CapyStylePickerModal`)**:
    - Khi người dùng mới vào app lần đầu tiên, hệ thống hiển thị ngay modal tương tác cho phép chọn 1 trong 4 phong cách:
      1. 😄 **Vui Vẻ & Tích Cực** (`vui`): Khích lệ tinh thần, đón sắc tím rực rỡ.
      2. 😈 **Troll & Cà Khịa** (`troll`): Kháy đểu fomo đu đỉnh, thức khuya ngắm NAV.
      3. 💼 **Chuyên Nghiệp & Kỷ Luật** (`pro`): Chuẩn corporate, kiểm soát chặt chẽ rủi ro T+2.5.
      4. ⚡ **Gen Z & Bắt Trend** (`gen_z`): Trendy, slay, no cap, chill chill như Capy.
    - Lưu cấu hình vào `localStorage` và áp dụng ngay lập tức cho toàn bộ câu chào & thoại của Capy Mascot.
12. **Nguyên Tắc Tối Thượng Mascot Capy Nằm Trên Tất Cả (`z-index: 2147483000`)**:
    - Capy luôn nằm trên mọi lớp thành phần (Modals, Bottom Navigation, Header Bar), di chuyển tự do, không bị che khuất.
13. **Nâng Cấp Trải Nghiệm UI/UX Toàn Diện**:
    - **Header**: Thêm click-outside backdrop tự động đóng menu avatar khi bấm ra ngoài.
    - **Sổ Lệnh (OrderForm)**: Hiệu ứng viền sáng nhấp nháy (Pulse ring animation) phản hồi khi chọn nhanh mã từ bảng giá/danh mục.
    - **Cập Nhật Giá (PriceUpdateModal)**: Thêm các nút biến động nhanh ±7% (Trần/Sàn), ±3%, ±1% và xử lý viết hoa mã cổ phiếu tự động.
    - **Quản Lý Vốn (CashModal)**: Thêm dòng quy đổi tiền tệ trực tiếp (`100.000.000 đ`) và các nút nạp nhanh (+10Tr, +20Tr, +50Tr, +100Tr, Tất toán nợ).
    - **Bảng Giá 300 Mã (MarketBoard)**: Tích hợp phân trang mượt mà (50 mã/trang), triệt tiêu lag giật DOM trên điện thoại.
    - **Cổ Tức (DividendModal)**: Thêm Empty State khi chưa có cổ phiếu và bảng bóc tách 5% Thuế TNCN minh bạch.
    - **Quản Trị Admin (AdminPanelModal)**: Thêm Empty State minh họa khi chưa có thành viên phụ đăng ký.
14. **Bộ Test Bắt Buộc 100% Pass**: 20/20 Test Định lượng & Vĩ mô PASS, 17/17 Test SQL Schema PASS, Vite 6 Production Build Sạch 100%.

---

## 9. 📡 DỮ LIỆU THỊ TRƯỜNG THỜI GIAN THỰC

**Vì sao không lấy được số liệu từ TradingView:** widget nhúng `s.tradingview.com/widgetembed`
là iframe khác origin — trình duyệt chặn tuyệt đối việc JavaScript đọc dữ liệu bên trong.
Widget miễn phí cũng không cung cấp API trả giá ra ngoài. Nó chỉ để NHÌN.

**Đường lấy giá thật (đã triển khai):**
1. `marketDataService.fetchLiveStockPrice(symbol)` gọi endpoint `/api/market/ohlc` của
   Cloudflare Worker (`backend/src/worker.ts`). Worker chạy server-side nên **không vướng CORS**.
2. Worker proxy sang `services.entrade.com.vn` với `resolution=1` (nến 1 phút) — giá trong
   phiên, không phải giá đóng cửa ngày như bản cũ dùng `resolution=1D`.
3. Không cấu hình được proxy thì gọi thẳng Entrade (nhiều khả năng bị CORS chặn).
4. `syncAllLivePrices(heldSymbols)` lấy giá cho **mọi mã đang nắm giữ và cả watchlist**,
   không chỉ riêng TPB như bản cũ. Trả về `{ liveCount, total }` để UI báo cáo trung thực
   bao nhiêu mã thực sự lấy được giá thực.

**Cấu hình:** đặt `VITE_MARKET_PROXY_URL` trong `frontend/.env` trỏ tới domain Worker đã deploy.

**Giới hạn còn lại:** app vẫn cập nhật theo lần bấm nút, chưa có WebSocket/polling tự động.

---

## 10. 🧪 NGUYÊN TẮC KIỂM THỬ (bài học từ bộ test cũ)

Bộ test cũ khai báo hằng số ngay trong test rồi assert lại chính hằng số đó
(`const marginDebt = 6898107 + 103944; assert(marginDebt === 7002051)`). Kiểu test này
**luôn PASS kể cả khi app sai hoàn toàn** — nó từng báo 20/20 PASS trong khi test khẳng định
NAV 7,498,120 còn app hardcode 7,598,120.

**Quy tắc bắt buộc từ nay:**
1. Test về tiền phải **import đúng module app đang chạy**, không được chép lại công thức.
2. Chuẩn đối chiếu là **ảnh chụp số dư thật trên DNSE**, không phải kỳ vọng của lập trình viên.
3. `scripts/test-deal-model.mjs` là nguồn kiểm chứng duy nhất cho Nợ / NAV / Lãi lỗ / Hòa vốn.
4. Có test quét mã nguồn chặn hằng số ảnh chụp số dư quay lại (test 13).

---

## 11. 🖥️ BA LỖI TRẢI NGHIỆM ĐÃ SỬA (28/08/2026)

### 11.1 Biểu đồ không đổi theo mã đang chọn

Bản cũ nhúng iframe `s.tradingview.com/widgetembed/?symbol=...&symboledit=1` — endpoint nội bộ
không có tài liệu. Tham số `symboledit=1` cho phép widget TỰ GHI NHỚ mã cuối vào localStorage
của chính tradingview.com; khi mã trong URL không khớp thứ nó nhớ, nó lặng lẽ hiện lại mã cũ.
Đó là lý do chọn VCB/TCB nhưng biểu đồ vẫn là Apple Inc.

Đã thay bằng widget CHÍNH THỨC (`embed-widget-advanced-chart.js`) trong
`components/TradingViewChart.tsx`: mã truyền qua cấu hình JSON, widget được DỰNG LẠI mỗi
lần đổi mã. Sàn niêm yết lấy từ dữ liệu của chính mã đó thay vì hai mảng cứng.

Thêm hai lớp bảo vệ để không bao giờ sai âm thầm nữa:
- Badge **"Đang yêu cầu: HOSE:VCB"** luôn hiện góc phải biểu đồ — nhìn là biết chart có đúng mã không
- Không dựng được widget trong 8 giây thì hiện cảnh báo + nút mở thẳng trên tradingview.com

### 11.2 Hỏi phong cách Capy trước khi đăng nhập

`isStylePickerOpen` khởi tạo thẳng từ localStorage, không hề tham chiếu trạng thái đăng nhập,
nên modal bật ngay lúc dựng giao diện và đè lên cả màn hình đăng nhập của khách mới.

Đã sửa: chỉ mở SAU KHI có `user`. Khoá ghi nhớ đổi từ toàn cục `ckv_style_initialized`
sang theo từng tài khoản `ckv_style_initialized_<userId>` — mỗi thành viên mới vẫn được
hỏi một lần của riêng họ thay vì bị bỏ qua vì máy đã từng có người khác chọn.

### 11.3 Phải tự bấm nút Đồng Bộ

Không hề có bộ hẹn giờ nào. Đã thêm `lib/useAutoSync.ts` + `lib/syncSchedule.ts`:

| Mốc | Giờ Việt Nam |
|---|---|
| Sáng (mở cửa) | 09:20 |
| Trưa (nghỉ giữa phiên) | 11:40 |
| Chiều (sau ATC) | 15:05 |
| Tối (chốt ngày) | 20:00 |

- Mỗi mốc chạy ĐÚNG một lần mỗi ngày (dấu vết `ngày|mốc` trong localStorage) — mở app 10 lần không đồng bộ 10 lần
- Tắt máy cả ngày rồi mở lúc 21h: chỉ chạy mốc mới nhất, không dồn 4 lần
- Trong phiên (T2-T6, 09:00-15:00) làm tươi giá mỗi 2 phút, bỏ qua khi tab đang ẩn
- Chỉ chạy khi ĐÃ đăng nhập
- Logic giờ giấc tách riêng ở `syncSchedule.ts` để kiểm thử thật bằng `scripts/test-auto-sync.mjs` (8/8 PASS)

**Lưu ý về import:** module nào cần kiểm thử bằng Node phải viết đuôi `.ts` tường minh trong
đường dẫn tương đối (`from '../services/dealModel.ts'`). Vite và `allowImportingTsExtensions`
đều chấp nhận, còn Node ESM thì bắt buộc.
