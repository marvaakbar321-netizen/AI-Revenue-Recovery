import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AnalyticsSeries } from "@/lib/dashboard-data";

export function OrderAnalyticsCard({ series, selected, onChange }: { series: AnalyticsSeries[]; selected: string; onChange: (value: string) => void }) {
  const activeSeries = series.find((item) => item.label === selected) ?? series[0];

  return (
    <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b border-[var(--border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Order Analytics</CardTitle>
          <p className="text-sm text-[var(--muted)]">Switch between daily, weekly, and monthly performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {series.map((item) => (
            <Button
              key={item.label}
              variant={selected === item.label ? "primary" : "secondary"}
              className="whitespace-nowrap"
              onClick={() => onChange(item.label)}
            >
              {item.label.replace("Orders by ", "")}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-slate-50 p-5">
          <div className="flex items-end gap-2">
            {activeSeries.values.map((value, index) => (
              <div key={index} className="h-32 w-5 rounded-full bg-[var(--primary)]/20 transition-all" style={{ height: `${Math.max(value / 2, 10)}px` }} />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
            <span>{activeSeries.label}</span>
            <span>{activeSeries.values[activeSeries.values.length - 1]} orders</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
