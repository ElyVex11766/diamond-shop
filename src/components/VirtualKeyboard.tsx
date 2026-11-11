import { useState } from "react";

interface Props {
  onKeyPress: (key: string) => void;
}

// ساختار کیبورد (دقیقاً مثل عکس)
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
    if (ignoredKeys.includes(key)) return;

    let actualKey = key;
    
    if (key === "Space") actualKey = " ";
    else if (key === "Backspace") actualKey = "BACKSPACE";
    else if (key === "Enter") actualKey = "ENTER";
    else if (key.includes(" ")) actualKey = key.split(" ")[0];

    onKeyPress(actualKey);

    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 150);
  };

  return (
    <>
      {/* 👇 این بخش فقط روی دسکتاپ نمایش داده می‌شود */}
      <div className="hidden md:block w-full max-w-3xl mx-auto mt-8">
        <div className="bg-[#020202] bg-gradient-to-b from-[#1c1c1c] to-[#020202] rounded-lg p-2 shadow-[0_0_33px_rgba(255,255,255,0.1)]">
          <div className="flex flex-col gap-1.5">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1.5">
                {row.map((key) => {
                  const displayKey = specialKeys[key] || key;
                  const isSpecial = ignoredKeys.includes(key) || key === "Space";
                  
                  let flexGrow = "flex-1";
                  if (key === "Space") flexGrow = "flex-[6.63]";
                  else if (key === "Backspace") flexGrow = "flex-[1.5]";
                  else if (key === "Tab") flexGrow = "flex-[1.4]";
                  else if (key === "Caps") flexGrow = "flex-[1.7]";
                  else if (key === "Enter") flexGrow = "flex-[2.2]";
                  else if (key === "LShift") flexGrow = "flex-[2.3]";
                  else if (key === "RShift") flexGrow = "flex-[2.8]";
                  else if (ignoredKeys.includes(key)) flexGrow = "flex-[1.2]";

                  return (
                    <div
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className={`
                        ${flexGrow} h-10 rounded-md text-sm font-medium
                        relative overflow-hidden
                        bg-[#0a0a0a] text-[#46bfb0] 
                        shadow-[inset_0_-1px_0_rgba(70,191,176,0.05),inset_1px_0_0_rgba(0,0,0,0.75),inset_-1px_0_0_rgba(0,0,0,0.75),inset_0_1px_0_rgba(70,191,176,0.05),0_0_12px_rgba(70,191,176,0.3)]
                        hover:translate-y-0.5 hover:shadow-[inset_0_-1px_0_rgba(70,191,176,0.05),inset_1px_0_0_rgba(0,0,0,0.75),inset_-1px_0_0_rgba(0,0,0,0.75),inset_0_1px_0_rgba(70,191,176,0.05),0_0_5px_rgba(70,191,176,0.2)]
                        transition-all duration-100
                        ${activeKey === key ? "translate-y-1 shadow-none bg-[#16203a]" : ""}
                        ${isSpecial ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        select-none flex items-center justify-center
                      `}
                    >
                      {displayKey}
                    </div>
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
    </>
  );
}
