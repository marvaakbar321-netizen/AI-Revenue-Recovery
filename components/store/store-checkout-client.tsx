"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStoreCart } from "@/hooks/useStoreCart";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/store-utils";
import { SafeImage } from "@/components/ui/safe-image";
export function CustomerCheckoutPageClient() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; description: string; price: number; image: string; stock: number } | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(true);

  const { clearCart } = useStoreCart();
  const shipping = 0;
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerPostalCode, setCustomerPostalCode] = useState("");
  const [customerCountry, setCustomerCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    const loadProduct = async () => {
      if (!productId) { setLoading(false); return; }
      const { data } = await supabase.from("products").select("id, store_id, name, description, price, image_url, stock").eq("id", productId).eq("active", true).maybeSingle();
      if (!active) return;
      if (data) {
        const { data: store } = await supabase.from("stores").select("name").eq("id", data.store_id).maybeSingle();
        setStoreId(data.store_id);
        setStoreName(store?.name ?? "the store");
        setSelectedProduct({ id: data.id, name: data.name, description: data.description, price: Number(data.price), image: data.image_url ?? "", stock: data.stock });
      }
      setLoading(false);
    };
    void loadProduct();
    return () => { active = false; };
  }, [productId]);

  const unitPrice = selectedProduct ? selectedProduct.price : 0;
  const subtotal = unitPrice * quantity;
  const total = subtotal + shipping;

  const handleQuantityChange = (delta: number) => {
    setQuantity((current) => Math.min(10, Math.max(1, current + delta)));
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) {
      setError("No product selected.");
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerAddress.trim() || !customerCity.trim() || !customerPostalCode.trim() || !customerCountry.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    if (!storeId) { setError("Store information is missing."); setSubmitting(false); return; }
    try {
      const { error: orderError } = await supabase.rpc("create_store_order", {
        p_store_id: storeId,
        p_customer_name: customerName.trim(),
        p_customer_email: customerEmail.trim().toLowerCase(),
        p_customer_phone: customerPhone.trim(),
        p_customer_address: `${customerAddress.trim()}, ${customerCity.trim()}, ${customerPostalCode.trim()}, ${customerCountry.trim()}`,
        p_items: [{ product_id: selectedProduct.id, quantity }],
      });
      if (orderError) throw new Error(orderError.message);
    } catch (orderError) {
      setError(orderError instanceof Error ? orderError.message : "Failed to place order.");
      setSubmitting(false);
      return;
    }
    clearCart();
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div className="rounded-[1.5rem] border border-purple-200 bg-purple-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-700">Order Ready!</p>
          <h1 className="mt-3 text-3xl font-semibold text-purple-900">Your order has been prepared successfully.</h1>
          <p className="mt-3 text-sm text-purple-700">
            Thank you for shopping with {storeName || "the store"}. We&apos;ll send a confirmation to your email shortly.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" onClick={() => setSuccess(false)}>Place another order</Button>
            <Link href="/store">
              <Button variant="secondary">Back to Store</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-500">Loading product…</div>;
  }

  if (!selectedProduct) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-700">Checkout</p>
          <h1 className="text-3xl font-semibold text-slate-900">No product selected</h1>
          <p className="text-sm text-slate-500">Please return to the store and select a product.</p>
        </div>
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">No product selected</p>
          <p className="mt-2 text-sm text-slate-500">Browse the store and add something you love.</p>
          <Link href="/store">
            <Button variant="primary" className="mt-5">Return to Store</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-700">Checkout</p>
          <h1 className="text-3xl font-semibold text-slate-900">Complete your order</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 text-sm font-medium text-emerald-700 sm:inline-flex">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Secure Checkout
          </span>
          <Link href="/store" className="text-sm font-semibold text-purple-700">
            ← Back to store
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Customer information</h2>
                <p className="mt-1 text-sm text-slate-500">Enter your details to complete the order.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-900">Full name <span className="text-red-500">*</span></span>
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    className="w-full rounded-[0.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    placeholder="Jane Smith"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">Email address <span className="text-red-500">*</span></span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    className="w-full rounded-[0.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    placeholder="jane@example.com"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">Phone number</span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    className="w-full rounded-[0.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    placeholder="(555) 123-4567"
                  />
                </label>

                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-900">Address <span className="text-red-500">*</span></span>
                  <input
                    value={customerAddress}
                    onChange={(event) => setCustomerAddress(event.target.value)}
                    className="w-full rounded-[0.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    placeholder="123 Main Street"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">City <span className="text-red-500">*</span></span>
                  <input
                    value={customerCity}
                    onChange={(event) => setCustomerCity(event.target.value)}
                    className="w-full rounded-[0.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    placeholder="Springfield"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">Postal code <span className="text-red-500">*</span></span>
                  <input
                    value={customerPostalCode}
                    onChange={(event) => setCustomerPostalCode(event.target.value)}
                    className="w-full rounded-[0.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    placeholder="62701"
                  />
                </label>

                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-900">Country <span className="text-red-500">*</span></span>
                  <select
                    value={customerCountry}
                    onChange={(event) => setCustomerCountry(event.target.value)}
                    className="w-full rounded-[0.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                  >
                    <option value="">Select a country</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
            <p className="mt-1 text-sm text-slate-500">{quantity} item{quantity === 1 ? "" : "s"}</p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                <SafeImage src={selectedProduct.image} alt={selectedProduct.name} className="h-20 w-20 rounded-[0.75rem] object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{selectedProduct.name}</p>
                  <p className="text-xs text-slate-500">{selectedProduct.description}</p>
                  <p className="mt-1 text-sm font-semibold text-purple-700">{formatCurrency(selectedProduct.price)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] border border-slate-200 bg-white text-sm text-slate-700 transition hover:bg-slate-50"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm font-semibold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] border border-slate-200 bg-white text-sm text-slate-700 transition hover:bg-slate-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-3 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-700">Free</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <Button type="button" variant="primary" className="w-full" disabled={submitting} onClick={handlePlaceOrder}>
                {submitting ? "Placing order…" : "Complete Order"}
              </Button>
            </div>
          </div>

          <div className="rounded-[1rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Secure checkout
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-1.5" />
                </svg>
                Free shipping
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992h4.992m12.01 0h4.992m-15 0v4.992h4.992m-4.992-15v4.992" />
                </svg>
                Easy returns
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
