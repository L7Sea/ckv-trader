import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, LogIn, UserPlus, Sparkles, User, KeyRound } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginAsAdmin,
    user
  } = useAuthStore();

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authMode === 'REGISTER') {
        if (!name.trim()) return alert('Vui lòng nhập họ và tên!');
        if (!email.trim()) return alert('Vui lòng nhập email!');
        await registerWithEmail(name, email, password);
      } else {
        if (!email.trim()) return alert('Vui lòng nhập email!');
        await loginWithEmail(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tài Khoản Nhà Đầu Tư CKV</h3>
            <p className="text-xs text-slate-400">Không gian quản trị & phân tích danh mục riêng</p>
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
            <span>Tiếp tục với Google (Google Sign-In)</span>
          </button>
        </div>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] text-slate-500 font-mono uppercase">hoặc qua email</span>
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
            ĐĂNG KÝ MỚI
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {authMode === 'REGISTER' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Họ Và Tên:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="VD: trader@gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mật khẩu / Mã PIN:</label>
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
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 uppercase"
            >
              {loading ? 'ĐANG XỬ LÝ...' : authMode === 'REGISTER' ? 'TẠO TÀI KHOẢN & BẮT ĐẦU (0 VNĐ)' : 'ĐĂNG NHẬP VÀO SỔ LỆNH'}
            </button>
          </div>
        </form>

        {/* Phím tắt Chủ Nhân (Admin Fast Access) */}
        <div className="pt-2 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => {
              const pin = prompt('Nhập mã PIN xác thực Chủ Nhân (VIP Master):');
              if (pin === '542463' || pin === 'admin' || pin === '5424') {
                loginAsAdmin();
              } else if (pin !== null) {
                alert('Mã PIN không chính xác! Không thể truy cập tài khoản Master của Chủ nhân.');
              }
            }}
            className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Đăng Nhập Tài Khoản Chủ Nhân (VIP Master)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

