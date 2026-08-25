export type ProductStatus = "Active" | "Draft";

export type MockProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: ProductStatus;
};

export const mockProducts: MockProduct[] = [
  {
    id: "prod-headphones",
    name: "Wireless Headphones",
    description: "Premium over-ear wireless headphones with active noise cancellation.",
    category: "Electronics",
    price: 79.99,
    stock: 24,
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    status: "Active",
  },
  {
    id: "prod-shoes",
    name: "Running Shoes",
    description: "Lightweight performance runners designed for all-day comfort.",
    category: "Fashion",
    price: 120,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    status: "Active",
  },
  {
    id: "prod-shirt",
    name: "Classic T-Shirt",
    description: "Everyday soft cotton tee in a timeless fit.",
    category: "Clothing",
    price: 35,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    status: "Draft",
  },
  {
    id: "prod-speaker",
    name: "Wireless Speaker",
    description: "Portable Bluetooth speaker with rich 360° sound.",
    category: "Electronics",
    price: 59.99,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    status: "Active",
  },
];
