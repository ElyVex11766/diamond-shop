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
      className={`rounded-2xl border border-diamond-border bg-diamond-panel/70 backdrop-blur-sm p-6 hover:border-diamond-cyan/40 hover:shadow-glow-sm transition ${className}`}
    >
      {children}
    </div>
  );
}
