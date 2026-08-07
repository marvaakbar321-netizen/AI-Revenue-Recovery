import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let supabase: any = null;

// Only create a real Supabase client when valid env vars are present.
if (supabaseUrl && supabaseAnonKey && /^https?:\/\//i.test(supabaseUrl)) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} else {
  // Fallback safe stub to avoid runtime crashes during SSR or when env is missing.
  // Methods mirror the supabase-js responses shape so callers can handle errors.
  const missingMsg = "Supabase environment variables are not set (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signUp: async (_: any) => ({ data: null, error: new Error(missingMsg) }),
      signInWithPassword: async (_: any) => ({ data: null, error: new Error(missingMsg) }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (_callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };

  if (typeof window !== "undefined") {
    // Only warn in the browser/runtime where a developer can act.
    // eslint-disable-next-line no-console
    console.warn(missingMsg);
  }
}

export { supabase };
export default supabase;
