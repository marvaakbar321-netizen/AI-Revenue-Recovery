import { Button } from "@/components/ui/button";
import { heroStats } from "@/lib/landing-data";

interface HeroProps {
  onOpenSignUp: () => void;
}

export function Hero({ onOpenSignUp }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--background)] py-20">
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[rgba(124,92,252,0.15)] to-transparent" />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-4 sm:px-6 xl:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full bg-[var(--primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--primary)] shadow-sm">
              Premium AI recovery for ecommerce
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-6xl">
                Recover lost ecommerce revenue before it impacts your business.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
                AI Revenue Recovery continuously monitors order flow, detects revenue leaks, and delivers action-ready insights to protect growth.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={onOpenSignUp}>Start Free</Button>
              <Button variant="secondary" onClick={onOpenSignUp}>View Demo</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{stat.value}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 top-10 h-36 w-36 rounded-full bg-[var(--secondary)]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(124,92,252,0.35)] sm:p-8">
              <div className="grid gap-6">
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm">
                  <p className="text-sm font-semibold text-[var(--text)]">Revenue recovery score</p>
                  <p className="mt-3 text-4xl font-semibold text-[var(--primary)]">92</p>
                </div>
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--muted)]">Orders at risk</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">18</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-[var(--secondary)]/12 px-3 py-2 text-sm font-semibold text-[var(--secondary)]">Review</div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
                    <p className="text-sm text-[var(--muted)]">AI alerts</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--text)]">32</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
                    <p className="text-sm text-[var(--muted)]">Revenue impact</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--text)]">$81.4K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
