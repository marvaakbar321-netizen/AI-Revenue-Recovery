import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const revenueStatuses = new Set(["paid", "shipped", "delivered", "processing", "completed"]);
const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";
const defaultModel = "llama-3.3-70b-versatile";

type Order = { id: string; status: string; payment_status: string; total: number | string; created_at: string; customer_id: string };
type Product = { id: string; name: string; price: number | string; stock: number; active: boolean };
type OrderItem = { order_id: string; product_id: string; quantity: number; total: number | string };
type AIInsight = { category: "Revenue Opportunity" | "Product Performance" | "Customer Behavior" | "Order Trends" | "Revenue Risk"; title: string; description: string; priority: "high" | "medium" | "low"; impact: string };
type AIRecommendation = { title: string; reason: string; priority: "high" | "medium" | "low"; expectedImpact: string };
type AIAnalysis = { executiveSummary: string; observations: string[]; insights: AIInsight[]; recommendations: AIRecommendation[]; insufficientData: boolean };

type GroqResponse = { choices?: Array<{ message?: { content?: string | null } }> };

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function parseAnalysis(value: unknown): AIAnalysis | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.executiveSummary !== "string" || !Array.isArray(record.observations) || !Array.isArray(record.insights) || !Array.isArray(record.recommendations) || typeof record.insufficientData !== "boolean") return null;
  const observations = record.observations.filter((item): item is string => typeof item === "string").slice(0, 4);
  const insights = record.insights.filter((item): item is AIInsight => {
    if (!item || typeof item !== "object") return false;
    const insight = item as Record<string, unknown>;
    return typeof insight.category === "string" && typeof insight.title === "string" && typeof insight.description === "string" && ["high", "medium", "low"].includes(String(insight.priority)) && typeof insight.impact === "string";
  }).slice(0, 8);
  const recommendations = record.recommendations.filter((item): item is AIRecommendation => {
    if (!item || typeof item !== "object") return false;
    const recommendation = item as Record<string, unknown>;
    return typeof recommendation.title === "string" && typeof recommendation.reason === "string" && ["high", "medium", "low"].includes(String(recommendation.priority)) && typeof recommendation.expectedImpact === "string";
  }).slice(0, 6);
  return { executiveSummary: record.executiveSummary, observations, insights, recommendations, insufficientData: record.insufficientData };
}

function parseGroqJson(content: string) {
  const normalized = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(normalized) as unknown;
}

async function getAuthenticatedClient(request: Request): Promise<{ client: SupabaseClient; userId: string } | null> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length).trim();
  if (!token) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  const client = createClient(url, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return { client, userId: data.user.id };
}

export async function POST(request: Request) {
  try {
    const authenticated = await getAuthenticatedClient(request);
    if (!authenticated) return jsonError("Authentication is required to analyze store data.", 401);
    const { client, userId } = authenticated;
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) return jsonError("AI analysis is not configured.", 503);

    const { data: store, error: storeError } = await client.from("stores").select("id").eq("owner_id", userId).maybeSingle();
    if (storeError) return jsonError("Unable to verify the current store.", 500);
    if (!store) return jsonError("No store is associated with this account.", 404);

    const [ordersResult, productsResult, customersResult] = await Promise.all([
      client.from("orders").select("id, status, payment_status, total, created_at, customer_id").eq("store_id", store.id).order("created_at", { ascending: false }),
      client.from("products").select("id, name, price, stock, active").eq("store_id", store.id),
      client.from("customers").select("id", { count: "exact", head: true }).eq("store_id", store.id),
    ]);
    if (ordersResult.error || productsResult.error || customersResult.error) return jsonError("Unable to load current store data.", 500);

    const orders = (ordersResult.data ?? []) as Order[];
    const products = (productsResult.data ?? []) as Product[];
    const orderIds = orders.map((order) => order.id);
    let orderItems: OrderItem[] = [];
    if (orderIds.length > 0) {
      const itemsResult = await client.from("order_items").select("order_id, product_id, quantity, total").in("order_id", orderIds);
      if (itemsResult.error) return jsonError("Unable to load current store product activity.", 500);
      orderItems = (itemsResult.data ?? []) as OrderItem[];
    }

    const qualifyingOrders = orders.filter((order) => revenueStatuses.has(order.status.toLowerCase()));
    const revenue = qualifyingOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const productRevenue = new Map<string, number>();
    orderItems.forEach((item) => productRevenue.set(item.product_id, (productRevenue.get(item.product_id) ?? 0) + Number(item.total || 0)));
    const topProducts = [...productRevenue.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([productId, amount]) => ({ name: products.find((product) => product.id === productId)?.name ?? "Unknown product", revenue: amount }));
    const repeatCustomers = [...new Set(orders.map((order) => order.customer_id))].filter((customerId) => orders.filter((order) => order.customer_id === customerId).length > 1).length;
    const recentOrders = qualifyingOrders.filter((order) => Date.now() - new Date(order.created_at).getTime() <= 30 * 86400000);
    const previousOrders = qualifyingOrders.filter((order) => { const age = Date.now() - new Date(order.created_at).getTime(); return age > 30 * 86400000 && age <= 60 * 86400000; });
    const recentRevenue = recentOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const payload = { totalRevenue: revenue, totalOrders: orders.length, customers: customersResult.count ?? 0, averageOrderValue: qualifyingOrders.length ? revenue / qualifyingOrders.length : 0, recent30DayRevenue: recentRevenue, previous30DayRevenue: previousRevenue, repeatCustomers, topProducts, orderStatusCounts: orders.reduce<Record<string, number>>((counts, order) => { const status = order.status.toLowerCase(); counts[status] = (counts[status] ?? 0) + 1; return counts; }, {}), lowStockProducts: products.filter((product) => product.active && product.stock <= 5).map((product) => ({ name: product.name, stock: product.stock })) };

    if (orders.length === 0) return NextResponse.json({ executiveSummary: "Not enough store activity yet.", observations: [], insights: [], recommendations: [], insufficientData: true } satisfies AIAnalysis);

    const systemPrompt = "You are a professional revenue intelligence analyst. Analyze only the supplied store data. Never invent facts, numbers, trends, causes, or predictions. If evidence is insufficient, say so and return insufficientData true. Return JSON only, matching the requested schema. Use only these insight categories: Revenue Opportunity, Product Performance, Customer Behavior, Order Trends, Revenue Risk. Priorities must be high, medium, or low. Keep recommendations practical and grounded in the supplied data.";
    const userPrompt = `Analyze this current store's aggregated data:\n${JSON.stringify(payload)}\n\nReturn exactly this JSON shape: {"executiveSummary":"string","observations":["string"],"insights":[{"category":"Revenue Opportunity","title":"string","description":"string","priority":"high","impact":"string"}],"recommendations":[{"title":"string","reason":"string","priority":"high","expectedImpact":"string"}],"insufficientData":false}`;
    const groqResponse = await fetch(groqEndpoint, { method: "POST", headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.GROQ_MODEL ?? defaultModel, temperature: 0.1, response_format: { type: "json_object" }, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }] }) });
    if (!groqResponse.ok) return jsonError("AI analysis is temporarily unavailable. Please try again.", 502);
    const groqData = (await groqResponse.json()) as GroqResponse;
    const content = groqData.choices?.[0]?.message?.content;
    if (!content) return jsonError("AI returned an empty analysis. Please try again.", 502);
    const analysis = parseAnalysis(parseGroqJson(content));
    if (!analysis) return jsonError("AI returned an invalid analysis format. Please try again.", 502);
    return NextResponse.json(analysis);
  } catch {
    return jsonError("AI analysis failed. Please try again.", 500);
  }
}
