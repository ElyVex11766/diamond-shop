interface Props {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function DiamondLogo({ size = 36, withText = true, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
      >
        <defs>
          <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#2f81f7" />
          </linearGradient>
        </defs>
        <path d="M32 4L58 24L32 60L6 24L32 4Z" stroke="url(#dg)" strokeWidth="2.5" fill="rgba(47,129,247,0.08)" />
        <path d="M6 24H58M20 24L32 60L44 24M20 24L32 4L44 24" stroke="url(#dg)" strokeWidth="1.5" opacity="0.9" />
      </svg>
      {withText && (
        <span className="font-bold tracking-wide text-lg">
          <span className="text-white">DIAMOND</span>{" "}
          <span className="text-diamond-cyan">SHOP</span>
        </span>
      )}
    </div>
  );
}