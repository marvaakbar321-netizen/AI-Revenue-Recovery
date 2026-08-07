"use client";

import { Fragment, useState } from "react";
import { X, CalendarCheck, MapPin, CreditCard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";

export function OrderDetailsDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        View details
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex overflow-hidden bg-slate-950/40 px-4 py-6">
          <div className="relative ml-auto flex h-full w-full max-w-3xl flex-col overflow-y-auto rounded-[1.5rem] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Order details</p>
                <h2 className="text-2xl font-semibold text-[var(--text)]">#ORD-004781</h2>
              </div>
              <button onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-slate-50">
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
                    <p className="text-sm font-semibold text-[var(--text)]">Nolan Rivera</p>
                    <p className="text-sm text-[var(--muted)]">nolan.rivera@example.com</p>
                    <p className="text-sm text-[var(--muted)]">+1 415 774 9901</p>
                  </CardContent>
                </Card>
                <Card className="border border-[var(--border)]">
                  <CardHeader>
                    <CardTitle>Shipping</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm font-semibold text-[var(--text)]">Express delivery</p>
                    <p className="text-sm text-[var(--muted)]">438 Market St, San Francisco, CA 94104</p>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <MapPin className="h-4.5 w-4.5" />
                      <span>Arriving by Aug 06</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <Card className="border border-[var(--border)]">
                  <CardHeader>
                    <CardTitle>Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm font-semibold text-[var(--text)]">Visa •••• 2244</p>
                    <p className="text-sm text-[var(--muted)]">Paid on Aug 04, 2026</p>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <CreditCard className="h-4.5 w-4.5" />
                      <span>Authorization complete</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-[var(--border)]">
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 rounded-[1.5rem] bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-[var(--text)]">Aug 04, 2026</p>
                      <p className="text-sm text-[var(--muted)]">Order confirmed and payment approved.</p>
                    </div>
                    <div className="space-y-2 rounded-[1.5rem] bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-[var(--text)]">Aug 05, 2026</p>
                      <p className="text-sm text-[var(--muted)]">Fulfillment started and courier assigned.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-[var(--border)]">
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-[var(--muted)]">High-priority shipment. Customer requested expedited handling due to subscription renewal date.</p>
                </CardContent>
              </Card>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="primary" className="w-full">Mark as shipped</Button>
                <Button variant="secondary" className="w-full">Contact customer</Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
