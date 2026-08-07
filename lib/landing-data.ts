import {
  Activity,
  AlertTriangle,
  BarChart3,
  CloudLightning,
  Cpu,
  HeartHandshake,
  Layers,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const landingNav = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "FAQ", href: "#faq" },
  { label: "Pricing", href: "#pricing" },
];

export const heroStats = [
  { label: "Revenue recovered", value: "$1.2M", description: "in the last 90 days" },
  { label: "Issues identified", value: "184", description: "across fulfillment & checkout" },
  { label: "Average lift", value: "12.8%", description: "in order conversion" },
];

export const problems = [
  {
    title: "Checkout abandonment",
    description: "High cart drop-off as customers hit payment errors or confusing flows.",
  },
  {
    title: "Unexpected revenue loss",
    description: "Orders fail after payment or inventory mismatches, reducing margins.",
  },
  {
    title: "Delayed fulfillment",
    description: "Shipping issues cause cancellations, refunds, and poor customer experiences.",
  },
  {
    title: "Invisible order risks",
    description: "Revenue leaks stay hidden until they become urgent business problems.",
  },
];

export const features = [
  {
    title: "Revenue Intelligence",
    description: "See the revenue impact of every order and stop leaks early.",
    icon: TrendingUp,
  },
  {
    title: "AI Insights",
    description: "Get automated recommendations for payments, fulfillment, and retention.",
    icon: Sparkles,
  },
  {
    title: "Problem Detection",
    description: "Detect high-risk order issues with an AI-first monitoring engine.",
    icon: AlertTriangle,
  },
  {
    title: "Order Intelligence",
    description: "Understand pending, failed, and revenue-critical orders instantly.",
    icon: Activity,
  },
  {
    title: "Smart Reports",
    description: "Share actionable recovery plans with clear business metrics.",
    icon: BarChart3,
  },
  {
    title: "Customer Analytics",
    description: "Track buying behavior, repeat customers, and high-value segments.",
    icon: Users,
  },
];

export const steps = [
  {
    title: "Connect your store",
    description: "Plug in Shopify or ecommerce data in minutes.",
    icon: Layers,
  },
  {
    title: "AI analyzes your business",
    description: "Continuous monitoring learns revenue patterns and risks.",
    icon: Cpu,
  },
  {
    title: "Revenue problems detected",
    description: "See high-impact issues before they become urgent.",
    icon: ShieldCheck,
  },
  {
    title: "Receive recommendations",
    description: "Take action with prioritized recovery tasks.",
    icon: CloudLightning,
  },
];

export const benefits = [
  {
    title: "AI-first approach",
    description: "Revenue recovery powered by intelligent automation.",
    icon: Zap,
  },
  {
    title: "Real-time monitoring",
    description: "Know order health the moment issues appear.",
    icon: HeartHandshake,
  },
  {
    title: "Revenue-focused insights",
    description: "Every recommendation links back to business impact.",
    icon: Target,
  },
  {
    title: "Beautiful dashboard",
    description: "Premium data visualization built for ecommerce teams.",
    icon: BarChart3,
  },
];

export const testimonials = [
  {
    quote: "AI Revenue Recovery helped us spot abandoned carts and recover thousands within the first week.",
    name: "Avery Morgan",
    role: "VP of Growth",
    company: "Luna & Co.",
  },
  {
    quote: "The platform turned order issues into clear actions — our revenue visibility has never been better.",
    name: "Jordan Lee",
    role: "Head of Ecommerce",
    company: "Nova Retail",
  },
];

export const faqs = [
  {
    question: "How does AI Revenue Recovery connect to my ecommerce store?",
    answer: "It connects through a secure integration layer that ingests order and checkout data to monitor revenue flow in real time.",
  },
  {
    question: "What types of issues can it detect?",
    answer: "The platform flags checkout abandonment, payment failures, fulfillment delays, refund risk, and order-related revenue leaks.",
  },
  {
    question: "Can I export reports for stakeholders?",
    answer: "Yes — share premium-ready recovery reports and recommendations directly with your team.",
  },
];
