"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/store-utils";

export type ProductCardData = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  active?: boolean;
  storeId: string;
  category?: string;
  rating?: number;
  reviews?: number;
};

export function ProductCard({
  product,
  slug,
  onAddToCart,
}: {
  product: ProductCardData;
  slug: string;
  onAddToCart: (product: ProductCardData) => void;
}) {
  const router = useRouter();

  const handleBuyNow = () => {
    onAddToCart(product);
    router.push(`/store/${slug}/checkout`);
  };

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/store/${slug}/product/${product.id}`} className="block overflow-hidden">
        <img src={product.image} alt={product.name} className="h-56 w-full object-cover transition duration-300 group-hover:scale-105" />
      </Link>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/store/${slug}/product/${product.id}`} className="text-xl font-semibold text-[var(--text)] hover:text-[var(--primary)]">
              {product.name}
            </Link>
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
            }`}>
              {product.stock > 0 ? "In stock" : "Sold out"}
            </span>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">{product.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-semibold text-[var(--text)]">{formatCurrency(product.price)}</span>
          <span className="text-sm text-[var(--muted)]">{product.stock} left</span>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" disabled={product.stock <= 0} onClick={() => onAddToCart(product)}>
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
