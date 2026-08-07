import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StatItem } from "@/lib/dashboard-data";

export function RevenueSummary({ metrics }: { metrics: StatItem[] }) {
  return (
    <Card className="border border-[var(--border)]">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Revenue summary</CardTitle>
          <p className="text-sm text-[var(--muted)]">A consolidated view of revenue health, growth, and recoverable opportunities.</p>
        </div>
        <Button variant="secondary">View plan</Button>
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div key={metric.title} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{metric.title}</p>
                  <p className="mt-3 text-2xl font-semibold text-[var(--text)]">{metric.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[var(--secondary)]/15 text-[var(--secondary)]">
                  <metric.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                <Badge variant={metric.trend === "positive" ? "success" : "danger"}>{metric.delta}</Badge>
                <p className="text-[var(--muted)]">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-slate-50 p-6 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Revenue trend</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text)]">$246.2K</p>
            </div>
            <Badge variant="success">+12.4%</Badge>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5">
              <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
                <span>Recoverable revenue</span>
                <span className="font-semibold text-[var(--text)]">$32.4K</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-[var(--primary)]" />
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5">
              <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
                <span>Average order value</span>
                <span className="font-semibold text-[var(--text)]">$78.40</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/2 rounded-full bg-[var(--secondary)]" />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-gradient-to-br from-[var(--primary)]/10 to-transparent p-6">
            <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
              <span>Forecast revision</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)]/10 px-3 py-1 text-[var(--success)]">
                <ArrowUpRight className="h-4 w-4" /> 8.2%
              </span>
            </div>
            <div className="mt-6 rounded-[1.5rem] bg-[var(--surface)] p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                <span>Forecast revision</span>
                <span>Forecast trend</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-[var(--primary)]/5 p-3">
                <svg viewBox="0 0 300 120" className="w-full h-44">
                  <defs>
                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 10 96 L 52 74 L 94 68 L 136 56 L 178 46 L 220 38 L 262 26" fill="none" stroke="#7C5CFC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 10 96 L 52 74 L 94 68 L 136 56 L 178 46 L 220 38 L 262 26 L 262 110 L 10 110 Z" fill="url(#forecastGradient)" />
                  {[{ x: 10, y: 96 }, { x: 52, y: 74 }, { x: 94, y: 68 }, { x: 136, y: 56 }, { x: 178, y: 46 }, { x: 220, y: 38 }, { x: 262, y: 26 }].map((point, idx) => (
                    <circle key={idx} cx={point.x} cy={point.y} r="5" fill="#fff" stroke="#7C5CFC" strokeWidth="2" />
                  ))}
                </svg>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
                <span>Last 30 days vs prior period</span>
                <span className="font-semibold text-[var(--text)]">Forecast trend</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
