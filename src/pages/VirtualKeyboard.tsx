import { useState } from "react";

interface Props {
  onKeyPress: (key: string) => void;
}

const keyboardRows = [
  ["Esc", "1 !", "2 @", "3 #", "4 $", "5 %", "6 ^", "7 &", "8 *", "9 (", "0 )", "- _", "= +", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[ {", "] }", "\\ |"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", "; :", "' \"", "Enter"],
  ["LShift", "Z", "X", "C", "V", "B", "N", "M", ", <", ". >", "/ ?", "RShift"],
  ["Ctrl", "Cmd", "Alt", "Space", "Alt", "Menu", "Ctrl", "Fn"],
];

const specialKeys: Record<string, string> = {
  "Backspace": "←",
  "Tab": "⇥",
  "Caps": "⇧",
  "Enter": "↵",
  "LShift": "↑",
  "RShift": "↑",
  "Space": "—",
};

const ignoredKeys = ["Esc", "Tab", "Caps", "LShift", "RShift", "Ctrl", "Cmd", "Alt", "Menu", "Fn"];

export function VirtualKeyboard({ onKeyPress }: Props) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleKeyPress = (key: string) => {
    // اگه دکمه از نوع نادیده گرفته شده باشه، کاری نکن
    if (ignoredKeys.includes(key)) return;

    let actualKey = key;
    
    // اگه دکمه Space بود، یه فاصله بفرست
    if (key === "Space") actualKey = " ";
    // اگه دکمه Backspace بود، یه علامت خاص بفرست تا توی تابع اصلی هندل بشه
    else if (key === "Backspace") actualKey = "BACKSPACE";
    // اگه دکمه Enter بود، یه علامت خاص بفرست
    else if (key === "Enter") actualKey = "ENTER";
    // اگه دکمه دو کاراکتری بود (مثل "1 !")، فقط کاراکتر اول رو بگیر
    else if (key.includes(" ")) actualKey = key.split(" ")[0];

    onKeyPress(actualKey);

    // افکت فشردن دکمه
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 100);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="bg-[#020202] bg-gradient-to-b from-[#1c1c1c] to-[#020202] rounded-lg p-2 shadow-[0_0_33px_rgba(255,255,255,0.1)]">
        <div className="flex flex-col gap-1.5">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5">
              {row.map((key) => {
                const displayKey = specialKeys[key] || key;
                const isSpecial = ignoredKeys.includes(key) || key === "Space";
                const flexGrow = 
                  key === "Space" ? "flex-[6.63]" :
                  key === "Backspace" || key === "Tab" ? "flex-[1.4]" :
                  key === "Caps" ? "flex-[1.7]" :
                  key === "Enter" ? "flex-[2.2]" :
                  key === "LShift" ? "flex-[2.3]" :
                  key === "RShift" ? "flex-[2.8]" :
                  ignoredKeys.includes(key) ? "flex-[1.2]" :
                  "flex-1";

                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`
                      ${flexGrow} h-10 rounded-md text-sm font-medium
                      bg-[#0a0a0a] text-[#46bfb0] 
                      shadow-[inset_0_-1px_0_rgba(70,191,176,0.05),inset_1px_0_0_rgba(0,0,0,0.75),inset_-1px_0_0_rgba(0,0,0,0.75),inset_0_1px_0_rgba(70,191,176,0.05),0_0_12px_rgba(70,191,176,0.3)]
                      hover:translate-y-0.5 hover:shadow-[inset_0_-1px_0_rgba(70,191,176,0.05),inset_1px_0_0_rgba(0,0,0,0.75),inset_-1px_0_0_rgba(0,0,0,0.75),inset_0_1px_0_rgba(70,191,176,0.05),0_0_5px_rgba(70,191,176,0.2)]
                      transition-all duration-100
                      ${activeKey === key ? "translate-y-0.5 shadow-none" : ""}
                      ${isSpecial ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      select-none
                    `}
                    disabled={isSpecial}
                  >
                    {displayKey}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-diamond-muted mt-2">
        با کلیک روی دکمه‌ها تایپ کنید (یا از کیبورد فیزیکی استفاده کنید)
      </p>
    </div>
  );
}
