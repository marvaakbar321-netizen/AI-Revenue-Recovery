import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ReportsPageClient } from "@/components/dashboard/reports-page-client";

export const metadata: Metadata = {
  title: "Reports | AI Revenue Recovery",
  description: "Review your store reports.",
};

export default function ReportsPage() {
  return (
    <DashboardShell>
      <ReportsPageClient />
    </DashboardShell>
  );
}
