import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AIInsight } from "@/lib/dashboard-data";

export function AIInsightCard({ insight }: { insight: AIInsight }) {
  return (
    <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <CardHeader className="bg-[var(--primary-soft)] px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--primary)]">AI Order Insight</p>
            <CardTitle className="text-[var(--text)]">{insight.title}</CardTitle>
          </div>
          <Badge variant="primary">Premium</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-6 py-6">
        <p className="text-sm leading-7 text-[var(--muted)]">{insight.description}</p>
        <div className="rounded-[1.5rem] bg-slate-50 p-5 text-sm text-[var(--text)]">
          <p className="font-semibold">Potential revenue impact</p>
          <p className="mt-2 text-2xl font-semibold">{insight.impact}</p>
        </div>
        <div className="space-y-3 text-sm text-[var(--muted)]">
          {insight.actions.map((action) => (
            <div key={action} className="flex items-center justify-between rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <span>{action}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="primary">Investigate</Button>
        <Button variant="secondary">Generate Recovery Plan</Button>
      </CardFooter>
    </Card>
  );
}
