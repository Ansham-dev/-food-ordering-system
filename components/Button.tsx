import { ButtonHTMLAttributes } from "react";
import { classNames } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-widest transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary: "bg-chili text-white hover:bg-chili-dark",
    secondary: "bg-ink text-cream hover:bg-ink/80",
    ghost: "bg-transparent text-ink border border-ink/20 hover:border-ink",
    danger: "bg-red-700 text-white hover:bg-red-800",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-[11px]",
    md: "px-5 py-2.5 text-xs",
    lg: "px-6 py-3.5 text-sm",
  };

  return (
    <button
      className={classNames(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
