import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OrderKpi } from "@/lib/dashboard-data";

function TrendGraph({ values }: { values: number[] }) {
  return (
    <div className="flex items-end gap-1">
      {values.map((value, index) => (
        <div
          key={index}
          className="h-2 rounded-full bg-[var(--primary)]/15"
          style={{ width: `${8 + value}px`, opacity: 0.85 }}
        />
      ))}
    </div>
  );
}

export function OrderStatCard({ stat }: { stat: OrderKpi }) {
  const isPositive = stat.trend === "positive";

  return (
    <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(15,23,42,0.12)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{stat.title}</p>
            <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{stat.value}</p>
          </div>
          <Badge variant={isPositive ? "success" : "danger"}>{stat.delta}</Badge>
        </div>

        <TrendGraph values={stat.series} />
        <p className="text-sm text-[var(--muted)]">{stat.description}</p>
      </CardContent>
    </Card>
  );
}
