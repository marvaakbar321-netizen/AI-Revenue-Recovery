import { StatCard } from "@/components/dashboard/stat-card";
import type { StatItem } from "@/lib/dashboard-data";

export function StatGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
