"use client";

import { ProductCard, type ProductCardData } from "@/components/store/product-card";

export function ProductGrid({
  products,
  slug,
  onAddToCart,
}: {
  products: ProductCardData[];
  slug: string;
  onAddToCart: (product: ProductCardData) => void;
}) {
  if (!products.length) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">
        No active products yet for this store.
      </div>
    );
  }

  return (
    <div id="products" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} slug={slug} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
