import React, { useState } from 'react';
import {
  X,
  BookOpen,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Wallet,
  Scale,
  RefreshCw,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Landmark,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const HelpCenterModal: React.FC = () => {
  const {
    isHelpCenterOpen,
    closeHelpCenter,
    openOnboarding,
    openSupportChat,
    user,
    updateBrokerage,
    switchSubAccount
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'GUIDE' | 'BROKERAGE' | 'CUSTOM_STOCKS' | 'FAQ'>('GUIDE');
  const [selectedBroker, setSelectedBroker] = useState<string>(user?.brokerage || 'DNSE');
  const [customRate, setCustomRate] = useState<number>(user?.customMarginRate || 11.5);

  if (!isHelpCenterOpen) return null;

  const BROKER_PRESETS = [
    { code: 'DNSE', name: 'DNSE Entrade X', rate: 11.5, desc: 'Gói Deal Margin 11.5%/năm (hoặc gói 9.99%)' },
    { code: 'VPS', name: 'VPS SmartOne', rate: 13.5, desc: 'Lãi suất Margin phổ thông 13.5%/năm' },
    { code: 'TCBS', name: 'TCBS iCopy', rate: 10.5, desc: 'Gói Margin linh hoạt 10.5%/năm' },
    { code: 'SSI', name: 'SSI iBoard', rate: 12.0, desc: 'Lãi suất Margin tiêu chuẩn 12.0%/năm' },
    { code: 'VNDIRECT', name: 'VNDirect D-Margin', rate: 12.8, desc: 'Lãi suất Margin 12.8%/năm' },
    { code: 'CUSTOM', name: 'Tùy chỉnh riêng', rate: customRate, desc: 'Nhập tỷ lệ lãi suất của gói vay của bạn' }
  ];

  const handleSaveBrokerage = () => {
    updateBrokerage(selectedBroker as any, customRate);
    alert(`Đã lưu cấu hình CTCK: ${selectedBroker} với lãi suất Margin ${customRate}%/năm thành công!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between space-y-4">
        <button
          onClick={closeHelpCenter}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800 shrink-0">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Trung Tâm Hướng Dẫn & Cẩm Nang Sử Dụng</h3>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                Knowledge Base
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Giải đáp cách tùy chỉnh CTCK, giao dịch thuần tiền mặt, thêm mã cổ phiếu lạ & quản trị danh mục
            </p>
          </div>
        </div>

        {/* 4 Tabs Menu */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('GUIDE')}
            className={`py-2 px-1 rounded-xl transition text-center truncate ${
              activeTab === 'GUIDE' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            📖 TỔNG QUAN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('BROKERAGE')}
            className={`py-2 px-1 rounded-xl transition text-center truncate ${
              activeTab === 'BROKERAGE' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏦 CHỌN CTCK & VAY
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CUSTOM_STOCKS')}
            className={`py-2 px-1 rounded-xl transition text-center truncate ${
              activeTab === 'CUSTOM_STOCKS' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔍 MÃ LẠ & UPCOM
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('FAQ')}
            className={`py-2 px-1 rounded-xl transition text-center truncate ${
              activeTab === 'FAQ' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ❓ HỎI ĐÁP FAQ
          </button>
        </div>

        {/* Tab Contents (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs leading-relaxed font-sans">
          {activeTab === 'GUIDE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>Bản Chất Cốt Lõi Của CKV Pro Trader</span>
                </h4>
                <p className="text-slate-300">
                  CKV Pro Trader là <b>Nền tảng Quản trị Vị thế, Nhật ký Giao dịch & Phân tích Định lượng Vĩ mô</b> chuyên sâu, không phải là app đẩy lệnh khớp trực tiếp lên sàn HOSE/HNX. Nền tảng giúp bạn:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    🎯 <b>Quản Trị Vị Thế Kỷ Luật:</b> Theo dõi chính xác Giá Vốn Mua Ban Đầu vs Giá Hòa Vốn sau khi gánh lãi vay Margin và thuế phí.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    ⚡ <b>Đồng Bộ Toàn Diện 1-Click:</b> Nạp giá thực tế 300 mã sàn HOSE/HNX/UPCOM + Lãi suất 20 Ngân hàng.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    🤖 <b>Radar 150 Thuật Toán:</b> Hệ thống chấm điểm AI Alpha từ 0 - 100 điểm tìm mã dẫn sóng.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    💬 <b>Kênh Hỗ Trợ Trực Tuyến:</b> Nhắn tin trực tiếp với Admin bất kỳ lúc nào để nhận giải đáp.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'BROKERAGE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-purple-400" />
                    <span>Cấu Hình Công Ty Chứng Khoán & Lãi Suất Margin</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Đang chọn: {user?.brokerage || 'DNSE'} ({user?.customMarginRate || 11.5}%/năm)
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Nếu bạn dùng <b>VPS, TCBS, SSI, VNDirect</b> hoặc có gói ưu đãi lãi suất riêng, hãy chọn bên dưới để app tự động tính đúng chi phí lãi vay Margin mỗi ngày:
                </p>

                {/* Danh sách chọn nhanh CTCK */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BROKER_PRESETS.map((b) => (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => {
                        setSelectedBroker(b.code);
                        setCustomRate(b.rate);
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1 ${
                        selectedBroker === b.code
                          ? 'bg-purple-500/20 border-purple-500 text-white'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{b.name}</span>
                        <span className="font-mono text-purple-400">{b.rate}%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-sans">{b.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1">
                    <label className="text-[11px] text-slate-400 block mb-1">Lãi suất Margin thực tế (%/năm):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={customRate}
                      onChange={(e) => setCustomRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveBrokerage}
                    className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition mt-5 shadow-md shadow-purple-500/20"
                  >
                    LƯU CẤU HÌNH CTCK
                  </button>
                </div>
              </div>

              {/* Chế độ Thuần Tiền Mặt (Tiểu khoản 01) */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-slate-300">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Bạn Không Vay Margin? (Giao dịch 100% Tiền Mặt)</span>
                </h4>
                <p className="text-[11px]">
                  Chỉ cần chọn <b>Tiểu khoản 01 (Thường)</b> trên thanh Header. Hệ thống sẽ <b>tự động triệt tiêu toàn bộ nợ Margin và tiền lãi vay</b>. Giá hòa vốn của bạn sẽ thuần túy chỉ gồm giá vốn mua + thuế phí bán 0.25%!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    switchSubAccount('01');
                    alert('Đã chuyển sang Tiểu khoản 01: Giao dịch thuần tiền mặt (Không Margin)!');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Chuyển Sang Tiểu Khoản 01 (Thường) Ngay
                </button>
              </div>
            </div>
          )}

          {activeTab === 'CUSTOM_STOCKS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Search className="h-4 w-4 text-cyan-400" />
                  <span>Cách Giao Dịch & Nạp Mã Cổ Phiếu Lạ (Sàn UPCOM, HNX, HOSE)</span>
                </h4>
                <p className="text-slate-300 text-[11px]">
                  Ngoài kho 300 mã mặc định, bạn có thể nhập và theo dõi <b>BẤT KỲ MÃ CỔ PHIẾU NÀO</b> trên thị trường chứng khoán Việt Nam:
                </p>
                <div className="space-y-2 font-mono text-[11px] text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    1️⃣ <b>Tại Sổ Lệnh (Trang 1):</b> Nhập bất kỳ mã nào vào ô "Mã Cổ Phiếu" (VD: <code>VNZ</code>, <code>SGP</code>, <code>NAB</code>, <code>CTR</code>, <code>PRT</code>). Hệ thống sẽ tự động gửi request kéo thị giá live từ sàn về.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    2️⃣ <b>Cập Nhật Giá Thủ Công:</b> Nếu một mã sàn UPCOM ít thanh khoản không có nến trên API, bạn chỉ cần bấm nút <b>"Sửa Giá"</b> ở Bảng vị thế hoặc nhập giá khớp thực tế của bạn, app sẽ tự động tính PnL và giá vốn chuẩn xác 100%!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FAQ' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white text-xs">❓ Tôi mới tạo tài khoản thì tiền có bị mất hay ảnh hưởng không?</h5>
                <p className="text-slate-400 text-[11px]">
                  Số dư ban đầu của bạn là 0 VNĐ. Toàn bộ giao dịch và số tiền của bạn được lưu trong không gian độc lập, bạn có thể tự do nạp vốn ảo để trải nghiệm mà không ảnh hưởng đến bất kỳ ai.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white text-xs">❓ Làm sao để tính giá hòa vốn sau khi mua gom (DCA)?</h5>
                <p className="text-slate-400 text-[11px]">
                  Hãy vào <b>Trang 2 (Quản trị Vị thế & Hòa vốn)</b>, kéo thanh trượt kịch bản mua thêm. Hệ thống sẽ tính ngay giá hòa vốn mới và có nút <b>1-Click Action</b> bắn thẳng lệnh sang Sổ lệnh!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white text-xs">❓ Làm sao để nhắn tin trực tiếp cho Admin?</h5>
                <p className="text-slate-400 text-[11px]">
                  Bấm nút <b>"Hỗ Trợ Admin"</b> ở góc dưới màn hình hoặc trên thanh Header để gửi tin nhắn trực tiếp tới anh Hải (Admin VIP).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 shrink-0 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                closeHelpCenter();
                openOnboarding();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Xem Lại Tour 5 Bước</span>
            </button>

            <button
              type="button"
              onClick={() => {
                closeHelpCenter();
                openSupportChat();
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-bold text-xs transition flex items-center gap-1.5"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Nhắn Tin Hỏi Admin</span>
            </button>
          </div>

          <button
            type="button"
            onClick={closeHelpCenter}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20"
          >
            ĐÃ HIỂU & ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
