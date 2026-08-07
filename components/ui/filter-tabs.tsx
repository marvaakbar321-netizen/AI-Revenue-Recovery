import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface FilterTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: readonly string[];
  selected: string;
  onChange: (value: string) => void;
}

export function FilterTabs({ options, selected, onChange, className, ...props }: FilterTabsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition",
            selected === option
              ? "bg-[var(--primary)] text-white shadow-sm"
              : "bg-[var(--surface)] text-[var(--muted)] hover:bg-slate-50",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
