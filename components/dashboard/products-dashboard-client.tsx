/* eslint-disable react-hooks/set-state-in-effect -- client-side localStorage/mock store data loading after hydration */
"use client";

import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SafeImage } from "@/components/ui/safe-image";
import { type MockProduct } from "@/lib/mock-products";
import { useStore } from "@/lib/store-context";
import { supabase } from "@/lib/supabase";

const defaultForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  imageUrl: "",
  status: "Active" as "Active" | "Draft",
};

type FormState = typeof defaultForm;

export function ProductsDashboardClient() {
  const { store, loading: storeLoading } = useStore();
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
  const [viewProduct, setViewProduct] = useState<MockProduct | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageSearchResults, setImageSearchResults] = useState<Array<{ url: string; photographer: string; pageUrl: string }>>([]);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imageSearchError, setImageSearchError] = useState("");

  const userStoreId = store?.id ?? null;

  useEffect(() => {
    if (storeLoading) return;

    if (!userStoreId) {
      setProducts([]);
      return;
    }

    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, store_id, name, description, price, image_url, stock, active")
        .eq("store_id", userStoreId)
        .order("created_at", { ascending: false });
      if (error) {
        setFormError(error.message);
        setProducts([]);
        return;
      }
      setProducts((data ?? []).map((product: { id: string; store_id: string; name: string; description: string; price: number | string; image_url: string | null; stock: number; active: boolean }) => ({
        id: product.id,
        storeId: product.store_id,
        name: product.name,
        description: product.description,
        category: "General",
        price: Number(product.price),
        stock: product.stock,
        imageUrl: product.image_url ?? "",
        status: (product.active ? "Active" : "Draft") as MockProduct["status"],
      })));
    };
    void loadProducts();
  }, [storeLoading, userStoreId]);

  const syncProductsToStore = async (next: MockProduct[]) => {
    if (!userStoreId) return;
    setProducts(next);
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return unique.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        [product.name, product.description, product.category, product.status].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const openCreateModal = () => {
    setSelectedProduct(null);
    setForm({ ...defaultForm, status: "Active" });
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditModal = (product: MockProduct) => {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl,
      status: product.status,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const openViewModal = (product: MockProduct) => {
    setViewProduct(product);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setViewProduct(null);
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
    const trimmedCategory = form.category.trim();
    const parsedPrice = Number(form.price);
    const parsedStock = Number(form.stock);

    if (!trimmedName || !trimmedDescription || !trimmedCategory) {
      setFormError("Product name, description, and category are required.");
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

    setIsSubmitting(true);

    if (selectedProduct) {
      const updated = products.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              name: trimmedName,
              description: trimmedDescription,
              category: trimmedCategory,
              price: parsedPrice,
              stock: parsedStock,
              imageUrl: form.imageUrl.trim() || product.imageUrl,
              status: form.status,
            }
          : product,
      );
      const { error } = await supabase.from("products").update({ name: trimmedName, description: trimmedDescription, price: parsedPrice, stock: parsedStock, image_url: form.imageUrl.trim() || null, active: form.status === "Active" }).eq("id", selectedProduct.id).eq("store_id", userStoreId);
      if (error) {
        setFormError(error.message);
        setIsSubmitting(false);
        return;
      }
      await syncProductsToStore(updated);
    } else {
      const newProduct: MockProduct = {
        id: crypto.randomUUID(),
        storeId: userStoreId || "store",
        name: trimmedName,
        description: trimmedDescription,
        category: trimmedCategory,
        price: parsedPrice,
        stock: parsedStock,
        imageUrl: form.imageUrl.trim(),
        status: form.status,
      };
      const { data, error } = await supabase.from("products").insert({ store_id: userStoreId, name: trimmedName, description: trimmedDescription, price: parsedPrice, stock: parsedStock, image_url: form.imageUrl.trim() || null, active: form.status === "Active" }).select("id, store_id, name, description, price, image_url, stock, active").single();
      if (error || !data) {
        setFormError(error?.message ?? "Could not create product.");
        setIsSubmitting(false);
        return;
      }
      await syncProductsToStore([{ ...newProduct, id: data.id, imageUrl: data.image_url ?? "", price: Number(data.price), stock: data.stock } , ...products]);
    }

    setIsSubmitting(false);
    closeFormModal();
  };

  const confirmDelete = (product: MockProduct) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedProduct) return;

    const next = products.filter((product) => product.id !== selectedProduct.id);
    void supabase.from("products").delete().eq("id", selectedProduct.id).eq("store_id", userStoreId).then(({ error }: { error: Error | null }) => {
      if (error) {
        setFormError(error.message);
        return;
      }
      void syncProductsToStore(next);
    });
    setIsDeleteOpen(false);
    setSelectedProduct(null);
  };

  const handleSearchImages = async () => {
    const trimmed = imageSearchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setImageSearchError("Enter a product name with at least 2 characters.");
      setImageSearchResults([]);
      return;
    }

    setImageSearchError("");
    setIsSearchingImages(true);
    setImageSearchResults([]);

    try {
      const response = await fetch("/api/images/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await response.json();
      if (!response.ok) {
        setImageSearchError(data.error || "No suitable image found. You can enter an Image URL manually.");
        setIsSearchingImages(false);
        return;
      }

      const results = Array.isArray(data.results) ? data.results : [];
      setImageSearchResults(results);
      if (results.length === 0) {
        setImageSearchError("No suitable image found. You can enter an Image URL manually.");
      }
    } catch {
      setImageSearchError("No suitable image found. You can enter an Image URL manually.");
      setImageSearchResults([]);
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleSelectImage = (url: string) => {
    setForm((current) => ({ ...current, imageUrl: url }));
    setImageSearchResults([]);
    setImageSearchError("");
  };

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
          <div className="flex flex-1 items-center gap-3 rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-3 py-2.5 md:max-w-md">
            <span className="text-sm text-[var(--muted)]">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="min-h-[44px] rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="min-h-[44px] rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>

            <div className="text-sm text-[var(--muted)]">
              {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                      No products match your search.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="align-middle">
                      <td className="px-4 py-4">
                        <SafeImage src={product.imageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"} alt={product.name} className="h-12 w-12 rounded-[0.875rem] object-cover" />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-semibold text-[var(--text)]">{product.name}</div>
                          <div className="mt-1 text-xs text-[var(--muted)]">{product.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[var(--text)]">{product.category}</td>
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
                            onClick={() => openViewModal(product)}
                            className="rounded-[0.75rem] border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--text)] transition hover:bg-slate-50"
                          >
                            View
                          </button>
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

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Category</span>
              <input
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="min-h-[44px] w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 placeholder:text-slate-400"
                placeholder="Electronics"
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

            <div className="block space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Image URL</span>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    value={form.imageUrl}
                    onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                    className="min-h-[44px] flex-1 rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 placeholder:text-slate-400"
                    placeholder="https://example.com/product.jpg"
                  />
                  <Button type="button" variant="secondary" onClick={handleSearchImages} disabled={isSearchingImages}>
                    {isSearchingImages ? "Searching..." : "Find Image"}
                  </Button>
                </div>
                {form.imageUrl ? (
                  <SafeImage src={form.imageUrl} alt="Selected product image preview" className="h-40 w-full rounded-[0.875rem] border border-[var(--border)] object-cover" fallback="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80" />
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-[var(--text)]">Search Images</span>
              <div className="flex gap-2">
                <input
                  value={imageSearchQuery}
                  onChange={(event) => setImageSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleSearchImages();
                    }
                  }}
                  className="min-h-[44px] flex-1 rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 placeholder:text-slate-400"
                  placeholder="Search for a product image..."
                />
                <Button type="button" variant="secondary" onClick={handleSearchImages} disabled={isSearchingImages}>
                  {isSearchingImages ? "Searching..." : "Search"}
                </Button>
              </div>
              {imageSearchError ? <p className="text-sm text-[var(--muted)]">{imageSearchError}</p> : null}
              {imageSearchResults.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {imageSearchResults.map((result) => (
                    <button
                      key={result.url + result.photographer}
                      type="button"
                      onClick={() => handleSelectImage(result.url)}
                      className="overflow-hidden rounded-[0.875rem] border border-[var(--border)] bg-slate-50 transition hover:ring-2 hover:ring-[var(--primary)]"
                    >
                      <SafeImage src={result.url} alt={imageSearchQuery} className="h-24 w-full object-cover" fallback="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

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

      <Modal open={isViewOpen} onClose={closeViewModal} title={viewProduct ? "Product Details" : "Product Details"}>
        <div className="p-6">
          {viewProduct ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Product</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{viewProduct.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={closeViewModal}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-slate-50"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
                <SafeImage src={viewProduct.imageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"} alt={viewProduct.name} className="h-56 w-full object-cover" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Category</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text)]">{viewProduct.category}</p>
                </div>
                <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Status</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text)]">{viewProduct.status}</p>
                </div>
                <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Price</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text)]">${viewProduct.price.toFixed(2)}</p>
                </div>
                <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Stock</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text)]">{viewProduct.stock}</p>
                </div>
              </div>

              <div className="rounded-[1rem] border border-[var(--border)] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Description</p>
                <p className="mt-1 text-sm leading-7 text-[var(--text)]">{viewProduct.description}</p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={closeViewModal}>
                  Close
                </Button>
                <Button type="button" variant="primary" onClick={() => { closeViewModal(); openEditModal(viewProduct); }}>
                  Edit Product
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
