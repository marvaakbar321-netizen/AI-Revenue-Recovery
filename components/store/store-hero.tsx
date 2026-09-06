"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";

export function StoreHero({
  store,
}: {
  store: { name: string; heroTitle: string; heroDescription: string; logo?: string; slug: string };
}) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[radial-gradient(circle_at_top_left,_rgba(127,92,252,0.16),transparent_40%),linear-gradient(135deg,#ffffff_0%,#f8f8ff_100%)] shadow-[0_20px_60px_-35px_rgba(124,92,252,0.4)]">
      <div className="grid gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">{store.name}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">{store.heroTitle}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">{store.heroDescription}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/store/${store.slug}#products`}>
              <Button variant="primary">Shop Now</Button>
            </Link>
            <Link href={`/store/${store.slug}/checkout`}>
              <Button variant="secondary">View Cart</Button>
            </Link>
          </div>
        </div>

        <div className="relative min-h-[260px] overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-slate-100 shadow-inner">
          {store.logo ? (
            <SafeImage src={store.logo} alt={store.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl font-semibold text-[var(--primary)]">{store.name.slice(0, 2).toUpperCase()}</div>
          )}
        </div>
      </div>
    </section>
  );
}
