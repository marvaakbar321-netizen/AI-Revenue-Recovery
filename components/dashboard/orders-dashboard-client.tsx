"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { getMockOrders, type MockOrder } from "@/lib/mock-store-data";
import { formatCurrency } from "@/lib/store-utils";
import { OrderDetailsDrawer } from "@/components/dashboard/order-details-drawer";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = ["All", "Pending", "Paid", "Processing", "Shipped", "Completed", "Cancelled"] as const;

type OrderRow = {
  id: string;
  customer: string;
  email: string;
  items: string;
  date: string;
  quantity: number;
  total: string;
  status: string;
};

export function OrdersDashboardClient() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

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

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const orderRows: OrderRow[] = filteredOrders.map((order) => {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const productNames = order.items.map((item) => item.productName).join(", ");
    return {
      id: order.id,
      customer: order.customerName,
      email: order.customerEmail,
      items: productNames,
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      quantity: itemCount,
      total: formatCurrency(order.total),
      status: order.status,
    };
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">Recent orders</h1>
        </div>
        <Link href="/store/checkout">
          <Button variant="primary">New Order</Button>
        </Link>
      </section>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-3 py-2.5 md:max-w-md">
            <span className="text-sm text-[var(--muted)]">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders by ID, customer, or email"
              className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="min-h-[44px] rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <div className="text-sm text-[var(--muted)]">
              {filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Products / Items</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                      Loading orders…
                    </td>
                  </tr>
                ) : orderRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orderRows.map((order) => (
                    <tr key={order.id} className="align-middle">
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-[var(--text)]">{order.id}</td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-[var(--text)]">{order.customer}</p>
                          <p className="text-xs text-[var(--muted)]">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[var(--muted)]">{order.items}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-[var(--muted)]">{order.date}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-[var(--text)]">{order.quantity}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[var(--text)]">{order.total}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        <Button variant="ghost" onClick={() => setSelectedOrder(orders.find((o) => o.id === order.id) ?? null)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <OrderDetailsDrawer order={selectedOrder} open={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
