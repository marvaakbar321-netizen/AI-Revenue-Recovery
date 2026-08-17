import { StoreLandingClient } from "@/components/store/store-landing-client";

export default async function StoreLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StoreLandingClient slug={slug} />;
}
