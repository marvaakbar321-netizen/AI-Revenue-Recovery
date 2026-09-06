"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cart } from "@/components/store/cart";
import { useStoreCart } from "@/hooks/useStoreCart";
import { supabase } from "@/lib/supabase";

export function CartPageClient({ slug }: { slug: string }) {
  const { subtotal, updateQuantity, removeItem, getItemsByStore } = useStoreCart();

  const [store, setStore] = useState<{ id: string; name: string } | null>(null);
  useEffect(() => {
    let active = true;
    void supabase.from("stores").select("id, name").eq("slug", slug).maybeSingle().then(({ data }: { data: { id: string; name: string } | null }) => {
      if (active) setStore(data ?? null);
    });
    return () => { active = false; };
  }, [slug]);
  const storeItems = useMemo(() => (store ? getItemsByStore(store.id) : []), [store, getItemsByStore]);

  const handleIncrease = (productId: string) => {
    const current = storeItems.find((item) => item.productId === productId);
    if (current) {
      updateQuantity(productId, current.quantity + 1);
    }
  };

  const handleDecrease = (productId: string) => {
    const current = storeItems.find((item) => item.productId === productId);
    if (current && current.quantity > 1) {
      updateQuantity(productId, current.quantity - 1);
    }
  };

  if (!store) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-[var(--text)]">Store not found</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">The store you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/store/${slug}`} className="text-sm font-semibold text-[var(--primary)]">
          ← Back to {store.name}
        </Link>
      </div>
      <Cart
        items={storeItems.map((item) => ({
          productId: item.productId,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.unitPrice,
            image: item.product.image ?? item.product.image_url ?? "",
          },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        }))}
        subtotal={subtotal}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={removeItem}
        storeSlug={slug}
      />
    </div>
  );
}
