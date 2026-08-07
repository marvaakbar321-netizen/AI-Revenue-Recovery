"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { OrderStatCard } from "@/components/dashboard/order-stat-card";
import { OrderStatusCard } from "@/components/dashboard/order-status-card";
import { OrderAnalyticsCard } from "@/components/dashboard/order-analytics-card";
import { OrderTable } from "@/components/dashboard/order-table";
import { OrderAlertCard } from "@/components/dashboard/order-alert-card";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { CustomerInsightCard } from "@/components/dashboard/customer-insight-card";
import { ActivityTimelineOrders } from "@/components/dashboard/activity-timeline-orders";
import { orderKpis, orderStatuses, orderAnalytics, ordersTable, orderAlerts, aiOrderInsight, customerInsights, orderActivity } from "@/lib/dashboard-data";

export function OrdersPageClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("Orders by Day");

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">Orders</h1>
          <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Monitor customer orders, fulfillment progress, and identify issues before they affect revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost">Date Filter</Button>
          <Button variant="secondary">Export Orders</Button>
          <Button variant="secondary">Refresh</Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {orderKpis.map((stat) => (
          <OrderStatCard key={stat.title} stat={stat} />
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {orderStatuses.map((status) => (
          <OrderStatusCard key={status.title} status={status} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <OrderAnalyticsCard series={orderAnalytics} selected={selectedPeriod} onChange={setSelectedPeriod} />
        <div className="grid gap-6">
          <div className="space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <SectionHeader title="Customer Order Insights" description="Track behavior and buy patterns across the latest orders." />
            <div className="grid gap-4 sm:grid-cols-2">
              {customerInsights.map((insight) => (
                <CustomerInsightCard key={insight.title} insight={insight} />
              ))}
            </div>
          </div>
          <AIInsightCard insight={aiOrderInsight} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="space-y-6">
          <OrderTable orders={ordersTable} />
        </div>
        <div className="space-y-6">
          <div className="space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <SectionHeader title="Order Alerts" description="See order issues with the highest revenue risk." />
            <div className="space-y-4">
              {orderAlerts.map((alert) => (
                <OrderAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
          <ActivityTimelineOrders activity={orderActivity} />
        </div>
      </section>
    </div>
  );
}
