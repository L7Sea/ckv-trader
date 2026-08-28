import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      /* Khi chạy `npm run dev` thì Cloudflare Pages Function KHÔNG tồn tại, nên
         /api/market/ohlc phải được proxy thẳng sang nguồn dữ liệu — nếu không,
         trình duyệt gọi thẳng Entrade sẽ bị CORS chặn (Entrade không trả header
         Access-Control-Allow-Origin) và biểu đồ nến sẽ trống trên máy local.
         Trên production, Pages Function đảm nhiệm đúng vai trò này. */
      '/api/market/ohlc': {
        target: 'https://services.entrade.com.vn',
        changeOrigin: true,
        secure: true,
        // Giữ nguyên query string gốc (symbol, resolution, from, to)
        rewrite: (p) => '/chart-api/v2/ohlcs/stock' + p.slice(p.indexOf('?') >= 0 ? p.indexOf('?') : p.length)
      },
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
