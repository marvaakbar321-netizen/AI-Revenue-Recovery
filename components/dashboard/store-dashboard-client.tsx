"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useStore } from "@/lib/store-context";
import { formatCurrency, slugify } from "@/lib/store-utils";

const initialForm = {
  name: "",
  description: "",
  logo: "",
  slug: "",
  heroTitle: "",
  heroDescription: "",
};

export function StoreDashboardClient() {
  const { user } = useAuth();
  const { store, loading, error, createStore } = useStore();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const createdStore = useMemo(() => store, [store]);

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) return;

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      return;
    }

    setSubmitting(true);

    const slugValue = slugify(form.slug || form.name);
    const newStore = await createStore({
      name: trimmedName,
      description: form.description,
      logo: form.logo,
      slug: slugValue,
      heroTitle: form.heroTitle || `Welcome to ${trimmedName}`,
      heroDescription: form.heroDescription || "Discover our latest collection and shop your favorite essentials.",
    });

    setSubmitting(false);
    setForm(initialForm);

    if (newStore) {
      window.location.href = `/store/${newStore.slug}`;
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
          <Link href={`/store/${createdStore.slug}`} className="text-sm font-semibold text-[var(--primary)]">
            View public store →
          </Link>
        ) : null}
      </section>

      {!createdStore && !loading ? (
        <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-[var(--text)]">Create Your Store</h2>
            <p className="text-sm text-[var(--muted)]">
              Build a reusable storefront template with your store information and hero content.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-[var(--text)]">Store name</span>
              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="Marva Boutique"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-[var(--text)]">Store description</span>
              <textarea
                value={form.description}
                onChange={(event) => handleChange("description", event.target.value)}
                rows={4}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="Share what makes your collection special."
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Store logo / image URL</span>
              <input
                value={form.logo}
                onChange={(event) => handleChange("logo", event.target.value)}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="https://example.com/logo.jpg"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Store slug</span>
              <input
                value={form.slug}
                onChange={(event) => handleChange("slug", event.target.value)}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="marva-boutique"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-[var(--text)]">Hero title</span>
              <input
                value={form.heroTitle}
                onChange={(event) => handleChange("heroTitle", event.target.value)}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="Welcome to Marva Boutique"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-[var(--text)]">Hero description</span>
              <textarea
                value={form.heroDescription}
                onChange={(event) => handleChange("heroDescription", event.target.value)}
                rows={3}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="Discover our latest collection and shop your favorite essentials."
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
                <dd className="font-semibold text-[var(--text)]">{formatCurrency(0)}</dd>
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
