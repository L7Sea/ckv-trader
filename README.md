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

### 2. Quản Trị Vị Thế Thực Tế (Anh Hải - VIP Trader - DNSE 26/08/2026 10h11)
- **Vị thế cổ phiếu:** 1,000 CP TPB (Giá vốn hòa vốn Deal: 15.920đ, Thị giá: 14.400đ, Giá trị: 14.400.000đ).
- **Tiền mặt khả dụng:** 171 đ.
- **Tổng Nợ Margin thực tế:** 7.002.051 đ (Gốc vay Deal: 6.898.107đ + Lãi vay Margin tích luỹ: 103.944đ).
- **Lãi suất vay Margin Deal thực tế:** 11.50%/năm (~2,173 đ/ngày).
- **Tài sản ròng thực có (NAV):** 7.398.120 đ (Tỷ lệ tự có Deal: 51.22%).
- **Lỗ chưa chốt Deal:** -1.518.116 đ (-9.62%).

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY & TRIỂN KHAI

### 1. Khởi chạy 1-Click trên máy tính:
Chỉ cần nhấp đúp chuột vào file:
👉 **`start-all.bat`** (Tự động mở tại `http://localhost:3000`)

### 2. Triển khai Cơ sở dữ liệu Supabase:
1. Tạo dự án mới tại [supabase.com](https://supabase.com).
2. Mở mục **SQL Editor**, dán toàn bộ nội dung file **`schema.sql`** và bấm **Run**.
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
├── schema.sql                # Supabase PostgreSQL Database Schema
├── start-all.bat             # 1-Click Launch Script
├── connect-github.bat        # 1-Click GitHub Sync Script
└── deploy-to-cloudflare.bat  # 1-Click Cloudflare Deploy Script
```
