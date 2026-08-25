# CKV PRO TRADER — QUY TẮC DỰ ÁN & CHỈ DẪN AGENT (CLAUDE.md)
*Single Source of Truth: tài liệu/CONTEXT.md*

## 1. 🎯 Bối Cảnh & Kiến Trúc Dự Án
- **Chủ dự án**: CKV Pro Trader VIP.
- **Bản chất App**: Nền tảng giao dịch và phân tích định lượng chứng khoán Việt Nam (HOSE, HNX, UPCOM - 300 mã), Sổ lệnh 3 cấp thời gian thực (DNSE style), Biểu đồ nến Pro đa khung thời gian, Hệ thống Lãi suất vĩ mô 20 Ngân hàng & Top 10 FinTech, Trợ lý Capy Gunny.
- **Tech Stack**: React 19 + TypeScript + Vite 6 + Tailwind CSS + Lucide Icons + Cloudflare Pages.
- **Tài liệu bối cảnh chi tiết**: Đọc [tài liệu/CONTEXT.md](tài liệu/CONTEXT.md) khi cần tra cứu chi tiết 150 thuật toán định giá, ma trận lãi suất, cấu trúc sổ lệnh hoặc biểu đồ nến.

## 2. 🧪 Tiêu Chuẩn Kiểm Thử Bắt Buộc Trước Khi Kết Thúc
Bất kỳ thay đổi code nào cũng phải vượt qua 100% các bộ kiểm thử tự động sau:
```bash
node scripts/test-trading-formulas.cjs   # 10/10 bài test toán học định lượng & vĩ mô
node scripts/test-sql-schema.cjs         # 8/8 bài test toàn vẹn mô hình dữ liệu SQL
npm --prefix frontend run build          # Biên dịch sạch sẽ 100%, 0 lỗi TypeScript
```

## 3. 🛡️ Ranh Giới Quyền Hạn (Agent Guardrails)
- **ĐƯỢC TỰ LÀM**:
  - Sửa code frontend, thuật toán định lượng, biểu đồ, máy tính lãi suất.
  - Chạy test, dọn code chết, làm sạch tài liệu qua npm run clean:md.
  - Gom nhóm commit sạch sẽ theo chuẩn Conventional Commits (akigitcommit).
  - Tự động kích hoạt tư duy akithink khi giải quyết bài toán phức tạp.
- **BẮT BUỘC PHẢI HỎI Ý KIẾN CHỦ NHÂN**:
  - Deploy lên Cloudflare Pages (deploy:pages / akiship).
  - Kích hoạt hội đồng tốn token (/akiflow).
  - Tải và thực thi các script từ Internet.

## 4. 📚 Bộ Kỹ Năng & Quy Tắc
- Hướng dẫn kỹ năng Aki: [tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md](tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md).