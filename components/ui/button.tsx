import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const styles: Record<string, string> = {
  primary:
    "inline-flex items-center justify-center rounded-[0.875rem] bg-gradient-to-r from-[#7C5CFC] to-[#6E49F0] px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 ease-out hover:from-[#6E49F0] hover:to-[#643fee] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 hover:scale-[1.02]",
  secondary:
    "inline-flex items-center justify-center rounded-[0.875rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20",
  ghost:
    "inline-flex items-center justify-center rounded-[0.875rem] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20",
  danger:
    "inline-flex items-center justify-center rounded-[0.875rem] bg-[var(--danger)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e14b4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)]/30",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(styles[variant], className)} {...props} />;
}
