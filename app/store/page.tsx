import { StoreLandingClient } from "@/components/store/store-landing-client";
import { supabase } from "@/lib/supabase";

export default async function CustomerStorePage() {
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, name, slug, description, logo, hero_title, hero_description")
    .order("created_at", { ascending: true })
    .maybeSingle();

  if (storeError) {
    console.error("Failed to load store for /store", storeError);
  }

  const slug = store?.slug ?? "store";

  const { data: products, error: productsError } = store
    ? await supabase.from("products").select("id, name, description, price, image_url, stock, active, store_id").eq("store_id", store.id).eq("active", true).order("created_at", { ascending: false })
    : { data: [], error: null };

  if (productsError) {
    console.error("Failed to load products for /store", productsError);
  }

  const normalizedProducts = (products ?? []).map((product: { id: string; name: string; description: string; price: number | string; image_url: string | null; stock: number; active: boolean; store_id: string }) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.image_url ?? "",
    stock: product.stock,
    active: product.active,
    storeId: product.store_id,
    category: "General",
    rating: 4.5,
    reviews: 0,
  }));

  return <StoreLandingClient slug={slug} store={store ? {
    id: store.id,
    name: store.name,
    slug: store.slug,
    description: store.description,
    logo: store.logo ?? undefined,
    heroTitle: store.hero_title ?? store.name,
    heroDescription: store.hero_description ?? store.description,
  } : null} products={normalizedProducts} />;
}
