import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RevenueBreakdownItem } from "@/lib/dashboard-data";

export function RevenueBreakdown({ breakdown }: { breakdown: RevenueBreakdownItem[] }) {
  return (
    <Card className="border border-[var(--border)]">
      <CardHeader>
        <div>
          <CardTitle>Revenue breakdown</CardTitle>
          <p className="text-sm text-[var(--muted)]">Understand which customer segments and channels are driving the most revenue.</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {breakdown.map((item) => (
          <div key={item.category} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{item.category}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.amount}</p>
              </div>
              <Badge variant={item.trend === "up" ? "success" : "danger"}>{item.trend === "up" ? "+" : "-"}{item.change}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{item.percent} of revenue</span>
              <span>{item.progress}% progress</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${item.progress}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
