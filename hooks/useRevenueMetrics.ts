"use client";

import { useMemo } from "react";
import type { OrderRow } from "@/hooks/useOrders";

export type RevenueMetrics = {
  totalRevenue: number;
  netRevenue: number;
  averageOrderValue: number;
  revenueGrowth: number;
  pendingRevenue: number;
  completedRevenue: number;
  cancelledRevenue: number;
  topProducts: Array<{ name: string; revenue: number }>;
  statusBreakdown: Record<string, number>;
};

export function useRevenueMetrics(orders: OrderRow[]) {
  return useMemo(() => {
    const revenueByStatus: Record<string, number> = {};
    const revenueByProduct: Record<string, { name: string; revenue: number }> = {};
    const revenueOrders = orders.filter((order) => ["paid", "shipped", "delivered", "processing", "completed"].includes(order.status.toLowerCase()));

    revenueOrders.forEach((order) => {
      const total = Number(order.total ?? 0);
      revenueByStatus[order.status] = (revenueByStatus[order.status] || 0) + total;

      order.order_items?.forEach((item) => {
        if (!revenueByProduct[item.product_id]) {
          revenueByProduct[item.product_id] = { name: item.product_name, revenue: 0 };
        }
        revenueByProduct[item.product_id].revenue += Number(item.total ?? 0);
      });
    });

    const totalRevenue = Object.values(revenueByStatus).reduce((sum, value) => sum + value, 0);
    const cancelledRevenue = orders.filter((order) => ["cancelled", "canceled", "refunded"].includes(order.status.toLowerCase())).reduce((sum, order) => sum + Number(order.total ?? 0), 0);
    const netRevenue = totalRevenue;
    const averageOrderValue = revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0;
    const pendingRevenue = revenueOrders.filter((order) => ["pending", "processing"].includes(order.status.toLowerCase())).reduce((sum, order) => sum + Number(order.total ?? 0), 0);
    const completedRevenue = revenueOrders.filter((order) => ["delivered", "completed", "shipped"].includes(order.status.toLowerCase())).reduce((sum, order) => sum + Number(order.total ?? 0), 0);

    const topProducts = Object.values(revenueByProduct)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue,
      netRevenue,
      averageOrderValue,
      revenueGrowth: 0,
      pendingRevenue,
      completedRevenue,
      cancelledRevenue,
      topProducts,
      statusBreakdown: revenueByStatus,
    } satisfies RevenueMetrics;
  }, [orders]);
}
