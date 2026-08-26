import React, { useState } from 'react';
import { X, ShieldCheck, Users, MessageSquare, LogIn, Trash2, CheckCircle2, User, KeyRound, Copy, Check } from 'lucide-react';
import { useAuthStore, getDailyAccessPin, UserProfile } from '../store/useAuthStore';
import { localTradingEngine } from '../services/localTradingEngine';

export const AdminPanelModal: React.FC = () => {
  const { isAdminPanelOpen, closeAdminPanel, allUsers, user, switchUserAccount, deleteUser, openSupportChat } = useAuthStore();
  const [copiedPin, setCopiedPin] = useState(false);

  if (!isAdminPanelOpen || user?.role !== 'ADMIN') return null;

  const todayPin = getDailyAccessPin();

  const handleCopyPin = () => {
    navigator.clipboard.writeText(todayPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[88vh] p-6 shadow-2xl relative flex flex-col justify-between space-y-4">
        <button
          onClick={closeAdminPanel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Quản Trị Hệ Thống & Thành Viên (Admin VIP)</h3>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                  Master Console
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tổng cộng <b>{allUsers.length} tài khoản thành viên</b> trong cơ sở dữ liệu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Box Mã PIN Ngày Hôm Nay Cho Admin Gửi Cho Khách */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <KeyRound className="h-4 w-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Mã PIN hôm nay:</span>
                <b className="text-amber-300 font-mono text-sm tracking-widest">{todayPin}</b>
              </div>
              <button
                type="button"
                onClick={handleCopyPin}
                className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition active:scale-95 ml-1"
                title="Sao chép mã PIN để gửi cho khách đăng ký"
              >
                {copiedPin ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <button
              onClick={() => {
                closeAdminPanel();
                openSupportChat();
              }}
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-indigo-500/20"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Kênh Chat Thành Viên</span>
            </button>
          </div>
        </div>

        {/* Bảng Danh Sách Người Dùng */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-3 rounded-l-xl">Thành Viên</th>
                <th className="py-2.5 px-3">Tên App (Nickname)</th>
                <th className="py-2.5 px-3">Tuổi / Giới Tính</th>
                <th className="py-2.5 px-3">Email / Mã TK</th>
                <th className="py-2.5 px-3">Vai Trò</th>
                <th className="py-2.5 px-3">Ngày Đăng Ký</th>
                <th className="py-2.5 px-3 text-right rounded-r-xl">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {allUsers.map((u: UserProfile) => {
                const isCurrent = u.id === user.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          u.role === 'ADMIN' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-200'
                        }`}>
                          {u.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Đang chọn
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-emerald-300 font-sans font-bold">
                      {u.nickname || u.name}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans">
                      {u.age ? `${u.age} tuổi` : '26 tuổi'} • {u.gender === 'FEMALE' ? 'Nữ' : u.gender === 'OTHER' ? 'Khác' : 'Nam'}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-slate-500">{u.accountNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        u.role === 'ADMIN'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {u.role === 'ADMIN' ? '👑 ADMIN MASTER' : 'THÀNH VIÊN'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCurrent && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Chuyển sang kiểm tra góc nhìn của thành viên "${u.name}"?`)) {
                                switchUserAccount(u.id);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition inline-flex items-center gap-1"
                            title="Xem thử giao diện của thành viên này"
                          >
                            <LogIn className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="hidden sm:inline">Góc nhìn</span>
                          </button>
                        )}
                        {u.role !== 'ADMIN' && u.email !== 'leminhhaia5890@gmail.com' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`⚠️ CẢNH BÁO ADMIN:\nChủ nhân có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${u.name}" (${u.email}) khỏi hệ thống?\nToàn bộ dữ liệu của thành viên này sẽ bị xóa sạch.`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition"
                            title="Xóa vĩnh viễn tài khoản thành viên này"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
