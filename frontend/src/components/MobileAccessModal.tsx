import React, { useState } from 'react';
import { X, Smartphone, QrCode, Copy, Check, Wifi, Globe, Shield } from 'lucide-react';

interface MobileAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAccessModal: React.FC<MobileAccessModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Lấy URL hiện tại hoặc IP mạng LAN
  const currentOrigin = window.location.origin;
  // Nếu đang mở bằng localhost, gợi ý IP mạng nội bộ
  const localWifiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://${window.location.hostname === 'localhost' ? '192.168.0.54' : window.location.hostname}:3000`
    : currentOrigin;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(localWifiUrl)}&color=10-185-129&bgcolor=11-15-25`;

  const handleCopy = () => {
    navigator.clipboard.writeText(localWifiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <Smartphone className="h-6 w-6" />
        </div>

        <h3 className="text-lg font-bold text-white">Truy Cập Bằng Điện Thoại</h3>
        <p className="text-xs text-slate-400 mt-1">
          Chỉ cần quét mã QR hoặc nhập đường link dưới đây vào trình duyệt điện thoại (Safari / Chrome)
        </p>

        {/* QR Code Frame */}
        <div className="my-5 p-4 bg-slate-950 rounded-2xl border border-slate-800 inline-block shadow-inner">
          <img
            src={qrImageUrl}
            alt="QR Code"
            className="w-48 h-48 rounded-xl mx-auto border border-emerald-500/30"
          />
        </div>

        {/* Link Box */}
        <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-left">
          <Globe className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
          <input
            type="text"
            readOnly
            value={localWifiUrl}
            className="bg-transparent text-xs font-mono font-bold text-emerald-300 w-full focus:outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shrink-0"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        {/* Hướng dẫn kết nối */}
        <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-left space-y-1.5 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            <span>Lưu ý khi mở trên điện thoại:</span>
          </div>
          <p>• Điện thoại và máy tính kết nối <strong>cùng mạng Wi-Fi</strong>.</p>
          <p>• Sau khi mở, anh có thể chọn <em>"Thêm vào Màn hình chính" (Add to Home Screen)</em> trên điện thoại để dùng như một App độc lập!</p>
        </div>
      </div>
    </div>
  );
};
