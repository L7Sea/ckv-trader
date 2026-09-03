# CKV PRO TRADER — QUY TẮC DỰ ÁN & CHỈ DẪN GOOGLE ANTIGRAVITY (GEMINI.md)
*Single Source of Truth: tài liệu/CONTEXT.md*

## 1. 🎯 Bối Cảnh & Kiến Trúc Dự Án
- **Chủ dự án**: CKV Pro Trader VIP.
- **Bản chất App**: Nền tảng giao dịch và phân tích định lượng chứng khoán Việt Nam (HOSE, HNX, UPCOM - 300 mã), Sổ lệnh 3 cấp thời gian thực (DNSE style), Biểu đồ nến Pro đa khung thời gian, Hệ thống Lãi suất vĩ mô 20 Ngân hàng & Top 10 FinTech, Trợ lý Capy Gunny.
- **Kiến trúc 9 Trang Độc Lập**: `/src/pages/` gồm 9 file trang riêng biệt (`TradePositionsPage`, `PositionRiskPage`, `RadarAlgorithmsPage`, `MarketBoardChartPage`, `MacroRatesPage`, `MarketIntelligencePage`, `PortfolioAllocationPage`, `PerformanceAnalyticsPage`, `NhatKyLuanDiemPage`).
- **Tech Stack**: React 19 + TypeScript + Vite 6 + Tailwind CSS + Lucide Icons + Cloudflare Pages.
- **Tài liệu bối cảnh chi tiết**: Bắt buộc đọc [tài liệu/CONTEXT.md](tài liệu/CONTEXT.md), [tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md](tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md) và [README.md](README.md).

## 2. ⚡ QUY TRÌNH CHUẨN KHI BẮT ĐẦU HOẶC NHẬN LỆNH "DÒ XÉT LẠI TOÀN APP" (SOP)
Bất cứ khi nào khởi động phiên làm việc mới trên máy tính mới hoặc khi người dùng yêu cầu **"dò xét lại toàn app"** (hoặc câu lệnh tương tự):
1. **ĐỌC TOÀN BỘ 4 TÀI LIỆU CỐT LÕI**: `GEMINI.md`, `tài liệu/CONTEXT.md`, `tài liệu/HUONG_DAN_SU_DUNG_SKILLS_VA_RULES_AKIDEVRULE.md`, `README.md`.
2. **ÁP DỤNG TRIỆT ĐỂ BỘ 10 SKILLS & 18 RULES**: Tuân thủ Single Source of Truth, Fact-checking, không ảo giác, phân tách rạch ròi 8 trang, điều hướng chéo mượt mà.
3. **CHẠY BỘ TEST BẮT BUỘC 100% PASS**:
   ```bash
   node scripts/test-deal-model.mjs         # 15/15 - đối chiếu Nợ/NAV/Lãi lỗ với số dư thật DNSE
   node scripts/test-trading-formulas.cjs   # 20/20 bài test toán học định lượng & vĩ mô
   node scripts/test-sql-schema.cjs         # 17/17 bài test toàn vẹn mô hình dữ liệu SQL
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
  3. Tự động cập nhật test case. Test về TIỀN (Nợ/NAV/Lãi lỗ/Hòa vốn) vào `scripts/test-deal-model.mjs` — **bắt buộc import module thật và đối chiếu số dư thật trên DNSE, cấm chép lại công thức vào test**. Test nghiệp vụ khác vào `scripts/test-trading-formulas.cjs`.
  4. Chạy bộ test (100% PASS):
     ```bash
     npm run test:all
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
2. **Tự Động Đồng Bộ Bộ Test**: Bổ sung test case vào `scripts/test-deal-model.mjs` (mọi thứ liên quan đến tiền), `scripts/test-trading-formulas.cjs` hoặc `scripts/test-sql-schema.cjs`.
3. **Sửa Code & Chạy Test 100% Pass**: Đảm bảo code và test luôn đồng bộ với bối cảnh mới nhất (khi ở Chế độ Thực thi).
4. **Tự Động Đẩy Lên Cloudflare Pages**: Commit và `git push origin master` ngay lập tức.

## 6. 🎨 LUẬT GIAO DIỆN (skill `giao-dien-ui-design`)

Mỗi lần đụng vào giao diện phải theo công thức 7 bước trong skill
`giao-dien-ui-design`. **Bước 6 (ĐO bằng máy) là bắt buộc** — chưa chạy
`~/.claude/skills/giao-dien-ui-design/scripts/do-tuong-phan.js` thì chưa được
nói là xong.

**App này dùng Tailwind**, nên token nằm ở `frontend/tailwind.config.js` chứ
không phải file CSS. Ba luật vẫn giữ nguyên:

1. **Mỗi vai trò màu cần HAI token**: một cho NỀN, một cho CHỮ. Một màu không
   gánh được hai vai — màu đủ sẫm để chữ trắng đọc được trên nút thì lại quá sẫm
   để tự nó làm chữ trên nền sáng.
2. **Không rải class màu tuỳ tiện.** Hiện có **2.140 lượt dùng class màu với 34
   sắc khác nhau** — đó là con số của một hệ màu chưa được đặt tên. Màu mới phải
   khai trong `tailwind.config.js` trước.
3. **Tương phản chữ/nền ≥ 4,5** (chữ ≥24px hoặc ≥19px đậm thì 3,0).

**Diện mạo app này PHẢI KHÁC app Trần Long Sales.** Dùng chung *kỷ luật*, không
dùng chung *bảng màu*.

## 7. 🧹 DỌN MÃ CHẾT

```bash
npm run tim:codechet          # chỉ BÁO, không xoá
node scripts/xoa-code-chet.cjs <file> <tênExport> [...]   # xoá + tự build kiểm
```

`xoa-code-chet.cjs` **tự khôi phục nguyên vẹn nếu build hỏng** — đã cứu một lần
thật khi bộ khớp ngoặc cắt nhầm giữa file.

⚠ Ba thứ **KHÔNG** phải mã chết: gọi qua chuỗi động · điểm vào app · thứ nằm
trong danh sách `MIEN_TRU` (có ghi lý do). Ví dụ `locSvg` là bộ lọc an toàn
SVG — chưa ai gọi vì bảng meme chưa gắn, nhưng xoá nó là bỏ luôn lớp chặn.

## 8. 🗺 SƠ ĐỒ APP

```bash
node ~/.claude/skills/ban-do-trang-route-map/scripts/quet-duong-dan.cjs . --mermaid
```

⚠ **App này chưa có router.** Chạy lệnh trên sẽ ra thông báo giải thích, không
ra sơ đồ — vì 8 "trang" thực chất là component đổi qua biến `activeTab`.
Xem mục hạn chế bên dưới.

## 9. ⚠ HAI HẠN CHẾ LỚN NHẤT HIỆN TẠI

**1. Không có router.** `package.json` không có `react-router`. Hậu quả thật:
không có địa chỉ riêng cho từng màn → không lưu dấu trang, không gửi link được;
nút Back của trình duyệt **thoát hẳn app**; F5 là mất chỗ đang xem; không mở hai
màn cạnh nhau để so sánh. Tài liệu gọi đây là *"Kiến trúc 9 Trang Độc Lập"* —
đó là **ý định**, không phải hiện trạng.

**2. Phân quyền nằm trong máy người dùng.** `role: 'ADMIN'` lưu ở
`localStorage`; sửa một chữ trong DevTools là thành admin. Chấp nhận được khi
chỉ Chủ nhân dùng — **KHÔNG chấp nhận được** khi có khách hàng thật. Hàng rào
duy nhất có tác dụng là **RLS bật trên MỌI bảng** ở phía Supabase.
