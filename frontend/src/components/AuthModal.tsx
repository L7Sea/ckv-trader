import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, LogIn, UserPlus, Sparkles, User, KeyRound, Calendar, Hash } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    loginWithGoogle,
    loginWithEmail,
    registerWithMemberInfo,
    loginAsAdmin,
    user
  } = useAuthStore();

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState<number | ''>(26);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [email, setEmail] = useState('');
  const [dailyPin, setDailyPin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authMode === 'REGISTER') {
        if (!name.trim()) return alert('Vui lòng nhập Họ và Tên thật!');
        if (!nickname.trim()) return alert('Vui lòng nhập Tên gọi trong App!');
        if (!email.trim()) return alert('Vui lòng nhập Email / Gmail!');
        if (!dailyPin.trim() || dailyPin.length < 6) return alert('Vui lòng nhập đúng Mã PIN 6 số của ngày hôm nay (Liên hệ Admin Hải để nhận mã)!');

        const success = await registerWithMemberInfo({
          name: name.trim(),
          nickname: nickname.trim(),
          age: Number(age) || 25,
          gender,
          email: email.trim(),
          dailyPin: dailyPin.trim(),
          password: password.trim()
        });

        if (!success) return;
      } else {
        if (!email.trim()) return alert('Vui lòng nhập email!');
        await loginWithEmail(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative space-y-4">
        {/* Chỉ hiện nút đóng nếu người dùng đã đăng nhập trước đó */}
        {user && (
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">CỔNG TRUY CẬP CKV PRO TRADER</h3>
            <p className="text-xs text-slate-400">Đăng nhập tài khoản thành viên để vào sổ lệnh</p>
          </div>
        </div>

        {/* Nút Đăng Nhập 1-Click Bằng Google */}
        <div>
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              await loginWithGoogle();
              setLoading(false);
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition shadow-md shadow-white/10"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Tiếp tục với Google (Gmail Sign-In)</span>
          </button>
        </div>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] text-slate-500 font-mono uppercase">hoặc tài khoản thành viên</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Tabs Đăng Nhập / Đăng Ký */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('LOGIN')}
            className={`py-2 rounded-xl transition ${
              authMode === 'LOGIN' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ĐĂNG NHẬP
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('REGISTER')}
            className={`py-2 rounded-xl transition ${
              authMode === 'REGISTER' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ĐĂNG KÝ THÀNH VIÊN
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {authMode === 'REGISTER' && (
            <>
              {/* Box Cảnh Báo Mã PIN Hàng Ngày */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <KeyRound className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Yêu cầu Mã PIN 6 số biến đổi hàng ngày:</span>
                </div>
                <p className="text-slate-400 leading-tight">
                  Mỗi ngày hệ thống tự sinh 1 mã PIN 6 số. Hãy liên hệ <b>Admin Hải</b> để lấy mã kích hoạt trước khi tạo tài khoản.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-300 mb-1 flex items-center gap-1">
                  <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                  <span>MÃ PIN 6 SỐ CỦA NGÀY HÔM NAY (BẮT BUỘC):</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={dailyPin}
                  onChange={(e) => setDailyPin(e.target.value)}
                  placeholder="Nhập 6 số PIN ngày hôm nay (VD: 861482)"
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3.5 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-mono font-bold tracking-widest text-center"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Họ Và Tên Thật:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nguyễn Văn Nam"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tên Gọi Trong App:</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="VD: Nam Alpha Trader"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tuổi:</label>
                  <input
                    type="number"
                    min={18}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="26"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Giới Tính:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gmail / Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="VD: nam.trader@gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mật khẩu cá nhân:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono font-bold tracking-wider"
              required
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 uppercase tracking-wide"
            >
              {loading ? 'ĐANG XỬ LÝ...' : authMode === 'REGISTER' ? 'XÁC THỰC MÃ PIN & TẠO TÀI KHOẢN' : 'ĐĂNG NHẬP VÀO SỔ LỆNH'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

