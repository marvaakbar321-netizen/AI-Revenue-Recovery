import { StatCard } from "@/components/dashboard/stat-card";
import type { StatItem } from "@/lib/dashboard-data";

export function StatGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="min-w-0">
          <StatCard stat={stat} />
        </div>
      ))}
    </div>
  );
}
