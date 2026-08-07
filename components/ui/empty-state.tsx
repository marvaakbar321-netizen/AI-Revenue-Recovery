import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  actionLabel: string;
}

export function EmptyState({ title, description, actionLabel, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[1.25rem] border border-slate-200/70 bg-white p-10 text-center shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
        <span className="text-2xl">✨</span>
      </div>
      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
      <button className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
        {actionLabel}
      </button>
    </div>
  );
}
