import { notFound } from "next/navigation";
import { OrderSuccessPageClient } from "@/components/store/order-success-page-client";
import { getMockStoreBySlug } from "@/lib/mock-store-data";

export default async function StoreOrderSuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = getMockStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return <OrderSuccessPageClient storeSlug={store.slug} />;
}
