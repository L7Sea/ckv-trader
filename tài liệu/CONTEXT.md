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

4. **Dữ Liệu Tài Sản Thực Tế & Lãi Suất Vay Margin Deal (DNSE 26/08/2026 - 10h11)**:
   - **Vị thế**: 1,000 cổ phiếu TPB (Khả dụng: 1,000 CP).
   - **Thị giá**: 14.40 (14,400 đ/CP - Giảm -0.05 / -0.35% so với tham chiếu 14.45) $\rightarrow$ Giá trị CP: **14,400,000 đ**.
   - **Tiền mặt**: **171 đ**.
   - **Gốc vay Deal ban đầu**: **6,898,107 đ** (tổng ứng 6,997,221đ - đã trả 99,114đ).
   - **Lãi suất vay Margin Deal thực tế**: **11.50% / năm** ($\approx \mathbf{2,173 \text{ đ/ngày}}$).
   - **Lãi vay tích luỹ qua các ngày**: **103,944 đ** (Lãi đã trả trước đó: 1,256đ, Phí thuế deal: 22,916đ).
   - **Tổng Nợ Margin thực tế**: $6,898,107 + 103,944 = \mathbf{7,002,051 \text{ đ}}$.
   - **Tài Sản Ròng Thực Có (NAV)**: $14,400,171 - 7,002,051 = \mathbf{7,398,120 \text{ đ}}$.
   - **Giá hòa vốn Deal**: **15.920 (15,920 đ)**.
   - **Lãi/Lỗ chưa chốt Deal**: **-1,518,116 đ (-9.62%)**.
   - **Tỷ lệ ký quỹ Deal**: **51.22%**.
   - **Cơ chế Auto-Migration Cache**: Khóa phiên bản `ckv_data_version_lock` (`2026-08-26-1011-v4`) tự động làm mới LocalStorage của trình duyệt client và triệt tiêu mọi sai lệch giá ngẫu nhiên.

---

## 2. 🗄️ CẤU TRÚC DỮ LIỆU SQL & QUY TẮC RÀNG BUỘC
- Bảng `positions`: Lưu trữ danh mục cổ phiếu, giá vốn bình quân gia quyền, khối lượng khả dụng, khối lượng chờ về (T1, T2).
- Bảng `stock_orders`: Quản lý sổ lệnh mua/bán, trạng thái khớp lệnh (PENDING, FILLED, CANCELLED).
- Bảng `transactions`: Nhật ký giao dịch tiền mặt, khấu trừ thuế 0.1% + phí 0.15% (tổng 0.25% khi bán).
- Bảng `margin_accounts`: Quản lý hạn mức vay Margin DNSE, tỷ lệ ký quỹ an toàn $R_{margin} = NAV / Total\_Assets$.

---

## 3. 🧪 TIÊU CHUẨN KIỂM THỬ & TRIỂN KHAI TỰ ĐỘNG
- `node scripts/test-trading-formulas.cjs`: 10/10 bài test toán học & vĩ mô đạt chuẩn 100%.
- `node scripts/test-sql-schema.cjs`: 13/13 bài test toàn vẹn mô hình dữ liệu SQL.
- `npm --prefix frontend run build`: 100% sạch cảnh báo và 0 lỗi TypeScript.
- **Triển khai thường trực**: Tự động commit chuẩn Conventional Commits và đẩy thẳng lên Cloudflare Pages / GitHub (`git push origin master`) sau mỗi lần cập nhật.

---

## 4. 🔄 CƠ CHẾ TỰ ĐỘNG CẬP NHẬT BỐI CẢNH (REAL-TIME CONTEXT EVOLUTION)
Mỗi khi có thông tin tài chính mới, ảnh chụp màn hình hoặc công thức mới:
1. **Ghi đè Single Source of Truth**: Cập nhật ngay file này (`tài liệu/CONTEXT.md`) để bảo đảm mọi phiên làm việc tiếp theo luôn đọc được bối cảnh chính xác nhất.
2. **Cập nhật Test Suite**: Bổ sung kiểm thử vào `scripts/test-trading-formulas.cjs`.
3. **Cập nhật Code & Tự Động Deploy**: Sửa logic code, build và push thẳng lên Cloudflare Pages.


