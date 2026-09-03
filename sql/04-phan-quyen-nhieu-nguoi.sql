-- ═══════════════════════════════════════════════════════════════
-- 04. PHÂN QUYỀN THẬT — chuẩn bị cho NHIỀU KHÁCH HÀNG
--
-- ⚠ VẤN ĐỀ ĐANG CÓ, nói thẳng:
--
-- `01-cau-truc.sql` BẬT Row Level Security trên cả 4 bảng, nhưng mọi chính
-- sách đều là `USING (true) WITH CHECK (true)`. Đó là **bật rào rồi mở toang
-- cổng**: ai có anon key (nằm sẵn trong gói JavaScript mà trình duyệt tải về)
-- đều đọc và ghi được MỌI dòng.
--
-- Và không bảng nào có cột `user_id`. Nghĩa là hiện tại **mọi người dùng chung
-- MỘT danh mục** — không phải "khách A xem được của khách B", mà là chỉ có
-- đúng một bộ dữ liệu cho tất cả.
--
-- Chấp nhận được khi chỉ Chủ nhân dùng. **KHÔNG chấp nhận được** khi mở cho
-- khách hàng thật — điều Chủ nhân đã xác nhận là sẽ làm (03/09/2026).
--
-- ⚠ BÀI HỌC TỪ VIỆC TỪNG ĐOÁN SAI KIỂU CỘT:
-- Tôi KHÔNG có quyền truy cập database này. PHẦN 1 là câu hỏi để Chủ nhân
-- chạy và ĐỌC KẾT QUẢ TRƯỚC. Chỉ sang PHẦN 2 sau khi đã đọc PHẦN 1.
-- ═══════════════════════════════════════════════════════════════


-- ═══ PHẦN 1 — CHẨN ĐOÁN. Chạy riêng, đọc kết quả, rồi mới sang PHẦN 2 ═══

-- 1a. Bốn bảng đang có những chính sách nào?
SELECT c.relname AS bang,
       c.relrowsecurity AS dang_bat_rls,
       p.polname AS ten_policy,
       pg_get_expr(p.polqual, p.polrelid) AS dieu_kien_doc
  FROM pg_class c
  LEFT JOIN pg_policy p ON p.polrelid = c.oid
 WHERE c.relname IN ('portfolios', 'positions', 'transactions', 'watchlist')
 ORDER BY c.relname;
-- → Thấy `dieu_kien_doc` = `true` nghĩa là chính sách đó KHÔNG chặn gì cả.

-- 1b. Bốn bảng đã có cột user_id chưa?
SELECT table_name, column_name, data_type
  FROM information_schema.columns
 WHERE table_schema = 'public'
   AND table_name IN ('portfolios', 'positions', 'transactions', 'watchlist')
   AND column_name IN ('user_id', 'id')
 ORDER BY table_name, column_name;

-- 1c. Hiện có bao nhiêu dòng dữ liệu? (để biết PHẦN 2 sẽ gán cho ai)
SELECT 'portfolios' AS bang, count(*) FROM public.portfolios
UNION ALL SELECT 'positions',    count(*) FROM public.positions
UNION ALL SELECT 'transactions', count(*) FROM public.transactions
UNION ALL SELECT 'watchlist',    count(*) FROM public.watchlist;

-- 1d. Tài khoản Supabase Auth của Chủ nhân — LẤY UUID Ở ĐÂY.
SELECT id, email, created_at FROM auth.users ORDER BY created_at;
-- → Nếu KHÔNG có dòng nào: app chưa hề dùng Supabase Auth (đang tự quản người
--   dùng bằng localStorage). Phải đăng ký tài khoản qua Supabase Auth TRƯỚC,
--   rồi mới chạy PHẦN 2. Xem mục "VIỆC PHÍA APP" ở cuối file.


-- ═══ PHẦN 2 — GẮN DỮ LIỆU VÀO NGƯỜI ═══
-- ⚠ Thay <UUID_CHU_NHAN> bằng giá trị lấy được ở câu 1d TRƯỚC KHI CHẠY.
-- Idempotent: chạy lại nhiều lần không hỏng.

-- 2a. Thêm cột user_id. Chưa gán ai — bước 2b mới gán.
ALTER TABLE public.portfolios   ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.positions    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.watchlist    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2b. Dữ liệu ĐANG CÓ đều là của Chủ nhân → gán hết cho Chủ nhân.
--     Chỉ gán dòng đang trống, nên chạy lại không đụng dữ liệu của khách sau này.
UPDATE public.portfolios   SET user_id = '<UUID_CHU_NHAN>' WHERE user_id IS NULL;
UPDATE public.positions    SET user_id = '<UUID_CHU_NHAN>' WHERE user_id IS NULL;
UPDATE public.transactions SET user_id = '<UUID_CHU_NHAN>' WHERE user_id IS NULL;
UPDATE public.watchlist    SET user_id = '<UUID_CHU_NHAN>' WHERE user_id IS NULL;

-- 2c. Đánh chỉ mục — mọi truy vấn từ giờ đều lọc theo user_id.
CREATE INDEX IF NOT EXISTS idx_portfolios_user   ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_user    ON public.positions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user    ON public.watchlist(user_id);


-- ═══ PHẦN 3 — BẢNG HỒ SƠ & VAI TRÒ (chuẩn bị cho nhiều BẬC khách) ═══
-- Chủ nhân nói: hiện 2 bậc (Admin / Khách), tương lai chia bậc khách.
-- Nên khai enum NGAY BÂY GIỜ. Thêm bậc sau này chỉ là thêm một giá trị enum
-- và một policy — không phải sửa app.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vai_tro_ckv') THEN
    CREATE TYPE vai_tro_ckv AS ENUM ('admin', 'khach', 'khach_vip', 'khach_bac2');
  END IF;
END $$;

-- Chạy lại an toàn nhờ IF NOT EXISTS
ALTER TYPE vai_tro_ckv ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE vai_tro_ckv ADD VALUE IF NOT EXISTS 'khach';
ALTER TYPE vai_tro_ckv ADD VALUE IF NOT EXISTS 'khach_vip';
ALTER TYPE vai_tro_ckv ADD VALUE IF NOT EXISTS 'khach_bac2';

CREATE TABLE IF NOT EXISTS public.ho_so (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ho_ten     text,
  email      text,
  vai_tro    vai_tro_ckv NOT NULL DEFAULT 'khach',
  created_at timestamptz DEFAULT now()
);

-- Hàm xét vai trò. SECURITY DEFINER để tránh ĐỆ QUY VÔ HẠN: policy trên
-- `ho_so` mà lại đi đọc `ho_so` để xét quyền thì Postgres gọi lại chính nó.
CREATE OR REPLACE FUNCTION public.la_admin_ckv()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.ho_so WHERE id = auth.uid() AND vai_tro = 'admin');
$$;

ALTER TABLE public.ho_so ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ho_so_doc_cua_minh ON public.ho_so;
CREATE POLICY ho_so_doc_cua_minh ON public.ho_so FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS ho_so_admin_doc_het ON public.ho_so;
CREATE POLICY ho_so_admin_doc_het ON public.ho_so FOR SELECT USING (public.la_admin_ckv());

-- Sửa thì CHỈ sửa của mình. Đổi VAI TRÒ của người khác phải làm thẳng trên
-- Supabase — có ghi vết, không lẫn vào thao tác hằng ngày của app.
DROP POLICY IF EXISTS ho_so_sua_cua_minh ON public.ho_so;
CREATE POLICY ho_so_sua_cua_minh ON public.ho_so
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND vai_tro = (SELECT vai_tro FROM public.ho_so WHERE id = auth.uid()));


-- ═══ PHẦN 4 — THAY CHÍNH SÁCH "MỞ TOANG" BẰNG CHÍNH SÁCH THẬT ═══
-- ⚠ CHỈ CHẠY SAU KHI PHẦN 2 XONG và mọi dòng đã có user_id.
--   Chạy trước là app mất hết dữ liệu trên màn hình (không phải mất trong
--   database — chỉ là không đọc được nữa vì chưa gán chủ).

DROP POLICY IF EXISTS "Cho phep truy cap toan quyen portfolios"   ON public.portfolios;
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen positions"    ON public.positions;
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen transactions" ON public.transactions;
DROP POLICY IF EXISTS "Cho phep truy cap toan quyen watchlist"    ON public.watchlist;

-- Mỗi người CHỈ thấy và sửa dữ liệu của chính mình.
-- `WITH CHECK` quan trọng ngang `USING`: thiếu nó thì người ta vẫn GHI được
-- dòng mang tên người khác, dù không ĐỌC được.
DO $$
DECLARE b text;
BEGIN
  FOREACH b IN ARRAY ARRAY['portfolios', 'positions', 'transactions', 'watchlist'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', b || '_cua_minh', b);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())',
      b || '_cua_minh', b);
  END LOOP;
END $$;

-- Admin XEM được của mọi người (chỉ XEM — không sửa được của khách).
DO $$
DECLARE b text;
BEGIN
  FOREACH b IN ARRAY ARRAY['portfolios', 'positions', 'transactions', 'watchlist'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', b || '_admin_xem', b);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT USING (public.la_admin_ckv())',
      b || '_admin_xem', b);
  END LOOP;
END $$;


-- ═══ KIỂM SAU KHI CHẠY ═══
-- 1. Không còn chính sách nào có điều kiện `true`:
-- SELECT c.relname, p.polname, pg_get_expr(p.polqual, p.polrelid)
--   FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
--  WHERE c.relname IN ('portfolios','positions','transactions','watchlist');
--   → mọi dòng phải có `auth.uid()`, KHÔNG dòng nào là `true`.
--
-- 2. Không còn dòng nào vô chủ:
-- SELECT count(*) FROM public.positions WHERE user_id IS NULL;   → phải là 0
--
-- 3. Đăng nhập bằng tài khoản khách rồi chạy:
--    SELECT count(*) FROM public.positions;   → chỉ thấy dòng của chính họ.


-- ═══════════════════════════════════════════════════════════════
-- VIỆC PHÍA APP — SQL này MỘT MÌNH KHÔNG ĐỦ
-- ═══════════════════════════════════════════════════════════════
--
-- `auth.uid()` chỉ có giá trị khi app đăng nhập bằng **Supabase Auth thật**.
-- Hiện CKV tự quản người dùng trong `localStorage` (`useAuthStore.ts`), nên
-- `auth.uid()` sẽ là NULL và MỌI truy vấn trả về rỗng.
--
-- Ba việc phải làm ở app, theo đúng thứ tự:
--
--   1. Đăng nhập bằng `supabase.auth.signInWithPassword()` hoặc OAuth Google.
--      Bỏ hẳn mã PIN khỏi vai trò CẤP QUYỀN — giữ PIN thì chỉ để KHOÁ MÀN HÌNH
--      cho tiện, không phải để phân quyền.
--   2. `api.ts` gửi kèm token của phiên đăng nhập thay vì dùng anon key trần.
--   3. Mọi lệnh ghi thêm `user_id` — hoặc để `DEFAULT auth.uid()` lo:
--      ALTER TABLE public.positions ALTER COLUMN user_id SET DEFAULT auth.uid();
--
-- Cho tới khi làm xong bước 1, ĐỪNG chạy PHẦN 4 — app sẽ không đọc được gì.
-- Thứ tự an toàn: PHẦN 1 → PHẦN 2 → PHẦN 3 → **làm app** → PHẦN 4.
