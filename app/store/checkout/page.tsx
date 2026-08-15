import { Suspense } from "react";
import { CustomerCheckoutPageClient } from "@/components/store/store-checkout-client";

export default async function CustomerStoreCheckoutPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-slate-500">Loading checkout…</div>}>
      <CustomerCheckoutPageClient />
    </Suspense>
  );
}
