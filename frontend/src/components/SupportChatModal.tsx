import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, ShieldCheck, User, Sparkles, Clock, CheckCheck, Users } from 'lucide-react';
import { useAuthStore, UserProfile } from '../store/useAuthStore';
import { supportService, SupportMessage } from '../services/supportService';

export const SupportChatModal: React.FC = () => {
  const { isSupportChatOpen, closeSupportChat, user, allUsers } = useAuthStore();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'ADMIN';

  // Lấy danh sách thành viên thường (không bao gồm Admin)
  const regularMembers = allUsers.filter((u: UserProfile) => u.role !== 'ADMIN');

  useEffect(() => {
    if (isAdmin && !selectedMemberId && regularMembers.length > 0) {
      setSelectedMemberId(regularMembers[0].id);
    }
  }, [isAdmin, regularMembers.length]);

  const reloadMessages = () => {
    if (!user) return;
    if (isAdmin) {
      const msgs = selectedMemberId ? supportService.getMessagesForThread(selectedMemberId) : [];
      setMessages([...msgs]);
      if (selectedMemberId) {
        supportService.markAsRead(user.id, true, selectedMemberId);
      }
    } else {
      const msgs = supportService.getMessagesForUser(user.id);
      setMessages([...msgs]);
      supportService.markAsRead(user.id, false);
    }
  };

  useEffect(() => {
    if (isSupportChatOpen) {
      reloadMessages();
      const interval = setInterval(reloadMessages, 2500); // Polling realtime tin nhắn
      return () => clearInterval(interval);
    }
  }, [isSupportChatOpen, user?.id, isAdmin, selectedMemberId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isSupportChatOpen || !user) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isAdmin && !selectedMemberId) {
      alert('Vui lòng chọn một thành viên để gửi tin nhắn!');
      return;
    }

    supportService.sendMessage(
      user.id,
      user.nickname || user.name,
      user.email,
      inputText,
      isAdmin,
      isAdmin ? selectedMemberId : 'admin_hai_master'
    );

    setInputText('');
    reloadMessages();
  };

  const selectedMember = regularMembers.find((m) => m.id === selectedMemberId);

  return (
    <div className="fixed inset-0 z-50 bg-nen backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`bg-the border border-vien rounded-3xl w-full ${
        isAdmin ? 'max-w-4xl h-[600px]' : 'max-w-lg h-[560px]'
      } p-5 shadow-2xl relative flex flex-col justify-between space-y-3`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-vien shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-the2 text-nhan-chu border border-vien">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-chu">
                  {isAdmin
                    ? `🛡️ HỘP THƯ HỖ TRỢ ADMIN (Đang chat với: ${selectedMember?.name || 'Thành viên'})`
                    : '💬 NHẮN TIN 1-1 VỚI ADMIN VIP (ANH HẢI)'}
                </h3>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-tot-nen text-tot border border-vien font-mono font-bold">
                  Bảo Mật 1-1
                </span>
              </div>
              <p className="text-[11px] text-chu-phu">
                {isAdmin
                  ? 'Kênh trả lời riêng tư từng thành viên (các thành viên không nhìn thấy nhau)'
                  : 'Trao đổi chiến lược đầu tư & giải đáp thắc mắc trực tiếp với Chủ nhân'}
              </p>
            </div>
          </div>

          <button
            onClick={closeSupportChat}
            className="text-chu-phu hover:text-chu p-1.5 rounded-xl hover:bg-the2 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body: Split for Admin, Single Column for Member */}
        <div className="flex-1 flex gap-3 overflow-hidden">
          {/* Cột Danh Sách Thành Viên (Chỉ Dành Cho Admin) */}
          {isAdmin && (
            <div className="w-64 border-r border-vien pr-2 flex flex-col space-y-2 overflow-y-auto shrink-0 text-xs">
              <div className="text-[11px] font-bold text-chu-phu uppercase tracking-wider px-2 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-nhan-chu" />
                <span>Thành viên ({regularMembers.length})</span>
              </div>

              {regularMembers.length === 0 ? (
                <div className="p-3 rounded-xl bg-nen text-chu-mo text-[11px] text-center">
                  Chưa có thành viên đăng ký
                </div>
              ) : (
                regularMembers.map((m: UserProfile) => {
                  const isSelected = m.id === selectedMemberId;
                  const unread = supportService.getUnreadCountForUser(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMemberId(m.id);
                      }}
                      className={`w-full p-2.5 rounded-2xl text-left transition flex items-center justify-between gap-2 border ${
                        isSelected
                          ? 'bg-the2 border-vien text-chu'
                          : 'bg-nen hover:bg-the2 border-vien text-chu-phu'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-bold truncate">{m.name}</div>
                        <div className="text-[10px] text-chu-phu truncate">
                          {m.nickname ? `@${m.nickname}` : m.email}
                        </div>
                      </div>
                      {unread > 0 && (
                        <span className="h-4 w-4 rounded-full bg-loi text-tren-nhan text-[9px] font-bold flex items-center justify-center shrink-0">
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Khung Tin Nhắn Cuộn */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-chu-mo space-y-2">
                  <MessageSquare className="h-8 w-8 text-chu-mo opacity-50" />
                  <p>Chưa có tin nhắn nào. Hãy gửi câu hỏi đầu tiên!</p>
                </div>
              ) : (
                messages.map((m: SupportMessage) => {
                  const isMine = isAdmin ? m.isFromAdmin : !m.isFromAdmin;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 px-1">
                        <span className="text-[10px] text-chu-mo font-sans">
                          {m.isFromAdmin ? '👑 Hải (Admin VIP)' : m.userName}
                        </span>
                        <span className="text-[9px] text-chu-mo font-mono">
                          {new Date(m.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                          isMine
                            ? 'bg-the text-chu font-medium rounded-tr-none'
                            : 'bg-nen border border-vien text-chu rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="pt-2 border-t border-vien shrink-0 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isAdmin
                    ? `Nhập câu trả lời cho ${selectedMember?.name || 'thành viên'}...`
                    : 'Nhập câu hỏi gửi riêng cho Admin Hải...'
                }
                className="flex-1 bg-nen border border-vien rounded-2xl px-4 py-2.5 text-xs text-chu placeholder-the2 focus:outline-none focus:border-nhan-chu"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-2xl bg-nhan hover:bg-nhan text-tren-nhan transition disabled:opacity-40 shadow-md shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
