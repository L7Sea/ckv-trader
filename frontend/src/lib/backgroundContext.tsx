import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const BG_STORAGE_KEY = 'ckv_background_image';
const DIM_STORAGE_KEY = 'ckv_background_dim';

export interface BgPreset {
  id: string;
  name: string;
  url: string;
  preview: string;
}

export const PRESET_WALLPAPERS: BgPreset[] = [
  {
    id: 'cyberpunk',
    name: '🏙️ Cyberpunk Trading',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    preview: 'bg-cyan-950'
  },
  {
    id: 'wallstreet',
    name: '🐂 Wall Street Bull',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
    preview: 'bg-amber-950'
  },
  {
    id: 'bloomberg',
    name: '📊 Bloomberg Dark',
    url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop',
    preview: 'bg-slate-950'
  },
  {
    id: 'deepsea',
    name: '🌊 Deep Sea Obsidian',
    url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2070&auto=format&fit=crop',
    preview: 'bg-indigo-950'
  },
  {
    id: 'aurora',
    name: '✨ Emerald Matrix',
    url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=2070&auto=format&fit=crop',
    preview: 'bg-emerald-950'
  }
];

interface BackgroundState {
  bgUrl: string | null;
  dim: number; // 0 to 100
  activePresetId: string | null;
  uploadBg: (file: File) => void;
  setPresetBg: (preset: BgPreset) => void;
  setDirectUrl: (url: string) => void;
  removeBg: () => void;
  setDim: (dim: number) => void;
}

const BackgroundContext = createContext<BackgroundState | null>(null);

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bgUrl, setBgUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(BG_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ckv_background_preset_id');
    } catch {
      return null;
    }
  });

  const [dim, setDimState] = useState<number>(() => {
    try {
      const val = localStorage.getItem(DIM_STORAGE_KEY);
      return val ? Number(val) : 35;
    } catch {
      return 35;
    }
  });

  const uploadBg = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setBgUrl(url);
      setActivePresetId(null);
      try {
        localStorage.setItem(BG_STORAGE_KEY, url);
        localStorage.removeItem('ckv_background_preset_id');
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const setPresetBg = (preset: BgPreset) => {
    setBgUrl(preset.url);
    setActivePresetId(preset.id);
    try {
      localStorage.setItem(BG_STORAGE_KEY, preset.url);
      localStorage.setItem('ckv_background_preset_id', preset.id);
    } catch {}
  };

  const setDirectUrl = (url: string) => {
    setBgUrl(url);
    setActivePresetId(null);
    try {
      localStorage.setItem(BG_STORAGE_KEY, url);
      localStorage.removeItem('ckv_background_preset_id');
    } catch {}
  };

  const removeBg = () => {
    setBgUrl(null);
    setActivePresetId(null);
    try {
      localStorage.removeItem(BG_STORAGE_KEY);
      localStorage.removeItem('ckv_background_preset_id');
    } catch {}
  };

  const setDim = (newDim: number) => {
    setDimState(newDim);
    try {
      localStorage.setItem(DIM_STORAGE_KEY, String(newDim));
    } catch {}
  };

  return (
    <BackgroundContext.Provider value={{ bgUrl, dim, activePresetId, uploadBg, setPresetBg, setDirectUrl, removeBg, setDim }}>
      {/* Background layer container */}
      <div className="relative min-h-screen">
        {bgUrl && (
          <div
            className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
            style={{
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Dim Overlay */}
            <div
              className="absolute inset-0 bg-[#0B0F19]"
              style={{ opacity: dim / 100 }}
            />
          </div>
        )}
        <div className="relative z-10">{children}</div>
      </div>
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error('useBackground must be used within BackgroundProvider');
  return ctx;
};
