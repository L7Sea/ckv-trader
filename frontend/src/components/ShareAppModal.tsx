import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, QrCode, Smartphone, Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const ShareAppModal: React.FC = () => {
  const { isShareModalOpen, closeShareModal } = useAuthStore();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const appUrl = window.location.origin || 'https://ckv-trader.pages.dev';

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
        <button
          onClick={closeShareModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Share2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Chia Sẻ CKV Pro Trader</h3>
            <p className="text-xs text-slate-400">Gửi link cho bạn bè & cộng đồng trader</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Link truy cập Production:</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Cloudflare Pages
            </span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 bg-transparent text-xs font-mono font-bold text-white focus:outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition shadow-md shadow-emerald-500/20"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            💡 Bạn bè khi truy cập link này có thể tự tạo tài khoản (hoặc đăng nhập Google) với số dư khởi tạo là 0đ để bắt đầu ghi chép danh mục độc lập!
          </p>
        </div>

        <div className="pt-1">
          <button
            onClick={closeShareModal}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
