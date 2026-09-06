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
        {activity.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity yet. New orders will appear here automatically.</p>
        ) : (
          <div className="space-y-5">
            {activity.map((item, index) => (
              <div key={item.id} className="relative flex min-w-0 gap-3 pb-1">
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 sm:h-10 sm:w-10">
                    {index === 0 ? <CheckCircle className="h-4 w-4 sm:h-4.5 sm:w-4.5" /> : <Circle className="h-2.5 w-2.5" />}
                  </span>
                  {index !== activity.length - 1 ? <span className="mt-1 h-full w-px bg-slate-200" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="break-words text-sm font-semibold text-slate-950">{item.title}</h3>
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400 sm:text-xs sm:tracking-[0.24em]">{item.time}</span>
                  </div>
                  <p className="mt-1.5 break-words text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
