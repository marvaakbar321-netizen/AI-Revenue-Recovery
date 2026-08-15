import { CheckoutPageClient } from "@/components/store/checkout-page-client";

export default async function StoreCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CheckoutPageClient slug={slug} />;
}
