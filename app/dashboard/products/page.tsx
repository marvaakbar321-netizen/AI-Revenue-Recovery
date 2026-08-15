import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductsDashboardClient } from "@/components/dashboard/products-dashboard-client";
import { StoreProvider } from "@/lib/store-context";

export const metadata: Metadata = {
  title: "Products | AI Revenue Recovery",
  description: "Manage the products in your store.",
};

export default function DashboardProductsPage() {
  return (
    <DashboardShell>
      <StoreProvider>
        <ProductsDashboardClient />
      </StoreProvider>
    </DashboardShell>
  );
}
