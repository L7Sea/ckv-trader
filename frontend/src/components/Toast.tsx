import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ToastState {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastState>({
  success: (msg) => console.log('Toast success:', msg),
  error: (msg) => console.error('Toast error:', msg),
  info: (msg) => console.log('Toast info:', msg)
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const show = (text: string, type: 'success' | 'error' | 'info') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const toast: ToastState = {
    success: (t) => show(t, 'success'),
    error: (t) => show(t, 'error'),
    info: (t) => show(t, 'info')
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {msg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2147483647] px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-slate-700 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          {msg.text}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
