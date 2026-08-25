@echo off
chcp 65001 > nul
title Triển khai CKV lên Cloudflare (Pages & Workers)

echo ======================================================================
echo    TRIỂN KHAI CKV LÊN CLOUDFLARE (100%% SERVERLESS & MIỄN PHÍ)
echo ======================================================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

:: 1. Kiểm tra đăng nhập Cloudflare
echo [1/3] Kiểm tra xác thực tài khoản Cloudflare...
cd /d "%~dp0backend"
call npx wrangler whoami > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Bạn chưa đăng nhập Cloudflare trên máy này.
    echo 🌐 Đang mở trình duyệt để bạn bấm 'Allow' (Ủy quyền Cloudflare)...
    echo.
    call npx wrangler login
)

:: 2. Deploy Backend Worker
echo.
echo [2/3] Đang tải Backend (Trading Engine) lên Cloudflare Workers...
cd /d "%~dp0backend"
call npx wrangler deploy

:: 3. Build & Deploy Frontend lên Cloudflare Pages
echo.
echo [3/3] Đang đóng gói và tải Giao diện lên Cloudflare Pages...
cd /d "%~dp0frontend"
call npm run build
call npx wrangler pages deploy dist --project-name=ckv-trader

echo.
echo ======================================================================
echo  🎉 CHÚC MỪNG! DỰ ÁN ĐÃ ĐƯỢC TRIỂN KHAI LÊN CLOUDFLARE THÀNH CÔNG!
echo.
echo  Đường link truy cập Online toàn cầu của bạn là:
echo  👉 https://ckv-trader.pages.dev
echo.
echo  (Bạn có thể mở link này trên Điện thoại 4G/5G hoặc Máy tính bất kỳ lúc nào)
echo ======================================================================
echo.
pause
