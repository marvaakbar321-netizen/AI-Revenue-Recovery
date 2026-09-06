/* eslint-disable react-hooks/set-state-in-effect -- client-side localStorage cart hydration after mount */
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/store-utils";

export type CartProduct = Product & {
  image?: string;
  image_url?: string;
  storeId?: string;
};

export type CartLine = {
  productId: string;
  product: CartProduct;
  quantity: number;
  unitPrice: number;
  total: number;
};

const CART_STORAGE_KEY = "ai-revenue-recovery-cart";

function normalizeCartProduct(product: CartProduct): CartProduct {
  return {
    ...product,
    image: product.image ?? product.image_url ?? "",
    storeId: product.storeId ?? product.store_id,
  };
}

export function useStoreCart() {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved) as CartLine[];
      if (Array.isArray(parsed)) {
        setItems(parsed.map((line) => ({ ...line, product: normalizeCartProduct(line.product) })));
      }
    } catch (error) {
      console.warn("Failed to read cart from local storage", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: CartProduct, quantity = 1) => {
    const normalized = normalizeCartProduct(product);
    setItems((current) => {
      const item = current.find((line) => line.productId === normalized.id);
      const stockLimit = Number(normalized.stock ?? 0) || 0;
      const delta = Number(quantity) || 0;

      if (item) {
        const updatedQuantity = Math.min(item.quantity + delta, stockLimit || item.quantity + delta);
        if (updatedQuantity <= 0) {
          return current.filter((line) => line.productId !== normalized.id);
        }

        const nextUnitPrice = Number(normalized.price ?? 0);
        return current.map((line) =>
          line.productId === normalized.id
            ? {
                ...line,
                product: normalized,
                quantity: updatedQuantity,
                unitPrice: nextUnitPrice,
                total: nextUnitPrice * updatedQuantity,
              }
            : line,
        );
      }

      if (delta <= 0) return current;

      const unitPrice = Number(normalized.price ?? 0);
      const quantityToAdd = Math.min(Math.max(delta, 1), stockLimit || 1);
      return [
        ...current,
        {
          productId: normalized.id,
          product: normalized,
          quantity: quantityToAdd,
          unitPrice,
          total: unitPrice * quantityToAdd,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((current) =>
      current.flatMap((line) => {
        if (line.productId !== productId) return [line];

        if (quantity <= 0) return [];

        const maxAvailable = Number(line.product.stock ?? 0) || 1;
        const nextQuantity = Math.min(quantity, maxAvailable);

        return [
          {
            ...line,
            quantity: nextQuantity,
            total: Number(line.product.price ?? 0) * nextQuantity,
          },
        ];
      }),
    );
  };

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((line) => line.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const getItemsByStore = (storeId: string) => {
    return items.filter((line) => line.product.storeId === storeId || line.product.store_id === storeId);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + Number(line.total ?? 0), 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  );

  return {
    items,
    subtotal,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemsByStore,
  };
}
