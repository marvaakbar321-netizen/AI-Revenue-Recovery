import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import logoImage from "@/app/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { OrderDetailsDrawer } from "@/components/dashboard/order-details-drawer";
import type { OrderRow } from "@/lib/dashboard-data";

export function OrderTable({ orders }: { orders: OrderRow[] }) {
  return (
    <Card className="border border-[var(--border)]">
      <CardHeader className="flex flex-col gap-4 border-b border-[var(--border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Orders</CardTitle>
          <p className="text-sm text-[var(--muted)]">Search, sort, and review the orders driving revenue.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-sm">
            <Search className="h-4.5 w-4.5 text-[var(--muted)]" />
            <input
              type="search"
              placeholder="Search orders"
              className="ml-3 min-w-[180px] bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-slate-400"
            />
          </div>
          <Button variant="secondary">Filter</Button>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto p-0">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
          <thead className="sticky top-0 bg-[var(--surface)] shadow-sm">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Products</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Total</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Fulfillment</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Order Date</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="group rounded-[1.5rem] border border-transparent bg-[var(--surface)] transition hover:border-[var(--border)] hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 font-semibold text-[var(--text)]">{order.id}</td>
                <td className="flex items-center gap-3 px-6 py-4 text-[var(--text)]">
                  <div className="relative h-10 w-10 overflow-hidden rounded-[1.25rem] bg-slate-100">
                    <Image src={logoImage} alt="Site logo" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">{order.customer}</p>
                    <p className="text-xs text-[var(--muted)]">{order.priority} priority</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-[var(--muted)]">{order.products}</td>
                <td className="px-6 py-4 font-semibold text-[var(--text)]">{order.total}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.fulfillmentStatus} />
                </td>
                <td className="px-6 py-4 text-[var(--muted)]">{order.date}</td>
                <td className="px-6 py-4 text-right">
                  <OrderDetailsDrawer />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-sm text-[var(--muted)]">
          <span>Showing 1-5 of 52 orders</span>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-10 items-center justify-center rounded-[1rem] border border-[var(--border)] px-4 text-sm transition hover:bg-slate-50">Previous</button>
            <button className="inline-flex h-10 items-center justify-center rounded-[1rem] border border-[var(--border)] px-4 text-sm transition hover:bg-slate-50">Next</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
