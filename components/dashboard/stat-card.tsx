import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StatItem } from "@/lib/dashboard-data";

function TrendGraph({ data }: { data: number[] }) {
  return (
    <div className="flex items-end gap-1">
      {data.map((value, index) => (
        <div
          key={index}
          className="h-2 rounded-full bg-[var(--primary)]/15"
          style={{ width: `${6 + value}px`, opacity: 0.85 }}
        />
      ))}
    </div>
  );
}

export function StatCard({ stat }: { stat: StatItem }) {
  const isPositive = stat.trend === "positive";

  return (
    <Card className="group border border-[var(--border)] bg-[var(--surface)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(15,23,42,0.18)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{stat.title}</p>
            <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{stat.value}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[var(--secondary)]/10 text-[var(--secondary)]">
            <stat.icon className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <Badge variant={isPositive ? "success" : "danger"}>{stat.delta}</Badge>
          <p className="text-[var(--muted)]">{stat.description}</p>
        </div>

        <TrendGraph data={stat.series} />
      </CardContent>
    </Card>
  );
}
