"use client";

import { useState, useEffect } from "react";
import { useStoreCart } from "@/hooks/useStoreCart";
import { StoreNavbar } from "@/components/store/store-navbar";
import { StoreHero } from "@/components/store/store-hero";
import { ProductGrid } from "@/components/store/product-grid";
import { getMockStoreBySlug } from "@/lib/mock-store-data";

export function StorePageClient({ slug }: { slug: string }) {
  const [store, setStore] = useState<{
    id: string;
    name: string;
    slug: string;
    description: string;
    logo?: string;
    heroTitle: string;
    heroDescription: string;
  } | null>(null);
  const [products, setProducts] = useState<Array<{
    id: string;
    storeId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    active: boolean;
  }>>([]);
  const { addItem } = useStoreCart();

  useEffect(() => {
    const found = getMockStoreBySlug(slug);
    if (found) {
      setStore({
        id: found.id,
        name: found.name,
        slug: found.slug,
        description: found.description,
        logo: found.logo,
        heroTitle: found.heroTitle,
        heroDescription: found.heroDescription,
      });
      setProducts(
        found.products.map((product) => ({
          id: product.id,
          storeId: product.storeId,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          stock: product.stock,
          active: product.active,
        })),
      );
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load client-only localStorage data after hydration
  }, [slug]);

  if (!store) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold text-[var(--text)]">Store not found</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">The store you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]" suppressHydrationWarning>
      <StoreNavbar store={store} />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <StoreHero store={store} />

        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Featured</p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--text)]">Our products</h2>
            </div>
            <p className="text-sm text-[var(--muted)]">{products.length} item{products.length === 1 ? "" : "s"}</p>
          </div>

          <ProductGrid
            products={products}
            slug={store.slug}
            onAddToCart={(product) => addItem({ ...product, image: product.image, store_id: product.storeId, active: true }, 1)}
          />
        </section>
      </main>
    </div>
  );
}
