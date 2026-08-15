"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStoreCart } from "@/hooks/useStoreCart";
import { addMockOrder, getMockOrders, getMockStoreBySlug, getMockStoreById } from "@/lib/mock-store-data";
import { formatCurrency } from "@/lib/store-utils";

export function CheckoutPageClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useStoreCart();

  const store = useMemo(() => {
    const found = getMockStoreBySlug(slug);
    return found ? { id: found.id, name: found.name, slug: found.slug } : null;
  }, [slug]);

  const shipping = 0;
  const total = subtotal + shipping;
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

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const handlePlaceOrder = () => {
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerAddress.trim() || !customerCity.trim() || !customerPostalCode.trim() || !customerCountry.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!store) {
      setError("Store information is missing.");
      return;
    }

    setSubmitting(true);
    setError("");

    const storeData = getMockStoreById(store.id) ?? { name: store.name };
    const orderId = `ORD-${String(getMockOrders().length + 1001).padStart(4, "0")}`;

    const orderItems = items.map((item) => ({
      id: `line-${Date.now()}-${item.productId}`,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice ?? item.product.price ?? 0),
      total: Number(item.total ?? 0),
      image: item.product.image ?? item.product.image_url ?? "",
    }));

    const order = {
      id: orderId,
      storeId: store.id,
      storeName: storeData.name,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim() || "(555) 000-0000",
      customerAddress: `${customerAddress.trim()}, ${customerCity.trim()}, ${customerPostalCode.trim()}, ${customerCountry.trim()}`,
      items: orderItems,
      subtotal,
      shipping,
      total,
      status: "Paid",
      createdAt: new Date().toISOString(),
    };

    addMockOrder(order);
    clearCart();
    setSubmitting(false);
    setSuccess(true);
  };

  if (!store) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Checkout</p>
          <h1 className="text-3xl font-semibold text-[var(--text)]">Store not found</h1>
          <p className="text-sm text-[var(--muted)]">The store you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Order Ready</p>
          <h1 className="mt-3 text-3xl font-semibold text-emerald-900">Your order has been prepared successfully.</h1>
          <p className="mt-3 text-sm text-emerald-700">
            Thank you for shopping with {store.name}. We&apos;ll send a confirmation to your email shortly.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" onClick={() => router.push(`/store/${store.slug}`)}>Continue shopping</Button>
            <Button variant="secondary" onClick={() => setSuccess(false)}>Place another order</Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Checkout</p>
          <h1 className="text-3xl font-semibold text-[var(--text)]">Your cart is empty</h1>
          <p className="text-sm text-[var(--muted)]">Add products to your cart before placing an order.</p>
        </div>
        <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-[var(--text)]">No product selected</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Browse the store and add something you love.</p>
          <Link href={`/store/${store.slug}`}>
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
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Checkout</p>
          <h1 className="text-3xl font-semibold text-[var(--text)]">Complete your order</h1>
        </div>
        <Link href={`/store/${store.slug}`} className="text-sm font-semibold text-[var(--primary)]">
          ← Back to store
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text)]">Customer information</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Enter your details to complete the order.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-[var(--text)]">Full name <span className="text-[var(--danger)]">*</span></span>
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                    placeholder="Jane Smith"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--text)]">Email address <span className="text-[var(--danger)]">*</span></span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                    placeholder="jane@example.com"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--text)]">Phone number</span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                    placeholder="(555) 123-4567"
                  />
                </label>

                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-[var(--text)]">Address <span className="text-[var(--danger)]">*</span></span>
                  <input
                    value={customerAddress}
                    onChange={(event) => setCustomerAddress(event.target.value)}
                    className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                    placeholder="123 Main Street"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--text)]">City <span className="text-[var(--danger)]">*</span></span>
                  <input
                    value={customerCity}
                    onChange={(event) => setCustomerCity(event.target.value)}
                    className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                    placeholder="Springfield"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--text)]">Postal code <span className="text-[var(--danger)]">*</span></span>
                  <input
                    value={customerPostalCode}
                    onChange={(event) => setCustomerPostalCode(event.target.value)}
                    className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                    placeholder="62701"
                  />
                </label>

                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-sm font-medium text-[var(--text)]">Country <span className="text-[var(--danger)]">*</span></span>
                  <select
                    value={customerCountry}
                    onChange={(event) => setCustomerCountry(event.target.value)}
                    className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
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
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[var(--text)]">Order summary</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{itemCount} item{itemCount === 1 ? "" : "s"} in your cart</p>

            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="h-14 w-14 rounded-[0.75rem] object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--text)]">{item.product.name}</p>
                      <p className="text-xs text-[var(--muted)]">{formatCurrency(item.unitPrice)} each</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] border border-[var(--border)] bg-white text-sm text-[var(--text)] transition hover:bg-slate-50"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold text-[var(--text)]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] border border-[var(--border)] bg-white text-sm text-[var(--text)] transition hover:bg-slate-50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text)]">{formatCurrency(item.total)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="mt-2 text-xs font-medium text-[var(--danger)] transition hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Subtotal</span>
                <span className="font-semibold text-[var(--text)]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-base font-semibold text-[var(--text)]">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}

            <Button type="button" variant="primary" className="mt-6 w-full" disabled={submitting} onClick={handlePlaceOrder}>
              {submitting ? "Placing order…" : "Complete Order"}
            </Button>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--border)] bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
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
