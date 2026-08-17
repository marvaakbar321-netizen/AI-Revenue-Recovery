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
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">
                Revenue Pulse <span aria-hidden="true">✦</span>
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">
                {fullName ? `Hi ${fullName}, here's what's happening in your business today.` : "Here's what's happening in your business today."}
              </h1>
            </div>
            <p className="max-w-[700px] text-sm leading-7 text-slate-600">
              The AI Revenue Recovery dashboard highlights revenue risks, root causes, and prioritized actions so you can fix the biggest issues first.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.65rem] bg-purple-50 text-[var(--primary)]">
                  <BarChart3 className="h-4 w-4" />
                </span>
                <span className="font-medium">Revenue Insights</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-slate-200" aria-hidden="true" />
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.65rem] bg-purple-50 text-[var(--primary)]">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <span className="font-medium">Risk Detection</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-slate-200" aria-hidden="true" />
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.65rem] bg-purple-50 text-[var(--primary)]">
                  <CheckSquare className="h-4 w-4" />
                </span>
                <span className="font-medium">Prioritized Actions</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex w-72 shrink-0 items-center justify-center" aria-hidden="true">
            <div className="relative flex h-64 w-64 items-center justify-center">
              <div className="absolute h-56 w-56 rounded-full bg-purple-100/60 blur-2xl" />
              <div className="absolute flex h-36 w-36 items-center justify-center rounded-full border border-purple-200/80 bg-white/90 shadow-[0_20px_50px_-20px_rgba(139,92,246,0.35)]">
                <Sparkles className="h-14 w-14 text-[var(--primary)]" />
              </div>
              <div className="absolute h-48 w-48 rounded-full border border-dashed border-purple-200/60" style={{ transform: "rotate(18deg)" }} />
              <div className="absolute h-60 w-60 rounded-full border border-purple-100/50" style={{ transform: "rotate(-12deg)" }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
