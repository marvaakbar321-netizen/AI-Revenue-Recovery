"use client";

import { useEffect, useState, useMemo } from "react";
import useAuth from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useRevenueMetrics } from "@/hooks/useRevenueMetrics";
import { formatCurrency } from "@/lib/store-utils";

export function RevenueDashboardClient() {
  const { user } = useAuth();
  const { orders, loading, error } = useOrders();
  const metrics = useRevenueMetrics(orders);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Revenue</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">Store revenue</h1>
          {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <p className="text-sm text-[var(--muted)]">Total revenue</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--text)]">
            {loading ? "…" : formatCurrency(metrics.totalRevenue)}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <p className="text-sm text-[var(--muted)]">Order count</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--text)]">{loading ? "…" : orders.length}</p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <p className="text-sm text-[var(--muted)]">Average order value</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--text)]">{loading ? "…" : formatCurrency(metrics.averageOrderValue)}</p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <p className="text-sm text-[var(--muted)]">Completed revenue</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--text)]">{loading ? "…" : formatCurrency(metrics.completedRevenue)}</p>
        </div>
      </div>
    </div>
  );
}
