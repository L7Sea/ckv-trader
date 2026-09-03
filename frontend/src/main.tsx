import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { apCheDo, docCheDo } from './lib/cheDoMau';

/* Áp chế độ màu NGAY, trước khi React dựng cây — nếu áp trong component thì
   khung đầu tiên vẽ bằng bảng mặc định rồi mới đổi, mắt thấy nháy một cái. */
apCheDo(docCheDo());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Router thêm 03/09/2026: trước đó app KHÔNG có địa chỉ cho từng màn
        → nút Back thoát hẳn app, F5 mất chỗ đang xem. Xem lib/duongDan.ts */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
