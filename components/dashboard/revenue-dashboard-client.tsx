"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { getMockOrders, getMockRevenueTotal } from "@/lib/mock-store-data";
import { formatCurrency } from "@/lib/store-utils";

export function RevenueDashboardClient() {
  const { user } = useAuth();
  const [revenue, setRevenue] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadRevenue = () => {
      setLoading(true);
      const orders = getMockOrders();
      setRevenue(getMockRevenueTotal());
      setOrdersCount(orders.length);
      setLoading(false);
    };

    loadRevenue();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Revenue</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">Store revenue</h1>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <p className="text-sm text-[var(--muted)]">Total revenue</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--text)]">
            {loading ? "…" : formatCurrency(revenue)}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <p className="text-sm text-[var(--muted)]">Order count</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--text)]">{loading ? "…" : ordersCount}</p>
        </div>
      </div>
    </div>
  );
}
