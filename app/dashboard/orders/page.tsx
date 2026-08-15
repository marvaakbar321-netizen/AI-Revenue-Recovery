import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OrdersDashboardClient } from "@/components/dashboard/orders-dashboard-client";

export const metadata: Metadata = {
  title: "Orders | AI Revenue Recovery",
  description: "Monitor customer orders, fulfillment progress, and identify issues before they affect revenue.",
};

export default function OrdersPage() {
  return (
    <DashboardShell>
      <OrdersDashboardClient />
    </DashboardShell>
  );
}
