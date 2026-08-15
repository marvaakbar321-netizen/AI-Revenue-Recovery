"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useStoreCart } from "@/hooks/useStoreCart";

export function StoreNavbar({
  store,
}: {
  store: { name: string; slug: string; logo?: string; description?: string };
}) {
  const { itemCount, subtotal } = useStoreCart();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href={`/store/${store.slug}`} className="flex items-center gap-3 min-w-0">
          <div className="relative h-10 w-10 overflow-hidden rounded-[0.9rem] border border-[var(--border)] bg-slate-100">
            {store.logo ? (
              <img src={store.logo} alt={store.name} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[var(--text)]">{store.name}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
          <Link href={`/store/${store.slug}`} className="transition hover:text-[var(--text)]">Home</Link>
          <Link href={`/store/${store.slug}#products`} className="transition hover:text-[var(--text)]">Products</Link>
        </nav>

        <Link href={`/store/${store.slug}/checkout`} className="inline-flex items-center gap-3 rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm font-medium text-[var(--text)] shadow-sm transition hover:bg-white">
          <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-[0.75rem] bg-[var(--primary-soft)] text-[var(--primary)]">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </div>
          <span className="hidden sm:inline">Cart</span>
          <span className="text-[var(--muted)]">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal)}</span>
        </Link>
      </div>
    </header>
  );
}
