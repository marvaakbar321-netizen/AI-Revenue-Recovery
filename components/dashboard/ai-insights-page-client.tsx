"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  DollarSign,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAIInsights, type AIInsightsData } from "@/hooks/useAIInsights";
import { formatCurrency } from "@/lib/store-utils";
import { Button } from "@/components/ui/button";

type Category = "Revenue Opportunity" | "Product Performance" | "Customer Behavior" | "Order Trends" | "Revenue Risk";
type Filter = "All" | Category;
type Impact = "High" | "Medium" | "Low";
type Insight = { id: string; category: Category; title: string; explanation: string; metric: string; impact: Impact; action: string; details: string };
type Action = { priority: "P1" | "P2"; title: string; reason: string; impact: string; insightId?: string };
type TrendPoint = { label: string; revenue: number; orders: number };
type ProductPoint = { name: string; revenue: number; share: number };
type Analysis = {
  insights: Insight[];
  actions: Action[];
  observations: string[];
  trend: TrendPoint[];
  products: ProductPoint[];
  summary: { revenue: number; orders: number; averageOrderValue: number; trend: number | null };
};

const filters: Filter[] = ["All", "Revenue Opportunity", "Product Performance", "Customer Behavior", "Order Trends", "Revenue Risk"];
const currency = (value: number) => formatCurrency(value);
const isRevenueOrder = (status: string) => !["cancelled", "canceled", "refunded"].includes(status.toLowerCase());

function buildTrend(orders: AIInsightsData["orders"]): TrendPoint[] {
  const dates = orders.map((order) => new Date(order.created_at).getTime()).filter(Number.isFinite);
  if (dates.length < 2 || Math.max(...dates) - Math.min(...dates) < 7 * 86400000) return [];
  const latest = Math.max(...dates);
  const result: TrendPoint[] = [];
  for (let index = 7; index >= 0; index -= 1) {
    const end = latest - index * 7 * 86400000;
    const start = end - 7 * 86400000;
    const bucket = orders.filter((order) => {
      const created = new Date(order.created_at).getTime();
      return isRevenueOrder(order.status) && created > start && created <= end;
    });
    result.push({ label: new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric" }), revenue: bucket.reduce((sum, order) => sum + Number(order.total || 0), 0), orders: bucket.length });
  }
  return result.some((point) => point.revenue > 0) ? result : [];
}

function buildAnalysis(data: AIInsightsData): Analysis {
  const orders = data.orders.filter((order) => isRevenueOrder(order.status));
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const averageOrderValue = orders.length ? revenue / orders.length : 0;
  const insights: Insight[] = [];
  const actions: Action[] = [];
  const now = Date.now();
  const recent = orders.filter((order) => now - new Date(order.created_at).getTime() <= 30 * 86400000);
  const previous = orders.filter((order) => { const age = now - new Date(order.created_at).getTime(); return age > 30 * 86400000 && age <= 60 * 86400000; });
  const recentRevenue = recent.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const previousRevenue = previous.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const trend = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : null;

  if (trend !== null) {
    const direction = trend >= 0 ? "up" : "down";
    insights.push({ id: "revenue-trend", category: trend >= 0 ? "Revenue Opportunity" : "Revenue Risk", title: `Revenue is ${direction} ${Math.abs(trend).toFixed(1)}%`, explanation: `The latest 30-day revenue is ${direction} compared with the preceding 30-day period.`, metric: `${currency(recentRevenue)} in the latest 30 days`, impact: Math.abs(trend) >= 20 ? "High" : "Medium", action: trend < 0 ? "Investigate the recent revenue decline." : "Build on the products driving this momentum.", details: `Your store recorded ${currency(recentRevenue)} in the latest 30-day period and ${currency(previousRevenue)} in the previous period.` });
  }

  const totals = new Map<string, number>();
  data.orderItems.forEach((item) => {
    const order = data.orders.find((candidate) => candidate.id === item.order_id);
    if (order && isRevenueOrder(order.status)) totals.set(item.product_id, (totals.get(item.product_id) ?? 0) + Number(item.total || 0));
  });
  const products = [...totals.entries()].map(([id, amount]) => ({ name: data.products.find((product) => product.id === id)?.name ?? "", revenue: amount, share: revenue > 0 ? (amount / revenue) * 100 : 0 })).filter((product) => product.name).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const bestProduct = products[0];
  if (bestProduct) insights.push({ id: "best-product", category: "Product Performance", title: `${bestProduct.name} leads product revenue`, explanation: "This product has generated more recorded order-item revenue than any other product in your store.", metric: `${currency(bestProduct.revenue)} · ${bestProduct.share.toFixed(1)}% of revenue`, impact: "High", action: "Keep this product visible and review its stock level.", details: `${bestProduct.name} contributed ${currency(bestProduct.revenue)} across the orders currently recorded for this store.` });

  const customerOrders = new Map<string, number>();
  orders.forEach((order) => customerOrders.set(order.customer_id, (customerOrders.get(order.customer_id) ?? 0) + 1));
  const repeatCustomers = [...customerOrders.values()].filter((count) => count > 1).length;
  if (data.customerCount > 0 && orders.length >= 2) {
    const repeatRate = (repeatCustomers / data.customerCount) * 100;
    insights.push({ id: "customer-repeat", category: "Customer Behavior", title: repeatCustomers > 0 ? "Repeat customers are contributing to revenue" : "No repeat purchases recorded yet", explanation: repeatCustomers > 0 ? "Some customers have placed more than one recorded order." : "Your current order history contains no customer with more than one order.", metric: `${repeatRate.toFixed(1)}% repeat customer rate`, impact: repeatCustomers > 0 ? "Medium" : "Low", action: repeatCustomers > 0 ? "Identify repeat-purchase products and promote them." : "Plan a first-to-second purchase journey.", details: `${repeatCustomers} of ${data.customerCount} customers have placed more than one recorded order.` });
  }

  const openOrders = data.orders.filter((order) => ["pending", "processing", "paid"].includes(order.status.toLowerCase()));
  if (openOrders.length) {
    const openValue = openOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    insights.push({ id: "open-orders", category: "Order Trends", title: "Orders need fulfillment attention", explanation: "These orders are still in an open status and may need an operational follow-up.", metric: `${openOrders.length} open orders · ${currency(openValue)}`, impact: openOrders.length >= 5 ? "High" : "Medium", action: "Review open orders and update their status.", details: `${openOrders.length} orders currently have pending, processing, or paid status, representing ${currency(openValue)} in order value.` });
  }

  const failedPayments = data.orders.filter((order) => ["failed", "declined", "unpaid"].includes(order.payment_status.toLowerCase()));
  if (failedPayments.length) {
    const failedValue = failedPayments.reduce((sum, order) => sum + Number(order.total || 0), 0);
    insights.push({ id: "payment-issues", category: "Revenue Risk", title: "Payment issues may be blocking orders", explanation: "Some recorded orders have a failed or unpaid payment status.", metric: `${failedPayments.length} affected orders · ${currency(failedValue)}`, impact: "High", action: "Review affected orders and contact customers where appropriate.", details: `${failedPayments.length} orders with ${currency(failedValue)} in recorded value have failed, declined, or unpaid payment status.` });
  }

  const lowStockBestSeller = bestProduct && data.products.find((product) => product.name === bestProduct.name && product.active && product.stock <= 5);
  if (lowStockBestSeller) insights.push({ id: "stock-opportunity", category: "Revenue Risk", title: "Your leading product is low on stock", explanation: "The product currently contributing the most item revenue has five or fewer units available.", metric: `${bestProduct.name} · ${lowStockBestSeller.stock} units`, impact: "High", action: "Review inventory before promoting this product further.", details: `${bestProduct.name} is the leading product by recorded item revenue and its current stock is at or below five units.` });

  if (insights.some((insight) => insight.id === "payment-issues")) actions.push({ priority: "P1", title: "Review failed payments", reason: "Unpaid or failed orders can prevent recorded demand from becoming revenue.", impact: "Review affected order value", insightId: "payment-issues" });
  if (insights.some((insight) => insight.id === "stock-opportunity")) actions.push({ priority: "P1", title: "Protect best-seller availability", reason: "Your leading product has limited stock.", impact: "Preserve future product revenue", insightId: "stock-opportunity" });
  if (insights.some((insight) => insight.id === "open-orders")) actions.push({ priority: "P2", title: "Clear open orders", reason: "Orders are waiting in an open fulfillment state.", impact: "Improve fulfillment visibility", insightId: "open-orders" });
  if (trend !== null && trend < 0) actions.push({ priority: "P2", title: "Investigate the recent revenue decline", reason: "The latest 30-day revenue is below the prior 30-day period.", impact: "Recover declining revenue", insightId: "revenue-trend" });

  const observations = [
    trend !== null ? `Revenue is ${trend >= 0 ? "up" : "down"} ${Math.abs(trend).toFixed(1)}% versus the previous 30 days.` : null,
    bestProduct ? `${bestProduct.name} is the leading product by recorded item revenue.` : null,
    data.customerCount > 0 ? `${repeatCustomers} of ${data.customerCount} customers have placed more than one order.` : null,
    failedPayments.length ? `${failedPayments.length} order${failedPayments.length === 1 ? " has" : "s have"} a failed or unpaid payment status.` : null,
  ].filter((observation): observation is string => Boolean(observation)).slice(0, 4);

  return { insights, actions, observations, trend: buildTrend(orders), products, summary: { revenue, orders: orders.length, averageOrderValue, trend } };
}

function MetricCard({ label, value, supporting, trend, icon: Icon }: { label: string; value: string; supporting: string; trend: number | null; icon: LucideIcon }) {
  return <div className="relative overflow-hidden rounded-[1.125rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_14px_35px_-28px_rgba(50,35,110,0.45)]"><div className="absolute inset-y-0 left-0 w-1 bg-[var(--primary-soft)]" /><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p><p className="mt-2 truncate text-2xl font-semibold tracking-tight text-[var(--text)]">{value}</p><p className="mt-1 truncate text-xs text-[var(--muted)]">{supporting}</p></div><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] bg-[var(--primary-soft)] text-[var(--primary)]"><Icon className="h-4 w-4" /></div></div>{trend !== null ? <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{trend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{Math.abs(trend).toFixed(1)}% vs previous 30 days</div> : <p className="mt-3 text-[0.68rem] text-[var(--muted)]">Historical change unavailable</p>}</div>;
}

function Skeleton() {
  return <div className="space-y-5" aria-label="Loading insights"><div className="h-28 animate-pulse rounded-[1.25rem] bg-slate-100" /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-[1.125rem] bg-slate-100" />)}</div><div className="h-56 animate-pulse rounded-[1.25rem] bg-slate-100" /><div className="grid gap-3 lg:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-48 animate-pulse rounded-[1.125rem] bg-slate-100" />)}</div></div>;
}

function Impact({ impact }: { impact: Impact }) {
  const styles = impact === "High" ? "bg-rose-50 text-rose-700" : impact === "Medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700";
  return <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${styles}`}>{impact} priority</span>;
}

function Analytics({ trend, products }: { trend: TrendPoint[]; products: ProductPoint[] }) {
  const maxRevenue = Math.max(...trend.map((point) => point.revenue), 1);
  return <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]"><div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Analytics</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Revenue trend</h2></div><TrendingUp className="h-5 w-5 text-[var(--primary)]" /></div><div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">{trend.map((point) => <div key={point.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"><div className="w-full rounded-t-md bg-gradient-to-t from-[#7C5CFC] to-[#C8B9FF]" style={{ height: `${Math.max((point.revenue / maxRevenue) * 100, point.revenue > 0 ? 8 : 2)}%` }} title={`${point.label}: ${currency(point.revenue)}`} /><span className="truncate text-[0.65rem] text-[var(--muted)]">{point.label}</span></div>)}</div><p className="mt-4 text-xs text-[var(--muted)]">Weekly revenue from recorded orders</p></div><div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Product performance</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Leading products</h2><div className="mt-5 space-y-4">{products.map((product) => <div key={product.name}><div className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate font-medium text-[var(--text)]">{product.name}</span><span className="shrink-0 font-semibold text-[var(--text)]">{currency(product.revenue)}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${Math.max(product.share, 4)}%` }} /></div></div>)}</div></div></section>;
}

function InsightDrawer({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="insight-detail-title"><div className="flex h-full w-full max-w-xl flex-col overflow-y-auto rounded-[1.35rem] bg-[var(--surface)] shadow-2xl"><div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-5"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">{insight.category}</p><h2 id="insight-detail-title" className="mt-2 text-xl font-semibold text-[var(--text)]">{insight.title}</h2></div><button type="button" aria-label="Close insight details" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-[0.75rem] border border-[var(--border)] text-[var(--muted)] hover:bg-slate-50"><X className="h-4 w-4" /></button></div><div className="space-y-5 p-5"><div className="rounded-[1rem] bg-[var(--primary-soft)] p-5"><p className="text-sm leading-7 text-[var(--text)]">{insight.details}</p><p className="mt-4 text-2xl font-semibold text-[var(--primary)]">{insight.metric}</p></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Why it matters</p><p className="mt-2 text-sm leading-7 text-[var(--muted)]">This observation is calculated from the orders, products, customers, and order items currently associated with your store.</p></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Recommended action</p><p className="mt-2 text-sm leading-7 text-[var(--text)]">{insight.action}</p></div></div></div></div>;
}

export function AIInsightsPageClient() {
  const data = useAIInsights();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
    const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const baseAnalysis = useMemo(() => buildAnalysis(data), [data]);
  const aiIsCurrent = Boolean(data.aiAnalysis && !data.analysisStale);
  const displayedInsights: Insight[] = aiIsCurrent
    ? data.aiAnalysis!.insights.map((insight, index) => ({ id: `ai-${index}-${insight.title}`, category: insight.category, title: insight.title, explanation: insight.description, metric: insight.impact, impact: insight.priority === "high" ? "High" : insight.priority === "medium" ? "Medium" : "Low", action: "Review this evidence-backed recommendation.", details: insight.description }))
    : baseAnalysis.insights;
  const displayedActions: Action[] = aiIsCurrent
    ? data.aiAnalysis!.recommendations.map((recommendation) => ({ priority: recommendation.priority === "high" ? "P1" : "P2", title: recommendation.title, reason: recommendation.reason, impact: recommendation.expectedImpact }))
    : baseAnalysis.actions;
  const displayedObservations = aiIsCurrent ? [data.aiAnalysis!.executiveSummary, ...data.aiAnalysis!.observations] : baseAnalysis.observations;
  const analysis = { ...baseAnalysis, insights: displayedInsights, actions: displayedActions };
  const filteredInsights = displayedInsights.filter((insight) => {
    const query = search.trim().toLowerCase();
    return (filter === "All" || insight.category === filter) && (!query || `${insight.title} ${insight.explanation} ${insight.action}`.toLowerCase().includes(query));
  });

  if (data.loading) return <Skeleton />;

  return <div className="space-y-5">
    {aiIsCurrent && data.analysisGeneratedAt ? <p className="text-right text-xs text-[var(--muted)]">Last analyzed: {new Date(data.analysisGeneratedAt).toLocaleString()}</p> : null}
    <section className="flex flex-col gap-4 rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(110deg,#ffffff_0%,#fbf9ff_72%,#f4edff_100%)] px-5 py-5 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--primary)]">AI REVENUE INTELLIGENCE</span>{aiIsCurrent ? <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[0.65rem] font-semibold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />AI Analysis Ready</span> : <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[0.65rem] font-semibold text-amber-700">Analysis not run</span>}</div><h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">AI Insights</h1><p className="mt-1 text-sm text-[var(--muted)]">Turn your store activity into clear insights and prioritized actions.</p></div><Button variant="secondary" disabled={data.analyzing || data.loading} className="w-full shrink-0 sm:w-auto" onClick={() => void data.analyze()}><RefreshCw className={`mr-2 h-4 w-4 ${data.analyzing ? "animate-spin" : ""}`} />{data.analyzing ? "Analyzing..." : "Refresh Analysis"}</Button></section>
    {data.error ? <div className="flex flex-col gap-3 rounded-[1rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"><span>We could not load your store analysis. Your data was not changed.</span><Button variant="secondary" onClick={() => void data.refresh()}>Retry</Button></div> : null}
    {data.analysisError ? <div className="flex flex-col gap-3 rounded-[1rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"><span>{data.analysisError}</span><Button variant="secondary" onClick={() => void data.analyze()}>Retry Analysis</Button></div> : null}
    {data.analyzing ? <div className="rounded-[1rem] border border-[var(--primary)]/20 bg-[var(--primary-soft)] px-4 py-3 text-sm text-[var(--text)]"><p className="font-semibold">Analyzing your store...</p><p className="mt-1 text-xs text-[var(--muted)]">Reviewing revenue, orders, products and customer activity.</p></div> : null}
    {data.analysisStale && data.aiAnalysis && !data.analyzing ? <div className="flex flex-col gap-3 rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between"><span>New store activity detected — Refresh analysis.</span><Button variant="secondary" onClick={() => void data.analyze()}>Refresh Analysis</Button></div> : null}
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><MetricCard label="Revenue" value={currency(analysis.summary.revenue)} supporting="Recorded revenue" trend={analysis.summary.trend} icon={DollarSign} /><MetricCard label="Orders" value={String(analysis.summary.orders)} supporting="Revenue-generating orders" trend={analysis.summary.trend} icon={ShoppingCart} /><MetricCard label="Customers" value={String(data.customerCount)} supporting="Customers in your store" trend={null} icon={Users} /><MetricCard label="Average Order Value" value={currency(analysis.summary.averageOrderValue)} supporting="Revenue per order" trend={analysis.summary.trend} icon={BarChart3} /></section>

    {analysis.summary.orders === 0 ? <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center shadow-sm"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]"><Sparkles className="h-5 w-5" /></div><h2 className="mt-4 text-lg font-semibold text-[var(--text)]">Not enough store activity yet</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">Once your store receives orders, AI Revenue will analyze your activity and surface opportunities, risks, and recommended actions.</p></section> : <>
      <section className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.875rem] bg-[var(--primary)] text-white"><Sparkles className="h-5 w-5" /></div><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold text-[var(--text)]">AI Executive Summary</h2><span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[0.65rem] font-semibold text-[var(--primary)]">{aiIsCurrent ? "Generated from your store data" : "Rule-based store analysis"}</span></div><p className="mt-1 text-sm text-[var(--muted)]">A concise readout of the strongest signals in your current activity.</p></div></div><span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600"><Check className="h-3.5 w-3.5" />{aiIsCurrent ? "Analysis current" : "Awaiting analysis"}</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{displayedObservations.length ? displayedObservations.map((observation) => <div key={observation} className="flex items-start gap-2 rounded-[0.875rem] bg-slate-50 px-3 py-3 text-sm leading-6 text-[var(--text)]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />{observation}</div>) : <p className="text-sm text-[var(--muted)]">There are not enough signals to summarize yet.</p>}</div></section>
      {analysis.trend.length > 0 && analysis.products.length > 0 ? <Analytics trend={analysis.trend} products={analysis.products} /> : null}
      <section className="space-y-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Signal library</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">AI Insights</h2><p className="mt-1 text-sm text-[var(--muted)]">Evidence-backed signals from your current store activity.</p></div><div className="relative w-full lg:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search insights" className="h-10 w-full rounded-[0.75rem] border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm outline-none focus:border-[var(--primary)]" /></div></div><div className="flex max-w-full gap-2 overflow-x-auto pb-1">{filters.map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === item ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-slate-50"}`}>{item}</button>)}</div><div className="grid gap-3 lg:grid-cols-2">{filteredInsights.length ? filteredInsights.map((insight) => <article key={insight.id} className="rounded-[1.125rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-[var(--primary)]/40 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] bg-[var(--primary-soft)] text-[var(--primary)]"><Sparkles className="h-4 w-4" /></div><div className="min-w-0"><p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--primary)]">{insight.category}</p><h3 className="mt-1 text-base font-semibold leading-6 text-[var(--text)]">{insight.title}</h3></div></div><Impact impact={insight.impact} /></div><p className="mt-4 text-sm leading-6 text-[var(--muted)]">{insight.explanation}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4"><div><p className="text-xs text-[var(--muted)]">Business impact</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">{insight.metric}</p></div><button type="button" onClick={() => setSelectedInsight(insight)} className="inline-flex items-center text-sm font-semibold text-[var(--primary)]">View Details<ChevronRight className="ml-1 h-4 w-4" /></button></div></article>) : <div className="rounded-[1.125rem] border border-dashed border-[var(--border)] bg-[var(--surface)] p-7 text-sm text-[var(--muted)] lg:col-span-2">No insights match this filter.</div>}</div></section>
      <section className="space-y-4"><div><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Next best actions</p><h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Recommended Actions</h2><p className="mt-1 text-sm text-[var(--muted)]">Prioritized actions derived from the same store signals.</p></div><div className="grid gap-3">{analysis.actions.length ? analysis.actions.map((action) => <div key={action.title} className="flex flex-col gap-4 rounded-[1.125rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:flex-row sm:items-center"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] text-xs font-bold ${action.priority === "P1" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{action.priority}</div><div className="min-w-0 flex-1"><h3 className="font-semibold text-[var(--text)]">{action.title}</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{action.reason}</p></div><div className="sm:max-w-[190px]"><p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Expected impact</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">{action.impact}</p></div><Button variant="secondary" className="shrink-0" onClick={() => action.insightId && setSelectedInsight(analysis.insights.find((insight) => insight.id === action.insightId) ?? null)}>Review<ChevronRight className="ml-2 h-4 w-4" /></Button></div>) : <div className="rounded-[1.125rem] border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">No priority actions detected from the current activity.</div>}</div></section>
    </>}
    {selectedInsight ? <InsightDrawer insight={selectedInsight} onClose={() => setSelectedInsight(null)} /> : null}
  </div>;
}
