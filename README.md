# CKV PRO TRADER - HỆ THỐNG QUẢN LÝ CHỨNG KHOÁN & 150 THUẬT TOÁN ĐỊNH LƯỢNG (T+2.5)

Ứng dụng quản trị giao dịch chứng khoán cá nhân chuẩn Siêu ứng dụng Fintech (MoMo / ZaloPay / Shopee), tuân thủ nghiêm ngặt chu kỳ thanh toán T+2.5 của thị trường chứng khoán Việt Nam, tích hợp **150 thuật toán định lượng đa lớp**, Smart Stock Auto-Fetcher và kết nối cơ sở dữ liệu **Supabase PostgreSQL**.

---

## 🏗️ KIẾN TRÚC KỸ THUẬT (TECH STACK)
- **Frontend:** React 18, TypeScript, TailwindCSS, Zustand State Management, Lucide Icons, Vite.
- **Backend:** Cloudflare Workers + Hono.js (Chạy Serverless siêu tốc tại Edge toàn cầu).
- **Database:** Supabase PostgreSQL (PostgREST API, Row Level Security RLS, Realtime ACID).
- **Phân Tích Định Lượng:** 150 Mô hình toán học & tài chính (Trend, Momentum, Volatility, Volume, Price Action, Pivots, Risk MPT, Valuation, Financial Health, AI Alpha).
- **Ràng buộc:** 100% Serverless, miễn phí vĩnh viễn, bảo mật cao cấp.

---

## 💼 LOGIC NGHIỆP VỤ CỐT LÕI

### 1. Chu kỳ thanh toán T+2.5
- **Khi MUA cổ phiếu:**
  - Tiền mặt bị trừ ngay lập tức (kèm phí giao dịch 0.15%).
  - Cổ phiếu mua mới được chuyển vào rổ **`t2_quantity`** (Hàng T+2).
  - Tự động tính toán lại **Giá vốn bình quân gia quyền**:
    $$\text{Giá vốn mới} = \frac{\text{Giá trị vốn cũ} + \text{Giá trị mua mới (gồm phí)}}{\text{Tổng khối lượng mới}}$$
- **Khi BÁN cổ phiếu:**
  - Hệ thống kiểm tra chặt chẽ: Chỉ cho phép bán từ rổ **`available_quantity`** (Cổ phiếu khả dụng). **Tuyệt đối không cho bán hàng T+1, T+2**.
  - Tiền thu về (sau khi trừ phí 0.15% và thuế 0.1%) được chuyển vào rổ **`receiving_cash`** (Tiền chờ về).
  - Tự động ghi nhận **Lãi/Lỗ thực hiện (Realized PnL)** vào lịch sử giao dịch.
- **Nút "Chốt ngày T+2.5":**
  - Hàng T+1 $\rightarrow$ Hàng Khả dụng (sẵn sàng bán).
  - Hàng T+2 $\rightarrow$ Hàng T+1.
  - Tiền chờ về $\rightarrow$ Tiền mặt khả dụng.

### 2. Mô Hình Tiền Của Deal (đối chiếu DNSE 28/08/2026 06:26)

Mọi con số tiền được **tính** từ `frontend/src/services/dealModel.ts`, không hardcode.

- **Vị thế:** 1,000 CP TPB · **Tiền mặt:** 171 đ
- **Vốn tự có:** 8.891.893 đ · **Dư nợ gốc vay:** 6.898.107 đ · **Tổng giải ngân:** 15.790.000 đ
- **Ngày mốc tính lãi (N=0):** 13/07/2026
- **Lãi suất vay thực tế:** **12.5%/năm** (~2.362 đ/ngày) — đo từ chênh lệch dư nợ 3 ngày liên tiếp
- **Chi phí Deal đội vào giá vốn:** 2.617 đ/ngày (2.362 lãi vay + 255 phí Deal)

Tại 28/08/2026, giá TPB 14.700:

| | App tính ra | DNSE hiển thị |
|---|---|---|
| Tổng nợ Margin | 7.006.776 đ | 7.006.776 đ |
| Tài sản ròng (NAV) | 7.693.395 đ | 7.693.395 đ |
| Lãi chưa chốt | −1.223.158 đ (−7,75%) | −1.223.158 đ (−7,75%) |

Kiểm chứng: `node scripts/test-deal-model.mjs` (15/15 PASS, đối chiếu 3 mốc số dư thật).

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY & TRIỂN KHAI

### 1. Khởi chạy 1-Click trên máy tính:
Chỉ cần nhấp đúp chuột vào file:
👉 **`start-all.bat`** (Tự động mở tại `http://localhost:3000`)

### 2. Triển khai Cơ sở dữ liệu Supabase:
1. Tạo dự án mới tại [supabase.com](https://supabase.com).
2. Mở mục **SQL Editor**, chạy **`sql/01-cau-truc.sql`** rồi **`sql/02-nap-moc-doi-chieu.sql`**, cuối cùng **`sql/03-kiem-tra.sql`** để xác nhận. Chi tiết: [sql/README.md](sql/README.md).
3. Lấy `Project URL` và `Anon Key` điền vào `backend/wrangler.toml` hoặc `.env`.

### 3. Triển khai Cloudflare Pages & Workers:
👉 **`deploy-to-cloudflare.bat`** hoặc truy cập bản Online: **`https://ckv-trader.pages.dev`**.

---

## 📁 CẤU TRÚC THƯ MỤC TỐI ƯU (CLEAN CODEBASE)
```text
CKV/
├── backend/                  # Cloudflare Worker API & Supabase Client
│   ├── src/
│   │   ├── types.ts          # TypeScript Data Contracts
│   │   ├── supabase.ts       # Supabase REST Client
│   │   ├── server.ts         # Local Node.js Dev Server
│   │   └── worker.ts         # Core Trading Engine & Hono Endpoints
│   ├── wrangler.toml         # Cloudflare Worker Environment Config
│   └── package.json
│
├── frontend/                 # Giao diện React Super-App Fintech
│   ├── src/
│   │   ├── components/       # Master Card, 150 Algos, Radar, Decision Engine
│   │   ├── services/         # Prediction Engine (150 algos), Market Data Fetcher
│   │   ├── store/            # Zustand Central State Management
│   │   └── App.tsx           # Mobile Bottom Nav & Super-App Shell
│   └── package.json
│
├── scripts/                  # Bộ công cụ kiểm thử nghiệp vụ & mô phỏng
│   ├── test-trading-formulas.cjs   # Formula & 150 Algorithms Unit Test Suite
│   └── bot-simulate-trading.cjs    # Live Bot Simulator
│
├── sql/                      # Cấu trúc & dữ liệu Supabase (xem sql/README.md)
├── start-all.bat             # 1-Click Launch Script
├── connect-github.bat        # 1-Click GitHub Sync Script
└── deploy-to-cloudflare.bat  # 1-Click Cloudflare Deploy Script
```
