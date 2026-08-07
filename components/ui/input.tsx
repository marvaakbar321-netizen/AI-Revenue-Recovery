import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-[44px] w-full rounded-[0.875rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/80 focus:ring-2 focus:ring-[var(--primary)]/10 placeholder:text-slate-400",
        props.className,
      )}
      {...props}
    />
  );
}
