import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  BookOpen,
  Scale,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  Zap,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const OnboardingTourModal: React.FC = () => {
  const { isOnboardingOpen, closeOnboarding, completeOnboarding, user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOnboardingOpen) return null;

  const steps = [
    {
      title: 'Chào mừng bạn đến với CKV Pro Trader! 🎯',
      subtitle: 'Nền tảng Quản trị Vị thế & Phân tích Định lượng Chứng khoán Việt Nam',
      icon: <TrendingUp className="h-7 w-7 text-emerald-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
            💡 <b>LƯU Ý QUAN TRỌNG VỀ BẢN CHẤT APP:</b>
            <p className="mt-1 text-slate-300 text-[11px]">
              CKV Pro Trader <b>không phải là app đẩy lệnh khớp trực tiếp lên sàn HOSE/HNX</b> (như DNSE hay SSI), mà là <b>Bộ Công Cụ Cao Cấp</b> giúp bạn:
            </p>
            <ul className="list-disc pl-4 mt-1.5 space-y-1 text-slate-300 text-[11px]">
              <li>Quản trị vị thế & ghi chép nhật ký lệnh chuẩn chu kỳ T+2.5.</li>
              <li>Kiểm soát chi phí lãi vay Margin Deal (11.5%) & tính toán điểm hòa vốn kỷ luật.</li>
              <li>Quét dòng tiền với 150 thuật toán định lượng & điểm đồng thuận AI Alpha.</li>
            </ul>
          </div>
          <p>Trợ lý <b>Capy Gunny</b> sẽ đồng hành hướng dẫn bạn 4 tính năng cốt lõi sau đây!</p>
        </div>
      )
    },
    {
      title: '1. Quản Lý Nguồn Vốn & Ghi Sổ Lệnh T+2.5 💰',
      subtitle: 'Khởi tạo từ 0đ hoặc nạp vốn ảo / đồng bộ danh mục thực',
      icon: <Wallet className="h-7 w-7 text-amber-400" />,
      content: (
        <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            • <b>Số dư ban đầu của bạn là 0 VNĐ</b>: Bạn có thể bấm vào ô <b>"Tiền Mặt Khả Dụng"</b> trên thẻ Master Card bất kỳ lúc nào để <b>Nạp Vốn Ảo</b> hoặc <b>Hiệu chỉnh số dư thực tế</b> khớp với tài khoản chứng khoán của bạn.
          </p>
          <p>
            • <b>Ghi Nhật Ký Lệnh Mua/Bán (Trang 1)</b>: Hỗ trợ 3 nguồn vốn giải ngân: <b>100% Tiền Mặt (Tiểu khoản 01)</b>, <b>100% Vay Margin Deal (Tiểu khoản 06)</b>, hoặc <b>Hỗn Hợp 50-50</b>.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
            🏷️ Hệ thống tự động phân tách: <b>Giá Vốn Mua Ban Đầu</b> (Avg Cost) và <b>Giá Hòa Vốn Deal</b> (Breakeven Price gánh lãi vay & thuế phí).
          </div>
        </div>
      )
    },
    {
      title: '2. Nút Đồng Bộ Toàn Diện Tất-Cả-Trong-Một ⚡',
      subtitle: 'Cập nhật giá thực 300 mã + Lãi suất 20 Ngân hàng chỉ với 1 cú nhấp',
      icon: <RefreshCw className="h-7 w-7 text-cyan-400" />,
      content: (
        <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            • Ở góc trên bên phải, nút <b>"ĐỒNG BỘ TOÀN DIỆN"</b> (màu tím/xanh ngọc) sẽ tự động nạp:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
            <li><b>Giá thời gian thực 300 mã</b> trên cả 3 sàn HOSE, HNX, UPCOM.</li>
            <li><b>Biểu đồ nến Pro đa khung thời gian</b> & Sổ lệnh 3 cấp thời gian thực.</li>
            <li><b>Bảng lãi suất 20 Ngân hàng</b> & Top 10 FinTech + Định giá ERP.</li>
          </ul>
        </div>
      )
    },
    {
      title: '3. Radar 150 Thuật Toán & Quản Trị Hòa Vốn 🎯',
      subtitle: 'Tính toán kịch bản DCA mua thêm để kéo điểm về bờ an toàn',
      icon: <Scale className="h-7 w-7 text-purple-400" />,
      content: (
        <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            • <b>Trang 2 (Quản trị Vị thế & Hòa vốn)</b>: Kéo thanh trượt để thử nghiệm mua thêm bao nhiêu cổ phiếu thì giá hòa vốn hạ về bao nhiêu. Có nút <b>1-Click Action</b> bắn thẳng lệnh sang Sổ lệnh!
          </p>
          <p>
            • <b>Trang 3 (Radar Thuật toán)</b>: 150 công thức chấm điểm AI Alpha từ 0 - 100 điểm để lọc mã bứt phá dòng tiền.
          </p>
        </div>
      )
    },
    {
      title: '4. Kênh Nhắn Tin Trực Tuyến Với Admin 💬',
      subtitle: 'Hỗ trợ giải đáp thắc mắc và tư vấn chuyên sâu 24/7',
      icon: <MessageSquare className="h-7 w-7 text-indigo-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
            <p className="font-semibold">💬 Gặp khó khăn hay cần hỗ trợ?</p>
            <p className="mt-1 text-slate-300 text-[11px]">
              Bạn chỉ cần bấm vào nút <b>"Hỗ Trợ Admin"</b> ở góc dưới màn hình hoặc trên thanh Header để gửi tin nhắn trực tiếp tới Admin (anh Hải). Mọi thắc mắc sẽ được giải đáp ngay!
            </p>
          </div>
          <p className="text-center font-bold text-emerald-400 text-sm mt-2">
            🚀 Chúc bạn có những quyết định đầu tư kỷ luật và thành công rực rỡ cùng CKV Pro Trader!
          </p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative flex flex-col justify-between space-y-5 animate-in fade-in duration-200">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          title="Bỏ qua hướng dẫn"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Bước */}
        <div className="flex items-center gap-3.5 pb-3 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
            {current.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                Bước {currentStep + 1} / {steps.length}
              </span>
              <span className="text-xs text-slate-500 font-mono">Capy Onboarding</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{current.title}</h3>
            <p className="text-[11px] text-slate-400">{current.subtitle}</p>
          </div>
        </div>

        {/* Nội dung Bước */}
        <div className="min-h-[160px] py-1">{current.content}</div>

        {/* Thanh Tiến Trình & Nút Chuyển */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-emerald-400' : idx < currentStep ? 'w-2.5 bg-emerald-500/50' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition bg-slate-950 border border-slate-800"
              >
                Quay Lại
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:opacity-95 transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 font-sans"
            >
              <span>{currentStep === steps.length - 1 ? 'BẮT ĐẦU TRẢI NGHIỆM' : 'TIẾP TỤC'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
