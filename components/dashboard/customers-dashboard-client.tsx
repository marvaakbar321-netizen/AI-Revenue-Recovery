"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Search, Users, UserPlus, Repeat, DollarSign, X, Mail, MapPin, Calendar, Package, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store-context";
import { useOrders, type OrderRow } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/store-utils";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";

type DerivedCustomer = {
  key: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  orderCount: number;
  totalSpent: number;
  firstOrderAt: string;
  lastOrderAt: string;
  orders: OrderRow[];
  type: "New" | "Returning";
};

type SortKey = "name" | "orders" | "totalSpent" | "lastOrder";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "C";
}

function deriveCustomers(orders: OrderRow[]): DerivedCustomer[] {
  const byEmail = new Map<string, DerivedCustomer>();
  orders.forEach((order) => {
    const email = (order.customer_email || "").trim().toLowerCase() || `unknown-${order.id}`;
    const existing = byEmail.get(email);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += Number(order.total ?? 0);
      existing.orders.push(order);
      if (order.created_at < existing.firstOrderAt) existing.firstOrderAt = order.created_at;
      if (order.created_at > existing.lastOrderAt) existing.lastOrderAt = order.created_at;
      if (order.customer_name && !existing.name) existing.name = order.customer_name;
      if (order.customer_phone && !existing.phone) existing.phone = order.customer_phone;
      if (order.customer_address && !existing.address) existing.address = order.customer_address;
    } else {
      byEmail.set(email, {
        key: email,
        name: order.customer_name || "Unknown Customer",
        email: order.customer_email || email,
        phone: order.customer_phone || null,
        address: order.customer_address || null,
        orderCount: 1,
        totalSpent: Number(order.total ?? 0),
        firstOrderAt: order.created_at,
        lastOrderAt: order.created_at,
        orders: [order],
        type: "New",
      });
    }
  });

  const list = Array.from(byEmail.values()).map((c) => {
    c.orders.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    c.type = c.orderCount > 1 ? "Returning" : "New";
    return c;
  });
  return list;
}

function CustomerAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.875rem] bg-gradient-to-br from-[#F4EDFF] to-[#EDE3FF] text-sm font-semibold text-[var(--primary)]">
      {getInitials(name)}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
          {description ? <p className="mt-1 text-xs text-[var(--muted)]">{description}</p> : null}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.875rem] bg-[var(--primary-soft)] text-[var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function CustomerDetailsDrawer({
  customer,
  onClose,
}: {
  customer: DerivedCustomer | null;
  onClose: () => void;
}) {
  if (!customer) return null;
  const avg = customer.orderCount > 0 ? customer.totalSpent / customer.orderCount : 0;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-slate-950/40 px-4 py-6">
      <div className="relative ml-auto flex h-full w-full max-w-3xl flex-col overflow-y-auto rounded-[1.5rem] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <CustomerAvatar name={customer.name} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Customer</p>
              <h2 className="truncate text-xl font-semibold text-[var(--text)]">{customer.name}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.875rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-slate-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Email</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--text)] break-words">
                <Mail className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                <span className="break-all">{customer.email}</span>
              </p>
            </div>
            <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Phone</p>
              <p className="mt-1 text-sm font-semibold text-[var(--text)]">{customer.phone || "—"}</p>
            </div>
            <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4 sm:col-span-2">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Address</p>
              <p className="mt-1 flex items-start gap-2 text-sm text-[var(--text)]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                <span className="break-words">{customer.address || "—"}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Total Orders</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text)]">{customer.orderCount}</p>
            </div>
            <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Total Spent</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text)]">{formatCurrency(customer.totalSpent)}</p>
            </div>
            <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Avg. Order</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text)]">{formatCurrency(avg)}</p>
            </div>
            <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Customer Type</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text)]">{customer.type}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">First Order</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <Calendar className="h-4 w-4 text-[var(--primary)]" />
                {formatDate(customer.firstOrderAt)}
              </p>
            </div>
            <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Last Order</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <Calendar className="h-4 w-4 text-[var(--primary)]" />
                {formatDate(customer.lastOrderAt)}
              </p>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border)] px-5 py-3">
              <p className="text-sm font-semibold text-[var(--text)]">Order history</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">All previous orders from this customer</p>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {customer.orders.length === 0 ? (
                <p className="px-5 py-6 text-sm text-[var(--muted)]">No orders yet.</p>
              ) : (
                customer.orders.map((o) => (
                  <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text)]">#{o.id.slice(0, 8).toUpperCase()}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">{formatDate(o.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                      <Package className="h-3.5 w-3.5" />
                      {o.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0} item(s)
                    </div>
                    <p className="text-sm font-semibold text-[var(--text)]">{formatCurrency(o.total)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomersDashboardClient() {
  const { user } = useAuth();
  const { store, loading: storeLoading } = useStore();
  const { orders, loading: ordersLoading, error: ordersError, refresh } = useOrders();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "returning">("all");
  const [sortKey, setSortKey] = useState<SortKey>("lastOrder");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<DerivedCustomer | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const customers = useMemo(() => deriveCustomers(orders), [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = customers.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchesFilter = filter === "all" || c.type.toLowerCase() === filter;
      return matchesQuery && matchesFilter;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "orders":
          cmp = a.orderCount - b.orderCount;
          break;
        case "totalSpent":
          cmp = a.totalSpent - b.totalSpent;
          break;
        case "lastOrder":
        default:
          cmp = a.lastOrderAt < b.lastOrderAt ? -1 : a.lastOrderAt > b.lastOrderAt ? 1 : 0;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [customers, search, filter, sortKey, sortDir]);

  const stats = useMemo(() => {
    const total = customers.length;
    const newCount = customers.filter((c) => c.type === "New").length;
    const returningCount = customers.filter((c) => c.type === "Returning").length;
    const revenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    return { total, newCount, returningCount, revenue };
  }, [customers]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortHeader = ({ k, label, align = "left" }: { k: SortKey; label: string; align?: "left" | "right" }) => (
    <button
      type="button"
      onClick={() => handleSort(k)}
      className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--text)] ${align === "right" ? "justify-end" : ""}`}
    >
      {label}
      {sortKey === k ? (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : null}
    </button>
  );

  if (!user) return null;

  const isLoading = !mounted || storeLoading || ordersLoading;
  const noStore = !storeLoading && !store;

  return (
    <Fragment>
      <div className="space-y-6">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Customers</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">Customer Overview</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Understand your customers, their activity, and the revenue they generate.
            </p>
          </div>
        </section>

        {noStore ? (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-[var(--text)]">No store yet</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Create your store to start tracking customers.</p>
            <a
              href="/dashboard/store"
              className="mt-4 inline-flex items-center justify-center rounded-[0.875rem] bg-gradient-to-r from-[#7C5CFC] to-[#6E49F0] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-[#6E49F0] hover:to-[#643fee]"
            >
              Set up store
            </a>
          </div>
        ) : null}

        {!noStore ? (
          <Fragment>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Total Customers" value={isLoading ? "—" : String(stats.total)} icon={Users} description="Unique customers" />
              <SummaryCard label="New" value={isLoading ? "—" : String(stats.newCount)} icon={UserPlus} description="First-time buyers" />
              <SummaryCard label="Returning" value={isLoading ? "—" : String(stats.returningCount)} icon={Repeat} description="Repeat buyers" />
              <SummaryCard label="Customer Revenue" value={isLoading ? "—" : formatCurrency(stats.revenue)} icon={DollarSign} description="All-time" />
            </section>

            <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-3 rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-3 py-2.5 md:max-w-md">
                  <Search className="h-4 w-4 text-[var(--muted)]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers..."
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-slate-400"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as typeof filter)}
                    className="min-h-[44px] rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                  >
                    <option value="all">All Customers</option>
                    <option value="new">New</option>
                    <option value="returning">Returning</option>
                  </select>
                  <div className="text-sm text-[var(--muted)]">
                    {filtered.length} customer{filtered.length === 1 ? "" : "s"}
                  </div>
                </div>
              </div>

              {ordersError ? (
                <div className="mt-5 flex flex-col items-start gap-3 rounded-[1rem] border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Failed to load customers</p>
                      <p className="text-xs text-red-700">{ordersError}</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={refresh}>Retry</Button>
                </div>
              ) : null}

              <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--border)] text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3"><SortHeader k="name" label="Customer" /></th>
                        <th className="px-4 py-3"><SortHeader k="orders" label="Orders" /></th>
                        <th className="px-4 py-3"><SortHeader k="totalSpent" label="Total Spent" /></th>
                        <th className="px-4 py-3"><SortHeader k="lastOrder" label="Last Order" /></th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                      {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <tr key={`skel-${i}`}>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 animate-pulse rounded-[0.875rem] bg-slate-200" />
                                <div className="space-y-2">
                                  <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                                  <div className="h-2 w-40 animate-pulse rounded bg-slate-200" />
                                </div>
                              </div>
                            </td>
                            <td colSpan={6} className="px-4 py-4">
                              <div className="h-3 w-full max-w-[60%] animate-pulse rounded bg-slate-200" />
                            </td>
                          </tr>
                        ))
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-14 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]">
                              <Users className="h-6 w-6" />
                            </div>
                            <p className="mt-4 text-base font-semibold text-[var(--text)]">No customers yet</p>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                              Customers will appear here when your first order is placed.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((c) => (
                          <tr key={c.key} className="align-middle">
                            <td className="whitespace-nowrap px-4 py-4">
                              <div className="flex items-center gap-3">
                                <CustomerAvatar name={c.name} />
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-[var(--text)]">{c.name}</p>
                                  <p className="truncate text-xs text-[var(--muted)]">{c.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-[var(--text)]">{c.orderCount}</td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[var(--text)]">{formatCurrency(c.totalSpent)}</td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-[var(--muted)]">{formatDate(c.lastOrderAt)}</td>
                            <td className="whitespace-nowrap px-4 py-4">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  c.type === "Returning"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {c.type}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              <StatusBadge status={c.orders[0]?.status ?? "Active"} />
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right">
                              <Button variant="ghost" onClick={() => setSelected(c)}>View</Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </Fragment>
        ) : null}
      </div>

      <CustomerDetailsDrawer customer={selected} onClose={() => setSelected(null)} />
    </Fragment>
  );
}
