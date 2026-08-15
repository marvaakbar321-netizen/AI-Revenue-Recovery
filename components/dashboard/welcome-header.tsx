"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";

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
    // If first and last name are stored separately, join them
    ((meta.first_name || meta.last_name) ? `${meta.first_name ?? ""} ${meta.last_name ?? ""}`.trim() : undefined) ??
    (user?.email ? user.email.split("@")[0] : "there");

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white via-slate-100 to-slate-100">
      <CardContent className="space-y-4 p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Welcome back 👋</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {fullName ? `Hi ${fullName}, here's what's happening in your business today.` : "Here's what's happening in your business today."}
          </h1>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          The AI Revenue Recovery dashboard highlights revenue risks, root causes, and prioritized actions so you can fix the biggest issues first.
        </p>
      </CardContent>
    </Card>
  );
}
