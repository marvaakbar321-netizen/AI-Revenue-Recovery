"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useStoreCart } from "@/hooks/useStoreCart";
import { formatCurrency } from "@/lib/store-utils";
import type { ProductCardData } from "@/components/store/product-card";

export function CustomerProductCard({
  product,
}: {
  product: ProductCardData;
}) {
  const router = useRouter();
  const { addItem } = useStoreCart();

  const handleBuyNow = () => {
    addItem(
      {
        ...product,
        image: product.image,
        store_id: product.storeId,
        active: product.active ?? true,
      },
      1,
    );
    router.push(`/store/checkout?product=${product.id}`);
  };

  const category = product.category ?? "Product";
  const rating = product.rating ?? 4.5;
  const reviews = product.reviews ?? 0;

  return (
    <article className="group overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative block overflow-hidden">
        <img src={product.image} alt={product.name} className="h-60 w-full object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-purple-700">
            {category}
          </span>
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/90 text-slate-400 shadow-sm transition hover:text-red-500"
          aria-label="Add to favorites"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-purple-700">{product.name}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1 text-purple-700">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
            <span className="font-semibold text-slate-900">{rating}</span>
          </div>
          <span>•</span>
          <span>{reviews} reviews</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-semibold text-purple-700">{formatCurrency(product.price)}</span>
          <span className="text-xs text-slate-500">{product.stock} left</span>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" disabled={product.stock <= 0} onClick={handleBuyNow}>
            Add to Cart
          </Button>
          <Button type="button" variant="primary" className="flex-1" disabled={product.stock <= 0} onClick={handleBuyNow}>
            Buy Now
          </Button>
        </div>
      </div>
    </article>
  );
}
