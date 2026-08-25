@echo off
chcp 65001 > nul
title CKV Pro Trader - Automated Server (T+2.5)

echo ======================================================================
echo    CKV PRO - HỆ THỐNG QUẢN TRỊ CHỨNG KHOÁN CÁ NHÂN (T+2.5)
echo ======================================================================
echo.
echo Đang tự động khởi chạy Hệ thống Giao dịch & Bảng điện tử...
echo.

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\gh;%PATH%"

:: Khởi động Backend (Port 8787)
start "CKV Backend (Port 8787)" cmd /k "cd /d %~dp0backend && npm run dev"

:: Khởi động Frontend (Port 3000 - Hỗ trợ cả máy tính & điện thoại)
start "CKV Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ======================================================================
echo  🚀 HỆ THỐNG ĐÃ SẴN SÀNG HOẠT ĐỘNG!
echo.
echo  🖥️  Link mở trên MÁY TÍNH:
echo      👉 http://localhost:3000
echo.
echo  📱  Link mở trên ĐIỆN THOẠI (4G/5G/Wi-Fi):
echo      👉 http://192.168.0.54:3000
echo.
echo  ☁️  Để đưa lên Cloudflare (Chạy vĩnh viễn không cần bật máy):
echo      👉 Nhấp đúp vào file: deploy-to-cloudflare.bat
echo ======================================================================
echo.
pause
