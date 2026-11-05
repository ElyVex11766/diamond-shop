import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-diamond-blue hover:bg-blue-500 text-white shadow-glow-sm hover:shadow-glow transition",
  secondary:
    "bg-white/5 border border-white/10 hover:border-diamond-cyan/50 hover:bg-white/10 text-white transition",
  ghost: "text-diamond-muted hover:text-white transition",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-diamond-cyan/70 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  to,
  variant = "primary",
  children,
  className = "",
}: BaseProps & { to: string }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-diamond-cyan/70 ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
