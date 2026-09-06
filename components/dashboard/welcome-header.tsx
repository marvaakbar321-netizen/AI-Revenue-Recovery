"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, BarChart3, AlertTriangle, CheckSquare } from "lucide-react";

export function WelcomeHeader() {
  const { user } = useAuth();

  const meta = user?.user_metadata ?? {};

  const fullName =
    (meta.full_name as string | undefined) ??
    (meta.fullName as string | undefined) ??
    (meta.name as string | undefined) ??
    (meta.display_name as string | undefined) ??
    (meta.displayName as string | undefined) ??
    (meta.given_name as string | undefined) ??
    (meta.first_name as string | undefined) ??
    ((meta.first_name || meta.last_name) ? `${meta.first_name ?? ""} ${meta.last_name ?? ""}`.trim() : undefined) ??
    (user?.email ? user.email.split("@")[0] : "there");

  return (
    <Card className="overflow-hidden border-purple-100 bg-gradient-to-br from-white via-purple-50/40 to-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <CardContent className="p-5 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)] sm:text-sm sm:tracking-[0.3em]">
                Revenue Pulse <span aria-hidden="true">✦</span>
              </p>
              <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl lg:text-[1.7rem]">
                {fullName ? `Hi ${fullName}, here's what's happening in your business today.` : "Here's what's happening in your business today."}
              </h1>
            </div>
            <p className="max-w-[640px] text-sm leading-6 text-slate-600">
              The AI Revenue Recovery dashboard highlights revenue risks, root causes, and prioritized actions so you can fix the biggest issues first.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-700 sm:text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.6rem] bg-purple-50 text-[var(--primary)] sm:h-8 sm:w-8">
                  <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                <span className="font-medium">Revenue Insights</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-slate-200" aria-hidden="true" />
              <div className="flex items-center gap-2 text-xs text-slate-700 sm:text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.6rem] bg-purple-50 text-[var(--primary)] sm:h-8 sm:w-8">
                  <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                <span className="font-medium">Risk Detection</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-slate-200" aria-hidden="true" />
              <div className="flex items-center gap-2 text-xs text-slate-700 sm:text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.6rem] bg-purple-50 text-[var(--primary)] sm:h-8 sm:w-8">
                  <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                <span className="font-medium">Prioritized Actions</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex w-44 shrink-0 items-center justify-center self-center" aria-hidden="true">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <div className="absolute h-32 w-32 rounded-full bg-purple-100/60 blur-2xl" />
              <div className="absolute flex h-24 w-24 items-center justify-center rounded-full border border-purple-200/80 bg-white/90 shadow-[0_20px_50px_-20px_rgba(139,92,246,0.35)]">
                <Sparkles className="h-10 w-10 text-[var(--primary)]" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
