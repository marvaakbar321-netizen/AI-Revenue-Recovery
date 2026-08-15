"use client";

import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useStore } from "@/lib/store-context";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/store-utils";

const defaultForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  status: "Active" as "Active" | "Draft",
};

type FormState = typeof defaultForm;

function mapProductRow(row: Product) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    imageUrl: row.image_url ?? "",
    status: (row.status ?? (row.active ? "Active" : "Draft")) as "Active" | "Draft",
  };
}

export function ProductsDashboardClient() {
  const { store, loading: storeLoading } = useStore();
  const [products, setProducts] = useState<Array<ReturnType<typeof mapProductRow>>>([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ReturnType<typeof mapProductRow> | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!store) return;

    let isMounted = true;
    const currentStore = store;

    async function loadProducts() {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", currentStore.id)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setProducts([]);
      } else if (data) {
        setProducts(data.map(mapProductRow));
      }

      setLoading(false);
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [store]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.description, product.status].some((value) => value.toLowerCase().includes(query)),
    );
  }, [products, search]);

  const openCreateModal = () => {
    setSelectedProduct(null);
    setForm({ ...defaultForm, status: "Active" });
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditModal = (product: ReturnType<typeof mapProductRow>) => {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl,
      status: product.status,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
    setForm(defaultForm);
    setFormError("");
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedDescription = form.description.trim();
    const parsedPrice = Number(form.price);
    const parsedStock = Number(form.stock);

    if (!trimmedName || !trimmedDescription) {
      setFormError("Product name and description are required.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setFormError("Please enter a valid price greater than zero.");
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setFormError("Please enter a valid stock quantity.");
      return;
    }

    if (!store) {
      setFormError("You need a store before adding products.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedProduct) {
        const { error: updateError } = await supabase
          .from("products")
          .update({
            name: trimmedName,
            description: trimmedDescription,
            price: parsedPrice,
            stock: parsedStock,
            image_url: form.imageUrl.trim() || null,
            status: form.status,
          })
          .eq("id", selectedProduct.id);

        if (updateError) {
          setFormError(updateError.message);
          setIsSubmitting(false);
          return;
        }
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert({
            store_id: store.id,
            name: trimmedName,
            description: trimmedDescription,
            price: parsedPrice,
            stock: parsedStock,
            image_url: form.imageUrl.trim() || null,
            status: form.status,
          });

        if (insertError) {
          setFormError(insertError.message);
          setIsSubmitting(false);
          return;
        }
      }

      const { data, error: refetchError } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

      if (!refetchError && data) {
        setProducts(data.map(mapProductRow));
      }

      setIsSubmitting(false);
      closeFormModal();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (product: ReturnType<typeof mapProductRow>) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct || !store) return;

    await supabase
      .from("products")
      .delete()
      .eq("id", selectedProduct.id)
      .eq("store_id", store.id);

    setProducts((current) => current.filter((product) => product.id !== selectedProduct.id));
    setIsDeleteOpen(false);
    setSelectedProduct(null);
  };

  if (storeLoading) {
    return <p className="text-sm text-[var(--muted)]">Loading store…</p>;
  }

  if (!store) {
    return (
      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <p className="text-sm text-[var(--muted)]">Create a store first to manage products.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Catalog</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">Products</h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Manage the products in your store and prepare them for your next customer checkout flow.
          </p>
        </div>

        <Button variant="primary" onClick={openCreateModal}>Add Product</Button>
      </section>

      <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-3 py-2.5 md:min-w-[280px]">
            <span className="text-sm text-[var(--muted)]">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="text-sm text-[var(--muted)]">
            {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-[var(--danger)]">{error}</p>
        ) : loading ? (
          <p className="mt-10 text-center text-sm text-[var(--muted)]">Loading products…</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--border)] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Stock</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                        No products match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="align-middle">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"}
                              alt={product.name}
                              className="h-12 w-12 rounded-[0.875rem] object-cover"
                            />
                            <div>
                              <div className="font-semibold text-[var(--text)]">{product.name}</div>
                              <div className="mt-1 text-xs text-[var(--muted)]">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[var(--text)]">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--text)]">{product.stock}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              product.status === "Active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
                              className="rounded-[0.75rem] border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--text)] transition hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmDelete(product)}
                              className="rounded-[0.75rem] border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <Modal open={isFormOpen} onClose={closeFormModal} title={selectedProduct ? "Edit Product" : "Add Product"}>
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Product</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                {selectedProduct ? "Edit Product" : "Add Product"}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeFormModal}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-slate-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Product Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="min-h-[44px] w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 placeholder:text-slate-400"
                placeholder="Summer Wireless Speaker"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 placeholder:text-slate-400"
                placeholder="Describe the product features and value."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--text)]">Price</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  className="min-h-[44px] w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                  placeholder="79.99"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--text)]">Stock</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                  className="min-h-[44px] w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                  placeholder="24"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Image URL</span>
              <input
                value={form.imageUrl}
                onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                className="min-h-[44px] w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 placeholder:text-slate-400"
                placeholder="https://example.com/product.jpg"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as "Active" | "Draft" }))}
                className="min-h-[44px] w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </label>

            {formError ? <p className="text-sm text-[var(--danger)]">{formError}</p> : null}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={closeFormModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : selectedProduct ? "Save Changes" : "Add Product"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Product">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-[var(--text)]">Delete Product?</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Are you sure you want to delete <span className="font-semibold text-[var(--text)]">{selectedProduct?.name}</span>? This action cannot be undone.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
