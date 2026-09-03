import React, { useState } from 'react';
import { CheDoMau, NHAN_CHE_DO, cheDoKeTiep, docCheDo, luuCheDo } from '../lib/cheDoMau';
import {
  Sun,
  Moon,
  MonitorSmartphone,
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
  RotateCcw,
  Share2,
  MessageSquare,
  Users,
  HelpCircle,
  LogIn
} from 'lucide-react';
import { useTradingStore } from '../store/useTradingStore';
import { useAuthStore } from '../store/useAuthStore';
import { supportService } from '../services/supportService';
import { MobileAccessModal } from './MobileAccessModal';
import { DividendModal } from './DividendModal';
import { AuthModal } from './AuthModal';
import { SettingsModal } from './SettingsModal';
import { AdminPanelModal } from './AdminPanelModal';
import { SupportChatModal } from './SupportChatModal';
import { ShareAppModal } from './ShareAppModal';
import { OnboardingTourModal } from './OnboardingTourModal';
import { HelpCenterModal } from './HelpCenterModal';
import { GoogleAuthPickerModal } from './GoogleAuthPickerModal';
import { DEAL_CONFIG } from '../services/dealModel';

export const Header: React.FC = () => {
  const { fetchData, settleDay, resetCleanSlate, isLoading, syncLiveMarketData, isLiveSyncing } = useTradingStore();
  const [cheDoMau, setCheDoMau] = useState<CheDoMau>(() => docCheDo());
  const {
    user,
    openAuthModal,
    openAdminPanel,
    openSupportChat,
    openShareModal,
    openOnboarding,
    openHelpCenter,
    logout,
    switchSubAccount,
    lockApp
  } = useAuthStore();

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isDividendModalOpen, setIsDividendModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const unreadCount = isAdmin ? supportService.getUnreadCountForAdmin() : (user ? supportService.getUnreadCountForUser(user.id) : 0);

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
      <header className="border-b border-vien bg-nen backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-md">
        <div className="mx-auto flex w-full max-w-[1720px] flex-wrap items-center justify-between gap-3">
          {/* Logo & Account Info (Left Side - Clean & Aligned) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-2xl bg-the flex items-center justify-center shadow-lg shadow-md shrink-0">
              <TrendingUp className="h-6 w-6 text-chu stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-chu font-sans">CKV PRO</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-tot-nen text-tot border border-vien font-mono">
                  T+2.5
                </span>
                {isAdmin && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-canh-bao-nen text-canh-bao border border-vien font-mono">
                    👑 ADMIN VIP
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-chu-phu">
                <ShieldCheck className={`h-3.5 w-3.5 ${isAdmin ? 'text-canh-bao' : 'text-chu-phu'}`} />
                <span>Tài khoản: <b className={isAdmin ? 'text-canh-bao font-bold' : 'text-chu-phu'}>{user ? (user.nickname ? `${user.name} (@${user.nickname})` : user.name) : 'Chưa đăng nhập'}</b></span>
              </div>
            </div>
          </div>

          {/* Action Tools & Navigation Center (Right Side - Balanced & Clean) */}
          <div className="flex flex-wrap items-center justify-end gap-2 min-w-0">
            {/* Switch Sub-account on Desktop */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-the rounded-2xl border border-vien text-xs font-mono">
              <span className="text-chu-mo px-2 font-sans font-semibold text-[11px]">Tiểu khoản:</span>
              <button
                onClick={() => switchSubAccount('01')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  user?.subAccount === '01'
                    ? 'bg-tot text-tren-nhan shadow-sm'
                    : 'text-chu-phu hover:text-chu'
                }`}
                title="Tiểu khoản 01: Giao dịch Thường (Không Margin - Thuần tiền mặt)"
              >
                01 (Thường)
              </button>
              <button
                onClick={() => switchSubAccount('06')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  user?.subAccount === '06'
                    ? 'bg-nhan text-tren-nhan shadow-sm'
                    : 'text-chu-phu hover:text-chu'
                }`}
                title="Tiểu khoản 06: Giao dịch Ký Quỹ Margin"
              >
                06 (Margin)
              </button>
            </div>

            {/* Nút Đồng Bộ Toàn Diện (Master Unified Sync) */}
            <button
              onClick={syncLiveMarketData}
              disabled={isLiveSyncing}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-the hover: hover: text-tot border border-vien text-xs font-bold transition active:scale-95 disabled:opacity-50 shadow-md shadow-md shrink-0"
              title="Đồng bộ toàn diện: 300 mã giá thực + Lãi suất 20 Ngân hàng & FinTech + Tài sản NAV"
            >
              <RefreshCw className={`h-4 w-4 text-tot shrink-0 ${isLiveSyncing ? 'animate-spin' : ''}`} />
              <span className="font-sans hidden xs:inline sm:inline">{isLiveSyncing ? 'Đang đồng bộ...' : 'Đồng Bộ'}</span>
            </button>

            {/* Nút Cẩm Nang & Hướng Dẫn (Help Center) */}
            <button
              onClick={openHelpCenter}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-tot-nen hover:bg-tot-nen text-tot border border-vien text-xs font-bold transition active:scale-95 shadow-sm shrink-0"
              title="Mở Cẩm Nang & Hướng Dẫn Sử Dụng (Chọn CTCK, Lãi suất, Mã lạ, Giao dịch tiền mặt)"
            >
              <HelpCircle className="h-4 w-4 text-tot" />
              <span className="hidden md:inline">Cẩm Nang</span>
            </button>

            {/* Nút Nhắn Tin Cho Admin / Khách Hàng (Support Chat) */}
            <button
              onClick={openSupportChat}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-the2 hover:bg-the2 text-nhan-chu border border-vien transition active:scale-95 flex items-center gap-1.5 text-xs font-bold shrink-0"
              title={isAdmin ? 'Mở kênh chat với khách hàng' : 'Nhắn tin trực tiếp cho Admin (anh Hải)'}
            >
              <MessageSquare className="h-4 w-4 text-nhan-chu" />
              <span className="hidden md:inline">{isAdmin ? 'Chat Khách' : 'Hỗ Trợ Admin'}</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:static h-4 w-4 rounded-full bg-loi text-tren-nhan text-[10px] font-mono font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Nút Chia Sẻ App (Share) */}
            <button
              onClick={openShareModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-the2 hover:bg-the2 text-nhan-chu border border-vien text-xs font-bold transition active:scale-95 shrink-0"
              title="Chia sẻ link ứng dụng cho bạn bè"
            >
              <Share2 className="h-3.5 w-3.5 text-nhan-chu" />
              <span>Chia Sẻ Link</span>
            </button>

            {/* Nút Quản Trị User (Dành riêng cho Admin) */}
            {isAdmin && (
              <button
                onClick={openAdminPanel}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-canh-bao-nen hover:bg-canh-bao-nen text-canh-bao border border-vien text-xs font-bold transition active:scale-95 shrink-0"
                title="Quản trị danh sách người dùng & số dư"
              >
                <Users className="h-3.5 w-3.5 text-canh-bao" />
                <span>Quản Trị User</span>
              </button>
            )}

            {/* Nút gạt chế độ màu: Sáng → Tối → Theo máy.
                Mặc định là SÁNG vì "giấy tài chính" là bản sắc app — không để cài
                đặt hệ điều hành quyết định diện mạo sản phẩm. */}
            <button
              onClick={() => {
                const moi = cheDoKeTiep(cheDoMau);
                setCheDoMau(moi);
                luuCheDo(moi);
              }}
              className="min-h-[44px] min-w-[44px] justify-center p-2 rounded-xl bg-the hover:bg-the2 text-chu-phu border border-vien transition active:scale-95 shrink-0 inline-flex items-center gap-1.5"
              title={`Chế độ màu: ${NHAN_CHE_DO[cheDoMau]} — bấm để đổi`}
              aria-label={`Chế độ màu hiện tại: ${NHAN_CHE_DO[cheDoMau]}`}
            >
              {cheDoMau === 'sang' ? (
                <Sun className="h-4 w-4 text-canh-bao" />
              ) : cheDoMau === 'toi' ? (
                <Moon className="h-4 w-4 text-nhan-chu" />
              ) : (
                <MonitorSmartphone className="h-4 w-4 text-chu-phu" />
              )}
              <span className="hidden lg:inline text-[11px] font-sans font-semibold">
                {NHAN_CHE_DO[cheDoMau]}
              </span>
            </button>

            {/* Nút Cài Đặt (Settings) */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 rounded-xl bg-the hover:bg-the2 text-chu-phu border border-vien transition active:scale-95 shrink-0"
              title="Tùy biến hình nền 4K & giao diện"
            >
              <Settings className="h-4 w-4 text-nhan-chu" />
            </button>

            {/* User Profile / Login Button */}
            {!user?.isLoggedIn ? (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-tot hover:bg-tot text-tren-nhan text-xs font-black transition active:scale-95 shadow-md shadow-md shrink-0 uppercase tracking-wide"
                title="Đăng nhập Gmail / Đăng ký Thành Viên Mới"
              >
                <LogIn className="h-4 w-4" />
                <span>ĐĂNG NHẬP</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-the border border-vien text-chu text-xs font-semibold hover:border-vien transition"
                >
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isAdmin ? 'bg-canh-bao-nen text-canh-bao border border-vien' : 'bg-tot-nen text-tot'
                  }`}>
                    {isAdmin ? '👑' : user?.name ? user.name[0].toUpperCase() : 'V'}
                  </div>
                  <span className="max-w-[85px] truncate hidden md:inline font-bold">
                    {user?.nickname || user?.name || 'Thành Viên'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-chu-mo" />
                </button>

                {/* Dropdown Menu & Click Outside Backdrop */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-the border border-vien rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                      <div className="p-2 border-b border-vien mb-1">
                      <p className="text-xs font-bold text-chu truncate">
                        {user?.name} {user?.nickname ? `(@${user.nickname})` : ''}
                      </p>
                      <p className="text-[11px] font-mono text-tot">Email: {user?.email}</p>
                      <span className="text-[10px] font-bold text-chu-phu">
                        CTCK: <b className="text-nhan-chu">{user?.brokerage || 'DNSE'}</b> ({user?.customMarginRate || DEAL_CONFIG.marginRateAnnual}%)
                      </span>
                    </div>
                  
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openAdminPanel();
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-canh-bao hover:bg-canh-bao-nen rounded-xl transition font-semibold"
                    >
                      <Users className="h-4 w-4 text-canh-bao" />
                      <span>Quản trị người dùng (Admin)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openAuthModal();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-chu-phu hover:text-chu hover:bg-the2 rounded-xl transition"
                  >
                    <User className="h-4 w-4 text-chu-phu" />
                    <span>Đổi tài khoản / Đăng ký</span>
                  </button>

                  <div className="border-t border-vien my-1"></div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openAuthModal();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-loi hover:bg-loi-nen rounded-xl transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </>
            )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <MobileAccessModal isOpen={isMobileModalOpen} onClose={() => setIsMobileModalOpen(false)} />
      <DividendModal isOpen={isDividendModalOpen} onClose={() => setIsDividendModalOpen(false)} />
      <AuthModal />
      <GoogleAuthPickerModal />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <AdminPanelModal />
      <SupportChatModal />
      <ShareAppModal />
      <OnboardingTourModal />
      <HelpCenterModal />
    </>
  );
};

