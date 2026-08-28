# 🗄️ Thư mục SQL — chạy file nào, khi nào

Tất cả chạy trong **supabase.com → dự án → SQL Editor → dán → RUN**.

| File | Chạy khi nào | Có ghi đè số dư không? |
|---|---|---|
| **`01-cau-truc.sql`** | Lần đầu dựng dự án, hoặc khi app báo thiếu cột | ❌ Không. An toàn chạy lại bao nhiêu lần cũng được. |
| **`02-nap-moc-doi-chieu.sql`** | Chỉ khi muốn đưa số dư về mốc 28/08/2026 đã đối chiếu | ⚠️ **CÓ**. Đừng chạy nếu số dư hiện tại đang đúng. |
| **`03-kiem-tra.sql`** | Sau khi chạy 01, hoặc bất cứ lúc nào nghi số lệch | ❌ Không. Chỉ đọc. |

## Tình huống thường gặp

**Máy mới / dự án Supabase mới:** chạy `01` → `02` → `03`.

**Đã chạy `CAP-NHAT-SUPABASE.sql` trước đây rồi:**
Chạy thêm `01-cau-truc.sql` cho chắc chắn (nó không đụng số dư), rồi `03-kiem-tra.sql` để xác nhận.
**Không cần** chạy `02` — dữ liệu của bạn đã đúng rồi, chạy `02` sẽ ghi đè ngược về mốc cũ.

**App báo "Bảng thiếu cột ... — hãy chạy sql/01-cau-truc.sql":**
Chạy `01-cau-truc.sql`. Đó chính là thông báo app tự phát ra khi phát hiện cột chưa có.

**Nghi ngờ số liệu lệch:** chạy `03-kiem-tra.sql`, đọc cột "Kiểm tra".

## Nguyên tắc

Cấu trúc bảng ở đây phải luôn khớp với danh sách cột trong
[`frontend/src/services/api.ts`](../frontend/src/services/api.ts)
(`PORTFOLIO_COLUMNS`, `POSITION_COLUMNS`, `TRANSACTION_COLUMNS`).

Lệch nhau là app ghi dữ liệu thất bại — PostgREST huỷ **toàn bộ** lệnh ghi chỉ vì một cột lạ.
Đúng lỗi này đã khiến app im lặng không lưu được gì suốt từ 25/08/2026.

`scripts/test-sql-schema.cjs` tự động đối chiếu hai bên, nên đổi cột ở một nơi mà quên nơi kia
sẽ bị test chặn lại ngay.

Các con số tiền trong `02` chỉ là **điểm khởi đầu**, không phải nguồn sự thật.
Nguồn sự thật duy nhất là [`frontend/src/services/dealModel.ts`](../frontend/src/services/dealModel.ts).
