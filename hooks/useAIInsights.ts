"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";

export type InsightOrder = {
  id: string;
  store_id: string;
  status: string;
  payment_status: string;
  total: number | string;
  created_at: string;
  customer_id: string;
};

export type InsightProduct = {
  id: string;
  name: string;
  price: number | string;
  stock: number;
  active: boolean;
};

export type InsightOrderItem = {
  order_id: string;
  product_id: string;
  quantity: number;
  total: number | string;
};

export type AIInsightsData = {
  orders: InsightOrder[];
  products: InsightProduct[];
  orderItems: InsightOrderItem[];
  customerCount: number;
};

export type AIInsightResult = {
  executiveSummary: string;
  observations: string[];
  insights: Array<{
    category: "Revenue Opportunity" | "Product Performance" | "Customer Behavior" | "Order Trends" | "Revenue Risk";
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    impact: string;
  }>;
  recommendations: Array<{
    title: string;
    reason: string;
    priority: "high" | "medium" | "low";
    expectedImpact: string;
  }>;
  insufficientData: boolean;
};

const emptyData: AIInsightsData = { orders: [], products: [], orderItems: [], customerCount: 0 };

export function useAIInsights() {
  const { user } = useAuth();
  const [data, setData] = useState<AIInsightsData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAIAnalysis] = useState<AIInsightResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisGeneratedAt, setAnalysisGeneratedAt] = useState<string | null>(null);
  const [analysisStale, setAnalysisStale] = useState(true);
  const analyzingRef = useRef(false);

  const load = useCallback(async () => {
    if (!user) {
      setData(emptyData);
      setLoading(false);
      setAnalysisStale(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (storeError) throw storeError;
      if (!store) {
        setData(emptyData);
        setAnalysisStale(true);
        return;
      }

      const [ordersResult, productsResult, customersResult] = await Promise.all([
        supabase
          .from("orders")
          .select("id, store_id, status, payment_status, total, created_at, customer_id")
          .eq("store_id", store.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("products")
          .select("id, name, price, stock, active")
          .eq("store_id", store.id),
        supabase.from("customers").select("id", { count: "exact", head: true }).eq("store_id", store.id),
      ]);

      if (ordersResult.error) throw ordersResult.error;
      if (productsResult.error) throw productsResult.error;
      if (customersResult.error) throw customersResult.error;

      const orders = (ordersResult.data ?? []) as InsightOrder[];
      const orderIds = orders.map((order) => order.id);
      let orderItems: InsightOrderItem[] = [];

      if (orderIds.length > 0) {
        const itemsResult = await supabase
          .from("order_items")
          .select("order_id, product_id, quantity, total")
          .in("order_id", orderIds);
        if (itemsResult.error) throw itemsResult.error;
        orderItems = (itemsResult.data ?? []) as InsightOrderItem[];
      }

      setData({
        orders,
        products: (productsResult.data ?? []) as InsightProduct[],
        orderItems,
        customerCount: customersResult.count ?? 0,
      });
      setAnalysisStale(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "We could not load your store insights.");
      setData(emptyData);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const analyze = useCallback(async () => {
    if (analyzingRef.current) return;
    analyzingRef.current = true;
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Your session has expired. Please sign in again.");
      const response = await fetch("/api/ai-insights", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } });
      const body = (await response.json()) as AIInsightResult | { error?: string };
      if (!response.ok) throw new Error("error" in body && body.error ? body.error : "AI analysis is unavailable.");
      if (!body || typeof body !== "object" || typeof (body as AIInsightResult).executiveSummary !== "string" || !Array.isArray((body as AIInsightResult).insights) || !Array.isArray((body as AIInsightResult).recommendations)) throw new Error("AI returned an invalid analysis format.");
      setAIAnalysis(body as AIInsightResult);
      setAnalysisGeneratedAt(new Date().toISOString());
      setAnalysisStale(false);
    } catch (analysisLoadError) {
      setAnalysisError(analysisLoadError instanceof Error ? analysisLoadError.message : "AI analysis failed. Please try again.");
    } finally {
      analyzingRef.current = false;
      setAnalyzing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    void load();
  }, [load]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    let storeId: string | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    const subscribe = async () => {
      const { data: store } = await supabase.from("stores").select("id").eq("owner_id", user.id).maybeSingle();
      if (!active || !store) return;
      storeId = store.id;
      channel = supabase
      .channel(`ai-insights-${user.id}-${storeId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `store_id=eq.${storeId}` }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `store_id=eq.${storeId}` }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "customers", filter: `store_id=eq.${storeId}` }, () => void load())
      .subscribe();
    };
    void subscribe();

    return () => {
      active = false;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [load, user]);

  return { ...data, loading, error, refresh: load, analyze, aiAnalysis, analyzing, analysisError, analysisGeneratedAt, analysisStale };
}