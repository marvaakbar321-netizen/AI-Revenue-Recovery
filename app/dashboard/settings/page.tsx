import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsPageClient } from "@/components/dashboard/settings-page-client";
import { StoreProvider } from "@/lib/store-context";

export const metadata: Metadata = {
  title: "Settings | AI Revenue Recovery",
  description: "Manage your dashboard settings.",
};

export default function SettingsPage() {
  return (
    <DashboardShell>
      <StoreProvider>
        <SettingsPageClient />
      </StoreProvider>
    </DashboardShell>
  );
}
