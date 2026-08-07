import { Circle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/lib/dashboard-data";

export function ActivityTimelineOrders({ activity }: { activity: ActivityItem[] }) {
  return (
    <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <CardHeader>
        <CardTitle>Recent Order Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {activity.map((item, index) => (
          <div key={item.id} className="flex gap-4 rounded-[1.5rem] border border-[var(--border)] bg-slate-50 p-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                {index === 0 ? <CheckCircle className="h-4.5 w-4.5" /> : <Circle className="h-2.5 w-2.5" />}
              </div>
              {index !== activity.length - 1 ? <div className="h-full w-px bg-slate-200" /> : null}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{item.description}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{item.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
