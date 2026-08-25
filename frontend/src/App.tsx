import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PortfolioOverview } from './components/PortfolioOverview';
import { OrderForm } from './components/OrderForm';
import { PositionsTable } from './components/PositionsTable';
import { TransactionHistory } from './components/TransactionHistory';
import { TechnicalChart } from './components/TechnicalChart';
import { MarketBoard } from './components/MarketBoard';
import { PortfolioCharts } from './components/PortfolioCharts';
import { AnalyticsReport } from './components/AnalyticsReport';
import { PositionDecisionEngine } from './components/PositionDecisionEngine';
import { FiftyAlgorithmsReport } from './components/FiftyAlgorithmsReport';
import { QuickRadarSearch } from './components/QuickRadarSearch';
import { MarketIntelligenceDashboard } from './components/MarketIntelligenceDashboard';
import { PriceUpdateModal } from './components/PriceUpdateModal';
import { PinLockScreen } from './components/PinLockScreen';
import Capy from './components/Capy';
import { BackgroundProvider } from './lib/backgroundContext';
import { useTradingStore } from './store/useTradingStore';
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
  FileSpreadsheet
} from 'lucide-react';

type TabType = 'TRADE' | 'DECISION' | 'ALGORITHMS' | 'MARKET' | 'INTELLIGENCE' | 'CHARTS' | 'ANALYTICS';

export const AppContent: React.FC = () => {
  const { fetchData, error, successMessage, clearMessages } = useTradingStore();
  const [activeTab, setActiveTab] = useState<TabType>('TRADE');

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-20 md:pb-6">
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

        {/* Navigation Tabs Bar (Desktop & Tablet Pill Bar) */}
        <div className="hidden md:flex items-center justify-between border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-semibold backdrop-blur-md">
            <button
              data-tab="TRADE"
              onClick={() => setActiveTab('TRADE')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'TRADE'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>GIAO DỊCH & VỊ THẾ</span>
            </button>

            <button
              data-tab="DECISION"
              onClick={() => setActiveTab('DECISION')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'DECISION'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>CHIẾN LƯỢC HÒA VỐN</span>
            </button>

            <button
              data-tab="ALGORITHMS"
              onClick={() => setActiveTab('ALGORITHMS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'ALGORITHMS'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-bold shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>150 THUẬT TOÁN DỰ ĐOÁN</span>
            </button>

            <button
              data-tab="MARKET"
              onClick={() => setActiveTab('MARKET')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'MARKET'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>BẢNG GIÁ VN50 (VNI)</span>
            </button>

            <button
              data-tab="INTELLIGENCE"
              onClick={() => setActiveTab('INTELLIGENCE')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'INTELLIGENCE'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="h-4 w-4" />
              <span>TIN TỨC & BCTC</span>
            </button>

            <button
              data-tab="CHARTS"
              onClick={() => setActiveTab('CHARTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'CHARTS'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span>PHÂN BỔ NAV</span>
            </button>

            <button
              data-tab="ANALYTICS"
              onClick={() => setActiveTab('ANALYTICS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'ANALYTICS'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>HIỆU SUẤT & EXCEL</span>
            </button>
          </div>
        </div>

        {/* TAB 1: GIAO DỊCH & VỊ THẾ */}
        {activeTab === 'TRADE' && (
          <div className="space-y-6">
            <QuickRadarSearch />
            <PositionDecisionEngine />
            <TechnicalChart />
            <div id="order-form-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 sticky top-20">
                <OrderForm />
              </div>
              <div className="lg:col-span-8 space-y-6">
                <PositionsTable />
              </div>
            </div>
            <TransactionHistory />
          </div>
        )}

        {/* TAB 2: THUẬT TOÁN HÒA VỐN TPB */}
        {activeTab === 'DECISION' && (
          <div className="space-y-6">
            <PositionDecisionEngine />
            <TechnicalChart />
          </div>
        )}

        {/* TAB 3: HỆ THỐNG 150 THUẬT TOÁN DỰ ĐOÁN */}
        {activeTab === 'ALGORITHMS' && (
          <div className="space-y-6">
            <QuickRadarSearch />
            <FiftyAlgorithmsReport />
          </div>
        )}

        {/* TAB 4: BẢNG GIÁ THEO DÕI (VNI) */}
        {activeTab === 'MARKET' && (
          <div className="space-y-6">
            <QuickRadarSearch />
            <MarketBoard />
            <TechnicalChart />
          </div>
        )}

        {/* TAB 5: TIN TỨC & BÁO CÁO TÀI CHÍNH BCTC DOANH NGHIỆP */}
        {activeTab === 'INTELLIGENCE' && (
          <div className="space-y-6">
            <MarketIntelligenceDashboard />
          </div>
        )}

        {/* TAB 6: PHÂN BỔ TÀI SẢN & BIỂU ĐỒ NAV */}
        {activeTab === 'CHARTS' && (
          <div className="space-y-6">
            <PortfolioCharts />
            <PositionsTable />
          </div>
        )}

        {/* TAB 7: HIỆU SUẤT & XUẤT BÁO CÁO EXCEL */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
            <AnalyticsReport />
            <TransactionHistory />
          </div>
        )}
      </main>

      {/* ══ MOBILE BOTTOM NAVIGATION BAR (MOMO / ZALOPAY / SHOPEE STYLE) ══ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-2 py-1.5 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('TRADE')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'TRADE' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-[10px]">Vị Thế</span>
          </button>

          <button
            onClick={() => setActiveTab('DECISION')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'DECISION' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Scale className="h-5 w-5" />
            <span className="text-[10px]">Hòa Vốn</span>
          </button>

          <button
            onClick={() => setActiveTab('ALGORITHMS')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'ALGORITHMS' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <div className="relative">
              <Cpu className="h-5 w-5" />
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            </div>
            <span className="text-[10px]">150 Algos</span>
          </button>

          <button
            onClick={() => setActiveTab('MARKET')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'MARKET' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="text-[10px]">Bảng Giá</span>
          </button>

          <button
            onClick={() => setActiveTab('INTELLIGENCE')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition ${
              activeTab === 'INTELLIGENCE' ? 'text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Newspaper className="h-5 w-5" />
            <span className="text-[10px]">Tin Tức</span>
          </button>
        </div>
      </nav>

      {/* Modals, Security Screen & Full Physics Capy */}
      <PriceUpdateModal />
      <PinLockScreen />
      
      {/* Linh vật Capy chạy trên tất cả, kéo thả lăn lộn tự do */}
      <Capy />

      {/* Footer Desktop */}
      <footer className="hidden md:block border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>CKV PRO TRADER • Nền tảng Quản trị Chứng khoán Cá nhân Chuẩn T+2.5 • Serverless Cloudflare & Firestore</p>
      </footer>
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
