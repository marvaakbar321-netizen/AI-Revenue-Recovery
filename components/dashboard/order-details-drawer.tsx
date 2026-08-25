"use client";

import { Fragment, useState } from "react";
import { X, MapPin, CreditCard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency } from "@/lib/store-utils";
import type { MockOrder } from "@/lib/mock-store-data";

type OrderDetailsDrawerProps = {
  order?: MockOrder | null;
  open?: boolean;
  onClose?: () => void;
};

export function OrderDetailsDrawer({ order, open, onClose }: OrderDetailsDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const drawerOpen = isControlled ? open : internalOpen;

  const handleClose = () => {
    if (!isControlled) {
      setInternalOpen(false);
    }
    onClose?.();
  };

  const handleOpen = () => {
    if (!isControlled) {
      setInternalOpen(true);
    }
  };

  if (!drawerOpen || !order) return null;

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Fragment>
      {!isControlled ? (
        <Button variant="ghost" onClick={handleOpen}>
          View
        </Button>
      ) : null}
      <div className="fixed inset-0 z-50 flex overflow-hidden bg-slate-950/40 px-4 py-6">
        <div className="relative ml-auto flex h-full w-full max-w-3xl flex-col overflow-y-auto rounded-[1.5rem] bg-[var(--surface)] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Order details</p>
              <h2 className="text-2xl font-semibold text-[var(--text)]">{order.id}</h2>
            </div>
            <button onClick={handleClose} className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-slate-50">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-6 p-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <Card className="border border-[var(--border)]">
                <CardHeader>
                  <CardTitle>Customer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--text)]">{order.customerName}</p>
                  <p className="text-sm text-[var(--muted)]">{order.customerEmail}</p>
                  <p className="text-sm text-[var(--muted)]">{order.customerPhone}</p>
                </CardContent>
              </Card>
              <Card className="border border-[var(--border)]">
                <CardHeader>
                  <CardTitle>Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <MapPin className="h-4.5 w-4.5" />
                    <span>{order.customerAddress}</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">Order date: {orderDate}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-[var(--border)]">
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 rounded-[1rem] bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-purple-50 text-[var(--primary)]">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text)]">{item.productName}</p>
                          <p className="text-xs text-[var(--muted)]">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[var(--text)]">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border border-[var(--border)]">
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <CreditCard className="h-4.5 w-4.5" />
                    <span>Status: <StatusBadge status={order.status} /></span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">Total: {formatCurrency(order.total)}</p>
                </CardContent>
              </Card>
              <Card className="border border-[var(--border)]">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-[var(--muted)]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[var(--text)]">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--muted)]">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 text-base font-semibold text-[var(--text)]">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
