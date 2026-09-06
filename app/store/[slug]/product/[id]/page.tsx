import { Suspense } from "react";
import { ProductDetailsPageClient } from "@/components/store/product-details-page-client";

export default async function StoreProductPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-slate-500">Loading product…</div>}>
      <ProductDetailsPageClient slug={slug} productId={id} />
    </Suspense>
  );
}
