"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "@/components/store/product-details";
import { useStoreCart } from "@/hooks/useStoreCart";
import { supabase } from "@/lib/supabase";

export function ProductDetailsPageClient({ slug, productId }: { slug: string; productId: string }) {
  const { addItem } = useStoreCart();
  const [addedMessage, setAddedMessage] = useState("");

  const [store, setStore] = useState<{ id: string; name: string } | null>(null);
  const [product, setProduct] = useState<{ id: string; name: string; description: string; price: number; image: string; stock: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data: storeData } = await supabase.from("stores").select("id, name").eq("slug", slug).maybeSingle();
      if (!active || !storeData) {
        if (active) setLoading(false);
        return;
      }
      const { data: productData } = await supabase.from("products").select("id, name, description, price, image_url, stock").eq("id", productId).eq("store_id", storeData.id).eq("active", true).maybeSingle();
      if (!active) return;
      setStore(storeData);
      setProduct(productData ? { id: productData.id, name: productData.name, description: productData.description, price: Number(productData.price), image: productData.image_url ?? "", stock: productData.stock } : null);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [productId, slug]);

  const handleAddToCart = (product: { id: string; name: string; description: string; price: number; image: string; stock: number }, quantity = 1) => {
    if (!store || !product) return;
    addItem({
      id: product.id,
      store_id: store.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image,
      stock: product.stock,
      active: true,
      image: product.image,
    }, quantity);
    setAddedMessage(`${quantity} ${product.name} added to cart.`);
  };

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[var(--muted)]">Loading product…</div>;

  if (!store || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-[var(--text)]">Product not found</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">The product you are looking for does not exist.</p>
          <Link href={`/store/${slug}`}>
            <Button variant="primary" className="mt-5">Back to store</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`/store/${slug}`} className="text-sm font-semibold text-[var(--primary)]">
          ← Back to {store.name}
        </Link>
      </div>
      <ProductDetails product={product} storeSlug={slug} onAddToCart={handleAddToCart} />
      {addedMessage ? (
        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
          <p className="text-sm text-emerald-600">{addedMessage}</p>
        </div>
      ) : null}
    </div>
  );
}
