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
import { CashModal } from './components/CashModal';
import { PriceUpdateModal } from './components/PriceUpdateModal';
import { PinLockScreen } from './components/PinLockScreen';
import { CapyMascot } from './components/CapyMascot';
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
  Award
} from 'lucide-react';

type TabType = 'TRADE' | 'MARKET' | 'CHARTS' | 'ANALYTICS';

export const AppContent: React.FC = () => {
  const { fetchData, error, successMessage, clearMessages } = useTradingStore();
  const [activeTab, setActiveTab] = useState<TabType>('TRADE');

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
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

        {/* 1. Tổng quan tài sản (Portfolio Overview) */}
        <PortfolioOverview />

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 overflow-x-auto">
          <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-semibold backdrop-blur-md">
            <button
              onClick={() => setActiveTab('TRADE')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'TRADE'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>GIAO DỊCH & VỊ THẾ</span>
            </button>

            <button
              onClick={() => setActiveTab('MARKET')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'MARKET'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>BẢNG GIÁ VN30</span>
            </button>

            <button
              onClick={() => setActiveTab('CHARTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'CHARTS'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span>PHÂN BỔ TÀI SẢN</span>
            </button>

            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'ANALYTICS'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
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
            <TechnicalChart />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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

        {/* TAB 2: BẢNG GIÁ VN30 */}
        {activeTab === 'MARKET' && (
          <div className="space-y-6">
            <MarketBoard />
            <TechnicalChart />
          </div>
        )}

        {/* TAB 3: PHÂN BỔ TÀI SẢN & BIỂU ĐỒ NAV */}
        {activeTab === 'CHARTS' && (
          <div className="space-y-6">
            <PortfolioCharts />
            <PositionsTable />
          </div>
        )}

        {/* TAB 4: HIỆU SUẤT & XUẤT BÁO CÁO EXCEL */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
            <AnalyticsReport />
            <TransactionHistory />
          </div>
        )}
      </main>

      {/* Modals, Security Screen & Mascot */}
      <CashModal />
      <PriceUpdateModal />
      <PinLockScreen />
      <CapyMascot />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
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
