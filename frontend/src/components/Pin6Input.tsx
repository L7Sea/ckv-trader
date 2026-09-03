import React, { useRef, useEffect } from 'react';

interface Pin6InputProps {
  value: string;
  onChange: (pin: string) => void;
  autoFocus?: boolean;
  mask?: boolean;
  borderColor?: 'emerald' | 'amber' | 'indigo';
}

export const Pin6Input: React.FC<Pin6InputProps> = ({
  value,
  onChange,
  autoFocus = true,
  mask = false,
  borderColor = 'amber'
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const pinArray = (value || '').padEnd(6, ' ').slice(0, 6).split('');

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, char: string) => {
    const cleanChar = char.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = (value || '').split('');
    newDigits[index] = cleanChar || '';
    const newPin = newDigits.join('').slice(0, 6);
    onChange(newPin);

    // Tự động nhảy sang ô tiếp theo nếu có ký tự vừa nhập
    if (cleanChar && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!pinArray[index].trim() && index > 0) {
        // Lùi về ô trước nếu ô hiện tại rỗng
        inputsRef.current[index - 1]?.focus();
      } else {
        const newDigits = (value || '').split('');
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted) {
      onChange(pasted);
      const nextFocus = Math.min(pasted.length, 5);
      inputsRef.current[nextFocus]?.focus();
    }
  };

  const borderClass =
    borderColor === 'emerald'
      ? 'border-vien focus:border-tot focus:ring-2 focus:ring-tot text-tot'
      : borderColor === 'indigo'
      ? 'border-vien focus:border-nhan-chu focus:ring-2 focus:ring-nhan-chu text-nhan-chu'
      : 'border-vien focus:border-canh-bao focus:ring-2 focus:ring-canh-bao text-canh-bao';

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-2" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const char = (value || '')[index] || '';
        return (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={mask && char ? '●' : char}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-2xl font-mono font-black rounded-2xl bg-nen border-2 transition shadow-inner select-none ${borderClass} ${
              char ? 'bg-the shadow-lg' : ''
            }`}
          />
        );
      })}
    </div>
  );
};
