import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StoreDashboardClient } from "@/components/dashboard/store-dashboard-client";
import { StoreProvider } from "@/lib/store-context";

export const metadata: Metadata = {
  title: "Store | AI Revenue Recovery",
  description: "Create and manage your storefront for products and orders.",
};

export default function DashboardStorePage() {
  return (
    <DashboardShell>
      <StoreProvider>
        <StoreDashboardClient />
      </StoreProvider>
    </DashboardShell>
  );
}
