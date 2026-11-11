interface Props {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function ZyloxLogo({ size = 36, withText = true, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
      >
        <path 
          d="M14 12 H50 L14 52 H50" 
          stroke="#ffffff" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <circle cx="50" cy="12" r="3" fill="#ffffff" />
        <circle cx="14" cy="52" r="3" fill="#ffffff" />
      </svg>
      {withText && (
        <span className="font-bold tracking-wide text-lg text-white">
          ZYLOX
        </span>
      )}
    </div>
  );
}
