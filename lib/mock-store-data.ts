import { slugify } from "@/lib/store-utils";

export type MockStoreProduct = {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  active: boolean;
};

export type MockStore = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo: string;
  slug: string;
  heroTitle: string;
  heroDescription: string;
  banner?: string;
  category?: string;
  owner?: string;
  email?: string;
  phone?: string;
  address?: string;
  currency?: string;
  shipping?: string;
  status?: string;
  products: MockStoreProduct[];
};

export type MockOrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  image: string;
};

export type MockOrder = {
  id: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: MockOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
};

const STORE_STORAGE_KEY = "ai_revenue_mock_stores";
const ORDER_STORAGE_KEY = "ai_revenue_mock_orders";

const fallbackStoreProducts: MockStoreProduct[] = [
  {
    id: "prod-headphones",
    storeId: "store-tech",
    name: "Premium Wireless Headphones",
    description: "Enjoy clear, immersive sound with these premium wireless headphones. Designed with comfortable ear cushions, long battery life, and Bluetooth connectivity, they are perfect for music, work, travel, and everyday use.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    stock: 25,
    active: true,
  },
  {
    id: "prod-shoes",
    storeId: "store-tech",
    name: "Running Shoes",
    description: "Lightweight runners designed for comfort, speed, and every step.",
    price: 120,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    stock: 12,
    active: true,
  },
  {
    id: "prod-speaker",
    storeId: "store-tech",
    name: "Wireless Speaker",
    description: "Portable Bluetooth speaker with rich 360° sound.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    stock: 18,
    active: true,
  },
  {
    id: "prod-backpack",
    storeId: "store-tech",
    name: "Everyday Backpack",
    description: "A lightweight and practical backpack with enough space for your everyday essentials. Perfect for work, university, travel, and daily activities.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    stock: 30,
    active: true,
  },
  {
    id: "prod-watch",
    storeId: "store-tech",
    name: "Smart Fitness Watch",
    description: "Track your daily activity, workouts, and important fitness metrics with this modern smartwatch. Its lightweight design makes it comfortable for everyday use.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80",
    stock: 18,
    active: true,
  },
];

const fallbackStores: MockStore[] = [
  {
    id: "store-tech",
    ownerId: "demo-owner",
    name: "Marva Store",
    description: "Discover quality products at affordable prices, carefully selected to make your everyday shopping simple and enjoyable. Explore our collection of fashion, lifestyle, and everyday essentials.",
    logo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    slug: "marva-store",
    heroTitle: "Quality Products, Simple Shopping",
    heroDescription: "Explore our carefully selected collection of products designed to make your everyday life easier and more enjoyable.",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    category: "Lifestyle & Fashion",
    owner: "Marva",
    email: "marva@example.com",
    phone: "+92 300 1234567",
    address: "Faisalabad, Pakistan",
    currency: "USD",
    shipping: "Free Shipping",
    status: "Active",
    products: fallbackStoreProducts,
  },
  {
    id: "store-fashion",
    ownerId: "demo-owner",
    name: "Fatima Fashion",
    description: "Curated style essentials and statement pieces for everyday confidence.",
    logo: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80",
    slug: "fatima-fashion",
    heroTitle: "Welcome to Fatima Fashion",
    heroDescription: "Shop the latest trends and wardrobe staples curated for effortless everyday style.",
    products: [
      {
        id: "prod-blazer",
        storeId: "store-fashion",
        name: "Tailored Blazer",
        description: "Complete your look with a polished silhouette and premium finish.",
        price: 149,
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
        stock: 18,
        active: true,
      },
      {
        id: "prod-sneaker",
        storeId: "store-fashion",
        name: "Street Sneaker",
        description: "Everyday comfort with bold design and premium cushioning.",
        price: 95,
        image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80",
        stock: 20,
        active: true,
      },
      {
        id: "prod-dress",
        storeId: "store-fashion",
        name: "Luna Dress",
        description: "Soft, elegant, and versatile for work or weekend plans.",
        price: 110,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        stock: 16,
        active: true,
      },
    ],
  },
];

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getMockStores(): MockStore[] {
  const stores = readJSON<MockStore[]>(STORE_STORAGE_KEY, fallbackStores);
  if (stores.length === 0) {
    writeJSON(STORE_STORAGE_KEY, fallbackStores);
    return fallbackStores;
  }

  return stores;
}

export function getMockStoreBySlug(slug: string): MockStore | null {
  return getMockStores().find((store) => store.slug === slug) ?? null;
}

export function getMockStoreById(storeId: string): MockStore | null {
  return getMockStores().find((store) => store.id === storeId) ?? null;
}

export function createMockStore(input: {
  name: string;
  description: string;
  logo: string;
  slug: string;
  heroTitle: string;
  heroDescription: string;
}) {
  const stores = getMockStores();

  const normalizedSlug = slugify(input.slug || input.name);
  const trimmedName = input.name.trim();
  const finalSlug = normalizedSlug || "my-store";

  const store: MockStore = {
    id: `store-${Date.now()}`,
    ownerId: "demo-owner",
    name: trimmedName || "My Store",
    description: input.description.trim() || "A simple, clean storefront for my products.",
    logo: input.logo.trim() || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    slug: finalSlug,
    heroTitle: input.heroTitle.trim() || `Welcome to ${trimmedName || "My Store"}`,
    heroDescription: input.heroDescription.trim() || "Shop the latest products and discover what makes our collection special.",
    products: [],
  };

  const existingIndex = stores.findIndex((item) => item.slug === finalSlug);
  if (existingIndex >= 0) {
    stores[existingIndex] = store;
  } else {
    stores.unshift(store);
  }

  writeJSON(STORE_STORAGE_KEY, stores);
  return store;
}

export function updateStoreProducts(storeId: string, products: MockStoreProduct[]) {
  const stores = getMockStores();
  const target = stores.find((store) => store.id === storeId);
  if (!target) return;

  target.products = products;
  writeJSON(STORE_STORAGE_KEY, stores);
}

export function getMockOrders(): MockOrder[] {
  return readJSON<MockOrder[]>(ORDER_STORAGE_KEY, [
    {
      id: "ORD-1001",
      storeId: "store-tech",
      storeName: "Tech Store",
      customerName: "Ava Thompson",
      customerEmail: "ava@example.com",
      customerPhone: "(555) 123-4444",
      customerAddress: "218 Market Street, Boston, MA",
      items: [
        {
          id: "line-1",
          productId: "prod-headphones",
          productName: "Wireless Headphones",
          quantity: 1,
          unitPrice: 79.99,
          total: 79.99,
          image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80",
        },
        {
          id: "line-2",
          productId: "prod-shoes",
          productName: "Running Shoes",
          quantity: 1,
          unitPrice: 120,
          total: 120,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
        },
      ],
      subtotal: 199.99,
      shipping: 0,
      total: 199.99,
      status: "Paid",
      createdAt: new Date().toISOString(),
    },
  ]);
}

export function addMockOrder(order: MockOrder) {
  const orders = getMockOrders();
  orders.unshift(order);
  writeJSON(ORDER_STORAGE_KEY, orders);
}

export function getMockRevenueTotal() {
  return getMockOrders().reduce((sum, order) => sum + Number(order.total ?? 0), 0);
}

export function getMockStoreProductById(storeId: string, productId: string): MockStoreProduct | null {
  const store = getMockStoreById(storeId);
  if (!store) return null;
  return store.products.find((product) => product.id === productId) ?? null;
}
