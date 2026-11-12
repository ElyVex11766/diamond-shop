interface Props {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function ZyloxLogo({ size = 36, withText = true, className = "" }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* 👇 آیکون لوگو (حرف Z) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
      >
        <defs>
          <linearGradient id="zGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#888888" />
          </linearGradient>
        </defs>
        {/* حرف Z */}
        <path 
          d="M14 12 H50 L14 52 H50" 
          stroke="url(#zGrad)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>

      {/* 👇 متن برند (Zylox Shop) با ترکیب سفید، مشکی و خاکستری */}
      {withText && (
        <div className="mt-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest uppercase">
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Zylox</span>
            <span className="text-gray-400 ml-2 mr-2">|</span>
            <span className="text-gray-600">Shop</span>
          </h1>
          <p className="text-xs tracking-[0.5em] text-gray-500 mt-2 font-light">
            PREMIUM GAMING STORE
          </p>
        </div>
      )}
    </div>
  );
}
