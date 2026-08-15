"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/store-utils";

export type CartItemRow = {
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  unitPrice: number;
  total: number;
};

export function Cart({
  items,
  subtotal,
  onIncrease,
  onDecrease,
  onRemove,
  storeSlug,
}: {
  items: CartItemRow[];
  subtotal: number;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  storeSlug: string;
}) {
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Cart</p>
        <h1 className="text-3xl font-semibold text-[var(--text)]">Your shopping cart</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-[var(--text)]">Your cart is empty</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Browse the store and add something you love.</p>
              <Link href={`/store/${storeSlug}`} className="mt-5 inline-block">
                <Button variant="primary">Continue shopping</Button>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-[1rem] object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-[var(--text)]">{item.product.name}</h2>
                        <p className="mt-1 text-sm text-[var(--muted)]">{formatCurrency(item.unitPrice)} each</p>
                      </div>
                      <button type="button" onClick={() => onRemove(item.productId)} className="text-sm font-medium text-[var(--danger)]">
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => onDecrease(item.productId)} className="flex h-9 w-9 items-center justify-center rounded-[0.75rem] border border-[var(--border)] bg-white text-lg text-[var(--text)]">
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold text-[var(--text)]">{item.quantity}</span>
                        <button type="button" onClick={() => onIncrease(item.productId)} className="flex h-9 w-9 items-center justify-center rounded-[0.75rem] border border-[var(--border)] bg-white text-lg text-[var(--text)]">
                          +
                        </button>
                      </div>

                      <div className="text-lg font-semibold text-[var(--text)]">{formatCurrency(item.total)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[var(--text)]">Summary</h2>
          <div className="mt-5 space-y-3 text-sm text-[var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[var(--text)]">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-[var(--text)]">{formatCurrency(shipping)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-base font-semibold text-[var(--text)]">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link href={`/store/${storeSlug}/checkout`}>
              <Button type="button" variant="primary" className="w-full" disabled={items.length === 0}>Proceed to Checkout</Button>
            </Link>
            <Link href={`/store/${storeSlug}`}>
              <Button type="button" variant="secondary" className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
