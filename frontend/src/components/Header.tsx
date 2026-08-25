import React, { useState } from 'react';
import {
  RefreshCw,
  Calendar,
  Wallet,
  TrendingUp,
  Smartphone,
  Gift,
  User,
  LogOut,
  ChevronDown,
  Lock,
  ShieldCheck,
  Settings,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { useAuthStore } from '../store/useAuthStore';
import { MobileAccessModal } from './MobileAccessModal';
import { DividendModal } from './DividendModal';
import { AuthModal } from './AuthModal';
import { SettingsModal } from './SettingsModal';

export const Header: React.FC = () => {
  const { fetchData, settleDay, resetCleanSlate, isLoading, syncLiveMarketData, isLiveSyncing } = useTradingStore();
  const { user, openAuthModal, logout, switchSubAccount, lockApp } = useAuthStore();

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isDividendModalOpen, setIsDividendModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSettle = async () => {
    if (
      window.confirm(
        'Anh có chắc muốn thực hiện Chuyển trạng thái ngày mới (T+2.5)?\n- Cổ phiếu T+1 sẽ chuyển sang Khả dụng (sẵn sàng bán)\n- Cổ phiếu T+2 sẽ chuyển sang T+1\n- Tiền chờ về sẽ chuyển sang Tiền mặt khả dụng.'
      )
    ) {
      await settleDay();
    }
  };

  const handleResetSlate = () => {
    const input = window.prompt(
      'NHẬP SỐ TIỀN VỐN KHỞI ĐẦU ĐỂ BẮT ĐẦU SỔ GHI CHÉP THẬT (VND):\n(Để trống hoặc nhập 0 nếu muốn bắt đầu từ 0đ để nạp tiền thủ công sau)',
      '0'
    );
    if (input !== null) {
      const cleanNum = Number(input.replace(/[^0-9]/g, '')) || 0;
      resetCleanSlate(cleanNum);
      setIsUserMenuOpen(false);
    }
  };

  return (
    <>
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Account Info (Left Side - Clean & Aligned) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <TrendingUp className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white font-sans">CKV PRO</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  T+2.5
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Tài khoản: <b className="text-emerald-400">{user?.name || 'VIP Trader'}</b></span>
              </div>
            </div>
          </div>

          {/* Action Tools & Navigation Center (Right Side - Balanced & Clean) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Switch Sub-account on Desktop */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 px-2 font-sans font-semibold text-[11px]">Tiểu khoản:</span>
              <button
                onClick={() => switchSubAccount('01')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  user?.subAccount === '01'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tiểu khoản 01: Giao dịch Thường (Không Margin)"
              >
                01 (Thường)
              </button>
              <button
                onClick={() => switchSubAccount('06')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  user?.subAccount === '06'
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tiểu khoản 06: Giao dịch Ký Quỹ Margin"
              >
                06 (Margin)
              </button>
            </div>

            {/* Nút Đồng Bộ Giá Sống */}
            <button
              onClick={syncLiveMarketData}
              disabled={isLiveSyncing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition active:scale-95 disabled:opacity-50"
              title="Đồng bộ giá thị trường trực tiếp"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isLiveSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLiveSyncing ? 'Đang tải...' : 'Đồng Bộ'}</span>
            </button>

            {/* Nút Cổ Tức */}
            <button
              onClick={() => setIsDividendModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition active:scale-95"
              title="Ghi nhận cổ tức tiền mặt hoặc cổ tức cổ phiếu"
            >
              <Gift className="h-3.5 w-3.5 text-amber-400" />
              <span>Cổ Tức</span>
            </button>

            {/* Nút Điện Thoại */}
            <button
              onClick={() => setIsMobileModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition active:scale-95"
              title="Quét mã QR để mở ứng dụng trên điện thoại"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>

            {/* Nút Cài Đặt (Settings) */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition active:scale-95"
              title="Tùy biến hình nền & giao diện"
            >
              <Settings className="h-4 w-4 text-indigo-400" />
            </button>

            {/* Nút Khóa Ứng Dụng (Lock App) */}
            <button
              onClick={lockApp}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 transition active:scale-95"
              title="Khóa ứng dụng ngay lập tức"
            >
              <Lock className="h-4 w-4" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-slate-700 transition"
              >
                <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0].toUpperCase() : 'V'}
                </div>
                <span className="max-w-[70px] truncate hidden md:inline">{user?.name || 'VIP Trader'}</span>
                <ChevronDown className="h-3 w-3 text-slate-500" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="p-2 border-b border-slate-800/80 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user?.name || 'VIP Trader'}</p>
                    <p className="text-[11px] font-mono text-emerald-400">STK: {user?.accountNumber || '001C888999'}</p>
                  </div>
                  
                  <button
                    onClick={handleResetSlate}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-semibold"
                  >
                    <RotateCcw className="h-4 w-4 text-rose-400" />
                    <span>Làm sạch & Thiết lập vốn thật</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsSettingsModalOpen(true);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                  >
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>Tùy biến hình nền & Linh vật</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openAuthModal();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>Hồ sơ & Đổi PIN</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      lockApp();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 rounded-xl transition"
                  >
                    <Lock className="h-4 w-4 text-amber-400" />
                    <span>Khóa bảo vệ bằng PIN</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      fetchData();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                  >
                    <RefreshCw className="h-4 w-4 text-slate-400" />
                    <span>Đồng bộ dữ liệu</span>
                  </button>
                  <div className="border-t border-slate-800/80 my-1"></div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <MobileAccessModal isOpen={isMobileModalOpen} onClose={() => setIsMobileModalOpen(false)} />
      <DividendModal isOpen={isDividendModalOpen} onClose={() => setIsDividendModalOpen(false)} />
      <AuthModal />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </>
  );
};
