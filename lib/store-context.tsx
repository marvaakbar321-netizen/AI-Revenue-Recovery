"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import type { Store } from "@/lib/store-utils";

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

      const { data: existingStore, error: existingError } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", session.user.id)
        .maybeSingle();

      if (existingError) {
        setError(existingError.message);
        return null;
      }

      if (existingStore) {
        setStore(existingStore as Store);
        return existingStore as Store;
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
        if (isMissingStoreTableError(insertError)) setError("Store setup is unavailable until the Supabase migration is applied.");
        else if (insertError.code === "23505") setError("You already own a store. Each admin can have only one store.");
        else setError(insertError.message);
        return null;
      }

      setStore(data as Store);
      return data as Store;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create store");
      return null;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    refreshStore();
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
