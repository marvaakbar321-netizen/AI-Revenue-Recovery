"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreCart } from "@/hooks/useStoreCart";
import type { ProductCardData } from "@/components/store/product-card";
import { CustomerProductCard } from "@/components/store/customer-product-card";

const PLACEHOLDER_PRODUCTS: ProductCardData[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium over-ear wireless headphones with noise cancellation.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    stock: 24,
    active: true,
    storeId: "store",
    category: "Electronics",
    rating: 4.8,
    reviews: 128,
  },
  {
    id: "2",
    name: "Running Shoes",
    description: "Lightweight performance runners designed for all-day comfort.",
    price: 120,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    stock: 12,
    active: true,
    storeId: "store",
    category: "Footwear",
    rating: 4.7,
    reviews: 95,
  },
  {
    id: "3",
    name: "Classic T-Shirt",
    description: "Everyday soft cotton tee in a timeless fit.",
    price: 35,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    stock: 45,
    active: true,
    storeId: "store",
    category: "Apparel",
    rating: 4.6,
    reviews: 76,
  },
  {
    id: "4",
    name: "Summer Wireless Speaker",
    description: "Portable wireless speaker for music anywhere.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    stock: 18,
    active: true,
    storeId: "store",
    category: "Electronics",
    rating: 4.8,
    reviews: 84,
  },
];

const STORE = {
  id: "store",
  name: "Marva Boutique",
  slug: "store",
  tagline: "Your style, your way",
  description: "Premium products curated for you.",
  logo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
  heroTitle: "Welcome to\nMarva Boutique",
  heroDescription: "Discover our latest collection and shop your favorite essentials.",
};

export function StoreLandingClient({ slug = "store" }: { slug?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useStoreCart();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={`/store/${slug}`} className="flex items-center gap-3 min-w-0">
            <div className="relative h-9 w-9 overflow-hidden rounded-[0.75rem] border border-slate-200 bg-slate-100">
              {STORE.logo ? (
                <Image src={STORE.logo} alt={STORE.name} fill className="object-cover" />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">{STORE.name}</p>
              <p className="truncate text-[11px] text-slate-500">{STORE.tagline}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href={`/store/${slug}`} className="transition hover:text-slate-900">Home</Link>
            <Link href={`/store/${slug}#products`} className="transition hover:text-slate-900">Products</Link>
            <Link href={`/store/${slug}#about`} className="transition hover:text-slate-900">About Us</Link>
            <Link href={`/store/${slug}#contact`} className="transition hover:text-slate-900">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-[0.75rem] text-slate-600 transition hover:bg-slate-50"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-[0.75rem] text-slate-600 transition hover:bg-slate-50"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </button>
            <Link href={`/store/${slug}/checkout`} className="inline-flex items-center gap-2 rounded-[0.75rem] border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
              <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-purple-50 text-purple-700">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                ) : null}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[0.75rem] border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav className="border-t border-slate-200 px-4 py-3 md:hidden">
            <Link href={`/store/${slug}`} className="block rounded-[0.75rem] px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Home</Link>
            <Link href={`/store/${slug}#products`} className="block rounded-[0.75rem] px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Products</Link>
            <Link href={`/store/${slug}#about`} className="block rounded-[0.75rem] px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">About Us</Link>
            <Link href={`/store/${slug}#contact`} className="block rounded-[0.75rem] px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Contact</Link>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center">
                <span className="inline-flex w-fit items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
                  ✦ New Collection 2025 ✦
                </span>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Welcome to<br />
                  <span className="text-purple-700">{STORE.name}</span>
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">{STORE.heroDescription}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/store/${slug}#products`}>
                    <Button variant="primary">Shop Now →</Button>
                  </Link>
                  <Link href={`/store/${slug}#products`}>
                    <Button variant="secondary">Explore Collection</Button>
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[1.5rem] border border-purple-100 bg-gradient-to-br from-purple-100 to-purple-50 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
                  alt="Marva Boutique Collection"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-purple-50 text-purple-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-1.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Free Shipping</p>
                  <p className="text-xs text-slate-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-purple-50 text-purple-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992h4.992m12.01 0h4.992m-15 0v4.992h4.992m-4.992-15v4.992" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Easy Returns</p>
                  <p className="text-xs text-slate-500">30 day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-purple-50 text-purple-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Secure Checkout</p>
                  <p className="text-xs text-slate-500">100% secure payment</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-700">Featured</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Our products</h2>
              <p className="mt-2 text-sm text-slate-500">Explore our most popular products.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PLACEHOLDER_PRODUCTS.map((product) => (
                <CustomerProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button variant="secondary">View All Products →</Button>
            </div>
          </div>
        </section>

        <section id="about" className="bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-700">Why Choose Us</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Store Benefits</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[0.75rem] bg-purple-50 text-purple-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Quality Products</h3>
                <p className="mt-2 text-sm text-slate-500">Carefully selected premium products for you.</p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[0.75rem] bg-purple-50 text-purple-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992h4.992m12.01 0h4.992m-15 0v4.992h4.992m-4.992-15v4.992" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Easy Shopping</h3>
                <p className="mt-2 text-sm text-slate-500">Simple and smooth shopping experience.</p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[0.75rem] bg-purple-50 text-purple-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-1.5" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Fast Delivery</h3>
                <p className="mt-2 text-sm text-slate-500">Quick delivery right to your doorstep.</p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[0.75rem] bg-purple-50 text-purple-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v9.75h-2.25v-9.75m0 0c0-.884-.616-1.613-1.5-2.097m1.5 2.097h2.25m-15 0h15M3 21h18M3 10h18M3 7l9-4 9 4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">Customer Support</h3>
                <p className="mt-2 text-sm text-slate-500">We&apos;re here to help 24/7 anytime.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-purple-700 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Stay Updated</h2>
              <p className="mt-2 text-sm text-purple-100">Subscribe to get special offers, giveaways, and once-in-a-lifetime deals.</p>
              <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-[0.75rem] border border-purple-500 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-purple-200 outline-none transition focus:border-white focus:ring-2 focus:ring-white/20"
                />
                <Button type="submit" variant="secondary" className="w-full sm:w-auto">Subscribe</Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">© 2025 {STORE.name}. All rights reserved.</p>
            <p className="text-sm text-slate-400">Powered by AI Revenue Recovery</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
