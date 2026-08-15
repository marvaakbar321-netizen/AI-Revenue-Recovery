"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getMockOrders } from "@/lib/mock-store-data";

export function OrderSuccessPageClient({ storeSlug }: { storeSlug: string }) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const order = useMemo(() => getMockOrders().find((entry) => entry.id === orderId) ?? null, [orderId]);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-[var(--text)]">Order not found</h1>
        <Link href={`/store/${storeSlug}`} className="mt-6 inline-block">
          <Button variant="primary">Back to store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Success</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Thank you for your order!</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--text)]">Order summary</h2>
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
              <dd className="font-semibold text-[var(--text)]">${order.total.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--text)]">Ordered products</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={`${order.id}-${item.productId}`} className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-[var(--text)]">{item.productName}</span>
                  <span className="text-[var(--muted)]">{item.quantity}x</span>
                </div>
                <div className="mt-1 text-[var(--muted)]">${item.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href={`/store/${storeSlug}`}>
          <Button variant="primary">Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
