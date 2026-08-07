export interface StatCard {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
}

export interface RevenueProblem {
  id: string
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  revenueImpact: string
}

export interface AIRecommendation {
  id: string
  title: string
  description: string
  impact: string
  actionLabel: string
}

export interface ActivityItem {
  id: string
  type: "sync" | "problem" | "recommendation" | "campaign"
  title: string
  description: string
  timestamp: string
}

export interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

export interface User {
  name: string
  email: string
  avatar: string
}