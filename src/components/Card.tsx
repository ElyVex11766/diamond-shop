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
      className={`rounded-2xl border border-diamond-border bg-diamond-panel/60 backdrop-blur-md p-6 hover:border-diamond-cyan/40 hover:shadow-glow-sm transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
