import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderAlert } from "@/lib/dashboard-data";

const priorityVariant: Record<string, "danger" | "warning" | "info"> = {
  Critical: "danger",
  High: "warning",
  Medium: "info",
};

export function OrderAlertCard({ alert }: { alert: OrderAlert }) {
  return (
    <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <CardHeader className="px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base">{alert.title}</CardTitle>
          <Badge variant={priorityVariant[alert.priority]}>{alert.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-5">
        <p className="text-sm leading-6 text-[var(--muted)]">{alert.description}</p>
        <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3 text-sm font-semibold text-[var(--text)]">
          Estimated impact: {alert.impact}
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4">
        <Button variant="secondary">{alert.action}</Button>
      </CardFooter>
    </Card>
  );
}
