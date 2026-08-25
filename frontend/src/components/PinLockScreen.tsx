import React, { useState } from 'react';
import { Lock, Shield, KeyRound, ArrowRight, Delete, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const PinLockScreen: React.FC = () => {
  const { isLocked, unlockApp, user } = useAuthStore();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPin, setShowPin] = useState(false);

  if (!isLocked) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg('');

      if (newPin.length === 6) {
        // Tự động kiểm tra khi đủ 6 số
        const success = unlockApp(newPin);
        if (!success) {
          setErrorMsg('Mã PIN không chính xác! Vui lòng thử lại.');
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const handleManualUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockApp(pin);
    if (!success) {
      setErrorMsg('Mã PIN không chính xác! (Mặc định: 123456)');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-6 animate-in zoom-in-95">
        {/* Security Badge */}
        <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/10 mb-2">
          <Lock className="h-8 w-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">CKV PRO SECURITY</h2>
          <p className="text-xs text-slate-400 mt-1">
            Ứng dụng đang được khóa bảo vệ. Nhập mã PIN để mở khóa.
          </p>
          <p className="text-[11px] font-mono text-emerald-400 mt-0.5">Tài khoản: {user?.name || 'Nhà Đầu Tư'}</p>
        </div>

        {/* PIN Mask Dots */}
        <div className="flex justify-center items-center gap-3 my-4">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                className={`h-4 w-4 rounded-full border-2 transition-all ${
                  isFilled
                    ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-md shadow-emerald-400/50'
                    : 'border-slate-700 bg-slate-900'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <p className="text-xs font-semibold text-rose-400 animate-bounce">{errorMsg}</p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-lg font-bold font-mono text-white shadow-sm active:scale-95 transition"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-xs font-semibold text-slate-400 active:scale-95 transition"
          >
            XÓA HẾT
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-lg font-bold font-mono text-white shadow-sm active:scale-95 transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 flex items-center justify-center text-slate-400 active:scale-95 transition"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>

        <p className="text-[11px] text-slate-600 font-mono">Mã PIN mặc định: 123456 (Đổi trong mục Hồ sơ)</p>
      </div>
    </div>
  );
};
