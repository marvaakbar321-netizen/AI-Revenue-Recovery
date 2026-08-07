"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { RevenueSummary } from "@/components/dashboard/revenue-summary";
import { RevenueBreakdown } from "@/components/dashboard/revenue-breakdown";
import { TopProductsTable } from "@/components/dashboard/top-products-table";
import { RevenueForecastCard } from "@/components/dashboard/revenue-forecast-card";
import { RevenueProblems } from "@/components/dashboard/revenue-problems";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import {
  revenueMetrics,
  revenueBreakdown,
  topProducts,
  revenueForecast,
  revenueProblems,
  recommendation,
  activityFeed,
} from "@/lib/dashboard-data";

const ranges = ["30 days", "90 days", "12 months"];

export function RevenuePageClient() {
  const [selectedRange, setSelectedRange] = useState<string>("30 days");

  return (
    <div className="space-y-6">
      <section className="space-y-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Revenue center</p>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
                Recover lost revenue with AI-driven insights.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Dive into revenue health, prioritize recoverable losses, and track forecast impact with a single business view.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FilterTabs options={ranges} selected={selectedRange} onChange={setSelectedRange} />
            <Button variant="secondary">Export report</Button>
          </div>
        </div>

        <RevenueSummary metrics={revenueMetrics} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.9fr]">
        <div className="grid gap-6">
          <RevenueBreakdown breakdown={revenueBreakdown} />
          <TopProductsTable products={topProducts} />
        </div>

        <div className="grid gap-6">
          <RevenueForecastCard forecast={revenueForecast} />
          <RevenueProblems problems={revenueProblems} />
          <RecommendationCard recommendation={recommendation} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="grid gap-6">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_60px_-50px_rgba(15,23,42,0.12)]">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Opportunity timeline</p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--text)]">Revenue recovery actions</h2>
              </div>
              <Button variant="ghost">View details</Button>
            </div>
            <ActivityTimeline activity={activityFeed} />
          </div>
        </div>

        <div className="grid gap-6">
          <SectionHeader
            title="Revenue health"
            description="Alerts, forecasts, and high-priority tasks to keep recovery moving forward."
            trailing={<Button variant="secondary">Review</Button>}
          />
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold text-[var(--text)]">Recovery progress</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.5rem] bg-slate-100 p-4">
                <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
                  <span>Action items completed</span>
                  <span className="font-semibold text-[var(--text)]">6 / 9</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[66%] rounded-full bg-[var(--primary)]" />
                </div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-4">
                <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
                  <span>Forecast accuracy</span>
                  <span className="font-semibold text-[var(--text)]">92%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[92%] rounded-full bg-[var(--success)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
