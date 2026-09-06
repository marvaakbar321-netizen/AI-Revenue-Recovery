"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";

export type OrderRow = {
  id: string;
  store_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
  updated_at: string;
  order_items?: Array<{
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
};

type OrderQueryRow = Omit<OrderRow, "customer_name" | "customer_email" | "customer_phone" | "customer_address" | "order_items"> & {
  customers?: { name?: string; email?: string; phone?: string | null } | null;
  order_items?: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total: number;
    products?: { name?: string } | null;
  }>;
};

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [customerCount, setCustomerCount] = useState(0);

  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setStoreId(null);
      setCustomerCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (storeError) {
        setError(storeError.message);
        setOrders([]);
        setStoreId(null);
        setCustomerCount(0);
        setLoading(false);
        return;
      }

      if (!storeData) {
        setOrders([]);
        setStoreId(null);
        setCustomerCount(0);
        setLoading(false);
        return;
      }

      setStoreId(storeData.id);
      const [ordersResult, customersResult] = await Promise.all([
        supabase
        .from("orders")
        .select("*, customers(name, email, phone), order_items(id, product_id, quantity, unit_price, total, products(name))")
        .eq("store_id", storeData.id)
        .order("created_at", { ascending: false }),
        supabase.from("customers").select("id", { count: "exact", head: true }).eq("store_id", storeData.id),
      ]);

      if (ordersResult.error) {
        setError(ordersResult.error.message);
        setOrders([]);
      } else {
        setOrders(((ordersResult.data ?? []) as OrderQueryRow[]).map((order) => ({
          ...order,
          customer_name: order.customers?.name ?? "Unknown customer",
          customer_email: order.customers?.email ?? "",
          customer_phone: order.customers?.phone ?? "",
          customer_address: "",
          order_items: order.order_items?.map((item) => ({ ...item, product_name: item.products?.name ?? "Product" })) ?? [],
        })));
      }
      if (customersResult.error) setError(customersResult.error.message);
      setCustomerCount(customersResult.count ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!user || !storeId) return;

    const channel = supabase
      .channel(`orders-realtime-${storeId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `store_id=eq.${storeId}` },
        () => void loadOrders(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadOrders, storeId, user]);

  return { orders, loading, error, customerCount, refresh: loadOrders };
}
