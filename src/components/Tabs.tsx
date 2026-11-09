import { useRef, useEffect, useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // محاسبه موقعیت و عرض دکمه فعال برای انیمیشن
  useEffect(() => {
    const activeButton = containerRef.current?.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div 
      ref={containerRef}
      className="relative inline-flex items-center p-1 bg-diamond-panel/80 rounded-xl border border-diamond-border/50 overflow-x-auto max-w-full no-scrollbar"
    >
      {/* انیمیشن پس‌زمینه (مربع متحرک) */}
      <div
        className="absolute top-1 bottom-1 bg-diamond-blue/20 rounded-lg transition-all duration-300 ease-out border border-diamond-cyan/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
      
      {/* دکمه‌ها */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab-id={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative z-10 px-4 py-2 text-sm font-bold transition-colors duration-300 whitespace-nowrap ${
            activeTab === tab.id ? "text-diamond-cyan" : "text-diamond-muted hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
