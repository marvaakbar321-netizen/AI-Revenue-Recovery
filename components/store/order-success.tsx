"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/store-utils";

export function OrderSuccess({
  order,
  storeSlug,
}: {
  order: {
    id: string;
    customerName: string;
    total: number;
    items: Array<{ productName: string; quantity: number; total: number }>;
    status: string;
  };
  storeSlug: string;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Order placed</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Thank you for your order!</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--text)]">Order details</h2>
          <dl className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <div className="flex items-center justify-between">
              <dt>Order ID</dt>
              <dd className="font-semibold text-[var(--text)]">{order.id}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Customer</dt>
              <dd className="font-semibold text-[var(--text)]">{order.customerName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Status</dt>
              <dd className="font-semibold text-[var(--text)]">{order.status}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Total</dt>
              <dd className="font-semibold text-[var(--text)]">{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--text)]">Products</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={`${order.id}-${item.productName}`} className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text)]">{item.productName}</span>
                  <span className="text-[var(--muted)]">{item.quantity}x</span>
                </div>
                <div className="mt-1 text-[var(--muted)]">{formatCurrency(item.total)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href={`/store/${storeSlug}`}>
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
