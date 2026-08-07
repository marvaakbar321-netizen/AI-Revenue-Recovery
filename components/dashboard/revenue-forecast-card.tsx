import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RevenueForecastItem } from "@/lib/dashboard-data";

export function RevenueForecastCard({ forecast }: { forecast: RevenueForecastItem[] }) {
  return (
    <Card className="border border-[var(--border)]">
      <CardHeader>
        <div>
          <CardTitle>Forecast outlook</CardTitle>
          <p className="text-sm text-[var(--muted)]">Projected revenue outcomes and targets for the upcoming period.</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {forecast.map((item) => (
          <div key={item.title} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.description}</p>
              </div>
              <Badge variant="primary">{item.amount}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
