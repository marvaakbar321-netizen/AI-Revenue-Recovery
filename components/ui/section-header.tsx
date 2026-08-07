import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function SectionHeader({
  title,
  description,
  trailing,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)} {...props}>
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">{title}</p>
        {description ? <p className="text-sm text-[var(--muted)]">{description}</p> : null}
      </div>
      {trailing ? <div className="flex items-center gap-3">{trailing}</div> : null}
    </div>
  );
}
