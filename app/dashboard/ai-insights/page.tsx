import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AIInsightsPageClient } from "@/components/dashboard/ai-insights-page-client";

export const metadata: Metadata = {
  title: "AI Insights | AI Revenue Recovery",
  description: "Review actionable insights from your store activity.",
};

export default function AIInsightsPage() {
  return (
    <DashboardShell>
      <AIInsightsPageClient />
    </DashboardShell>
  );
}