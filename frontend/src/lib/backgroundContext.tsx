import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  wallpaperService,
  PRESET_WALLPAPERS,
  WallpaperPreset,
  WallpaperConfig
} from '../services/wallpaperService';

export { PRESET_WALLPAPERS };
export type { WallpaperPreset };

interface BackgroundState {
  bgUrl: string | null;
  dim: number; // 0 to 100
  activePresetId: string | null;
  setPresetBg: (preset: WallpaperPreset) => void;
  setDirectUrl: (url: string) => void;
  removeBg: () => void;
  setDim: (dim: number) => void;
}

const BackgroundContext = createContext<BackgroundState | null>(null);

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WallpaperConfig>(() => wallpaperService.getConfig());
  const [bgUrl, setBgUrl] = useState<string | null>(() => wallpaperService.getActiveBackgroundUrl());

  const setPresetBg = (preset: WallpaperPreset) => {
    wallpaperService.setPreset(preset.id);
    const newConfig = wallpaperService.getConfig();
    setConfig(newConfig);
    setBgUrl(preset.url);
  };

  const setDirectUrl = (url: string) => {
    wallpaperService.setCustomUrl(url);
    const newConfig = wallpaperService.getConfig();
    setConfig(newConfig);
    setBgUrl(newConfig.customUrl);
  };

  const removeBg = () => {
    wallpaperService.resetToDefault();
    const newConfig = wallpaperService.getConfig();
    setConfig(newConfig);
    setBgUrl(null);
  };

  const setDim = (newDim: number) => {
    wallpaperService.setDim(newDim);
    setConfig(wallpaperService.getConfig());
  };

  return (
    <BackgroundContext.Provider
      value={{
        bgUrl,
        dim: config.dim,
        activePresetId: config.activePresetId,
        setPresetBg,
        setDirectUrl,
        removeBg,
        setDim
      }}
    >
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
              style={{ opacity: config.dim / 100 }}
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
