import type { RevenueProblem, AIRecommendation, ActivityItem } from "@/components/types"

export const revenueProblems: RevenueProblem[] = [
  {
    id: "RP-001",
    severity: "critical",
    title: "Mobile checkout abandonment",
    description: "68% of mobile users abandon at the payment step.",
    revenueImpact: "$12,450/mo",
  },
  {
    id: "RP-002",
    severity: "high",
    title: "Cart recovery rate below average",
    description: "Cart recovery emails have a 12% open rate vs. industry 28%.",
    revenueImpact: "$8,200/mo",
  },
  {
    id: "RP-003",
    severity: "medium",
    title: "Product page load time",
    description: "Product pages take 4.2s to load on 3G connections.",
    revenueImpact: "$3,800/mo",
  },
  {
    id: "RP-004",
    severity: "low",
    title: "Missing product reviews",
    description: "23 products have zero reviews, affecting conversion.",
    revenueImpact: "$1,200/mo",
  },
  {
    id: "RP-005",
    severity: "high",
    title: "Out of stock products visible",
    description: "15 out-of-stock products still appear in search results.",
    revenueImpact: "$5,600/mo",
  },
]

export const aiRecommendations: AIRecommendation[] = [
  {
    id: "AI-001",
    title: "Improve mobile checkout experience",
    description: "Simplify the payment flow with one-click checkout and address autocomplete to reduce mobile abandonment.",
    impact: "Est. +$12,450/mo revenue",
    actionLabel: "View Recommendations",
  },
  {
    id: "AI-002",
    title: "Optimize cart recovery emails",
    description: "A/B test subject lines and send timing to improve open rates and recover more abandoned carts.",
    impact: "Est. +$8,200/mo revenue",
    actionLabel: "View Recommendations",
  },
  {
    id: "AI-003",
    title: "Enable lazy loading for product images",
    description: "Defer off-screen image loading to improve page speed and reduce bounce rate on product pages.",
    impact: "Est. +$3,800/mo revenue",
    actionLabel: "View Recommendations",
  },
]

export const activityItems: ActivityItem[] = [
  {
    id: "ACT-001",
    type: "sync",
    title: "Store synced",
    description: "Shopify store data refreshed successfully.",
    timestamp: "2 minutes ago",
  },
  {
    id: "ACT-002",
    type: "problem",
    title: "New problem detected",
    description: "Mobile checkout abandonment rate increased to 68%.",
    timestamp: "15 minutes ago",
  },
  {
    id: "ACT-003",
    type: "recommendation",
    title: "AI recommendation generated",
    description: "New recommendation: Improve mobile checkout experience.",
    timestamp: "1 hour ago",
  },
  {
    id: "ACT-004",
    type: "campaign",
    title: "Campaign created",
    description: "Summer Sale email campaign was created and scheduled.",
    timestamp: "3 hours ago",
  },
  {
    id: "ACT-005",
    type: "sync",
    title: "Store synced",
    description: "WooCommerce product catalog updated.",
    timestamp: "5 hours ago",
  },
]