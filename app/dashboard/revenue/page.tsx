import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RevenuePageClient } from "@/components/dashboard/revenue-page-client";

export const metadata: Metadata = {
  title: "Revenue | AI Revenue Recovery",
  description: "Track revenue performance, recovery risks, and forecasted growth across your store.",
};

export default function RevenuePage() {
  return (
    <DashboardShell>
      <RevenuePageClient />
    </DashboardShell>
  );
}
