import { Circle, CheckCircle, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/lib/dashboard-data";

export function ActivityTimeline({ activity }: { activity: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-slate-500">Recent updates and automatically detected events in your store.</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="space-y-6">
          {activity.map((item, index) => (
            <div key={item.id} className="relative flex gap-4 pb-1">
              <div className="flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  {index === 0 ? <CheckCircle className="h-4.5 w-4.5" /> : <Circle className="h-2.5 w-2.5" />}
                </span>
                {index !== activity.length - 1 ? <span className="mt-1 h-full w-px bg-slate-200" /> : null}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-950">{item.title}</h3>
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.time}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
