import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { OrderStatus } from "@/lib/dashboard-data";

const statusStyles: Record<string, string> = {
  default: "bg-slate-50 text-slate-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  info: "bg-sky-50 text-sky-700",
};

export function OrderStatusCard({ status }: { status: OrderStatus }) {
  return (
    <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{status.title}</p>
            <p className="mt-1 text-3xl font-semibold text-[var(--text)]">{status.value}</p>
          </div>
          <StatusBadge status={status.title} />
        </div>
        <div className={"rounded-[1.5rem] border px-3 py-2 text-sm font-medium " + statusStyles[status.variant]}>
          {status.label}
        </div>
      </CardContent>
    </Card>
  );
}
