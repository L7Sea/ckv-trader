/* ═══════════════════════════════════════════════════════════════════════════
   ĐỌC LỖI CỦA POSTGREST
   ───────────────────────────────────────────────────────────────────────────
   PostgREST huỷ TOÀN BỘ lệnh ghi chỉ vì một cột lạ trong payload. Đây chính là
   lỗi đã khiến app im lặng không lưu được gì lên Supabase suốt từ 25/08/2026:
   code không kiểm res.ok, catch rỗng nuốt lỗi, UI vẫn báo "thành công".

   Tách riêng ở đây (không phụ thuộc module nào) để kiểm thử được bằng dữ liệu
   lỗi THẬT lấy từ máy chủ, thay vì đoán định dạng thông báo.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Trả về tên cột bị thiếu mà PostgREST phàn nàn, hoặc null nếu lỗi thuộc loại khác.
 *
 * Hai định dạng gặp thực tế:
 *   PGRST204 — Could not find the 'current_simulated_date' column of 'portfolios' in the schema cache
 *   42703    — column positions.breakeven_price does not exist
 */
export function missingColumnFrom(errorText: string): string | null {
  if (!errorText) return null;

  const patterns: RegExp[] = [
    /Could not find the '([a-z_][a-z0-9_]*)' column/i,
    /column\s+(?:[a-z_][a-z0-9_]*\.)?"?([a-z_][a-z0-9_]*)"?\s+does not exist/i,
    /column\s+"?([a-z_][a-z0-9_]*)"?\s+of relation/i
  ];

  for (const pattern of patterns) {
    const match = errorText.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}
