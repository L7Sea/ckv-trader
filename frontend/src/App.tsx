import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PortfolioOverview } from './components/PortfolioOverview';
import { TradePositionsPage } from './pages/TradePositionsPage';
import { PositionRiskPage } from './pages/PositionRiskPage';
import { RadarAlgorithmsPage } from './pages/RadarAlgorithmsPage';
import { MarketBoardChartPage } from './pages/MarketBoardChartPage';
import { MacroRatesPage } from './pages/MacroRatesPage';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { PortfolioAllocationPage } from './pages/PortfolioAllocationPage';
import { PerformanceAnalyticsPage } from './pages/PerformanceAnalyticsPage';

import { CashModal } from './components/CashModal';
import { PriceUpdateModal } from './components/PriceUpdateModal';
import { PinLockScreen } from './components/PinLockScreen';
import { CapyStylePickerModal } from './components/CapyStylePickerModal';
import Capy from './components/Capy';
import { BackgroundProvider } from './lib/backgroundContext';
import { useTradingStore, TabType } from './store/useTradingStore';
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
  Landmark
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, fetchData, error, successMessage, clearMessages } = useTradingStore();
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isStylePickerOpen, setIsStylePickerOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('ckv_style_initialized');
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-20 md:pb-6">
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* Toast / Notification Banner */}
        {error && (
          <div className="flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearMessages} className="p-1 hover:bg-rose-500/20 rounded-lg text-rose-400">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearMessages} className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-400">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 1. Tổng quan tài sản Super-App (Portfolio Master Card) */}
        <PortfolioOverview />

        {/* Navigation Tabs Bar (Desktop & Tablet Pill Bar - Tinh gọn, vừa vặn 100% trên 1 hàng) */}
        <div className="hidden md:flex items-center justify-start border-b border-[#212636] pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 p-1 bg-[#121620] rounded-2xl border border-[#212636] text-xs font-semibold backdrop-blur-md shrink-0 w-full justify-between">
            <button
              data-tab="TRADE"
              onClick={() => setActiveTab('TRADE')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'TRADE'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Landmark className="h-4 w-4 text-emerald-300" />
              <span>LÃI SUẤT VĨ MÔ</span>
            </button>

            <button
              data-tab="INTELLIGENCE"
              onClick={() => setActiveTab('INTELLIGENCE')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'INTELLIGENCE'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>HIỆU SUẤT EXCEL</span>
            </button>
          </div>
        </div>

        {/* 8 TRANG ĐỘC LẬP TƯƠNG ỨNG TỪNG FILE TRONG /src/pages/ */}
        {activeTab === 'TRADE' && <TradePositionsPage />}
        {activeTab === 'DECISION' && <PositionRiskPage />}
        {activeTab === 'ALGORITHMS' && <RadarAlgorithmsPage />}
        {activeTab === 'MARKET' && <MarketBoardChartPage />}
        {activeTab === 'MACRO' && <MacroRatesPage />}
        {activeTab === 'INTELLIGENCE' && <MarketIntelligencePage />}
        {activeTab === 'CHARTS' && <PortfolioAllocationPage />}
        {activeTab === 'ANALYTICS' && <PerformanceAnalyticsPage />}
      </main>

      {/* Floating Mascot Capy (Duy nhất 1 trợ lý) */}
      <Capy />

      {/* Mobile Bottom Navigation (Chuẩn Mobile Native 5 Nút & Bottom Sheet Khám Phá Đầy Đủ 8 Trang) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-2xl px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),10px)] shadow-2xl">
        <div className="grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('TRADE')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
              activeTab === 'TRADE' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px]">Sổ Lệnh</span>
          </button>

          <button
            onClick={() => setActiveTab('DECISION')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
              activeTab === 'DECISION' ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-400'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span className="text-[10px]">Hòa Vốn</span>
          </button>

          <button
            onClick={() => setActiveTab('MARKET')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
              activeTab === 'MARKET' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-400'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="text-[10px]">Bảng Giá</span>
          </button>

          <button
            onClick={() => setActiveTab('ALGORITHMS')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
              activeTab === 'ALGORITHMS' ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-400'
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
                ? 'text-purple-400 font-bold bg-purple-500/10'
                : 'text-slate-400'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span className="text-[10px]">Khám Phá ☰</span>
          </button>
        </div>
      </div>

      {/* Mobile More Bottom Sheet (Trang Vĩ Mô, Tài Sản, Hiệu Suất, Tin Tức) */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom pb-[max(env(safe-area-inset-bottom),20px)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Khám Phá Toàn Diện CKV Pro</h3>
              </div>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
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
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300'
                }`}
              >
                <Landmark className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold">Lãi Suất Vĩ Mô</div>
                  <div className="text-[10px] text-slate-400 font-normal">20 Bank & FinTech</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('CHARTS');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  activeTab === 'CHARTS'
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300'
                }`}
              >
                <PieChart className="h-5 w-5 text-purple-400 shrink-0" />
                <div>
                  <div className="font-bold">Cơ Cấu Vốn & NAV</div>
                  <div className="text-[10px] text-slate-400 font-normal">Phân bổ tài sản</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('ANALYTICS');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  activeTab === 'ANALYTICS'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300'
                }`}
              >
                <Award className="h-5 w-5 text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold">Hiệu Suất & Excel</div>
                  <div className="text-[10px] text-slate-400 font-normal">Xuất file kiểm toán</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('INTELLIGENCE');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  activeTab === 'INTELLIGENCE'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300'
                }`}
              >
                <Newspaper className="h-5 w-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold">Tin Tức Thị Trường</div>
                  <div className="text-[10px] text-slate-400 font-normal">BCTC & Gợi ý AI</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capy 4-Style Onboarding Picker Modal */}
      <CapyStylePickerModal
        isOpen={isStylePickerOpen}
        onClose={() => setIsStylePickerOpen(false)}
      />

      {/* Cash Deposit / Withdraw Modal */}
      <CashModal />

      {/* Quick Price Update Modal */}
      <PriceUpdateModal />

      {/* Screen PIN Lock Modal */}
      <PinLockScreen />
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
