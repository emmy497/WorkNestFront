import { useRef } from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

const OtpInput = ({ value, onChange, length = 6 }: OtpInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function setDigitAt(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, length));
  }

  function handleChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const digit = raw.slice(-1);

    setDigitAt(index, digit);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigitAt(index - 1, "");
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    if (!pasted) return;

    onChange(pasted);

    const nextFocusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[nextFocusIndex]?.focus();
  }

  return (
    <div className="flex gap-[10px]">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-[45px] h-[52px] sm:w-[52px] sm:h-[56px] rounded-[12px] border-[1.5px] border-[#ECEBF0] text-center text-[20px] font-semibold text-[#161320] outline-none transition focus:border-[#6D4AFF] focus:ring-4 focus:ring-[#6D4AFF]/15"
        />
      ))}
    </div>
  );
};

export default OtpInput;
