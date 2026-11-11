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
    "bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition",
  secondary:
    "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/50 transition",
  ghost: "text-gray-400 hover:text-white transition",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
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
  onClick,
}: BaseProps & { to: string; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
