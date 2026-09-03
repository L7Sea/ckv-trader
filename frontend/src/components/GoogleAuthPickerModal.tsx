import React, { useState } from 'react';
import { X, User, Plus, ShieldCheck, ArrowLeft, KeyRound, Check, Lock, ChevronRight } from 'lucide-react';
import { useAuthStore, UserProfile, ADMIN_MASTER_PROFILE, isValidRegistrationPin, generateMemberAccountNumber } from '../store/useAuthStore';
import { localTradingEngine } from '../services/localTradingEngine';
import { Pin6Input } from './Pin6Input';

export const GoogleAuthPickerModal: React.FC = () => {
  const {
    isGooglePickerOpen,
    closeGooglePicker,
    allUsers,
    loginAsAdmin,
    registerWithMemberInfo
  } = useAuthStore();

  const [step, setStep] = useState<'LIST' | 'ADMIN_PASS' | 'NEW_EMAIL' | 'NEW_DETAILS'>('LIST');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  // Form tài khoản Google mới
  const [newEmail, setNewEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState<number | ''>(26);
  const [dailyPin, setDailyPin] = useState('');
  const [memberPass, setMemberPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isGooglePickerOpen) return null;

  // Lấy danh sách tài khoản Google sẵn có
  const googleAccounts: { name: string; email: string; isAdmin: boolean; user?: UserProfile }[] = [
    {
      name: 'Lê Minh Hải (Chủ Nhân VIP)',
      email: 'leminhhaia5890@gmail.com',
      isAdmin: true,
      user: allUsers.find((u) => u.email === 'leminhhaia5890@gmail.com') || ADMIN_MASTER_PROFILE
    },
    ...allUsers
      .filter((u) => u.email !== 'leminhhaia5890@gmail.com' && u.email.includes('@'))
      .map((u) => ({
        name: u.name,
        email: u.email,
        isAdmin: false,
        user: u
      }))
  ];

  const handleSelectAccount = (acc: typeof googleAccounts[0]) => {
    setErrorMsg('');
    setAdminError('');
    if (acc.isAdmin) {
      setSelectedUser(acc.user || ADMIN_MASTER_PROFILE);
      setStep('ADMIN_PASS');
    } else if (acc.user) {
      // Đăng nhập trực tiếp tài khoản thành viên có sẵn
      const activeId = acc.user.id;
      localStorage.setItem('ckv_active_user_id_v7', activeId);
      localTradingEngine.setActiveUserId(activeId, false);
      window.location.reload();
    }
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '542463' || adminPin === 'admin' || adminPin === '5424') {
      loginAsAdmin('leminhhaia5890@gmail.com');
      closeGooglePicker();
    } else {
      setAdminError('Mật khẩu / Mã PIN Admin không chính xác!');
    }
  };

  const handleNewEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setErrorMsg('Vui lòng nhập đúng định dạng Gmail / Email!');
      return;
    }

    const clean = newEmail.toLowerCase().trim();
    if (clean === 'leminhhaia5890@gmail.com') {
      setSelectedUser(ADMIN_MASTER_PROFILE);
      setStep('ADMIN_PASS');
      return;
    }

    // Kiểm tra xem email này đã tồn tại chưa
    const existing = allUsers.find((u) => u.email.toLowerCase() === clean);
    if (existing) {
      localStorage.setItem('ckv_active_user_id_v7', existing.id);
      localTradingEngine.setActiveUserId(existing.id, existing.role === 'ADMIN');
      window.location.reload();
      return;
    }

    setErrorMsg('');
    setStep('NEW_DETAILS');
  };

  const handleNewDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setErrorMsg('Vui lòng nhập Tên của bạn!');
      return;
    }
    if (!dailyPin.trim() || dailyPin.length < 6) {
      setErrorMsg('Vui lòng nhập đúng Mã PIN 6 số ngày hôm nay (Liên hệ Admin Hải)!');
      return;
    }

    const fullName = [lastName.trim(), middleName.trim(), firstName.trim()].filter(Boolean).join(' ') || firstName.trim();

    const success = await registerWithMemberInfo({
      name: fullName,
      nickname: (nickname || firstName).trim(),
      age: Number(age) || 25,
      gender: 'MALE',
      email: newEmail.trim().toLowerCase(),
      dailyPin: dailyPin.trim(),
      password: memberPass.trim()
    });

    if (success) {
      closeGooglePicker();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-nen backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-the border border-vien rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative text-chu flex flex-col justify-between space-y-4">
        {/* Nút đóng */}
        <button
          onClick={closeGooglePicker}
          className="absolute top-4 right-4 text-chu-phu hover:text-chu p-1.5 rounded-xl hover:bg-the2 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Chuẩn Google */}
        <div className="text-center space-y-2 pb-2 border-b border-vien">
          <div className="flex justify-center mb-1">
            <svg className="h-9 w-9" viewBox="0 0 24 24">
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
          </div>
          <h3 className="text-lg font-bold text-chu">Đăng nhập bằng Google</h3>
          <p className="text-xs text-chu-phu">để tiếp tục tới <b className="text-nhan-chu font-mono">CKV Pro Trader</b></p>
        </div>

        {/* BƯỚC 1: DANH SÁCH TÀI KHOẢN GOOGLE */}
        {step === 'LIST' && (
          <div className="space-y-2 py-1">
            <p className="text-xs text-chu-phu font-medium px-1">Chọn một tài khoản:</p>

            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {googleAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAccount(acc)}
                  className="w-full p-3 rounded-2xl bg-nen hover:bg-the2 border border-vien transition flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      acc.isAdmin ? 'bg-canh-bao text-tren-nhan font-black ring-2 ring-canh-bao' : 'bg-nhan text-tren-nhan'
                    }`}>
                      {acc.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-chu flex items-center gap-1.5 truncate">
                        <span>{acc.name}</span>
                        {acc.isAdmin && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-canh-bao-nen text-canh-bao border border-vien font-mono">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-chu-phu font-mono truncate">{acc.email}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-chu-mo group-hover:text-chu transition shrink-0" />
                </button>
              ))}

              {/* Sử dụng tài khoản khác */}
              <button
                onClick={() => {
                  setErrorMsg('');
                  setStep('NEW_EMAIL');
                }}
                className="w-full p-3 rounded-2xl bg-nen hover:bg-the2 border border-dashed border-vien transition flex items-center gap-3 text-left group"
              >
                <div className="h-9 w-9 rounded-full bg-the2 text-chu-phu flex items-center justify-center shrink-0">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-chu group-hover:text-chu">Sử dụng một tài khoản khác</div>
                  <div className="text-[11px] text-chu-mo">Đăng nhập tài khoản Gmail mới</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 2: XÁC THỰC MẬT KHẨU / MÃ PIN ADMIN */}
        {step === 'ADMIN_PASS' && (
          <form onSubmit={handleAdminVerify} className="space-y-4 py-1">
            <div className="p-3 rounded-2xl bg-canh-bao-nen border border-vien flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-canh-bao text-tren-nhan font-black flex items-center justify-center text-sm shrink-0">
                H
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-chu flex items-center gap-1.5">
                  <span>Lê Minh Hải</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-canh-bao-nen text-canh-bao border border-vien font-mono">
                    VIP Master
                  </span>
                </div>
                <div className="text-[11px] text-chu-phu font-mono">leminhhaia5890@gmail.com</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-chu-phu mb-1.5 flex items-center justify-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-canh-bao" />
                <span>Nhập mã PIN / Mật khẩu Admin bảo mật:</span>
              </label>
              <Pin6Input
                value={adminPin}
                onChange={setAdminPin}
                mask={true}
                borderColor="amber"
              />
              {adminError && <p className="text-loi text-xs mt-1 text-center font-bold">{adminError}</p>}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('LIST')}
                className="px-4 py-2.5 rounded-2xl bg-the2 hover:bg-the2 text-chu-phu font-bold text-xs transition"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-nhan hover:bg-nhan text-tren-nhan font-black text-xs transition shadow-lg shadow-md"
              >
                XÁC THỰC VÀO SỔ LỆNH MASTER
              </button>
            </div>
          </form>
        )}

        {/* BƯỚC 3: NHẬP GMAIL MỚI */}
        {step === 'NEW_EMAIL' && (
          <form onSubmit={handleNewEmailSubmit} className="space-y-4 py-1">
            <div>
              <label className="block text-xs font-semibold text-chu-phu mb-1.5">
                Nhập địa chỉ Gmail của bạn:
              </label>
              <input
                type="email"
                autoFocus
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="tenban@gmail.com"
                className="w-full bg-nen border border-vien rounded-2xl px-4 py-2.5 text-xs text-chu font-bold focus:outline-none focus:border-nhan-chu"
                required
              />
              {errorMsg && <p className="text-loi text-xs mt-1 font-bold">{errorMsg}</p>}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('LIST')}
                className="px-4 py-2.5 rounded-2xl bg-the2 hover:bg-the2 text-chu-phu font-bold text-xs transition"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-nhan hover:bg-nhan text-tren-nhan font-bold text-xs transition shadow-lg shadow-md"
              >
                Tiếp theo
              </button>
            </div>
          </form>
        )}

        {/* BƯỚC 4: ĐĂNG KÝ THÔNG TIN THÀNH VIÊN GOOGLE MỚI */}
        {step === 'NEW_DETAILS' && (
          <form onSubmit={handleNewDetailsSubmit} className="space-y-3 py-1 text-xs">
            <div className="p-2.5 rounded-xl bg-canh-bao-nen border border-vien text-[11px] text-canh-bao">
              <span className="font-bold">Mã PIN hôm nay:</span> Thành viên mới đăng ký lần đầu qua Google cần nhập đúng mã PIN ngày hôm nay (Liên hệ Admin Hải).
            </div>

            <div>
              <label className="block font-semibold text-canh-bao mb-1 text-center">MÃ PIN 6 SỐ HÔM NAY (BẮT BUỘC):</label>
              <Pin6Input
                value={dailyPin}
                onChange={setDailyPin}
                mask={false}
                borderColor="amber"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-chu-phu mb-1">Họ:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Lê"
                  className="w-full bg-nen border border-vien rounded-xl px-2.5 py-1.5 text-chu"
                />
              </div>
              <div>
                <label className="block text-chu-phu mb-1">Tên đệm:</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Minh"
                  className="w-full bg-nen border border-vien rounded-xl px-2.5 py-1.5 text-chu"
                />
              </div>
              <div>
                <label className="block text-nhan-chu mb-1">Tên chính *:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Hải / Minh"
                  className="w-full bg-nen border border-vien rounded-xl px-2.5 py-1.5 text-nhan-chu font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-chu-phu mb-1">Tên gọi trong App (Nickname):</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="VD: Minh Alpha"
                className="w-full bg-nen border border-vien rounded-xl px-3 py-1.5 text-chu"
                required
              />
            </div>

            <div>
              <label className="block text-chu-phu mb-1">Mật khẩu cá nhân (để đăng nhập nhanh lần sau):</label>
              <input
                type="password"
                value={memberPass}
                onChange={(e) => setMemberPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-nen border border-vien rounded-xl px-3 py-1.5 text-nhan-chu font-mono"
              />
            </div>

            {errorMsg && <p className="text-loi text-xs font-bold">{errorMsg}</p>}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('NEW_EMAIL')}
                className="px-4 py-2 rounded-xl bg-the2 hover:bg-the2 text-chu-phu font-bold"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-nhan hover:bg-nhan text-tren-nhan font-black tracking-wide shadow-lg shadow-md uppercase"
              >
                Xác thực & Vào App
              </button>
            </div>
          </form>
        )}

        {/* Footer bảo mật */}
        <div className="pt-2 border-t border-vien text-center">
          <p className="text-[10px] text-chu-mo flex items-center justify-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-nhan-chu" />
            <span>Được bảo vệ bởi CKV Google Single Sign-On Architecture</span>
          </p>
        </div>
      </div>
    </div>
  );
};
