import React, { useState } from 'react';
import { Sparkles, Check, Flame, Smile, Briefcase, Zap, X } from 'lucide-react';
import { setGreetingStyle, GreetingStyle } from '../lib/greeting';

interface CapyStylePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STYLES = [
  {
    key: 'vui' as GreetingStyle,
    name: 'Vui Vẻ & Tích Cực',
    icon: Smile,
    badge: 'Khuyên dùng',
    tagline: 'Khích lệ tinh thần, chúc danh mục tím lịm',
    sample: 'Chào buổi sáng! Cà phê thơm nồng, chúc danh mục hôm nay rực rỡ sắc tím nhé!'
  },
  {
    key: 'troll' as GreetingStyle,
    name: 'Troll & Cà Khịa',
    icon: Flame,
    badge: 'Hài hước cực mạnh',
    tagline: 'Kháy đểu fomo đu đỉnh, thức khuya ngắm NAV',
    sample: '03:00 sáng còn mở app? Định đặt lệnh ATO sớm cho đỡ lag à anh zai?'
  },
  {
    key: 'pro' as GreetingStyle,
    name: 'Chuyên Nghiệp & Kỷ Luật',
    icon: Briefcase,
    badge: 'Chuẩn VIP',
    tagline: 'Chuẩn corporate, kiểm soát chặt chẽ rủi ro T+2.5',
    sample: 'Chào buổi sáng. Hệ thống giao dịch T+2.5 đã sẵn sàng khớp lệnh an toàn.'
  },
  {
    key: 'gen_z' as GreetingStyle,
    name: 'Gen Z & Bắt Trend',
    icon: Zap,
    badge: 'Trendy / Slay',
    tagline: 'Flex lãi, săn siêu deal, chill chill như Capy',
    sample: 'GM! Sáng nay all-in hay chill chill săn hàng tím? Lesgooo bestie!'
  }
];

export const CapyStylePickerModal: React.FC<CapyStylePickerModalProps> = ({ isOpen, onClose }) => {
  const [selected, setSelected] = useState<GreetingStyle>('vui');

  if (!isOpen) return null;

  const handleConfirm = () => {
    setGreetingStyle(selected);
    try {
      localStorage.setItem('ckv_style_initialized', 'true');
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2147483001] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono uppercase">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Chọn Phong Cách Trợ Lý Capy</span>
          </div>
          <h3 className="text-xl font-black text-white">Bạn Thích Trợ Lý Capy Đồng Hành Kiểu Gì?</h3>
          <p className="text-xs text-slate-400">Chọn 1 trong 4 phong cách lời chào & phát ngôn thông minh bên dưới (có thể đổi bất cứ lúc nào trong Cài Đặt):</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STYLES.map((item) => {
            const Icon = item.icon;
            const isSelected = selected === item.key;
            return (
              <div
                key={item.key}
                onClick={() => setSelected(item.key)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 relative overflow-hidden ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-800/80 text-white">
                    <Icon className="h-4 w-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <span className="text-[10px] text-indigo-300 font-semibold">{item.badge}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{item.tagline}</p>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-slate-300 italic">
                  &ldquo;{item.sample}&rdquo;
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:opacity-95 transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Xác Nhận & Bắt Đầu Trải Nghiệm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

