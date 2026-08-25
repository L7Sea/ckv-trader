# CKV - HỆ THỐNG QUẢN LÝ GIAO DỊCH CHỨNG KHOÁN CÁ NHÂN (T+2.5)

Ứng dụng quản trị giao dịch chứng khoán cá nhân chuyên nghiệp, tuân thủ nghiêm ngặt chu kỳ thanh toán T+2.5 của thị trường chứng khoán Việt Nam, tính giá vốn bình quân gia quyền (Weighted Average Cost Price), quản lý tiền chờ về và kiểm soát rủi ro vị thế.

---

## 🏗️ KIẾN TRÚC KỸ THUẬT (TECH STACK)
- **Frontend:** React 18, TypeScript, TailwindCSS, Zustand State Management, Lucide Icons, Vite.
- **Backend:** Cloudflare Workers + Hono.js (Chạy Serverless siêu tốc tại Edge).
- **Database:** Firebase Firestore (Kết nối bằng REST API với Atomic Batch Write để đảm bảo tính toàn vẹn dữ liệu).
- **Ràng buộc:** 100% Serverless, miễn phí vĩnh viễn, không phụ thuộc API bên ngoài.

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
- **Nút "Chốt ngày (T+2.5)":**
  - Hàng T+1 $\rightarrow$ Hàng Khả dụng (sẵn sàng bán).
  - Hàng T+2 $\rightarrow$ Hàng T+1.
  - Tiền chờ về $\rightarrow$ Tiền mặt khả dụng.

### 2. Tính toàn vẹn dữ liệu (Atomic Batch Write)
Tất cả các thao tác thay đổi số dư tiền (`Portfolio`), vị thế cổ phiếu (`Position`), và lưu nhật ký (`Transaction`) đều được đóng gói trong một lệnh **Batch Commit duy nhất lên Firestore**. Không bao giờ xảy ra tình trạng bị trừ tiền nhưng thiếu cổ phiếu.

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY 1-CLICK

Chỉ cần nhấp đúp chuột vào file:
👉 **`start-all.bat`**

Hệ thống sẽ tự động bật cả Backend và Frontend, đồng thời mở trình duyệt web tại địa chỉ:
**`http://localhost:3000`**

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN
```text
CKV/
├── backend/                  # Cloudflare Worker API
│   ├── src/
│   │   ├── types.ts          # Định nghĩa kiểu dữ liệu TypeScript
│   │   ├── firestore.ts      # REST API Wrapper Firestore & Batch Write
│   │   └── worker.ts         # Core Trading Engine & API Hono
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.toml
│
├── frontend/                 # Giao diện người dùng React
│   ├── src/
│   │   ├── components/       # Header, OrderForm, PortfolioOverview, PositionsTable, Modals
│   │   ├── services/         # API Client kết nối Backend
│   │   ├── store/            # Quản lý State bằng Zustand
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── start-all.bat             # File khởi động 1-Click
└── README.md
```
