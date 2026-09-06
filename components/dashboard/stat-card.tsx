import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StatItem } from "@/lib/dashboard-data";

function TrendGraph({ data }: { data: number[] }) {
  return (
    <div className="flex min-w-0 items-end gap-1 overflow-hidden">
      {data.map((value, index) => (
        <div
          key={index}
          className="h-2 shrink-0 rounded-full bg-[var(--primary)]/15"
          style={{ width: `${Math.min(24, 6 + value)}px`, opacity: 0.85 }}
        />
      ))}
    </div>
  );
}

export function StatCard({ stat }: { stat: StatItem }) {
  const isPositive = stat.trend === "positive";

  return (
    <Card className="group min-w-0 border border-[var(--border)] bg-[var(--surface)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(15,23,42,0.18)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)] sm:text-sm sm:tracking-[0.18em]">{stat.title}</p>
            <p className="mt-2 truncate text-2xl font-semibold text-[var(--text)] sm:text-3xl">{stat.value}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.875rem] bg-[var(--secondary)]/10 text-[var(--secondary)] sm:h-11 sm:w-11">
            <stat.icon className="h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm">
          <Badge variant={isPositive ? "success" : "danger"}>{stat.delta}</Badge>
          <p className="min-w-0 break-words text-[var(--muted)]">{stat.description}</p>
        </div>

        <TrendGraph data={stat.series} />
      </CardContent>
    </Card>
  );
}
