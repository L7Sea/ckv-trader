@echo off
chcp 65001 > nul
title CKV Trading System - Fullstack Runner (T+2.5)

echo ======================================================================
echo    CKV - HỆ THỐNG QUẢN TRỊ CHỨNG KHOÁN CÁ NHÂN (T+2.5 ENGINE)
echo ======================================================================
echo.
echo Đang khởi động máy chủ Backend (Cloudflare Worker) và Giao diện Frontend...
echo.

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

:: Khởi động Backend (Port 8787)
start "CKV Backend (Port 8787)" cmd /k "cd /d %~dp0backend && npm run dev"

:: Khởi động Frontend (Port 3000 - Hỗ trợ cả máy tính & điện thoại)
start "CKV Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ======================================================================
echo  ỨNG DỤNG ĐÃ KHỞI CHẠY THÀNH CÔNG!
echo.
echo  🖥️  Truy cập trên MÁY TÍNH:
echo      👉 http://localhost:3000
echo.
echo  📱  Truy cập trên ĐIỆN THOẠI (Cùng mạng Wi-Fi):
echo      👉 http://192.168.0.54:3000
echo      (Hoặc bấm nút 'Dùng Điện Thoại' trên màn hình để quét mã QR)
echo ======================================================================
echo.
pause
