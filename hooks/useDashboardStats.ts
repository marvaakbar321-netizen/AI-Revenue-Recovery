"use client";

import { useMemo } from "react";
import type { OrderRow } from "@/hooks/useOrders";

export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  customerCount: number;
};

export function useDashboardStats(orders: OrderRow[], productsCount = 0, lowStockCount = 0, customerCount = 0) {
  return useMemo(() => {
    const revenueStatuses = ["paid", "shipped", "delivered", "processing", "completed"];
    const completedStatuses = ["delivered", "completed"];

    const qualifyingOrders = orders.filter((order) => revenueStatuses.includes(order.status.toLowerCase()));
    const totalRevenue = qualifyingOrders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
    const averageOrderValue = qualifyingOrders.length > 0 ? totalRevenue / qualifyingOrders.length : 0;
    const pendingOrders = orders.filter((order) => ["pending", "processing"].includes(order.status.toLowerCase())).length;
    const completedOrders = orders.filter((order) => completedStatuses.includes(order.status.toLowerCase())).length;

    return {
      totalOrders: orders.length,
      totalRevenue,
      averageOrderValue,
      pendingOrders,
      completedOrders,
      totalProducts: productsCount,
      lowStockProducts: lowStockCount,
      customerCount,
    } satisfies DashboardStats;
  }, [orders, productsCount, lowStockCount, customerCount]);
}
