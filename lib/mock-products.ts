export type ProductStatus = "Active" | "Draft";

export type MockProduct = {
  id: string;
  storeId: string;
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
    storeId: "store-tech",
    name: "Premium Wireless Headphones",
    description: "Enjoy clear, immersive sound with these premium wireless headphones. Designed with comfortable ear cushions, long battery life, and Bluetooth connectivity, they are perfect for music, work, travel, and everyday use.",
    category: "Electronics",
    price: 79.99,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    status: "Active",
  },
  {
    id: "prod-shoes",
    storeId: "store-tech",
    name: "Running Shoes",
    description: "Lightweight runners designed for comfort, speed, and every step.",
    category: "Fashion",
    price: 120,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    stock: 12,
    status: "Active",
  },
  {
    id: "prod-shirt",
    storeId: "store-tech",
    name: "Classic Cotton T-Shirt",
    description: "A comfortable everyday cotton T-shirt made with soft, breathable fabric. Its simple design makes it easy to wear for casual outings, work, or relaxing at home.",
    category: "Clothing",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    stock: 50,
    status: "Active",
  },
  {
    id: "prod-speaker",
    storeId: "store-tech",
    name: "Wireless Speaker",
    description: "Portable Bluetooth speaker with rich 360° sound.",
    category: "Electronics",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    stock: 18,
    status: "Active",
  },
  {
    id: "prod-backpack",
    storeId: "store-tech",
    name: "Everyday Backpack",
    description: "A lightweight and practical backpack with enough space for your everyday essentials. Perfect for work, university, travel, and daily activities.",
    category: "Accessories",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    stock: 30,
    status: "Active",
  },
  {
    id: "prod-watch",
    storeId: "store-tech",
    name: "Smart Fitness Watch",
    description: "Track your daily activity, workouts, and important fitness metrics with this modern smartwatch. Its lightweight design makes it comfortable for everyday use.",
    category: "Electronics",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80",
    stock: 18,
    status: "Active",
  },
];
