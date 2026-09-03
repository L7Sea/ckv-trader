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
    <div className="fixed inset-0 z-50 bg-nen backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-the border border-vien rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
        <button
          onClick={closeShareModal}
          className="absolute top-4 right-4 text-chu-phu hover:text-chu p-1.5 rounded-xl hover:bg-the2 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-vien">
          <div className="p-3 rounded-2xl bg-the2 text-nhan-chu border border-vien">
            <Share2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-chu">Chia Sẻ CKV Pro Trader</h3>
            <p className="text-xs text-chu-phu">Gửi link cho bạn bè & cộng đồng trader</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-nen border border-vien space-y-3">
          <div className="flex items-center justify-between text-xs text-chu-phu font-semibold">
            <span>Link truy cập Production:</span>
            <span className="text-tot flex items-center gap-1 font-mono">
              <span className="h-2 w-2 rounded-full bg-tot animate-pulse" />
              Cloudflare Pages
            </span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-the border border-vien">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 bg-transparent text-xs font-mono font-bold text-chu focus:outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-tot hover:bg-tot text-tren-nhan font-bold text-xs flex items-center gap-1 transition shadow-md shadow-md"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
            </button>
          </div>

          <p className="text-[11px] text-chu-mo leading-relaxed font-sans">
            💡 Bạn bè khi truy cập link này có thể tự tạo tài khoản (hoặc đăng nhập Google) với số dư khởi tạo là 0đ để bắt đầu ghi chép danh mục độc lập!
          </p>
        </div>

        <div className="pt-1">
          <button
            onClick={closeShareModal}
            className="w-full py-2.5 rounded-xl bg-the2 hover:bg-the2 text-chu font-bold text-xs transition"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
