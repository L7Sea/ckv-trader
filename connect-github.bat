@echo off
chcp 65001 > nul
title Tự Động Kết Nối GitHub và Tạo Repository CKV

echo ======================================================================
echo    TỰ ĐỘNG KẾT NỐI GITHUB CHO DỰ ÁN CKV TRADER
echo ======================================================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\gh;%LOCALAPPDATA%\Programs\nodejs;%PATH%"

cd /d "%~dp0"

echo [1/2] Đang kiểm tra đăng nhập GitHub...
gh auth status > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo 🌐 Đang mở trình duyệt để bạn đăng nhập GitHub bằng Google...
    echo 💡 Hãy nhấn nút 'Continue' trên trình duyệt để cấp quyền kết nối!
    echo.
    gh auth login --web --git-protocol https
)

echo.
echo [2/2] Đang tự động tạo kho lưu trữ GitHub và đẩy toàn bộ mã nguồn lên...
gh repo create ckv-trader --public --source=. --remote=origin --push

echo.
echo ======================================================================
echo  🎉 ĐÃ TẠO VÀ ĐẨY CODE LÊN GITHUB THÀNH CÔNG!
echo.
echo  Bây giờ kho lưu trữ của bạn đã sẵn sàng tại:
echo  👉 https://github.com/
echo.
echo  Tiếp theo: Bạn chỉ cần vào Cloudflare Pages bấm 'Connect to Git'
echo  và chọn repo 'ckv-trader' là XONG VĨNH VIỄN!
echo ======================================================================
echo.
pause
