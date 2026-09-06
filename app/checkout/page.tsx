"use client";

import { useEffect, useState } from "react";
import { CheckoutPageClient } from "@/components/store/checkout-page-client";
import { useStoreCart } from "@/hooks/useStoreCart";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items } = useStoreCart();

  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const storeId = items[0]?.product.storeId ?? items[0]?.product.store_id;
    if (!storeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset route state when the cart becomes empty
      setSlug(null);
      return;
    }
    void supabase.from("stores").select("slug").eq("id", storeId).maybeSingle().then(({ data }: { data: { slug: string } | null }) => setSlug(data?.slug ?? null));
  }, [items]);

  return slug ? <CheckoutPageClient slug={slug} /> : <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-[var(--muted)]">Add products from a store before checking out.</div>;
}
