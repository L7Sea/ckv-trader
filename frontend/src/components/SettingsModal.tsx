import React, { useState, useRef } from 'react';
import { Settings, Image, Sparkles, Lock, X, Upload, Trash2, Sliders, Check } from 'lucide-react';
import { useBackground, PRESET_WALLPAPERS } from '../lib/backgroundContext';
import { getGreetingStyle, setGreetingStyle, GreetingStyle } from '../lib/greeting';
import { useAuthStore } from '../store/useAuthStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { bgUrl, dim, activePresetId, uploadBg, setPresetBg, setDirectUrl, removeBg, setDim } = useBackground();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [style, setStyle] = useState<GreetingStyle>(() => getGreetingStyle());
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadBg(file);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleStyleSelect = (newStyle: GreetingStyle) => {
    setStyle(newStyle);
    setGreetingStyle(newStyle);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tùy Biến Giao Diện & Trợ Lý</h3>
              <p className="text-xs text-slate-400">Cá nhân hóa nền, linh vật Capy và trải nghiệm</p>
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

        {/* 2. Ảnh Nền & Thanh Trượt Dim (Tối Nền) */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Image className="h-4 w-4" />
            <span>Ảnh Nền Tùy Biến (Custom Background)</span>
          </label>

          {/* Preset Wallpaper Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-semibold block">Chọn nhanh hình nền 4K chuẩn Trader:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_WALLPAPERS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setPresetBg(preset);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className={`p-2 rounded-xl border text-[11px] font-bold text-slate-200 transition text-center truncate ${
                    activePresetId === preset.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                  title={preset.name}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition active:scale-95"
            >
              <Upload className="h-4 w-4" />
              <span>{bgUrl ? 'Tải ảnh từ máy' : 'Tải ảnh nền riêng từ máy'}</span>
            </button>

            {bgUrl && (
              <button
                onClick={removeBg}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                title="Xóa ảnh nền (Về mặc định)"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dán URL ảnh online để đồng bộ đa thiết bị */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Hoặc dán Link URL ảnh online (Unsplash/Pinterest)..."
                id="direct_bg_url_input"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('direct_bg_url_input') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    setDirectUrl(input.value.trim());
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }
                }}
                className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition shrink-0"
              >
                Áp Dụng
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              💡 Mẹo: Chọn <b>Preset 4K</b> ở trên hoặc <b>dán Link online</b> để ảnh hiện giống hệt nhau trên cả Máy tính lẫn Điện thoại!
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
            <span className="text-[11px] text-slate-500 font-mono">Tự động đồng bộ trên thiết bị</span>
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
