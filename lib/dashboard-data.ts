import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Box,
  Cpu,
  Home,
  ShoppingBag,
  Sparkles,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/revenue", label: "Revenue", icon: BarChart3 },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/products", label: "Products", icon: Box },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/problems", label: "Revenue Problems", icon: AlertTriangle, badge: "3" },
  { href: "/dashboard/insights", label: "AI Insights", icon: Sparkles },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export type StatItem = {
  title: string;
  value: string;
  delta: string;
  trend: "positive" | "negative";
  icon: LucideIcon;
  description: string;
  series: number[];
};

export const stats: StatItem[] = [
  {
    title: "Revenue",
    value: "$246.2K",
    delta: "+13.4%",
    trend: "positive",
    icon: ArrowUpRight,
    description: "Compared to last month",
    series: [28, 30, 33, 32, 35, 36, 40],
  },
  {
    title: "Orders",
    value: "1,842",
    delta: "+4.8%",
    trend: "positive",
    icon: ShoppingCart,
    description: "Orders increased this week",
    series: [14, 18, 16, 20, 23, 22, 24],
  },
  {
    title: "Customers",
    value: "1,068",
    delta: "-1.2%",
    trend: "negative",
    icon: Users,
    description: "New customers are stable",
    series: [12, 10, 14, 13, 12, 11, 11],
  },
  {
    title: "Conversion",
    value: "2.9%",
    delta: "-0.8%",
    trend: "negative",
    icon: Cpu,
    description: "Fewer visitors are converting",
    series: [3.1, 3.2, 3.0, 2.9, 2.8, 2.9, 2.7],
  },
];

export type ProblemItem = {
  id: string;
  severity: "Critical" | "High" | "Medium";
  title: string;
  description: string;
  impact: string;
  priority: string;
};

export const revenueProblems: ProblemItem[] = [
  {
    id: "p1",
    severity: "Critical",
    title: "Checkout abandonment spike",
    description: "Mobile checkout errors are blocking 18% of conversions.",
    impact: "$42,800/mo",
    priority: "P1",
  },
  {
    id: "p2",
    severity: "High",
    title: "Slow product pages",
    description: "Average load time is 4.1s, causing customer drop-off.",
    impact: "$18,200/mo",
    priority: "P2",
  },
  {
    id: "p3",
    severity: "Medium",
    title: "Low promo visibility",
    description: "Discount banners are missing from key landing pages.",
    impact: "$9,600/mo",
    priority: "P3",
  },
];

export type Recommendation = {
  title: string;
  description: string;
  impact: string;
};

export const recommendation: Recommendation = {
  title: "Improve mobile checkout experience",
  description:
    "Streamline the checkout flow with one-click payment options and faster form validation to recover lost revenue.",
  impact: "Expected recovery: $32K/mo",
};

export type RevenueBreakdownItem = {
  category: string;
  amount: string;
  percent: string;
  change: string;
  trend: "up" | "down";
  progress: number;
};

export const revenueBreakdown: RevenueBreakdownItem[] = [
  {
    category: "Subscription plans",
    amount: "$142.3K",
    percent: "41%",
    change: "8.4%",
    trend: "up",
    progress: 72,
  },
  {
    category: "Upsell revenue",
    amount: "$64.8K",
    percent: "19%",
    change: "5.2%",
    trend: "up",
    progress: 58,
  },
  {
    category: "New customers",
    amount: "$38.4K",
    percent: "11%",
    change: "-1.6%",
    trend: "down",
    progress: 34,
  },
  {
    category: "Recoverable loss",
    amount: "$32.1K",
    percent: "9%",
    change: "-4.8%",
    trend: "down",
    progress: 46,
  },
];

export type TopProduct = {
  name: string;
  category: string;
  revenue: string;
  change: string;
  trend: "positive" | "negative";
};

export const topProducts: TopProduct[] = [
  {
    name: "Pro Growth Kit",
    category: "Top seller",
    revenue: "$54.2K",
    change: "+12.4%",
    trend: "positive",
  },
  {
    name: "Premium onboarding",
    category: "Conversion",
    revenue: "$31.8K",
    change: "+7.9%",
    trend: "positive",
  },
  {
    name: "Retention bundle",
    category: "Repeat purchase",
    revenue: "$22.9K",
    change: "-2.1%",
    trend: "negative",
  },
  {
    name: "Checkout booster",
    category: "Recovery",
    revenue: "$18.7K",
    change: "+4.3%",
    trend: "positive",
  },
];

export type RevenueForecastItem = {
  title: string;
  description: string;
  amount: string;
};

export const revenueForecast: RevenueForecastItem[] = [
  {
    title: "AI recovery pipeline",
    description: "Predicted recoverable revenue from checkout and cart issues.",
    amount: "$24.8K",
  },
  {
    title: "Average order value",
    description: "Forecast increase from price personalization and cross-sell strategies.",
    amount: "$4.2K",
  },
  {
    title: "Revenue runway",
    description: "Estimated net gain if all priority actions are completed this quarter.",
    amount: "$17.5K",
  },
];

export type RevenueRange = "30 days" | "90 days" | "12 months";

export const revenueMetrics: StatItem[] = [
  {
    title: "Recovered revenue",
    value: "$32.4K",
    delta: "+9.8%",
    trend: "positive",
    icon: ArrowUpRight,
    description: "Recovered from abandoned carts",
    series: [16, 18, 22, 24, 27, 30, 32],
  },
  {
    title: "Revenue growth",
    value: "13.6%",
    delta: "+3.4%",
    trend: "positive",
    icon: BarChart3,
    description: "Growth over prior period",
    series: [8, 10, 11, 13, 15, 16, 18],
  },
  {
    title: "Conversion rate",
    value: "3.1%",
    delta: "+0.3%",
    trend: "positive",
    icon: ShoppingCart,
    description: "Checkout conversion uplift",
    series: [2.7, 2.8, 2.9, 3.0, 3.1, 3.1, 3.2],
  },
  {
    title: "Churn risk",
    value: "14.2%",
    delta: "-1.2%",
    trend: "negative",
    icon: Users,
    description: "Accounts at risk of downgrading",
    series: [18, 17, 16, 15, 15, 14, 14],
  },
];

export type OrderKpi = {
  title: string;
  value: string;
  delta: string;
  trend: "positive" | "negative";
  icon: LucideIcon;
  description: string;
  series: number[];
};

export const orderKpis: OrderKpi[] = [
  {
    title: "Total Orders",
    value: "5,824",
    delta: "+11.3%",
    trend: "positive",
    icon: ShoppingCart,
    description: "vs last 30 days",
    series: [68, 74, 69, 82, 84, 90, 96],
  },
  {
    title: "Completed",
    value: "4,210",
    delta: "+8.1%",
    trend: "positive",
    icon: Box,
    description: "orders fulfilled",
    series: [58, 64, 61, 70, 72, 78, 82],
  },
  {
    title: "Pending",
    value: "682",
    delta: "+5.4%",
    trend: "negative",
    icon: ArrowUpRight,
    description: "orders awaiting fulfillment",
    series: [42, 45, 47, 52, 55, 60, 66],
  },
  {
    title: "Cancelled",
    value: "132",
    delta: "-3.6%",
    trend: "negative",
    icon: AlertTriangle,
    description: "orders cancelled",
    series: [18, 16, 17, 16, 14, 13, 12],
  },
];

export type OrderStatus = {
  title: string;
  value: string;
  label: string;
  variant: "default" | "success" | "warning" | "danger" | "info";
};

export const orderStatuses: OrderStatus[] = [
  { title: "Pending", value: "682", label: "Needs action", variant: "warning" },
  { title: "Processing", value: "1,024", label: "In progress", variant: "info" },
  { title: "Shipped", value: "2,108", label: "On the way", variant: "default" },
  { title: "Delivered", value: "1,782", label: "Complete", variant: "success" },
  { title: "Cancelled", value: "132", label: "Refund review", variant: "danger" },
  { title: "Refunded", value: "96", label: "Customer refunded", variant: "danger" },
];

export type AnalyticsSeries = {
  label: string;
  values: number[];
};

export const orderAnalytics: AnalyticsSeries[] = [
  {
    label: "Orders by Day",
    values: [72, 84, 96, 104, 98, 112, 120],
  },
  {
    label: "Orders by Week",
    values: [320, 340, 370, 390, 420, 440, 460],
  },
  {
    label: "Orders by Month",
    values: [1200, 1320, 1410, 1480, 1560, 1620, 1700],
  },
];

export type OrderRow = {
  id: string;
  customer: string;
  avatar: string;
  products: number;
  total: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  fulfillmentStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  priority: "High" | "Medium" | "Low";
};

export const ordersTable: OrderRow[] = [
  {
    id: "#ORD-004782",
    customer: "Sienna Brooks",
    avatar: "SB",
    products: 3,
    total: "$624.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
    date: "Aug 4, 2026",
    priority: "Low",
  },
  {
    id: "#ORD-004781",
    customer: "Nolan Rivera",
    avatar: "NR",
    products: 5,
    total: "$1,240.00",
    paymentStatus: "Pending",
    fulfillmentStatus: "Processing",
    date: "Aug 4, 2026",
    priority: "High",
  },
  {
    id: "#ORD-004780",
    customer: "Lila Chen",
    avatar: "LC",
    products: 1,
    total: "$98.00",
    paymentStatus: "Failed",
    fulfillmentStatus: "Cancelled",
    date: "Aug 3, 2026",
    priority: "Medium",
  },
  {
    id: "#ORD-004779",
    customer: "Evan Walker",
    avatar: "EW",
    products: 2,
    total: "$246.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    date: "Aug 3, 2026",
    priority: "Low",
  },
  {
    id: "#ORD-004778",
    customer: "Zara Patel",
    avatar: "ZP",
    products: 4,
    total: "$512.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Pending",
    date: "Aug 2, 2026",
    priority: "High",
  },
];

export type OrderAlert = {
  id: string;
  priority: "Critical" | "High" | "Medium";
  title: string;
  description: string;
  impact: string;
  action: string;
};

export const orderAlerts: OrderAlert[] = [
  {
    id: "alert-1",
    priority: "Critical",
    title: "High-value order pending",
    description: "A $3,200 order is waiting for fulfillment confirmation.",
    impact: "$3,200",
    action: "Review order",
  },
  {
    id: "alert-2",
    priority: "High",
    title: "Payment failed on mobile",
    description: "Failed payment attempts from 14 mobile customers in the last hour.",
    impact: "$1,240",
    action: "Retry payments",
  },
  {
    id: "alert-3",
    priority: "Medium",
    title: "Shipping delayed",
    description: "6 orders are delayed at the fulfillment center.",
    impact: "$860",
    action: "Expedite shipping",
  },
  {
    id: "alert-4",
    priority: "Medium",
    title: "Refund requested",
    description: "Customer requested a refund before order shipment.",
    impact: "$420",
    action: "Review refund",
  },
];

export type AIInsight = {
  title: string;
  description: string;
  impact: string;
  actions: string[];
};

export const aiOrderInsight: AIInsight = {
  title: "AI detected an increase in failed payments from mobile users.",
  description: "Mobile checkout failures are spiking on iOS devices.",
  impact: "$1,240",
  actions: ["Review payment gateway", "Retry failed payments", "Notify affected customers"],
};

export type CustomerInsight = {
  title: string;
  value: string;
  detail: string;
  progress: number;
};

export const customerInsights: CustomerInsight[] = [
  {
    title: "Returning Customers",
    value: "2,180",
    detail: "Repeat buyers this month",
    progress: 76,
  },
  {
    title: "First-time Buyers",
    value: "1,420",
    detail: "New customers captured",
    progress: 64,
  },
  {
    title: "Avg. Order Value",
    value: "$128.70",
    detail: "Across all channels",
    progress: 88,
  },
  {
    title: "Repeat Purchase Rate",
    value: "27.4%",
    detail: "Returning customer frequency",
    progress: 54,
  },
];

export const orderActivity: ActivityItem[] = [
  {
    id: "oact1",
    time: "Just now",
    title: "New order received",
    description: "Order #ORD-004782 entered the system.",
    type: "success",
  },
  {
    id: "oact2",
    time: "30m ago",
    title: "Payment failed",
    description: "Payment declined for order #ORD-004780.",
    type: "warning",
  },
  {
    id: "oact3",
    time: "1h ago",
    title: "Order shipped",
    description: "Order #ORD-004777 is on its way.",
    type: "info",
  },
  {
    id: "oact4",
    time: "Yesterday",
    title: "Refund processed",
    description: "Refund completed for order #ORD-004769.",
    type: "success",
  },
];

export type ActivityItem = {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "success" | "warning" | "info";
};

export const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    time: "Just now",
    title: "Store synced",
    description: "Latest inventory and order data are now available.",
    type: "success",
  },
  {
    id: "a2",
    time: "1h ago",
    title: "New problem detected",
    description: "Checkout abandonment has increased across mobile browsers.",
    type: "warning",
  },
  {
    id: "a3",
    time: "3h ago",
    title: "Recommendation generated",
    description: "AI identified a high-impact checkout optimization.",
    type: "info",
  },
  {
    id: "a4",
    time: "Yesterday",
    title: "Campaign created",
    description: "A recovery campaign was drafted for abandoned carts.",
    type: "success",
  },
];
