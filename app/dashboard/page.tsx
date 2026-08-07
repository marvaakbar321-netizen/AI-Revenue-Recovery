import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { StatGrid } from "@/components/dashboard/stat-grid";
import { RevenueProblems } from "@/components/dashboard/revenue-problems";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { stats, revenueProblems, recommendation, activityFeed } from "@/lib/dashboard-data";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardShell>
        <div className="space-y-6">
          <WelcomeHeader />

          <section className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <SectionHeader
                title="Revenue snapshot"
                description="Monitor the health of your store with active insights and smart recommendations."
              />
              <Button variant="secondary">Export report</Button>
            </div>
            <StatGrid stats={stats} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.95fr)]">
            <RevenueProblems problems={revenueProblems} />
            <div className="flex flex-col gap-6">
              <RecommendationCard recommendation={recommendation} />
              <ActivityTimeline activity={activityFeed} />
            </div>
          </section>
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
