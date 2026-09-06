import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CustomersDashboardClient } from "@/components/dashboard/customers-dashboard-client";
import { StoreProvider } from "@/lib/store-context";

export const metadata: Metadata = {
  title: "Customers | AI Revenue Recovery",
  description: "Understand your customers, their activity, and the revenue they generate.",
};

export default function CustomersPage() {
  return (
    <DashboardShell>
      <StoreProvider>
        <CustomersDashboardClient />
      </StoreProvider>
    </DashboardShell>
  );
}
