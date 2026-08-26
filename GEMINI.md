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

## 3. 🛡️ Ranh Giới Quyền Hạn (Antigravity Agent Guardrails)
- **ĐƯỢC TỰ ĐỘNG THỰC HIỆN TOÀN BỘ**:
  - Đọc tài liệu, rà soát toàn bộ codebase, sửa code frontend, thuật toán, biểu đồ, lãi suất.
  - Chạy toàn bộ test suites và sửa lỗi triệt để.
  - Gom nhóm commit Conventional Commits (`akigitcommit`).
  - Tự động `git push origin master` để triển khai lên Cloudflare Pages.
- **CHỈ HỎI Ý KIẾN KHI**:
  - Kích hoạt hội đồng tốn token (/akiflow).
  - Tải và thực thi các file binary không rõ nguồn gốc từ Internet.

## 4. 📚 Bộ Kỹ Năng & Quy Tắc
- Hướng dẫn kỹ năng Aki: [tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md](tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md).