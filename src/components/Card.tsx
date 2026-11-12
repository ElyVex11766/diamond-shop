import { type ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_8px_40px_rgba(255,255,255,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}
