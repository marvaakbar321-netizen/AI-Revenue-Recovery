import { StorePageClient } from "@/components/store/store-page-client";

export default async function StoreLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StorePageClient slug={slug} />;
}
