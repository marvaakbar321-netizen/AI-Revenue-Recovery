"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { StatGrid } from "@/components/dashboard/stat-grid";
import { RevenueProblems } from "@/components/dashboard/revenue-problems";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { useOrders } from "@/hooks/useOrders";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatCurrency } from "@/lib/store-utils";
import type { ActivityItem } from "@/lib/dashboard-data";
import { ArrowUpRight, ShoppingCart, Users, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StatItem = {
  title: string;
  value: string;
  delta: string;
  trend: "positive" | "negative";
  icon: LucideIcon;
  description: string;
  series: number[];
};

export default function DashboardPage() {
  const { orders, loading, customerCount } = useOrders();
  const stats = useDashboardStats(orders, 0, 0, customerCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration gate for dashboard data
    setMounted(true);
  }, []);

  const recentActivity: ActivityItem[] = useMemo(() => {
    if (orders.length === 0) return [];
    return orders.slice(0, 6).map((order) => {
      const total = Number(order.total ?? 0);
      const status = (order.status || "").toLowerCase();
      const type: ActivityItem["type"] =
        status === "cancelled"
          ? "warning"
          : status === "paid" || status === "delivered" || status === "completed"
            ? "success"
            : "info";
      const created = new Date(order.created_at);
      // eslint-disable-next-line react-hooks/purity -- activity labels intentionally reflect the current time
      const minutesAgo = Math.max(1, Math.round((Date.now() - created.getTime()) / 60000));
      const time = minutesAgo < 60 ? `${minutesAgo}m ago` : minutesAgo < 1440 ? `${Math.round(minutesAgo / 60)}h ago` : created.toLocaleDateString();
      return {
        id: order.id,
        time,
        title: `Order ${order.status || "updated"}`,
        description: `${order.customer_name} · ${formatCurrency(total)}`,
        type,
      };
    });
  }, [orders]);

  const dynamicStats: StatItem[] = useMemo(() => {
    if (!mounted || loading) {
      return [
        { title: "Revenue", value: "—", delta: "—", trend: "positive", icon: ArrowUpRight, description: "Loading...", series: [0, 0, 0, 0, 0, 0, 0] },
        { title: "Orders", value: "—", delta: "—", trend: "positive", icon: ShoppingCart, description: "Loading...", series: [0, 0, 0, 0, 0, 0, 0] },
        { title: "Customers", value: "—", delta: "—", trend: "positive", icon: Users, description: "Loading...", series: [0, 0, 0, 0, 0, 0, 0] },
        { title: "Conversion", value: "—", delta: "—", trend: "positive", icon: Cpu, description: "Loading...", series: [0, 0, 0, 0, 0, 0, 0] },
      ];
    }

    return [
      {
        title: "Revenue",
        value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalRevenue),
        delta: stats.totalOrders > 0 ? `${stats.completedOrders} completed` : "No orders yet",
        trend: stats.totalRevenue > 0 ? "positive" : "positive",
        icon: ArrowUpRight,
        description: `Avg order ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.averageOrderValue)}`,
        series: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        title: "Orders",
        value: String(stats.customerCount),
        delta: stats.customerCount > 0 ? "Active customers" : "No customers yet",
        trend: "positive",
        icon: ShoppingCart,
        description: "Customers in your store",
        series: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        title: "Customers",
        value: "—",
        delta: "—",
        trend: "positive",
        icon: Users,
        description: "Store customers",
        series: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        title: "Conversion",
        value: "—",
        delta: "—",
        trend: "positive",
        icon: Cpu,
        description: "Checkout performance",
        series: [0, 0, 0, 0, 0, 0, 0],
      },
    ];
  }, [loading, stats, mounted]);

  return (
    <AuthGuard>
      <DashboardShell>
        <div className="mx-auto w-full max-w-[1400px] space-y-6">
          <WelcomeHeader />

          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SectionHeader
                title="Revenue snapshot"
                description="Monitor the health of your store with active insights and smart recommendations."
              />
              <Button variant="secondary" className="w-full sm:w-auto">Export report</Button>
            </div>
            <StatGrid stats={dynamicStats} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.95fr)]">
            <div className="min-w-0">
              <RevenueProblems problems={[]} />
            </div>
            <div className="flex min-w-0 flex-col gap-6">
              <RecommendationCard recommendation={{ title: "Improve mobile checkout experience", description: "Streamline the checkout flow with one-click payment options and faster form validation to recover lost revenue.", impact: "Expected recovery: $32K/mo" }} />
              <ActivityTimeline activity={recentActivity} />
            </div>
          </section>
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
