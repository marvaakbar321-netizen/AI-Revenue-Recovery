"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useStore } from "@/lib/store-context";
import { formatCurrency, slugify } from "@/lib/store-utils";
import { useOrders } from "@/hooks/useOrders";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const initialForm = {
  name: "",
  description: "",
  logo: "",
};

type FormState = typeof initialForm;

export function StoreDashboardClient() {
  const { user } = useAuth();
  const { store, loading, error, createStore } = useStore();
  const { orders, customerCount } = useOrders();
  const stats = useDashboardStats(orders, store?.products?.length ?? 0, 0, customerCount);
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const createdStore = useMemo(() => store, [store]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) return;

    const trimmedName = form.name.trim();
    const trimmedDescription = form.description.trim();
    const slugValue = slugify(trimmedName);
    const heroTitle = `Welcome to ${trimmedName}`;
    const heroDescription = trimmedDescription;

    if (!trimmedName || !trimmedDescription) {
      return;
    }

    if (store) {
      return;
    }

    setSubmitting(true);

    const newStore = await createStore({
      name: trimmedName,
      description: trimmedDescription,
      logo: form.logo,
      slug: slugValue,
      heroTitle,
      heroDescription,
    });

    setSubmitting(false);
    setForm(initialForm);

    if (newStore) {
      router.push(`/store/${newStore.slug}`);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Store</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">Your storefront</h1>
        </div>
        {createdStore ? (
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/products`} className="text-sm font-semibold text-[var(--primary)]">
              Manage products →
            </Link>
            <Link href={`/store/${createdStore.slug}`} className="text-sm font-semibold text-[var(--primary)]">
              View public store →
            </Link>
          </div>
        ) : null}
      </section>

      {!createdStore && !loading ? (
        <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-[var(--text)]">Create Your Store</h2>
            <p className="text-sm text-[var(--muted)]">
              Build your storefront with a few simple details.
            </p>
          </div>

          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Store name <span className="text-[var(--danger)]">*</span></span>
              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="Marva Boutique"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Store description <span className="text-[var(--danger)]">*</span></span>
              <textarea
                value={form.description}
                onChange={(event) => handleChange("description", event.target.value)}
                rows={4}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="Tell customers what makes your store special."
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Store logo / image <span className="text-xs text-[var(--muted)]">(optional)</span></span>
              <input
                value={form.logo || ""}
                onChange={(event) => handleChange("logo", event.target.value)}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="https://example.com/logo.jpg"
              />
            </label>
          </div>

          {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setForm(initialForm)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Creating…" : "Create Store"}
            </Button>
          </div>
        </form>
      ) : null}

      {createdStore ? (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Store details</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--text)]">{createdStore.name}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{createdStore.description}</p>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-[1rem] bg-slate-50 p-3">
                <dt className="text-[var(--muted)]">Slug</dt>
                <dd className="font-semibold text-[var(--text)]">/{createdStore.slug}</dd>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] bg-slate-50 p-3">
                <dt className="text-[var(--muted)]">Products</dt>
                <dd className="font-semibold text-[var(--text)]">{createdStore.products?.length ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] bg-slate-50 p-3">
                <dt className="text-[var(--muted)]">Revenue</dt>
                <dd className="font-semibold text-[var(--text)]">{formatCurrency(stats.totalRevenue)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Next actions</p>
            <div className="mt-5 space-y-3">
              <Link href="/dashboard/products" className="block w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm font-semibold text-[var(--text)] text-center">
                Manage products
              </Link>
              <Link href="/dashboard/orders" className="block w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm font-semibold text-[var(--text)] text-center">
                View orders
              </Link>
              <Link href={`/store/${createdStore.slug}`} className="block w-full rounded-[0.875rem] bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white text-center">
                Open storefront
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
