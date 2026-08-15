"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, X, Home, BarChart3, Box, ShoppingBag, Users, AlertTriangle, Sparkles, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/dashboard-data";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LogoutButton from "@/components/auth/LogoutButton";
import logoImage from "@/app/logo.png";

// fallback user when not signed in via supabase
function getLocalDemoUser() {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("airevenue_demo_user") : null;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mountedLocalUser, setMountedLocalUser] = useState<any>(null);
  const router = useRouter();
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMountedLocalUser(getLocalDemoUser());
  }, []);

  const displayName =
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.email?.split("@")[0] ||
    mountedLocalUser?.fullName ||
    mountedLocalUser?.full_name ||
    mountedLocalUser?.email?.split("@")[0] ||
    "User";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-5 xl:px-8">
        <aside className="hidden w-[300px] shrink-0 flex-col rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.15)] lg:flex">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-[1.25rem] bg-[var(--primary-soft)] shadow-sm">
                <Image src={logoImage} alt="Site logo" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">AI Revenue Recovery</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">Revenue Recovery</p>
              </div>
            </div>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-slate-50">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-[1rem] px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "text-[var(--muted)] hover:bg-slate-50 hover:text-[var(--text)]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? <Badge variant="outline">{item.badge}</Badge> : null}
                </Link>
              );
            })}
          </nav>

          <Card className="mt-auto border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-none">
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI-driven retail growth</p>
                  <p className="text-xs text-[var(--muted)]">Review your highest impact recovery ideas.</p>
                </div>
              </div>
              <Badge variant="primary">Premium</Badge>
            </CardContent>
          </Card>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4 lg:hidden">
            <div className="flex items-center justify-between rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-slate-50"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0 text-center">
                <p className="text-sm font-semibold text-[var(--text)]">Dashboard</p>
                <p className="text-xs text-[var(--muted)]">Overview</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-slate-50">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative h-11 w-11 overflow-hidden rounded-[1rem] bg-[var(--surface)]">
                  <Image src={logoImage} alt="Site logo" fill className="object-cover" />
                </div>
              </div>
            </div>
            <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3 rounded-[1rem] bg-slate-50 px-3 py-2">
                <Search className="h-4.5 w-4.5 text-[var(--muted)]" />
                <input
                  type="search"
                  placeholder="Search store insights"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <header className="hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm lg:flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex items-center gap-3 rounded-[1.25rem] bg-white px-4 py-3 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-[var(--text)]">Acme Store</p>
                  <p className="text-[var(--muted)]">Workspace</p>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.25rem] border border-[var(--border)] bg-slate-50 px-4 py-3">
                <Search className="h-4.5 w-4.5 text-[var(--muted)]" />
                <input
                  type="search"
                  placeholder="Search revenue insights"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] transition hover:bg-slate-50">
                <span>Last 30 days</span>
              </button>
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-slate-50">
                <Bell className="h-5 w-5" />
              </button>
              <div className="inline-flex items-center gap-3">
                <div className="inline-flex items-center gap-3 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]">
                  <div className="relative h-10 w-10 overflow-hidden rounded-[1rem] bg-slate-100">
                    <Image src={logoImage} alt="Site logo" fill className="object-cover" />
                  </div>
                  <span>{displayName}</span>
                </div>

                <LogoutButton />
              </div>
            </div>
          </header>

          <div className="space-y-6">{children}</div>

          <footer className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-sm text-[var(--muted)] shadow-sm">
            Powered by AI Revenue Recovery — Focus on the issues driving revenue impact.
          </footer>
        </main>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-950/40" onClick={() => setDrawerOpen(false)} />
          <div className="relative z-10 w-[280px] shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Menu</p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">AI Revenue Recovery</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "group flex items-center justify-between rounded-[1rem] px-4 py-3 text-sm font-semibold transition",
                      active
                        ? "bg-[var(--primary)] text-white shadow-sm"
                        : "text-[var(--muted)] hover:bg-slate-50 hover:text-[var(--text)]",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? <Badge variant="outline">{item.badge}</Badge> : null}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 border-t border-[var(--border)] pt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
