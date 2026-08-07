"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AuthState = {
  user: any | null;
  session: any | null;
  loading: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true });

  useEffect(() => {
    let mounted = true;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setState({ user: session?.user ?? null, session: session ?? null, loading: false });
    }

    load();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setState({ user: session?.user ?? null, session: session ?? null, loading: false });
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...state, signOut };
}

export default useAuth;
