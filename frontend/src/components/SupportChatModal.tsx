import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, ShieldCheck, User, Sparkles, Clock, CheckCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supportService, SupportMessage } from '../services/supportService';

export const SupportChatModal: React.FC = () => {
  const { isSupportChatOpen, closeSupportChat, user } = useAuthStore();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'ADMIN';

  const reloadMessages = () => {
    if (!user) return;
    const msgs = isAdmin ? supportService.getMessages() : supportService.getMessagesForUser(user.id);
    setMessages([...msgs]);
    supportService.markAsRead(user.id, isAdmin);
  };

  useEffect(() => {
    if (isSupportChatOpen) {
      reloadMessages();
      const interval = setInterval(reloadMessages, 3000); // Polling realtime tin nhắn mới
      return () => clearInterval(interval);
    }
  }, [isSupportChatOpen, user?.id, isAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isSupportChatOpen || !user) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    supportService.sendMessage(
      user.id,
      user.name,
      user.email,
      inputText,
      isAdmin
    );

    setInputText('');
    reloadMessages();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg h-[560px] p-5 shadow-2xl relative flex flex-col justify-between space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {isAdmin ? '🛡️ Kênh Chat Hỗ Trợ Khách Hàng (Admin Console)' : '💬 Nhắn Tin Trực Tuyến Với Admin VIP'}
                </h3>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isAdmin
                  ? 'Trao đổi trực tiếp và giải đáp cho các tài khoản người dùng'
                  : 'Trò chuyện trực tiếp với anh Hải (Admin VIP CKV Pro Trader)'}
              </p>
            </div>
          </div>

          <button
            onClick={closeSupportChat}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Khung Tin Nhắn Cuộn */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <MessageSquare className="h-8 w-8 text-slate-600 opacity-50" />
              <p>Chưa có tin nhắn nào. Hãy gửi câu hỏi đầu tiên!</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = isAdmin ? m.isFromAdmin : !m.isFromAdmin;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5 px-1">
                    <span className="text-[10px] text-slate-500 font-sans">
                      {m.isFromAdmin ? '👑 Hải (Admin VIP)' : m.userName}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">
                      {new Date(m.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      isMine
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
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
        <form onSubmit={handleSend} className="pt-2 border-t border-slate-800 shrink-0 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isAdmin ? 'Nhập câu trả lời cho người dùng...' : 'Nhập câu hỏi gửi Admin...'}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white transition disabled:opacity-40 shadow-md shadow-indigo-500/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
