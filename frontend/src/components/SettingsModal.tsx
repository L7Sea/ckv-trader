import React, { useState } from 'react';
import { Settings, Image, Sparkles, Lock, X, Trash2, Sliders, Check, Link2 } from 'lucide-react';
import { useBackground, PRESET_WALLPAPERS } from '../lib/backgroundContext';
import { getGreetingStyle, setGreetingStyle, GreetingStyle } from '../lib/greeting';
import { useAuthStore } from '../store/useAuthStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { bgUrl, dim, activePresetId, setPresetBg, setDirectUrl, removeBg, setDim } = useBackground();
  const { user } = useAuthStore();

  const [style, setStyle] = useState<GreetingStyle>(() => getGreetingStyle());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  if (!isOpen) return null;

  const handleStyleSelect = (newStyle: GreetingStyle) => {
    setStyle(newStyle);
    setGreetingStyle(newStyle);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setDirectUrl(customUrlInput.trim());
      setCustomUrlInput('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tùy Biến Giao Diện & Trợ Lý</h3>
              <p className="text-xs text-slate-400">Đồng bộ hình nền 4K đa thiết bị (Máy tính & Điện thoại)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. Phong cách Linh Vật Capy & Lời Chào */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>Tính Cách Linh Vật Capy & Trợ Lý</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'vui', name: '😄 Vui Vẻ', desc: 'Tích cực, khích lệ giao dịch' },
              { key: 'troll', name: '😈 Troll / Kháy', desc: 'Cà khịa đu đỉnh, thức khuya' },
              { key: 'pro', name: '💼 Chuyên Nghiệp', desc: 'Chuẩn corporate, kỷ luật' },
              { key: 'gen_z', name: '⚡ Gen Z', desc: 'Trendy, slay, no cap' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleStyleSelect(item.key as GreetingStyle)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  style === item.key
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-white">{item.name}</div>
                <div className="text-[10px] text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Ảnh Nền 4K & Đồng Bộ Đa Thiết Bị */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Image className="h-4 w-4" />
              <span>Hình Nền 4K Đa Thiết Bị</span>
            </label>
            {bgUrl && (
              <button
                onClick={removeBg}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                title="Khôi phục nền mặc định"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Về mặc định</span>
              </button>
            )}
          </div>

          {/* Preset Wallpaper Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-semibold block">Chọn nhanh 5 bộ nền 4K chuẩn Pro:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_WALLPAPERS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setPresetBg(preset);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className={`p-2.5 rounded-2xl border text-[11px] font-bold text-slate-200 transition text-left flex flex-col justify-between ${
                    activePresetId === preset.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-md ring-1 ring-indigo-500'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                  title={preset.description}
                >
                  <span className="truncate block font-semibold">{preset.name}</span>
                  <span className="text-[9px] text-slate-500 truncate block mt-0.5">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dán URL ảnh online để đồng bộ đa thiết bị */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] text-slate-400 font-semibold block">Hoặc dán Link URL ảnh online:</span>
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomUrl()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                disabled={!customUrlInput.trim()}
                className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shrink-0 shadow-sm"
              >
                Áp Dụng
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              💡 Mẹo: Chọn Preset 4K hoặc dán URL online sẽ hiển thị ngay lập tức và đồng bộ hoàn hảo trên cả Máy tính lẫn Điện thoại.
            </p>
          </div>

          {/* Dim Slider */}
          {bgUrl && (
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5 text-slate-400" />
                  <span>Độ tối phủ nền (Dim):</span>
                </span>
                <span className="font-mono text-indigo-400">{dim}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={dim}
                onChange={(e) => setDim(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-[10px] text-slate-500">Tăng độ tối để nhìn bảng giá và biểu đồ rõ ràng hơn</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold animate-in fade-in">
              <Check className="h-4 w-4" /> Đã lưu thiết lập!
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 font-mono">Tự động đồng bộ</span>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Hoàn Tất
          </button>
        </div>
      </div>
    </div>
  );
};
