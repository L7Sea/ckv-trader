import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Target,
  Gamepad2,
  Smile,
  Shirt,
  Move,
  Flame,
  Zap,
  Volume2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const OnboardingTourModal: React.FC = () => {
  const { isOnboardingOpen, closeOnboarding, completeOnboarding } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOnboardingOpen) return null;

  const capySteps = [
    {
      title: 'Chào mừng bạn gặp Trợ Lý Capy Gunny! 🐾',
      subtitle: 'Thú cưng tương tác vật lý & Người bạn đồng hành chứng khoán siêu cute',
      icon: <Sparkles className="h-7 w-7 text-amber-400" />,
      tag: 'BẮT ĐẦU CHƠI',
      content: (
        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 border border-amber-500/30 text-amber-200">
            <div className="flex items-center gap-2 font-black text-sm mb-1 text-amber-300">
              <Gamepad2 className="h-5 w-5 text-amber-400" />
              <span>CAPY GUNNY LÀ GÌ?</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Ở góc dưới màn hình luôn có một chú <b>Capybara</b> biết tương tác vật lý thời gian thực, biết đổi biểu cảm, biết thay trang phục và đặc biệt là sở hữu <b>Chế độ Bắn Súng Gunny đo góc & lực</b> cực đỉnh!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Smile className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>1. Chạm để đổi biểu cảm & nói</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Shirt className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>2. Nhấp đúp để đổi trang phục</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Move className="h-4 w-4 text-purple-400 shrink-0" />
              <span>3. Kéo ném bay lượn vật lý</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Target className="h-4 w-4 text-rose-400 shrink-0" />
              <span>4. Giữ 3s bật Gunny đo góc/lực</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '1. Chạm 1 Lần: Đổi Biểu Cảm & Thoại Dí Dỏm 💬',
      subtitle: 'Nhấp chuột hoặc chạm tay vào Capy để tương tác cảm xúc',
      icon: <Smile className="h-7 w-7 text-emerald-400" />,
      tag: 'TƯƠNG TÁC CẢM XÚC',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <p className="text-emerald-300 font-bold">
              👉 Cách thực hiện: <b>Click chuột trái 1 lần</b> vào chú Capy ở góc trái màn hình.
            </p>
            <p className="text-slate-300 text-[11px]">
              Mỗi lần chạm, Capy sẽ ngẫu nhiên đổi 1 trong các biểu cảm đáng yêu:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
              <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-emerald-300">
                😊 Vui vẻ / Hạnh phúc
              </span>
              <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-cyan-300">
                😎 Tự hào / Đeo kính ngầu
              </span>
              <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-amber-300">
                😲 Ngạc nhiên / Mở to mắt
              </span>
              <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-rose-300">
                😜 Cà khịa / Troll chứng sĩ
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            Capy sẽ xuất hiện bóng thoại phát ngôn các câu châm ngôn trading cực chuẩn, chúc mừng cổ phiếu tím trần hoặc nhắc nhở quản trị rủi ro!
          </p>
        </div>
      )
    },
    {
      title: '2. Nhấp Đúp (Double-Click): Thời Trang & Đổi Skin 👒',
      subtitle: 'Biến hóa phong cách với bộ sưu tập phụ kiện độc quyền',
      icon: <Shirt className="h-7 w-7 text-cyan-400" />,
      tag: 'THỜI TRANG CAPY',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
            <p className="text-cyan-300 font-bold">
              👉 Cách thực hiện: <b>Double Click (nhấp đúp chuột 2 lần nhanh)</b> vào Capy.
            </p>
            <p className="text-slate-300 text-[11px]">
              Capy sẽ tức thì xoay vòng và thay một bộ trang phục mới toanh:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                🍊 <b>Nón Quả Cam:</b> Phong cách nguyên bản thư thái on top
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                🪖 <b>Mũ Cối Chiến Binh:</b> Quyết tâm gồng lãi tới bến
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                🕶️ <b>Kính Râm Cyberpunk:</b> Quản trị định lượng siêu ngầu
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                👑 <b>Vương Miện Hoàng Gia:</b> VIP Master Trader
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                🎯 <b>Bộ Đồ Gunny VIP:</b> Tay súng đại bác thiện xạ
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                ⚡ <b>Tự động đổi đồ:</b> Cứ mỗi 60 giây Capy tự thay 1 outfit mới!
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '3. Kéo Thả & Ném Bay Lượn Vật Lý (Physics Engine) 🚀',
      subtitle: 'Nắm kéo Capy quăng khắp màn hình với gia tốc trọng trường',
      icon: <Move className="h-7 w-7 text-purple-400" />,
      tag: 'VẬT LÝ VUI NHỘN',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <p className="text-purple-300 font-bold">
              👉 Cách thực hiện: <b>Giữ chuột vào Capy $\rightarrow$ Kéo rê đến bất kỳ đâu $\rightarrow$ Thả tay hoặc quăng mạnh!</b>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
              <li><b>Ném theo quán tính:</b> Vung chuột càng nhanh khi thả tay, Capy bay càng xa và xoay vòng tít mù!</li>
              <li><b>Nảy bật tường (Bounce):</b> Capy sẽ va đập vào 4 cạnh màn hình, nảy bật qua lại như bóng bàn.</li>
              <li><b>Rơi tự do (Gravity):</b> Sau khi bay lượn, Capy sẽ từ từ rơi xuống và tiếp đất an toàn ở đáy màn hình.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '4. Đỉnh Cao: Giữ 3 Giây Bật "GUNNY MODE" Đo Góc & Lực 🎯',
      subtitle: 'Tụ lực bắn đại bác Gunny với thước ngắm laser và thanh Power %',
      icon: <Target className="h-7 w-7 text-rose-400" />,
      tag: 'MINI-GAME GUNNY',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-rose-500/20 border border-rose-500/30 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
              <Flame className="h-5 w-5 text-rose-400 animate-pulse" />
              <span>BÍ KÍP KÍCH HOẠT GUNNY MODE:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-200 text-[11px]">
              <li><b>Bước 1:</b> Nhấn và <b>GIỮ NGUYÊN CHUỘT</b> vào Capy trong đúng <b>3 GIÂY</b>.</li>
              <li><b>Bước 2:</b> Capy sẽ đếm ngược <b>3.. 2.. 1..</b> và bật <b>Tia ngắm laser Gunny</b> kèm thanh lực <b>Power %</b>!</li>
              <li><b>Bước 3:</b> Kéo chuột để <b>căn chỉnh góc bắn ($\theta^\circ$)</b> và <b>kéo dài để tăng lực (0% - 100%)</b>.</li>
              <li><b>Bước 4:</b> Thả tay $\rightarrow$ Capy bắn vút đi như viên đạn pháo với câu thoại Gunny chất lừ: <i>"POW!", "Góc 65 Lực 80!", "Bắn chuẩn trúng đỉnh!"</i>.</li>
            </ol>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-amber-300 font-mono text-[11px]">
            🌟 Hãy thử ngay bây giờ trên màn hình của bạn để cùng chơi đùa với Capy Gunny!
          </div>
        </div>
      )
    }
  ];

  const current = capySteps[currentStep];

  const handleNext = () => {
    if (currentStep < capySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      closeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl relative text-slate-100 flex flex-col justify-between space-y-4 animate-in fade-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={closeOnboarding}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700">
              {current.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                {current.tag} • BƯỚC {currentStep + 1}/{capySteps.length}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">{current.title}</h3>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-slate-400 font-medium px-1 -mt-2">
          {current.subtitle}
        </p>

        {/* Step Body */}
        <div className="py-1 min-h-[220px]">{current.content}</div>

        {/* Stepper Dots & Navigation Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {capySteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Trước</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 uppercase"
            >
              <span>{currentStep === capySteps.length - 1 ? 'BẮT ĐẦU CHƠI NGAY' : 'TIẾP THEO'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
