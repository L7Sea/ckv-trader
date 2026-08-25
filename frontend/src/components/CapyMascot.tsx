import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, X, Volume2, RefreshCw, Smile, Zap, Coffee, ShieldAlert } from 'lucide-react';
import { getCapyQuote, getSmartGreeting, getGreetingStyle, setGreetingStyle, GreetingStyle } from '../lib/greeting';
import { useAuthStore } from '../store/useAuthStore';

export const CapyMascot: React.FC = () => {
  const { user } = useAuthStore();
  const [quote, setQuote] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<GreetingStyle>('vui');
  const [isWiggling, setIsWiggling] = useState(false);

  useEffect(() => {
    setCurrentStyle(getGreetingStyle());
    setQuote(getCapyQuote());
  }, []);

  const handleNextQuote = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);
    setQuote(getCapyQuote());
  };

  const handleStyleChange = (style: GreetingStyle) => {
    setGreetingStyle(style);
    setCurrentStyle(style);
    setIsStyleMenuOpen(false);
    setQuote(getCapyQuote());
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-auto">
      {/* Speech Bubble */}
      {isOpen && (
        <div className="mb-3 max-w-xs bg-slate-900/95 border-2 border-emerald-500/40 rounded-3xl p-3.5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-300 relative">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide text-amber-400 flex items-center gap-1">
                🐹 CAPY TRADER
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {currentStyle === 'vui' && 'Vui Vẻ'}
                {currentStyle === 'troll' && 'Troll/Kháy'}
                {currentStyle === 'pro' && 'Chuyên Nghiệp'}
                {currentStyle === 'gen_z' && 'Gen Z'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition"
                title="Đổi phong cách của Capy"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Style Selector Dropdown */}
          {isStyleMenuOpen && (
            <div className="mb-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 gap-1 text-[11px]">
              <button
                onClick={() => handleStyleChange('vui')}
                className={`px-2 py-1 rounded-lg font-bold transition text-left ${currentStyle === 'vui' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'}`}
              >
                😄 Vui vẻ
              </button>
              <button
                onClick={() => handleStyleChange('troll')}
                className={`px-2 py-1 rounded-lg font-bold transition text-left ${currentStyle === 'troll' ? 'bg-rose-500 text-white' : 'text-slate-300 hover:bg-slate-900'}`}
              >
                😈 Troll/Kháy
              </button>
              <button
                onClick={() => handleStyleChange('pro')}
                className={`px-2 py-1 rounded-lg font-bold transition text-left ${currentStyle === 'pro' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-900'}`}
              >
                💼 Pro Trader
              </button>
              <button
                onClick={() => handleStyleChange('gen_z')}
                className={`px-2 py-1 rounded-lg font-bold transition text-left ${currentStyle === 'gen_z' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'}`}
              >
                ⚡ Gen Z
              </button>
            </div>
          )}

          <p className="text-xs text-slate-200 leading-relaxed font-medium">"{quote}"</p>

          <div className="mt-2.5 flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400">
            <span>Bấm vào Capy để nghe câu mới</span>
            <button
              onClick={handleNextQuote}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Đổi câu</span>
            </button>
          </div>

          {/* Chat bubble tail */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-slate-900 border-b-2 border-r-2 border-emerald-500/40 transform rotate-45" />
        </div>
      )}

      {/* Capybara Mascot Avatar Button */}
      <button
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          handleNextQuote();
        }}
        className={`group relative h-16 w-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-1 shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center ${
          isWiggling ? 'animate-bounce' : ''
        }`}
        title="Linh vật Capy - Trợ lý Chứng Khoán Cá Nhân"
      >
        {/* Capybara SVG Character */}
        <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden relative border border-amber-400/40">
          <svg viewBox="0 0 100 100" className="w-12 h-12 transform group-hover:scale-110 transition duration-300">
            {/* Capybara Body */}
            <ellipse cx="50" cy="55" rx="36" ry="32" fill="#9E6B38" />
            <ellipse cx="50" cy="58" rx="30" ry="26" fill="#B27E4B" />
            
            {/* Snout */}
            <rect x="30" y="42" width="40" height="26" rx="12" fill="#7D4F25" />
            
            {/* Nose nostrils */}
            <ellipse cx="44" cy="52" rx="3" ry="2.5" fill="#3D2008" />
            <ellipse cx="56" cy="52" rx="3" ry="2.5" fill="#3D2008" />

            {/* Eyes / Cool Sunglasses */}
            <rect x="26" y="32" width="20" height="10" rx="3" fill="#111827" stroke="#F59E0B" strokeWidth="1.5" />
            <rect x="54" y="32" width="20" height="10" rx="3" fill="#111827" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="46" y1="36" x2="54" y2="36" stroke="#F59E0B" strokeWidth="2" />
            {/* Glasses reflection */}
            <line x1="28" y1="34" x2="34" y2="40" stroke="#6EE7B7" strokeWidth="1.2" opacity="0.8" />
            <line x1="56" y1="34" x2="62" y2="40" stroke="#6EE7B7" strokeWidth="1.2" opacity="0.8" />

            {/* Small Cute Ears */}
            <circle cx="22" cy="28" r="6" fill="#7D4F25" />
            <circle cx="78" cy="28" r="6" fill="#7D4F25" />
            <circle cx="22" cy="28" r="3.5" fill="#B27E4B" />
            <circle cx="78" cy="28" r="3.5" fill="#B27E4B" />

            {/* Cute Orange/Tangerine on Capy's Head */}
            <circle cx="50" cy="18" r="8" fill="#F97316" />
            <ellipse cx="51" cy="11" rx="2.5" ry="1.5" fill="#15803D" />
          </svg>
        </div>

        {/* Live Notification Indicator */}
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950 text-[8px] font-black text-slate-950 items-center justify-center">
            VN
          </span>
        </span>
      </button>
    </div>
  );
};
