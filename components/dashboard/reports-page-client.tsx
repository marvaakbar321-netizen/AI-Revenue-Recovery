"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  DollarSign,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
} from "lucide-react";
import { TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useOrders, type OrderRow } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/store-utils";
import { Button } from "@/components/ui/button";

type RangeKey = "7" | "30" | "90" | "365";
type Range = { key: RangeKey; label: string; days: number };
type ReportPoint = { label: string; revenue: number; orders: number };
type ProductReport = { id: string; name: string; units: number; orders: number; revenue: number };

const ranges: Range[] = [
  { key: "7", label: "Last 7 days", days: 7 },
  { key: "30", label: "Last 30 days", days: 30 },
  { key: "90", label: "Last 90 days", days: 90 },
  { key: "365", label: "Last 12 months", days: 365 },
];

const revenueStatuses = ["paid", "shipped", "delivered", "processing", "completed"];
const completedStatuses = ["delivered", "completed", "shipped"];
const cancelledStatuses = ["cancelled", "canceled", "refunded"];
const currency = (value: number) => formatCurrency(value);
const statusIs = (order: OrderRow, statuses: string[]) => statuses.includes(order.status.toLowerCase());

function rangeStart(days: number) {
  return Date.now() - days * 86400000;
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getPoints(orders: OrderRow[], days: number): ReportPoint[] {
  const bucketCount = days <= 30 ? 7 : days <= 90 ? 8 : 12;
  const bucketDays = days / bucketCount;
  const end = Date.now();
  return Array.from({ length: bucketCount }, (_, index) => {
    const bucketEnd = end - (bucketCount - index - 1) * bucketDays * 86400000;
    const bucketStart = bucketEnd - bucketDays * 86400000;
    const bucketOrders = orders.filter((order) => {
      const created = new Date(order.created_at).getTime();
      return created > bucketStart && created <= bucketEnd;
    });
    return {
      label: formatShortDate(new Date(bucketEnd)),
      revenue: bucketOrders.filter((order) => statusIs(order, revenueStatuses)).reduce((sum, order) => sum + Number(order.total || 0), 0),
      orders: bucketOrders.length,
    };
  });
}

function buildProductReport(orders: OrderRow[]): ProductReport[] {
  const products = new Map<string, ProductReport>();
  orders.forEach((order) => order.order_items?.forEach((item) => {
    const existing = products.get(item.product_id) ?? { id: item.product_id, name: item.product_name, units: 0, orders: 0, revenue: 0 };
    existing.units += Number(item.quantity || 0);
    existing.revenue += Number(item.total || 0);
    products.set(item.product_id, existing);
  }));
  const orderIdsByProduct = new Map<string, Set<string>>();
  orders.forEach((order) => order.order_items?.forEach((item) => {
    const ids = orderIdsByProduct.get(item.product_id) ?? new Set<string>();
    ids.add(order.id);
    orderIdsByProduct.set(item.product_id, ids);
  }));
  return [...products.values()].map((product) => ({ ...product, orders: orderIdsByProduct.get(product.id)?.size ?? 0 })).sort((a, b) => b.revenue - a.revenue);
}

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return <div className="relative overflow-hidden rounded-[1.125rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_16px_40px_-30px_rgba(55,35,120,0.45)]"><div className="absolute inset-y-0 left-0 w-1 bg-[var(--primary-soft)]" /><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p><p className="mt-2 truncate text-2xl font-semibold tracking-tight text-[var(--text)]">{value}</p><p className="mt-1 truncate text-xs text-[var(--muted)]">{note}</p></div><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] bg-[var(--primary-soft)] text-[var(--primary)]"><Icon className="h-4 w-4" /></div></div></div>;
}

function Skeleton() {
  return <div className="space-y-5" aria-label="Loading reports"><div className="h-28 animate-pulse rounded-[1.25rem] bg-slate-100" /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-[1.125rem] bg-slate-100" />)}</div><div className="h-80 animate-pulse rounded-[1.25rem] bg-slate-100" /><div className="grid gap-3 lg:grid-cols-2"><div className="h-64 animate-pulse rounded-[1.125rem] bg-slate-100" /><div className="h-64 animate-pulse rounded-[1.125rem] bg-slate-100" /></div></div>;
}

function PerformanceChart({ points, kind }: { points: ReportPoint[]; kind: "revenue" | "orders" }) {
  const values = points.map((point) => kind === "revenue" ? point.revenue : point.orders);
  const max = Math.max(...values, 1);
  const width = 760;
  const height = 220;
  const coordinates = points.map((point, index) => ({ x: points.length === 1 ? width / 2 : (index / (points.length - 1)) * width, y: height - ((kind === "revenue" ? point.revenue : point.orders) / max) * (height - 24) }));
  const path = coordinates.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  return <div className="min-w-0 overflow-hidden"><div className="h-64 w-full overflow-hidden rounded-[0.875rem] bg-[linear-gradient(180deg,#fbf9ff_0%,#ffffff_100%)] p-3"><svg viewBox={`0 0 ${width} ${height + 30}`} className="h-full w-full" role="img" aria-label={`${kind === "revenue" ? "Revenue" : "Orders"} over time`} preserveAspectRatio="none"><line x1="0" y1={height} x2={width} y2={height} stroke="#E8ECF3" /><line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#E8ECF3" strokeDasharray="4 6" /><path d={path} fill="none" stroke="#7C5CFC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />{coordinates.map((point, index) => <g key={`${point.x}-${point.y}`}><circle cx={point.x} cy={point.y} r="6" fill="#fff" stroke="#7C5CFC" strokeWidth="3"><title>{`${points[index].label}: ${kind === "revenue" ? currency(points[index].revenue) : `${points[index].orders} orders`}`}</title></circle><text x={point.x} y={height + 22} textAnchor="middle" fill="#6B7280" fontSize="11">{points[index].label}</text></g>)}</svg></div><div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]"><span className="h-2 w-2 rounded-full bg-[var(--primary)]" />{kind === "revenue" ? "Revenue from qualifying orders" : "All orders created in the period"}</div></div>;
}

function Insight({ icon: Icon, title, detail, positive }: { icon: typeof TrendingUp; title: string; detail: string; positive?: boolean }) {
  return <div className="flex items-start gap-3 rounded-[0.875rem] bg-slate-50 p-3"><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.7rem] ${positive ? "bg-emerald-50 text-emerald-600" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}><Icon className="h-4 w-4" /></div><div><p className="text-sm font-semibold text-[var(--text)]">{title}</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{detail}</p></div></div>;
}

export function ReportsPageClient() {
  const { orders, customerCount, loading, error, refresh } = useOrders();
  const [rangeKey, setRangeKey] = useState<RangeKey>("30");
  const selectedRange = ranges.find((range) => range.key === rangeKey) ?? ranges[1];
  const report = useMemo(() => {
    const start = rangeStart(selectedRange.days);
    const periodOrders = orders.filter((order) => new Date(order.created_at).getTime() >= start);
    const revenueOrders = periodOrders.filter((order) => statusIs(order, revenueStatuses));
    const revenue = revenueOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const customerOrders = new Map<string, OrderRow[]>();
    orders.forEach((order) => { const list = customerOrders.get(order.customer_id) ?? []; list.push(order); customerOrders.set(order.customer_id, list); });
    const periodCustomerIds = new Set(periodOrders.map((order) => order.customer_id));
    const newCustomers = [...periodCustomerIds].filter((id) => (customerOrders.get(id) ?? []).every((order) => new Date(order.created_at).getTime() >= start)).length;
    const returningCustomers = [...periodCustomerIds].filter((id) => (customerOrders.get(id) ?? []).some((order) => new Date(order.created_at).getTime() < start)).length;
    const productReport = buildProductReport(revenueOrders);
    const points = getPoints(periodOrders, selectedRange.days);
    const previousStart = start - selectedRange.days * 86400000;
    const previousOrders = orders.filter((order) => { const time = new Date(order.created_at).getTime(); return time >= previousStart && time < start; });
    const previousRevenue = previousOrders.filter((order) => statusIs(order, revenueStatuses)).reduce((sum, order) => sum + Number(order.total || 0), 0);
    return { periodOrders, revenueOrders, revenue, average: revenueOrders.length ? revenue / revenueOrders.length : 0, newCustomers, returningCustomers, productReport, points, previousRevenue, completed: periodOrders.filter((order) => statusIs(order, completedStatuses)).length, pending: periodOrders.filter((order) => order.status.toLowerCase() === "pending").length, cancelled: periodOrders.filter((order) => statusIs(order, cancelledStatuses)).length };
  }, [orders, selectedRange.days]);
  const hasData = orders.length > 0;
  const maxProductRevenue = Math.max(...report.productReport.map((product) => product.revenue), 1);
  const revenueChange = report.previousRevenue > 0 ? ((report.revenue - report.previousRevenue) / report.previousRevenue) * 100 : null;

  if (loading) return <Skeleton />;

  return <div className="space-y-5">
    <section className="flex flex-col gap-4 rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(110deg,#ffffff_0%,#fbf9ff_72%,#f4edff_100%)] px-5 py-5 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--primary)]">Revenue intelligence</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">Reports</h1><p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">Understand your store performance with detailed revenue, order, product, and customer analytics.</p></div><div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><label className="relative flex items-center"><CalendarDays className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--muted)]" /><select value={rangeKey} onChange={(event) => setRangeKey(event.target.value as RangeKey)} className="h-10 w-full appearance-none rounded-[0.75rem] border border-[var(--border)] bg-[var(--surface)] pl-9 pr-8 text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--primary)] sm:w-auto"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last 12 months</option></select></label><Button variant="secondary" onClick={() => void refresh()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button></div></section>
    {error ? <div className="flex flex-col gap-3 rounded-[1rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"><span>We could not load your store report data. Your data was not changed.</span><Button variant="secondary" onClick={() => void refresh()}>Retry</Button></div> : null}
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric label="Total Revenue" value={currency(report.revenue)} note={selectedRange.label} icon={BarChart3} /><Metric label="Total Orders" value={String(report.periodOrders.length)} note={`${report.completed} completed`} icon={ShoppingCart} /><Metric label="Customers" value={String(customerCount)} note={`${report.newCustomers} new in period`} icon={Users} /><Metric label="Average Order Value" value={currency(report.average)} note="Qualifying orders" icon={DollarSign} /></section>
    {!hasData ? <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center shadow-sm"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]"><BarChart3 className="h-5 w-5" /></div><h2 className="mt-4 text-lg font-semibold text-[var(--text)]">No report data yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">Reports will become available as your store receives orders.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/dashboard/products"><Button variant="primary">Add Products</Button></Link><Link href="/dashboard/store"><Button variant="secondary">View Store</Button></Link></div></section> : <>
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]"><div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Revenue performance</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Revenue over time</h2></div><span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">{selectedRange.label}</span></div>{report.points.some((point) => point.revenue > 0) ? <div className="mt-5"><PerformanceChart points={report.points} kind="revenue" /></div> : <p className="mt-10 text-center text-sm text-[var(--muted)]">Not enough revenue activity in this date range.</p>}</div><div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6"><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Order performance</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Order status</h2><div className="mt-5 space-y-3"><div className="flex items-center justify-between rounded-[0.875rem] bg-emerald-50 px-3 py-3"><span className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" />Completed</span><strong className="text-emerald-800">{report.completed}</strong></div><div className="flex items-center justify-between rounded-[0.875rem] bg-amber-50 px-3 py-3"><span className="flex items-center gap-2 text-sm text-amber-800"><Clock3 className="h-4 w-4" />Pending</span><strong className="text-amber-800">{report.pending}</strong></div>{report.cancelled > 0 ? <div className="flex items-center justify-between rounded-[0.875rem] bg-rose-50 px-3 py-3"><span className="flex items-center gap-2 text-sm text-rose-800"><CircleAlert className="h-4 w-4" />Cancelled</span><strong className="text-rose-800">{report.cancelled}</strong></div> : null}</div><div className="mt-6 border-t border-[var(--border)] pt-5"><p className="text-xs text-[var(--muted)]">Orders over time</p><div className="mt-3"><PerformanceChart points={report.points} kind="orders" /></div></div></div></section>
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]"><div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm"><div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Product performance</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Products generating revenue</h2></div><Package className="h-5 w-5 text-[var(--primary)]" /></div>{report.productReport.length ? <div className="overflow-x-auto"><table className="min-w-[560px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"><tr><th className="px-5 py-3 font-semibold">Product</th><th className="px-5 py-3 font-semibold">Units sold</th><th className="px-5 py-3 font-semibold">Orders</th><th className="px-5 py-3 text-right font-semibold">Revenue</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{report.productReport.map((product) => <tr key={product.id}><td className="max-w-[220px] px-5 py-4"><p className="truncate font-semibold text-[var(--text)]">{product.name}</p><div className="mt-2 h-1.5 max-w-[180px] overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${Math.max((product.revenue / maxProductRevenue) * 100, 4)}%` }} /></div></td><td className="px-5 py-4 text-[var(--muted)]">{product.units}</td><td className="px-5 py-4 text-[var(--muted)]">{product.orders}</td><td className="px-5 py-4 text-right font-semibold text-[var(--text)]">{currency(product.revenue)}</td></tr>)}</tbody></table></div> : <p className="p-6 text-sm text-[var(--muted)]">No product sales in this date range.</p>}</div><div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Customer performance</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Customer contribution</h2><div className="mt-5 space-y-3"><div className="rounded-[0.875rem] bg-[var(--primary-soft)] p-4"><p className="text-xs text-[var(--muted)]">Total customers</p><p className="mt-1 text-2xl font-semibold text-[var(--text)]">{customerCount}</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><div className="rounded-[0.875rem] border border-[var(--border)] p-3"><p className="text-xs text-[var(--muted)]">New customers</p><p className="mt-1 text-lg font-semibold text-[var(--text)]">{report.newCustomers}</p></div><div className="rounded-[0.875rem] border border-[var(--border)] p-3"><p className="text-xs text-[var(--muted)]">Returning customers</p><p className="mt-1 text-lg font-semibold text-[var(--text)]">{report.returningCustomers}</p></div></div><p className="pt-2 text-xs leading-5 text-[var(--muted)]">Customer contribution is based on orders attributed to customers in this store.</p></div></div></section>
      <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Evidence-based analysis</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Performance Insights</h2></div><BarChart3 className="h-5 w-5 text-[var(--primary)]" /></div><div className="mt-5 grid gap-3 md:grid-cols-2">{revenueChange !== null ? <Insight icon={revenueChange >= 0 ? ArrowUpRight : ArrowDownRight} title={`Revenue ${revenueChange >= 0 ? "increased" : "decreased"}`} detail={`${Math.abs(revenueChange).toFixed(1)}% compared with the previous ${selectedRange.label.toLowerCase()}.`} positive={revenueChange >= 0} /> : null}{report.productReport[0] ? <Insight icon={Package} title="Best-performing product" detail={`${report.productReport[0].name} generated ${currency(report.productReport[0].revenue)} in this period.`} positive /> : null}{report.periodOrders.length > 0 ? <Insight icon={ShoppingCart} title="Order volume" detail={`${report.periodOrders.length} orders were recorded in ${selectedRange.label.toLowerCase()}, including ${report.completed} completed.`} /> : null}{report.cancelled > 0 ? <Insight icon={CircleAlert} title="Cancelled order activity" detail={`${report.cancelled} cancelled or refunded orders were recorded in this period.`} /> : null}</div></section>
    </>}
  </div>;
}

