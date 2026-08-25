import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const BG_STORAGE_KEY = 'ckv_background_image';
const DIM_STORAGE_KEY = 'ckv_background_dim';

interface BackgroundState {
  bgUrl: string | null;
  dim: number; // 0 to 100
  uploadBg: (file: File) => void;
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
      try {
        localStorage.setItem(BG_STORAGE_KEY, url);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const removeBg = () => {
    setBgUrl(null);
    try {
      localStorage.removeItem(BG_STORAGE_KEY);
    } catch {}
  };

  const setDim = (newDim: number) => {
    setDimState(newDim);
    try {
      localStorage.setItem(DIM_STORAGE_KEY, String(newDim));
    } catch {}
  };

  return (
    <BackgroundContext.Provider value={{ bgUrl, dim, uploadBg, removeBg, setDim }}>
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
