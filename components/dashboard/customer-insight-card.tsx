import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomerInsight } from "@/lib/dashboard-data";

export function CustomerInsightCard({ insight }: { insight: CustomerInsight }) {
  return (
    <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <CardHeader>
        <CardTitle>{insight.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <p className="text-3xl font-semibold text-[var(--text)]">{insight.value}</p>
        <p className="text-sm text-[var(--muted)]">{insight.detail}</p>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${insight.progress}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}
