"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Search,
  X,
  TrendingDown,
  ShoppingCart,
  Package,
  Repeat,
  CheckCircle2,
  Clock3,
  CircleDot,
  Sparkles,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useStore } from "@/lib/store-context";
import { useOrders, type OrderRow } from "@/hooks/useOrders";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatCurrency } from "@/lib/store-utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/status-badge";

type Severity = "Critical" | "High" | "Medium" | "Low";
type Status = "Open" | "In Progress" | "Resolved";
type Category = "Checkout" | "Orders" | "Products" | "Customer retention" | "Store performance";

type Problem = {
  id: string;
  title: string;
  category: Category;
  severity: Severity;
  estimatedImpact: number;
  evidence: string;
  whyItMatters: string;
  recommendation: string;
  affected: { orders?: number; customers?: number; products?: number };
  detectedAt: string;
};

const STATUSES: Status[] = ["Open", "In Progress", "Resolved"];

function severityVariant(s: Severity): "danger" | "warning" | "info" | "default" {
  switch (s) {
    case "Critical": return "danger";
    case "High": return "warning";
    case "Medium": return "info";
    case "Low": return "default";
  }
}

function statusVariant(s: Status): "danger" | "warning" | "success" {
  switch (s) {
    case "Open": return "danger";
    case "In Progress": return "warning";
    case "Resolved": return "success";
  }
}

function StatusIcon({ s }: { s: Status }) {
  if (s === "Resolved") return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (s === "In Progress") return <Clock3 className="h-3.5 w-3.5" />;
  return <CircleDot className="h-3.5 w-3.5" />;
}

function statusKey(storeId: string | undefined | null) {
  return storeId ? `rr_problem_status:${storeId}` : null;
}

function loadStatuses(storeId: string | undefined | null): Record<string, Status> {
  if (typeof window === "undefined" || !storeId) return {};
  try {
    const raw = window.localStorage.getItem(statusKey(storeId) ?? "");
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Status>;
  } catch {
    return {};
  }
}

function saveStatuses(storeId: string | undefined | null, value: Record<string, Status>) {
  if (typeof window === "undefined" || !storeId) return;
  try {
    window.localStorage.setItem(statusKey(storeId) ?? "", JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

type OrderStats = {
  total: number;
  cancelled: number;
  pending: number;
  totalRevenue: number;
  cancelledRevenue: number;
  pendingRevenue: number;
  paidRevenue: number;
  avgOrderValue: number;
  uniqueCustomers: number;
  returningCustomers: number;
  topCustomerShare: number;
};

function summarize(orders: OrderRow[]): OrderStats {
  const total = orders.length;
  const cancelled = orders.filter((o) => (o.status || "").toLowerCase() === "cancelled").length;
  const pending = orders.filter((o) => {
    const s = (o.status || "").toLowerCase();
    return s === "pending" || s === "processing";
  }).length;
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total ?? 0), 0);
  const cancelledRevenue = orders
    .filter((o) => (o.status || "").toLowerCase() === "cancelled")
    .reduce((s, o) => s + Number(o.total ?? 0), 0);
  const pendingRevenue = orders
    .filter((o) => {
      const s = (o.status || "").toLowerCase();
      return s === "pending" || s === "processing";
    })
    .reduce((s, o) => s + Number(o.total ?? 0), 0);
  const paidRevenue = orders
    .filter((o) => {
      const s = (o.status || "").toLowerCase();
      return s !== "cancelled";
    })
    .reduce((s, o) => s + Number(o.total ?? 0), 0);
  const avgOrderValue = total > 0 ? totalRevenue / total : 0;

  const counts = new Map<string, { count: number; total: number }>();
  orders.forEach((o) => {
    const key = (o.customer_email || "").toLowerCase() || `unknown-${o.id}`;
    const cur = counts.get(key) ?? { count: 0, total: 0 };
    cur.count += 1;
    cur.total += Number(o.total ?? 0);
    counts.set(key, cur);
  });
  const uniqueCustomers = counts.size;
  const returningCustomers = Array.from(counts.values()).filter((c) => c.count > 1).length;
  const topCustomerShare = paidRevenue > 0
    ? Math.max(0, ...Array.from(counts.values()).map((c) => c.total)) / paidRevenue
    : 0;

  return {
    total,
    cancelled,
    pending,
    totalRevenue,
    cancelledRevenue,
    pendingRevenue,
    paidRevenue,
    avgOrderValue,
    uniqueCustomers,
    returningCustomers,
    topCustomerShare,
  };
}

function detectProblems(stats: OrderStats, productsCount: number): Problem[] {
  const problems: Problem[] = [];
  const nowIso = new Date().toISOString();

  if (stats.cancelled > 0 && stats.total >= 3) {
    problems.push({
      id: "cancelled-orders",
      title: "Cancelled orders",
      category: "Orders",
      severity: stats.cancelled / Math.max(1, stats.total) > 0.2 ? "Critical" : "High",
      estimatedImpact: stats.cancelledRevenue,
      evidence: `${stats.cancelled} of ${stats.total} orders are cancelled, totaling ${formatCurrency(stats.cancelledRevenue)}.`,
      whyItMatters: "Cancelled orders reduce realized revenue and may indicate checkout, payment, or fulfillment issues.",
      recommendation: "Review cancelled orders to identify common reasons (payment failure, address issue, stock-out) and fix the top cause.",
      affected: { orders: stats.cancelled },
      detectedAt: nowIso,
    });
  }

  if (stats.pending > 0 && stats.total >= 2) {
    problems.push({
      id: "stuck-pending-orders",
      title: "Orders stuck in pending or processing",
      category: "Orders",
      severity: stats.pending / Math.max(1, stats.total) > 0.3 ? "High" : "Medium",
      estimatedImpact: stats.pendingRevenue,
      evidence: `${stats.pending} of ${stats.total} orders are still pending or processing (${formatCurrency(stats.pendingRevenue)}).`,
      whyItMatters: "Unfulfilled orders delay cash flow and risk cancellations if they age too long.",
      recommendation: "Confirm payment status and ship outstanding orders, or contact the customer to complete the order.",
      affected: { orders: stats.pending },
      detectedAt: nowIso,
    });
  }

  if (stats.uniqueCustomers > 0 && stats.returningCustomers === 0 && stats.uniqueCustomers >= 3) {
    problems.push({
      id: "no-repeat-customers",
      title: "No repeat customers yet",
      category: "Customer retention",
      severity: "High",
      estimatedImpact: stats.totalRevenue * 0.2,
      evidence: `${stats.uniqueCustomers} unique customers have placed ${stats.total} orders, but none have ordered again.`,
      whyItMatters: "Repeat customers typically drive a large share of revenue; without them, growth depends on constant new acquisition.",
      recommendation: "Set up a post-purchase follow-up, a small loyalty incentive, or a relevant second-purchase offer.",
      affected: { customers: stats.uniqueCustomers },
      detectedAt: nowIso,
    });
  }

  if (stats.topCustomerShare > 0.6 && stats.uniqueCustomers >= 2) {
    problems.push({
      id: "revenue-concentration",
      title: "Revenue is concentrated in a single customer",
      category: "Store performance",
      severity: "Medium",
      estimatedImpact: stats.paidRevenue * stats.topCustomerShare,
      evidence: `One customer accounts for ${(stats.topCustomerShare * 100).toFixed(0)}% of paid revenue.`,
      whyItMatters: "Heavy reliance on a single customer is risky — losing them would significantly drop revenue.",
      recommendation: "Broaden outreach, refresh your product mix, and add a couple of entry-point offers to attract more buyers.",
      affected: { customers: 1 },
      detectedAt: nowIso,
    });
  }

  if (stats.total >= 1 && stats.avgOrderValue > 0 && stats.avgOrderValue < 25) {
    problems.push({
      id: "low-average-order",
      title: "Average order value is low",
      category: "Checkout",
      severity: "Medium",
      estimatedImpact: 0,
      evidence: `Average order value is ${formatCurrency(stats.avgOrderValue)} across ${stats.total} orders.`,
      whyItMatters: "Raising AOV is usually the fastest lever to grow revenue without acquiring more customers.",
      recommendation: "Add bundle offers, a free-shipping threshold, or a relevant upsell at checkout.",
      affected: { orders: stats.total },
      detectedAt: nowIso,
    });
  }

  if (productsCount === 0 && stats.total > 0) {
    problems.push({
      id: "no-products-listed",
      title: "No products available in your store",
      category: "Products",
      severity: "Critical",
      estimatedImpact: stats.totalRevenue * 0.3,
      evidence: "Your store has no products listed, but orders have been recorded.",
      whyItMatters: "Without an active product catalog, new visitors cannot purchase, and revenue will stop.",
      recommendation: "Add at least your best-selling products with photos, prices, and stock counts.",
      affected: { products: 0 },
      detectedAt: nowIso,
    });
  }

  return problems;
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  description,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  tone?: "default" | "danger" | "warning";
}) {
  const toneClasses = {
    default: "bg-[var(--primary-soft)] text-[var(--primary)]",
    danger: "bg-red-100 text-red-600",
    warning: "bg-amber-100 text-amber-600",
  }[tone];

  return (
    <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
          {description ? <p className="mt-1 text-xs text-[var(--muted)]">{description}</p> : null}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.875rem] ${toneClasses}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function CategoryIcon({ category }: { category: Category }) {
  const cls = "h-3.5 w-3.5";
  if (category === "Checkout") return <ShoppingCart className={cls} />;
  if (category === "Orders") return <Package className={cls} />;
  if (category === "Products") return <Package className={cls} />;
  if (category === "Customer retention") return <Repeat className={cls} />;
  return <TrendingDown className={cls} />;
}

function ProblemDetailsDrawer({
  problem,
  status,
  onClose,
  onStatusChange,
}: {
  problem: Problem | null;
  status: Status;
  onClose: () => void;
  onStatusChange: (s: Status) => void;
}) {
  if (!problem) return null;
  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-slate-950/40 px-4 py-6">
      <div className="relative ml-auto flex h-full w-full max-w-3xl flex-col overflow-y-auto rounded-[1.5rem] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Revenue problem</p>
            <h2 className="mt-1 truncate text-xl font-semibold text-[var(--text)]">{problem.title}</h2>
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
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              problem.severity === "Critical" ? "bg-red-100 text-red-700" :
              problem.severity === "High" ? "bg-amber-100 text-amber-700" :
              problem.severity === "Medium" ? "bg-blue-100 text-blue-700" :
              "bg-slate-100 text-slate-700"
            }`}>
              {problem.severity}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-slate-50 px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
              <CategoryIcon category={problem.category} />
              {problem.category}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              status === "Resolved" ? "bg-emerald-100 text-emerald-700" :
              status === "In Progress" ? "bg-amber-100 text-amber-700" :
              "bg-red-100 text-red-700"
            }`}>
              <StatusIcon s={status} />
              {status}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Estimated impact</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                {problem.estimatedImpact > 0 ? formatCurrency(problem.estimatedImpact) : "—"}
              </p>
            </div>
            <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Affected orders</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text)]">{problem.affected.orders ?? 0}</p>
            </div>
            <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Affected customers</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text)]">{problem.affected.customers ?? 0}</p>
            </div>
            <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Affected products</p>
              <p className="mt-1 text-lg font-semibold text-[var(--text)]">{problem.affected.products ?? 0}</p>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--border)] bg-slate-50 p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Why this matters</p>
            <p className="mt-2 text-sm text-[var(--text)]">{problem.whyItMatters}</p>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--border)] bg-slate-50 p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Evidence from your store</p>
            <p className="mt-2 text-sm text-[var(--text)]">{problem.evidence}</p>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--primary)]/20 bg-[var(--primary-soft)] p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Recommended action</p>
            </div>
            <p className="mt-2 text-sm text-[var(--text)]">{problem.recommendation}</p>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-sm font-semibold text-[var(--text)]">Update status</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">Track this problem as you work on it.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(s)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    status === s
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-[var(--border)] bg-white text-[var(--text)] hover:bg-slate-50"
                  }`}
                >
                  <StatusIcon s={s} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FilterValue = "all" | Severity | Status;

export function RevenueProblemsPageClient() {
  const { user } = useAuth();
  const { store, loading: storeLoading } = useStore();
  const { orders, loading: ordersLoading, error: ordersError, refresh } = useOrders();
  const stats = useDashboardStats(orders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sortKey, setSortKey] = useState<"impact" | "severity" | "recent">("impact");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [selected, setSelected] = useState<Problem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!store?.id) return;
    setStatuses(loadStatuses(store.id));
  }, [store?.id]);

  const updateStatus = (id: string, s: Status) => {
    if (!store?.id) return;
    setStatuses((current) => {
      const next = { ...current, [id]: s };
      saveStatuses(store.id, next);
      return next;
    });
  };

  const problems = useMemo(() => {
    const summary = summarize(orders);
    return detectProblems(summary, 0);
  }, [orders]);

  const enriched = useMemo(
    () => problems.map((p) => ({ ...p, status: statuses[p.id] ?? "Open" as Status })),
    [problems, statuses],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = enriched.filter((p) => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      let matchesFilter = true;
      if (filter !== "all") {
        if (["Open", "In Progress", "Resolved"].includes(filter)) {
          matchesFilter = p.status === filter;
        } else {
          matchesFilter = p.severity === filter;
        }
      }
      return matchesQuery && matchesFilter;
    });

    const severityOrder: Record<Severity, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "impact") cmp = a.estimatedImpact - b.estimatedImpact;
      else if (sortKey === "severity") cmp = severityOrder[a.severity] - severityOrder[b.severity];
      else if (sortKey === "recent") cmp = a.detectedAt < b.detectedAt ? -1 : a.detectedAt > b.detectedAt ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [enriched, search, filter, sortKey, sortDir]);

  const summary = useMemo(() => {
    const total = enriched.length;
    const critical = enriched.filter((p) => p.severity === "Critical").length;
    const high = enriched.filter((p) => p.severity === "High").length;
    const impact = enriched.reduce((sum, p) => sum + p.estimatedImpact, 0);
    return { total, critical, high, impact };
  }, [enriched]);

  const handleSort = (k: typeof sortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("desc"); }
  };

  const SortHeader = ({ k, label }: { k: typeof sortKey; label: string }) => (
    <button
      type="button"
      onClick={() => handleSort(k)}
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--text)]"
    >
      {label}
      {sortKey === k ? (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : null}
    </button>
  );

  if (!user) return null;

  const isLoading = !mounted || storeLoading || ordersLoading;
  const noStore = !storeLoading && !store;
  const showEmpty = !isLoading && enriched.length === 0;

  return (
    <Fragment>
      <div className="space-y-6">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Revenue Problems</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">Revenue Problems</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Identify the issues affecting your revenue and focus on the opportunities with the highest impact.
            </p>
          </div>
        </section>

        {noStore ? (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-[var(--text)]">No store yet</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Create your store to start tracking revenue problems.</p>
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
              <SummaryCard
                label="Total Problems"
                value={isLoading ? "—" : String(summary.total)}
                icon={AlertTriangle}
                description="Detected from your store data"
                tone="warning"
              />
              <SummaryCard
                label="Critical"
                value={isLoading ? "—" : String(summary.critical)}
                icon={AlertCircle}
                description="Highest priority"
                tone="danger"
              />
              <SummaryCard
                label="High Impact"
                value={isLoading ? "—" : String(summary.high)}
                icon={TrendingDown}
                description="Severe revenue impact"
                tone="warning"
              />
              <SummaryCard
                label="Estimated revenue at risk"
                value={isLoading ? "—" : formatCurrency(summary.impact)}
                icon={Sparkles}
                description="Sum of estimated impact"
              />
            </section>

            <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-3 rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-3 py-2.5 md:max-w-md">
                  <Search className="h-4 w-4 text-[var(--muted)]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search problems..."
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-slate-400"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterValue)}
                    className="min-h-[44px] rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                  >
                    <option value="all">All</option>
                    <optgroup label="Severity">
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </optgroup>
                    <optgroup label="Status">
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </optgroup>
                  </select>
                  <div className="text-sm text-[var(--muted)]">
                    {filtered.length} problem{filtered.length === 1 ? "" : "s"}
                  </div>
                </div>
              </div>

              {ordersError ? (
                <div className="mt-5 flex flex-col items-start gap-3 rounded-[1rem] border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Failed to load problems</p>
                      <p className="text-xs text-red-700">{ordersError}</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={refresh}>Retry</Button>
                </div>
              ) : null}

              {showEmpty ? (
                <div className="mt-5 rounded-[1.25rem] border border-dashed border-[var(--border)] bg-slate-50 p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-[var(--text)]">No revenue problems yet</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Continue receiving orders and we&apos;ll highlight revenue-impacting issues as patterns emerge.
                  </p>
                </div>
              ) : null}

              {isLoading ? (
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200" />
                        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                      </div>
                      <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              ) : null}

              {!showEmpty && !isLoading ? (
                <Fragment>
                  {/* Desktop table */}
                  <div className="mt-5 hidden overflow-hidden rounded-[1.25rem] border border-[var(--border)] md:block">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[var(--border)] text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3"><SortHeader k="recent" label="Problem" /></th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Category</th>
                            <th className="px-4 py-3"><SortHeader k="severity" label="Severity" /></th>
                            <th className="px-4 py-3"><SortHeader k="impact" label="Est. impact" /></th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                          {filtered.map((p) => (
                            <tr key={p.id} className="align-middle">
                              <td className="px-4 py-4">
                                <p className="break-words text-sm font-semibold text-[var(--text)]">{p.title}</p>
                                <p className="mt-0.5 line-clamp-2 break-words text-xs text-[var(--muted)]">{p.evidence}</p>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm text-[var(--muted)]">
                                <span className="inline-flex items-center gap-1">
                                  <CategoryIcon category={p.category} />
                                  {p.category}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  p.severity === "Critical" ? "bg-red-100 text-red-700" :
                                  p.severity === "High" ? "bg-amber-100 text-amber-700" :
                                  p.severity === "Medium" ? "bg-blue-100 text-blue-700" :
                                  "bg-slate-100 text-slate-700"
                                }`}>
                                  {p.severity}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[var(--text)]">
                                {p.estimatedImpact > 0 ? formatCurrency(p.estimatedImpact) : "—"}
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  p.status === "Resolved" ? "bg-emerald-100 text-emerald-700" :
                                  p.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  <StatusIcon s={p.status} />
                                  {p.status}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-right">
                                <Button variant="ghost" onClick={() => setSelected(p)}>View Details</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile cards */}
                  <div className="mt-5 space-y-3 md:hidden">
                    {filtered.map((p) => (
                      <div key={p.id} className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            p.severity === "Critical" ? "bg-red-100 text-red-700" :
                            p.severity === "High" ? "bg-amber-100 text-amber-700" :
                            p.severity === "Medium" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {p.severity}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-slate-50 px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
                            <CategoryIcon category={p.category} />
                            {p.category}
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            p.status === "Resolved" ? "bg-emerald-100 text-emerald-700" :
                            p.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            <StatusIcon s={p.status} />
                            {p.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-[var(--text)]">{p.title}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">{p.evidence}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-[var(--text)]">
                            {p.estimatedImpact > 0 ? formatCurrency(p.estimatedImpact) : "—"}
                          </p>
                          <Button variant="secondary" onClick={() => setSelected(p)}>View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Fragment>
              ) : null}
            </section>

            {/* Side note: keeps existing dashboard/stat-grid values untouched */}
            <p className="text-center text-xs text-[var(--muted)]">
              Dashboard revenue: {formatCurrency(stats.totalRevenue)} · Total orders: {stats.totalOrders}
            </p>
          </Fragment>
        ) : null}
      </div>

      <ProblemDetailsDrawer
        problem={selected}
        status={selected ? statuses[selected.id] ?? "Open" : "Open"}
        onClose={() => setSelected(null)}
        onStatusChange={(s) => {
          if (selected) updateStatus(selected.id, s);
        }}
      />
    </Fragment>
  );
}
