"use client";

import { useEffect, useState, createContext, useContext, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Store } from "@/lib/store-utils";
import { createMockStore } from "@/lib/mock-store-data";

type StoreContextValue = {
  store: Store | null;
  loading: boolean;
  error: string | null;
  refreshStore: () => Promise<void>;
  createStore: (input: {
    name: string;
    description: string;
    logo: string;
    slug: string;
    heroTitle: string;
    heroDescription: string;
  }) => Promise<Store | null>;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function isMissingStoreTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const message = (error as { message?: string }).message ?? "";
  return message.includes("Could not find the table") || message.includes("schema cache");
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);

  const refreshStore = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setStore(null);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", session.user.id)
        .maybeSingle();

      if (fetchError) {
        if (isMissingStoreTableError(fetchError)) {
          setStore(null);
          setLoading(false);
          return;
        }
        setError(fetchError.message);
        setStore(null);
      } else if (data) {
        setStore(data as Store);
      } else {
        setStore(null);
      }
    } catch (err) {
      if (isMissingStoreTableError(err)) {
        setStore(null);
        setLoading(false);
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load store");
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (input: {
    name: string;
    description: string;
    logo: string;
    slug: string;
    heroTitle: string;
    heroDescription: string;
  }): Promise<Store | null> => {
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setError("You must be logged in to create a store.");
        return null;
      }

      const { data, error: insertError } = await supabase
        .from("stores")
        .insert({
          owner_id: session.user.id,
          name: input.name.trim(),
          description: input.description.trim(),
          logo: input.logo.trim() || null,
          slug: input.slug.trim(),
          hero_title: input.heroTitle.trim(),
          hero_description: input.heroDescription.trim(),
        })
        .select("*")
        .single();

      if (insertError) {
        if (isMissingStoreTableError(insertError)) {
          const mockStore = createMockStore({
            name: input.name,
            description: input.description,
            logo: input.logo,
            slug: input.slug,
            heroTitle: input.heroTitle,
            heroDescription: input.heroDescription,
          });
          const fallbackStore: Store = {
            id: mockStore.id,
            owner_id: session.user.id,
            name: mockStore.name,
            slug: mockStore.slug,
            description: mockStore.description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setStore(fallbackStore);
          return fallbackStore;
        }
        setError(insertError.message);
        return null;
      }

      setStore(data as Store);
      return data as Store;
    } catch (err) {
      if (isMissingStoreTableError(err)) {
        const mockStore = createMockStore({
          name: input.name,
          description: input.description,
          logo: input.logo,
          slug: input.slug,
          heroTitle: input.heroTitle,
          heroDescription: input.heroDescription,
        });
        const fallbackStore: Store = {
          id: mockStore.id,
          owner_id: "demo-owner",
          name: mockStore.name,
          slug: mockStore.slug,
          description: mockStore.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setStore(fallbackStore);
        return fallbackStore;
      }
      setError(err instanceof Error ? err.message : "Failed to create store");
      return null;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    refreshStore();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <StoreContext.Provider value={{ store, loading, error, refreshStore, createStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
