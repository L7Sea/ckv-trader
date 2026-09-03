import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PortfolioOverview } from './components/PortfolioOverview';
import { useDongBoDiaChi } from '@/lib/useDongBoDiaChi';
import { TradePositionsPage } from './pages/TradePositionsPage';
import { PositionRiskPage } from './pages/PositionRiskPage';
import { RadarAlgorithmsPage } from './pages/RadarAlgorithmsPage';
import { MarketBoardChartPage } from './pages/MarketBoardChartPage';
import { MacroRatesPage } from './pages/MacroRatesPage';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { PortfolioAllocationPage } from './pages/PortfolioAllocationPage';
import { PerformanceAnalyticsPage } from './pages/PerformanceAnalyticsPage';
import { NhatKyLuanDiemPage } from './pages/NhatKyLuanDiemPage';

import { CashModal } from './components/CashModal';
import { PriceUpdateModal } from './components/PriceUpdateModal';
import { PinLockScreen } from './components/PinLockScreen';
import { KhayThongBao } from './components/KhayThongBao';
import { CapyStylePickerModal } from './components/CapyStylePickerModal';
import Capy from './components/Capy';
import { BackgroundProvider } from './lib/backgroundContext';
import { useTradingStore, TabType } from './store/useTradingStore';
import { useAuthStore } from './store/useAuthStore';
import { useAutoSync } from './lib/useAutoSync';
import {
  TrendingUp,
  LayoutGrid,
  PieChart,
  History,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Award,
  Scale,
  Cpu,
  Zap,
  Newspaper,
  Compass,
  FileSpreadsheet,
  Flame,
  Landmark,
  BookOpen
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, fetchData, error, successMessage, clearMessages } = useTradingStore();

  /* Nối địa chỉ ↔ activeTab. Không component nào bên dưới phải biết đến router. */
  useDongBoDiaChi();
  const { user } = useAuthStore();
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isStylePickerOpen, setIsStylePickerOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Tự động đồng bộ theo mốc sáng/trưa/chiều/tối, chỉ khi đã đăng nhập
  useAutoSync(Boolean(user));

  /* Chỉ hỏi phong cách Capy SAU KHI đã đăng nhập. Bản cũ mở modal ngay lúc dựng
     giao diện, tức là đè lên cả màn hình đăng nhập của khách mới.
     Khoá ghi nhớ gắn theo TỪNG tài khoản, nên mỗi thành viên mới vẫn được hỏi
     một lần của riêng họ thay vì bị bỏ qua vì máy đã từng có người chọn. */
  useEffect(() => {
    if (!user) {
      setIsStylePickerOpen(false);
      return;
    }
    try {
      if (!localStorage.getItem(`ckv_style_initialized_${user.id}`)) {
        setIsStylePickerOpen(true);
      }
    } catch {
      // Trình duyệt chặn localStorage thì bỏ qua, không chặn luồng vào app
    }
  }, [user?.id]);

  const closeStylePicker = () => {
    setIsStylePickerOpen(false);
    try {
      if (user) localStorage.setItem(`ckv_style_initialized_${user.id}`, '1');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-transparent text-chu flex flex-col font-sans selection:bg-tot selection:text-tren-nhan pb-20 md:pb-6">
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* Toast / Notification Banner */}
        {error && (
          <div className="flex items-center justify-between p-4 bg-loi-nen border border-vien rounded-2xl text-loi text-sm shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-loi shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearMessages} className="p-1 hover:bg-loi-nen rounded-lg text-loi">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center justify-between p-4 bg-tot-nen border border-vien rounded-2xl text-tot text-sm shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-tot shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearMessages} className="p-1 hover:bg-tot-nen rounded-lg text-tot">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 1. Tổng quan tài sản Super-App (Portfolio Master Card) */}
        <PortfolioOverview />

        {/* Navigation Tabs Bar (Desktop & Tablet Pill Bar - Tinh gọn, vừa vặn 100% trên 1 hàng) */}
        <div className="hidden md:flex items-center justify-start border-b border-vien pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 p-1 bg-the rounded-2xl border border-vien text-xs font-semibold backdrop-blur-md shrink-0 w-full justify-between">
            <button
              data-tab="TRADE"
              onClick={() => setActiveTab('TRADE')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'TRADE'
                  ? 'bg-tot text-tren-nhan font-bold shadow-md shadow-md'
                  : 'text-chu-phu hover:text-chu hover:bg-the2'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>SỔ LỆNH</span>
            </button>

            <button
              data-tab="DECISION"
              onClick={() => setActiveTab('DECISION')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'DECISION'
                  ? 'bg-canh-bao text-tren-nhan font-bold shadow-md shadow-md'
                  : 'text-chu-phu hover:text-chu hover:bg-the2'
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>HÒA VỐN</span>
            </button>

            <button
              data-tab="ALGORITHMS"
              onClick={() => setActiveTab('ALGORITHMS')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'ALGORITHMS'
                  ? 'bg-nhan text-tren-nhan font-bold shadow-md shadow-md'
                  : 'text-chu-phu hover:text-chu hover:bg-the2'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>RADAR AI</span>
            </button>

            <button
              data-tab="MARKET"
              onClick={() => setActiveTab('MARKET')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'MARKET'
                  ? 'bg-nhan text-tren-nhan font-bold shadow-md shadow-md'
                  : 'text-chu-phu hover:text-chu hover:bg-the2'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>BẢNG GIÁ & CHART</span>
            </button>

            <button
              data-tab="MACRO"
              onClick={() => setActiveTab('MACRO')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'MACRO'
                  ? 'bg-tot text-tren-nhan font-bold shadow-md shadow-md'
                  : 'text-chu-phu hover:text-chu hover:bg-the2'
              }`}
            >
              <Landmark className="h-4 w-4 text-tot" />
              <span>LÃI SUẤT VĨ MÔ</span>
            </button>

            <button
              data-tab="INTELLIGENCE"
              onClick={() => setActiveTab('INTELLIGENCE')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'INTELLIGENCE'
                  ? 'bg-tot text-tren-nhan font-bold shadow-md shadow-md'
                  : 'text-chu-phu hover:text-chu hover:bg-the2'
              }`}
            >
              <Newspaper className="h-4 w-4" />
              <span>TIN THỊ TRƯỜNG</span>
            </button>

            <button
              data-tab="CHARTS"
              onClick={() => setActiveTab('CHARTS')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'CHARTS'
                  ? 'bg-nhan text-tren-nhan font-bold shadow-md shadow-md'
                  : 'text-chu-phu hover:text-chu hover:bg-the2'
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span>PHÂN BỔ VỐN</span>
            </button>

            <button
              data-tab="ANALYTICS"
              onClick={() => setActiveTab('ANALYTICS')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'ANALYTICS'
                  ? 'bg-loi text-tren-nhan font-bold shadow-md shadow-md'
                  : 'text-chu-phu hover:text-chu hover:bg-the2'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>HIỆU SUẤT EXCEL</span>
            </button>

            <button
              data-tab="NHATKY"
              onClick={() => setActiveTab('NHATKY')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'NHATKY'
                  ? 'bg-nhan text-tren-nhan font-bold shadow-md shadow-md'
                  : 'text-chu-phu hover:text-chu hover:bg-the2'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>NHẬT KÝ NHẬN ĐỊNH</span>
            </button>
          </div>
        </div>

        {/* 9 TRANG ĐỘC LẬP TƯƠNG ỨNG TỪNG FILE TRONG /src/pages/ */}
        {activeTab === 'TRADE' && <TradePositionsPage />}
        {activeTab === 'DECISION' && <PositionRiskPage />}
        {activeTab === 'ALGORITHMS' && <RadarAlgorithmsPage />}
        {activeTab === 'MARKET' && <MarketBoardChartPage />}
        {activeTab === 'MACRO' && <MacroRatesPage />}
        {activeTab === 'INTELLIGENCE' && <MarketIntelligencePage />}
        {activeTab === 'CHARTS' && <PortfolioAllocationPage />}
        {activeTab === 'ANALYTICS' && <PerformanceAnalyticsPage />}
        {activeTab === 'NHATKY' && <NhatKyLuanDiemPage />}
      </main>

      {/* Linh vật Capy — trợ lý cho người ĐÃ đăng nhập. Không hiện ở cổng đăng
          nhập: nó nổi đè lên tiêu đề của màn đó, và với người lạ lần đầu vào thì
          một con linh vật che mất câu giới thiệu là phản tác dụng. */}
      {user && <Capy />}

      {/* Mobile Bottom Navigation (Chuẩn Mobile Native 5 Nút & Bottom Sheet Khám Phá Đầy Đủ 8 Trang) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-nen border-t border-vien backdrop-blur-2xl px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),10px)] shadow-2xl">
        <div className="grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('TRADE')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
              activeTab === 'TRADE' ? 'text-tot font-bold bg-tot-nen' : 'text-chu-phu'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px]">Sổ Lệnh</span>
          </button>

          <button
            onClick={() => setActiveTab('DECISION')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
              activeTab === 'DECISION' ? 'text-canh-bao font-bold bg-canh-bao-nen' : 'text-chu-phu'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span className="text-[10px]">Hòa Vốn</span>
          </button>

          <button
            onClick={() => setActiveTab('MARKET')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
              activeTab === 'MARKET' ? 'text-nhan-chu font-bold bg-the2' : 'text-chu-phu'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="text-[10px]">Bảng Giá</span>
          </button>

          <button
            onClick={() => setActiveTab('ALGORITHMS')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
              activeTab === 'ALGORITHMS' ? 'text-nhan-chu font-bold bg-the2' : 'text-chu-phu'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span className="text-[10px]">Radar AI</span>
          </button>

          {/* Nút Khám Phá Mở Bottom Sheet 4 Trang Còn Lại */}
          <button
            onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
              ['MACRO', 'CHARTS', 'ANALYTICS', 'INTELLIGENCE'].includes(activeTab) || isMobileMoreOpen
                ? 'text-nhan-chu font-bold bg-the2'
                : 'text-chu-phu'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span className="text-[10px]">Khám Phá ☰</span>
          </button>
        </div>
      </div>

      {/* Mobile More Bottom Sheet (Trang Vĩ Mô, Tài Sản, Hiệu Suất, Tin Tức) */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-nen backdrop-blur-md flex flex-col justify-end animate-in fade-in">
          <div className="bg-the border-t border-vien rounded-t-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom pb-[max(env(safe-area-inset-bottom),20px)]">
            <div className="flex items-center justify-between border-b border-vien pb-3">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-nhan-chu" />
                <h3 className="text-sm font-bold text-chu">Khám Phá Toàn Diện CKV Pro</h3>
              </div>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1 text-chu-phu hover:text-chu rounded-lg hover:bg-the2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('MACRO');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  activeTab === 'MACRO'
                    ? 'bg-tot-nen border-vien text-tot'
                    : 'bg-nen border-vien text-chu-phu'
                }`}
              >
                <Landmark className="h-5 w-5 text-tot shrink-0" />
                <div>
                  <div className="font-bold">Lãi Suất Vĩ Mô</div>
                  <div className="text-[10px] text-chu-phu font-normal">20 Bank & FinTech</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('CHARTS');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  activeTab === 'CHARTS'
                    ? 'bg-the2 border-vien text-nhan-chu'
                    : 'bg-nen border-vien text-chu-phu'
                }`}
              >
                <PieChart className="h-5 w-5 text-nhan-chu shrink-0" />
                <div>
                  <div className="font-bold">Cơ Cấu Vốn & NAV</div>
                  <div className="text-[10px] text-chu-phu font-normal">Phân bổ tài sản</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('ANALYTICS');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  activeTab === 'ANALYTICS'
                    ? 'bg-loi-nen border-vien text-loi'
                    : 'bg-nen border-vien text-chu-phu'
                }`}
              >
                <Award className="h-5 w-5 text-loi shrink-0" />
                <div>
                  <div className="font-bold">Hiệu Suất & Excel</div>
                  <div className="text-[10px] text-chu-phu font-normal">Xuất file kiểm toán</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('NHATKY');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  activeTab === 'NHATKY'
                    ? 'bg-the2 border-vien text-nhan-chu'
                    : 'bg-nen border-vien text-chu-phu'
                }`}
              >
                <BookOpen className="h-5 w-5 text-nhan-chu shrink-0" />
                <div>
                  <div className="font-bold">Nhật Ký Nhận Định</div>
                  <div className="text-[10px] text-chu-phu font-normal">Ghi & đối chiếu luận điểm</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('INTELLIGENCE');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  activeTab === 'INTELLIGENCE'
                    ? 'bg-the2 border-vien text-nhan-chu'
                    : 'bg-nen border-vien text-chu-phu'
                }`}
              >
                <Newspaper className="h-5 w-5 text-nhan-chu shrink-0" />
                <div>
                  <div className="font-bold">Tin Tức Thị Trường</div>
                  <div className="text-[10px] text-chu-phu font-normal">BCTC & Gợi ý AI</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capy 4-Style Onboarding Picker Modal */}
      <CapyStylePickerModal isOpen={isStylePickerOpen} onClose={closeStylePicker} />

      {/* Cash Deposit / Withdraw Modal */}
      <CashModal />

      {/* Quick Price Update Modal */}
      <PriceUpdateModal />

      {/* Screen PIN Lock Modal */}
      <PinLockScreen />

      {/* Khay thông báo + hộp hỏi/nhập của chính app — thay window.alert/confirm/prompt */}
      <KhayThongBao />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BackgroundProvider>
      <AppContent />
    </BackgroundProvider>
  );
};

export default App;
