import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const badgeStyles: Record<string, string> = {
  default: "bg-slate-100 text-slate-800",
  primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
  info: "bg-[var(--info)]/15 text-[var(--info)]",
  success: "bg-[var(--success)]/15 text-[var(--success)]",
  warning: "bg-[var(--warning)]/15 text-[var(--warning)]",
  danger: "bg-[var(--danger)]/15 text-[var(--danger)]",
  outline: "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeStyles;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        badgeStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
