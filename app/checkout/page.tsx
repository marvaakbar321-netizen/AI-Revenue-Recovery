"use client";

import { useMemo } from "react";
import { CheckoutPageClient } from "@/components/store/checkout-page-client";
import { useStoreCart } from "@/hooks/useStoreCart";
import { getMockStoreById, getMockStores } from "@/lib/mock-store-data";

export default function CheckoutPage() {
  const { items } = useStoreCart();

  const slug = useMemo(() => {
    if (items.length > 0) {
      const storeId = items[0].product.storeId;
      if (storeId) {
        const store = getMockStoreById(storeId);
        if (store?.slug) {
          return store.slug;
        }
      }
    }

    const stores = getMockStores();
    return stores[0]?.slug ?? "store";
  }, [items]);

  return <CheckoutPageClient slug={slug} />;
}
