import { serve } from '@hono/node-server';
import app from './worker';

const port = 8787;

console.log(`🚀 CKV Core Trading Engine Backend đang chạy tại http://127.0.0.1:${port}`);

serve({
  fetch: app.fetch,
  port
});
