import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RevenueProblemsPageClient } from "@/components/dashboard/revenue-problems-page-client";
import { StoreProvider } from "@/lib/store-context";

export const metadata: Metadata = {
  title: "Revenue Problems | AI Revenue Recovery",
  description: "Identify the issues affecting your revenue and focus on the opportunities with the highest impact.",
};

export default function RevenueProblemsPage() {
  return (
    <DashboardShell>
      <StoreProvider>
        <RevenueProblemsPageClient />
      </StoreProvider>
    </DashboardShell>
  );
}
