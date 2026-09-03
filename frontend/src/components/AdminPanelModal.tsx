import React, { useState } from 'react';
import { thongBao } from '../lib/thongBao';
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
    <div className="fixed inset-0 z-50 bg-nen backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-the border border-vien rounded-3xl w-full max-w-5xl max-h-[88vh] p-6 shadow-2xl relative flex flex-col justify-between space-y-4">
        <button
          onClick={closeAdminPanel}
          className="absolute top-4 right-4 text-chu-phu hover:text-chu p-1.5 rounded-xl hover:bg-the2 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-vien gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-canh-bao-nen text-canh-bao border border-vien">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-chu">Quản Trị Hệ Thống & Thành Viên (Admin VIP)</h3>
                <span className="text-[10px] uppercase font-bold text-canh-bao bg-canh-bao-nen border border-vien px-2 py-0.5 rounded-full font-mono">
                  Master Console
                </span>
              </div>
              <p className="text-xs text-chu-phu">
                Tổng cộng <b>{allUsers.length} tài khoản thành viên</b> trong cơ sở dữ liệu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Box Mã PIN Ngày Hôm Nay Cho Admin Gửi Cho Khách */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-canh-bao-nen border border-vien text-xs">
              <KeyRound className="h-4 w-4 text-canh-bao" />
              <div>
                <span className="text-[10px] text-chu-phu block font-sans">Mã PIN hôm nay:</span>
                <b className="text-canh-bao font-mono text-sm tracking-widest">{todayPin}</b>
              </div>
              <button
                type="button"
                onClick={handleCopyPin}
                className="p-1.5 rounded-xl bg-canh-bao-nen hover:bg-canh-bao-nen text-canh-bao transition active:scale-95 ml-1"
                title="Sao chép mã PIN để gửi cho khách đăng ký"
              >
                {copiedPin ? <Check className="h-3.5 w-3.5 text-tot" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <button
              onClick={() => {
                closeAdminPanel();
                openSupportChat();
              }}
              className="px-4 py-2 rounded-xl bg-nhan hover:bg-nhan text-tren-nhan font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-md"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Kênh Chat Thành Viên</span>
            </button>
          </div>
        </div>

        {/* Bảng Danh Sách Người Dùng */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {allUsers.length === 0 ? (
            <div className="py-12 text-center text-chu-mo space-y-2">
              <Users className="h-10 w-10 mx-auto stroke-1 opacity-40" />
              <p className="text-sm font-semibold text-chu-phu">Chưa có tài khoản thành viên phụ nào trong cơ sở dữ liệu.</p>
              <p className="text-xs text-chu-mo">Mã PIN hôm nay ({todayPin}) luôn sẵn sàng để gửi cho khách đăng ký.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-nen text-chu-phu font-semibold uppercase tracking-wider sticky top-0">
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
              <tbody className="divide-y divide-the2 font-mono">
              {allUsers.map((u: UserProfile) => {
                const isCurrent = u.id === user.id;
                return (
                  <tr key={u.id} className="hover:bg-the2 transition">
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          u.role === 'ADMIN' ? 'bg-canh-bao text-tren-nhan font-black' : 'bg-the2 text-chu'
                        }`}>
                          {u.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-chu flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-tot-nen text-tot border border-vien">
                                Đang chọn
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-tot font-sans font-bold">
                      {u.nickname || u.name}
                    </td>
                    <td className="py-3 px-3 text-chu-phu font-sans">
                      {u.age ? `${u.age} tuổi` : '26 tuổi'} • {u.gender === 'FEMALE' ? 'Nữ' : u.gender === 'OTHER' ? 'Khác' : 'Nam'}
                    </td>
                    <td className="py-3 px-3 text-chu-phu">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-chu-mo">{u.accountNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        u.role === 'ADMIN'
                          ? 'bg-canh-bao-nen text-canh-bao border-vien'
                          : 'bg-tot-nen text-tot border-vien'
                      }`}>
                        {u.role === 'ADMIN' ? '👑 ADMIN MASTER' : 'THÀNH VIÊN'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-chu-phu text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCurrent && (
                          <button
                            onClick={async () => {
                              if (await thongBao.hoi({ loi: `Xem góc nhìn của "${u.name}"?`, nhanDong: 'Xem', nhanHuy: 'Huỷ', nguyHiem: false })) {
                                switchUserAccount(u.id);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-the2 hover:bg-the2 text-chu font-bold text-xs transition inline-flex items-center gap-1"
                            title="Xem thử giao diện của thành viên này"
                          >
                            <LogIn className="h-3.5 w-3.5 text-tot" />
                            <span className="hidden sm:inline">Góc nhìn</span>
                          </button>
                        )}
                        {u.role !== 'ADMIN' && u.email !== 'leminhhaia5890@gmail.com' && (
                          <button
                            onClick={async () => {
                              if (await thongBao.hoi({ loi: `Xoá vĩnh viễn tài khoản "${u.name}"?`, chiTiet: `${u.email} — toàn bộ dữ liệu của thành viên này sẽ bị xoá sạch, không hoàn tác được.`, nhanDong: 'Xoá vĩnh viễn', nhanHuy: 'Huỷ', nguyHiem: true })) {
                                deleteUser(u.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-loi-nen hover:bg-loi-nen border border-vien text-loi hover:text-loi transition"
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
        )}
      </div>
      </div>
    </div>
  );
};
