import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OrdersPageClient } from "@/components/dashboard/orders-page-client";

export const metadata: Metadata = {
  title: "Orders | AI Revenue Recovery",
  description: "Monitor customer orders, fulfillment progress, and identify issues before they affect revenue.",
};

export default function OrdersPage() {
  return (
    <DashboardShell>
      <OrdersPageClient />
    </DashboardShell>
  );
}
