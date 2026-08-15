export type Store = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
  products?: Array<{
    id: string;
    storeId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    active: boolean;
  }>;
};

export type Product = {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number | string;
  image_url?: string | null;
  stock: number;
  active: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type Customer = {
  id: string;
  store_id: string;
  name: string;
  email: string;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Order = {
  id: string;
  store_id: string;
  customer_id: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping: number;
  total: number;
  created_at?: string;
  updated_at?: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  product?: Product;
};

export const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80";

export function formatCurrency(amount: number | string) {
  const numericValue = Number(amount ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "store";
}

export function getStorePath(slug: string) {
  return `/store/${slug}`;
}
