# 📘 TÀI LIỆU BỐI CẢNH DỰ ÁN CKV PRO TRADER (REALTIME CONTEXT)
*Cập nhật thời gian thực: 26/08/2026*

---

## 1. 🎯 TỔNG QUAN HỆ THỐNG CKV PRO TRADER
**CKV Pro Trader** là nền tảng giao dịch và phân tích định lượng chứng khoán Việt Nam chuyên sâu dành cho nhà đầu tư chuyên nghiệp (VIP Trader).

### Trọng Tâm Kiến Trúc:
1. **Dữ Liệu 300 Mã Cổ Phiếu Toàn Thị Trường**:
   - 100 mã đầu ngành sàn HOSE (FPT, MWG, TPB, ACB, HPG, SSI, VND, VCB, MBB, VIC...).
   - 100 mã sàn HNX (SHS, IDC, PVS, CEO, MBS, NVB, TNG, VCS...).
   - 100 mã sàn UPCOM (BSR, VGI, C4G, ABB, QNS, MCH, VEA...).
2. **Hệ Thống 150 Thuật Toán Định Lượng & Lãi Suất Vĩ Mô**:
   - Top 20 Ngân hàng Việt Nam (Big 4, TMCP Top 1, TMCP Mid) + Top 10 Ví điện tử & Fintech (MoMo Túi Thần Tài, ZaloPay, Viettel Money, Tikop, Finhay, SPayLater, Cake...).
   - Tính toán Equity Risk Premium (ERP), P/E Fair Value, tối ưu chi phí đòn bẩy Margin DNSE (9.99%) và tối ưu lợi suất tiền mặt nhàn rỗi.
3. **Biểu Đồ Kỹ Thuật Nến Pro Natively Rendered**:
   - Đồ thị nến Nhật Bản OHLCV tương tác trực tiếp 100% thời gian thực.
   - Hỗ trợ đa khung thời gian: 15 Phút, 60 Phút, 1 Ngày, 1 Tuần, 1 Tháng.
   - Tích hợp chỉ báo MA20, MA50, EMA9, Volume Histogram, Crosshair Tooltip, tuyệt đối không bị chặn bản quyền, không bị popup hay lỗi Apple Inc.
4. **Sổ Lệnh 3 Cấp & Khớp Lệnh Realtime (DNSE Entrade X Style)**:
   - Bảng bước giá 3 cấp đối xứng Mua / Bán với % độ sâu dòng tiền và Time & Sales theo từng giây.
5. **Trợ Lý Capy Thông Minh (Gunny Slingshot + 500+ Câu Thoại Chuẩn Cảm Xúc)**:
   - Kéo thả tự do quanh màn hình.
   - Giữ 3 giây kích hoạt Chế Độ Bắn Gunny với lực cực đại, đập nảy tường 4-6 lần.
   - Nhấn đúp 2 lần $\rightarrow$ Phân tích và đưa ra 1 mã khuyến nghị tốt nhất hôm nay, đồng bộ toàn app sang TradingView/Sổ lệnh.

---

## 2. 🗄️ CẤU TRÚC DỮ LIỆU SQL & QUY TẮC RÀNG BUỘC
- Bảng `positions`: Lưu trữ danh mục cổ phiếu, giá vốn bình quân gia quyền, khối lượng khả dụng, khối lượng chờ về (T1, T2).
- Bảng `stock_orders`: Quản lý sổ lệnh mua/bán, trạng thái khớp lệnh (PENDING, FILLED, CANCELLED).
- Bảng `transactions`: Nhật ký giao dịch tiền mặt, khấu trừ thuế 0.1% + phí 0.15% (tổng 0.25% khi bán).
- Bảng `margin_accounts`: Quản lý hạn mức vay Margin DNSE, tỷ lệ ký quỹ an toàn $R_{margin} = NAV / Total\_Assets$.

---

## 3. 🧪 BỘ KIỂM THỬ TỰ ĐỘNG CỦA CKV
- `node scripts/test-trading-formulas.cjs`: 10/10 bài test toán học & vĩ mô đạt chuẩn 100%.
- `node scripts/test-sql-schema.cjs`: Kiểm thử toàn vẹn mô hình dữ liệu và nghiệp vụ sổ cái SQL.
