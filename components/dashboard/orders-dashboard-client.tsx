"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { getMockOrders } from "@/lib/mock-store-data";
import { formatCurrency } from "@/lib/store-utils";

export function OrdersDashboardClient() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadOrders = () => {
      setLoading(true);
      const mockOrders = getMockOrders();
      setOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">Recent orders</h1>
        </div>
      </section>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No orders yet for your store.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[1.25rem] border border-[var(--border)] bg-slate-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{order.status}</p>
                    <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">{order.customerName}</h2>
                    <p className="text-sm text-[var(--muted)]">{order.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--muted)]">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="mt-1 text-lg font-semibold text-[var(--text)]">{formatCurrency(order.total)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item: any) => (
                    <div key={`${order.id}-${item.productId}`} className="flex items-center justify-between gap-3 rounded-[0.875rem] bg-white px-3 py-2 text-sm">
                      <span className="text-[var(--text)]">{item.productName}</span>
                      <span className="text-[var(--muted)]">{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
