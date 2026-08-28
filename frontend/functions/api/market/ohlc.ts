/* ═══════════════════════════════════════════════════════════════════════════
   CLOUDFLARE PAGES FUNCTION — PROXY DỮ LIỆU THỊ TRƯỜNG
   ───────────────────────────────────────────────────────────────────────────
   Trình duyệt gọi thẳng services.entrade.com.vn sẽ bị CORS chặn. Hàm này chạy
   server-side ngay trên domain của app (ckv-trader.pages.dev) nên frontend gọi
   /api/market/ohlc là CÙNG ORIGIN — không cần cấu hình URL, không cần biến môi
   trường, và tự động deploy kèm mỗi lần Pages build.

   Đặt ở frontend/functions/api/market/ohlc.ts ⇒ Cloudflare Pages tự map thành
   đường dẫn /api/market/ohlc. Không cần khai báo gì thêm.
   ═══════════════════════════════════════════════════════════════════════════ */

const UPSTREAM = 'https://services.entrade.com.vn/chart-api/v2/ohlcs/stock';

const json = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders
    }
  });

export const onRequestOptions = () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });

export const onRequestGet = async (context: { request: Request }) => {
  const url = new URL(context.request.url);
  const symbol = (url.searchParams.get('symbol') || '').trim().toUpperCase();

  if (!/^[A-Z0-9]{3,10}$/.test(symbol)) {
    return json({ error: 'Mã cổ phiếu không hợp lệ' }, 400);
  }

  // resolution=1 là nến 1 phút (giá trong phiên). Chỉ nhận vài giá trị hợp lệ
  // để không biến endpoint này thành proxy mở cho người khác lợi dụng.
  const resolution = url.searchParams.get('resolution') || '1';
  if (!['1', '5', '15', '30', '60', '1D'].includes(resolution)) {
    return json({ error: 'Khung thời gian không hợp lệ' }, 400);
  }

  const now = Math.floor(Date.now() / 1000);
  const from = Number(url.searchParams.get('from')) || now - 86400 * 5;
  const to = Number(url.searchParams.get('to')) || now + 3600;

  const target = `${UPSTREAM}?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`;

  try {
    const res = await fetch(target, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      return json({ error: 'Nguồn dữ liệu trả lỗi', status: res.status }, 502);
    }
    const data = await res.json();
    // Cache 15 giây ở biên: đủ tươi cho giá trong phiên, đủ để không dội nguồn
    return json(data, 200, { 'Cache-Control': 'public, max-age=15' });
  } catch (e) {
    return json({ error: 'Không kết nối được nguồn dữ liệu', detail: String(e) }, 502);
  }
};
