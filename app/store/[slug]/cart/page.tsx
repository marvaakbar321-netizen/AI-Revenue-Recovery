import { Suspense } from "react";
import { CartPageClient } from "@/components/store/cart-page-client";

export default async function StoreCartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-slate-500">Loading cart…</div>}>
      <CartPageClient slug={slug} />
    </Suspense>
  );
}
