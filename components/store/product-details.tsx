"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { formatCurrency } from "@/lib/store-utils";

export type ProductDetailsData = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
};

export function ProductDetails({
  product,
  storeSlug,
  onAddToCart,
}: {
  product: ProductDetailsData;
  storeSlug: string;
  onAddToCart: (product: ProductDetailsData, quantity?: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedMessage(`${quantity} ${product.name} added to cart.`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-slate-100">
          <SafeImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Product</p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--text)]">{product.name}</h1>
          <p className="mt-4 text-lg font-semibold text-[var(--text)]">{formatCurrency(product.price)}</p>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">{product.description}</p>

          <div className="mt-6 flex items-center gap-3 text-sm text-[var(--muted)]">
            <span className="font-medium text-[var(--text)]">Available stock:</span>
            <span>{product.stock}</span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-[0.875rem] border border-[var(--border)] bg-white text-lg text-[var(--text)]"
            >
              −
            </button>
            <div className="flex h-11 w-16 items-center justify-center rounded-[0.875rem] border border-[var(--border)] bg-slate-50 text-base font-semibold text-[var(--text)]">
              {quantity}
            </div>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-[0.875rem] border border-[var(--border)] bg-white text-lg text-[var(--text)]"
            >
              +
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="primary" onClick={handleAdd} disabled={product.stock <= 0}>Add to Cart</Button>
            <Link href={`/store/${storeSlug}`}>
              <Button type="button" variant="secondary">Continue shopping</Button>
            </Link>
          </div>

          {addedMessage ? <p className="mt-4 text-sm text-emerald-600">{addedMessage}</p> : null}
        </div>
      </div>
    </div>
  );
}
