"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function LogoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError("Unable to log out. Please try again.");
        setLoading(false);
        return;
      }

      // On success, redirect to landing page
      router.push("/");
    } catch (err) {
      setError("Unable to log out. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button onClick={handleLogout} disabled={loading} variant="secondary" aria-label="Log out">
        <span className="inline-flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          {loading ? "Logging out..." : "Sign out"}
        </span>
      </Button>
      {error ? <div role="status" className="mt-2 text-sm text-[var(--danger)]">{error}</div> : null}
    </div>
  );
}

export default LogoutButton;
