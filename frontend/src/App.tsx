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

        {/* Navigation Tabs Bar (Desktop & Tablet Pill Bar - Chống chồng chéo, cuộn ngang mượt mà) */}
        <div className="hidden md:flex items-center justify-start border-b border-[#212636] pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 p-1.5 bg-[#121620] rounded-2xl border border-[#212636] text-xs font-semibold backdrop-blur-md shrink-0">
            <button
              data-tab="TRADE"
              onClick={() => setActiveTab('TRADE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'TRADE'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>SỔ LỆNH & VỊ THẾ</span>
            </button>

            <button
              data-tab="DECISION"
              onClick={() => setActiveTab('DECISION')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'DECISION'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>QUẢN TRỊ VỊ THẾ & HÒA VỐN</span>
            </button>

            <button
              data-tab="ALGORITHMS"
              onClick={() => setActiveTab('ALGORITHMS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'ALGORITHMS'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>RADAR & THUẬT TOÁN ĐỊNH LƯỢNG</span>
            </button>

            <button
              data-tab="MARKET"
              onClick={() => setActiveTab('MARKET')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'MARKET'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>BẢNG GIÁ THỰC TẾ & CHART</span>
            </button>

            <button
              data-tab="MACRO"
              onClick={() => setActiveTab('MACRO')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'MACRO'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Landmark className="h-4 w-4 text-emerald-300" />
              <span>LÃI SUẤT VĨ MÔ & CHI PHÍ VỐN</span>
            </button>

            <button
              data-tab="INTELLIGENCE"
              onClick={() => setActiveTab('INTELLIGENCE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'INTELLIGENCE'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Newspaper className="h-4 w-4" />
              <span>PHÂN TÍCH THỊ TRƯỜNG & TIN TỨC</span>
            </button>

            <button
              data-tab="CHARTS"
              onClick={() => setActiveTab('CHARTS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'CHARTS'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span>PHÂN BỔ TÀI SẢN & NAV</span>
            </button>

            <button
              data-tab="ANALYTICS"
              onClick={() => setActiveTab('ANALYTICS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'ANALYTICS'
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>HIỆU SUẤT & EXCEL</span>
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

      {/* Floating Mascot Capy */}
      <Capy />

      {/* Mobile Bottom Navigation (Siêu ứng dụng 6 nút có Lãi Suất Vĩ Mô) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1117]/95 border-t border-[#212636] backdrop-blur-xl px-2 py-2 shadow-2xl">
        <div className="grid grid-cols-6 gap-1 text-center">
          <button
            onClick={() => setActiveTab('TRADE')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'TRADE' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-[9px]">Sổ Lệnh</span>
          </button>

          <button
            onClick={() => setActiveTab('DECISION')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'DECISION' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span className="text-[9px]">Hòa Vốn</span>
          </button>

          <button
            onClick={() => setActiveTab('ALGORITHMS')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'ALGORITHMS' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span className="text-[9px]">Thuật Toán</span>
          </button>

          <button
            onClick={() => setActiveTab('MARKET')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'MARKET' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="text-[9px]">Bảng Giá</span>
          </button>

          <button
            onClick={() => setActiveTab('MACRO')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'MACRO' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Landmark className="h-4 w-4" />
            <span className="text-[9px]">Lãi Suất</span>
          </button>

          <button
            onClick={() => setActiveTab('CHARTS')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'CHARTS' ? 'text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <PieChart className="h-4 w-4" />
            <span className="text-[9px]">Tài Sản</span>
          </button>
        </div>
      </div>

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
