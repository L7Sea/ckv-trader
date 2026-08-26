# CKV PRO TRADER — QUY TẮC DỰ ÁN & CHỈ DẪN GOOGLE ANTIGRAVITY (GEMINI.md)
*Single Source of Truth: tài liệu/CONTEXT.md*

## 1. 🎯 Bối Cảnh & Kiến Trúc Dự Án
- **Chủ dự án**: CKV Pro Trader VIP.
- **Bản chất App**: Nền tảng giao dịch và phân tích định lượng chứng khoán Việt Nam (HOSE, HNX, UPCOM - 300 mã), Sổ lệnh 3 cấp thời gian thực (DNSE style), Biểu đồ nến Pro đa khung thời gian, Hệ thống Lãi suất vĩ mô 20 Ngân hàng & Top 10 FinTech, Trợ lý Capy Gunny.
- **Kiến trúc 8 Trang Độc Lập**: `/src/pages/` gồm 8 file trang riêng biệt (`TradePositionsPage`, `PositionRiskPage`, `RadarAlgorithmsPage`, `MarketBoardChartPage`, `MacroRatesPage`, `MarketIntelligencePage`, `PortfolioAllocationPage`, `PerformanceAnalyticsPage`).
- **Tech Stack**: React 19 + TypeScript + Vite 6 + Tailwind CSS + Lucide Icons + Cloudflare Pages.
- **Tài liệu bối cảnh chi tiết**: Bắt buộc đọc [tài liệu/CONTEXT.md](tài liệu/CONTEXT.md), [tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md](tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md) và [README.md](README.md).

## 2. ⚡ QUY TRÌNH CHUẨN KHI BẮT ĐẦU HOẶC NHẬN LỆNH "DÒ XÉT LẠI TOÀN APP" (SOP)
Bất cứ khi nào khởi động phiên làm việc mới trên máy tính mới hoặc khi người dùng yêu cầu **"dò xét lại toàn app"** (hoặc câu lệnh tương tự):
1. **ĐỌC TOÀN BỘ 4 TÀI LIỆU CỐT LÕI**: `GEMINI.md`, `tài liệu/CONTEXT.md`, `tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md`, `README.md`.
2. **ÁP DỤNG TRIỆT ĐỂ BỘ 10 SKILLS & 18 RULES**: Tuân thủ Single Source of Truth, Fact-checking, không ảo giác, phân tách rạch ròi 8 trang, điều hướng chéo mượt mà.
3. **CHẠY BỘ 3 LỆNH TEST BẮT BUỘC 100% PASS**:
   ```bash
   node scripts/test-trading-formulas.cjs   # 10/10 bài test toán học định lượng & vĩ mô
   node scripts/test-sql-schema.cjs         # 13/13 bài test toàn vẹn mô hình dữ liệu SQL
   npm --prefix frontend run build          # Biên dịch sạch sẽ 100%, 0 lỗi TypeScript
   ```
4. **TỰ ĐỘNG ĐẨY LÊN GITHUB / CLOUDFLARE PAGES**:
   - Chủ nhân đã **ỦY QUYỀN THƯỜNG TRỰC** tự động commit và push (`git push origin master`) sau mỗi lần cập nhật hoặc hoàn thành phiên bản mà không cần hỏi lại.
   - Cloudflare Pages CI/CD sẽ tự động bắt commit và deploy trực tiếp lên Production.

## 3. 🛡️ CƠ CHẾ PHÂN LUỒNG MỆNH LỆNH & RANH GIỚI HÀNH ĐỘNG (STRICT GUARDRAILS)
AI phải nhận diện chính xác ý định của Chủ nhân để chọn đúng 1 trong 2 chế độ:

### 🔎 CHẾ ĐỘ 1: BÁO CÁO / RÀ SOÁT / TÌM LỖI (INSPECT & ADVISORY MODE)
- **Dấu hiệu kích hoạt**: Khi Chủ nhân yêu cầu *"báo cáo lỗi sai"*, *"chỉ ra lỗi sai"*, *"dò xét lỗi sai"*, *"tìm lỗi và báo cáo"*, *"kiểm tra xem có lỗi gì không"*, *"tại sao con số này bị lệch..."*, hoặc hỏi phân tích/nguyên nhân.
- **Hành vi bắt buộc của AI**:
  - **CHỈ TẬP TRUNG CHUYÊN MÔN**: Phân tích toán học, thuật toán, tìm đúng nguyên nhân gốc rễ, đối chiếu số liệu thực tế, chỉ ra file và dòng code có vấn đề, và đề xuất hướng xử lý rõ ràng.
  - **TUYỆT ĐỐI KHÔNG**: **Không tự tiện sửa code, không chạy build, không commit, không push lên Cloudflare/GitHub trong chế độ này.**

### ⚡ CHẾ ĐỘ 2: THỰC THI & SỬA CODE / PUSH DEPLOY (EXECUTION & DEPLOY MODE)
- **Dấu hiệu kích hoạt**: Chỉ khi Chủ nhân ra lệnh rõ ràng: *"sửa và push"*, *"sửa cho tôi đi"*, *"tiến hành sửa"*, *"áp dụng giải pháp trên và đẩy lên cloudflare"*, *"dò xét và sửa lại toàn app"*.
- **Hành vi bắt buộc của AI**:
  1. Sửa code triệt để theo đúng phương án đã phân tích.
  2. Tự động cập nhật bối cảnh mới vào `tài liệu/CONTEXT.md` (Single Source of Truth).
  3. Tự động cập nhật test case vào `scripts/test-trading-formulas.cjs`.
  4. Chạy bộ 3 lệnh test (100% PASS):
     ```bash
     node scripts/test-trading-formulas.cjs
     node scripts/test-sql-schema.cjs
     npm --prefix frontend run build
     ```
  5. Tự động commit chuẩn Conventional Commits và `git push origin master` lên Cloudflare Pages.

## 4. 📂 Phân Định Rạch Ròi Vai Trò 4 Tài Liệu Cốt Lõi (Tránh Trùng Lặp)
1. **`GEMINI.md`** *(File này - Luật Tối Cao cho AI)*: Quy định hành vi, SOP khởi động máy mới, phân luồng mệnh lệnh Inspect vs Execute, phân quyền và ranh giới hành động của AI Agent.
2. **`tài liệu/CONTEXT.md`**: **Single Source of Truth** — Chứa toàn bộ tri thức nghiệp vụ, số liệu tài sản thực tế thời gian thực, ma trận lãi suất, cấu trúc 8 trang và công thức toán học.
3. **`tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md`**: Cẩm nang kỹ thuật về 10 Skills, 18 Rules và phương pháp luận Aki.
4. **`README.md`**: Bản giới thiệu dự án cho con người/developer đọc, Tech Stack, hướng dẫn khởi chạy 1-Click và luồng nghiệp vụ tổng quan.

## 5. 🔄 Cơ Chế Tự Động Cập Nhật Bối Cảnh & Bộ Test (Continuous Context Evolution)
Bất cứ khi nào Chủ nhân cung cấp thông tin mới (ảnh chụp số dư thực tế, lãi suất vay mới, công thức mới, thêm trang/mã mới):
1. **Tự Động Cập Nhật Bối Cảnh**: Cập nhật ngay vào `tài liệu/CONTEXT.md` (và `README.md` nếu là thông số lớn) để tài liệu luôn phản ánh đúng 100% thực tế.
2. **Tự Động Đồng Bộ Bộ Test**: Bổ sung test case tương ứng vào `scripts/test-trading-formulas.cjs` hoặc `scripts/test-sql-schema.cjs`.
3. **Sửa Code & Chạy Test 100% Pass**: Đảm bảo code và test luôn đồng bộ với bối cảnh mới nhất (khi ở Chế độ Thực thi).
4. **Tự Động Đẩy Lên Cloudflare Pages**: Commit và `git push origin master` ngay lập tức.