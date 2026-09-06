"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate profile fields from Supabase Auth
      setFullName(authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email || "");
      setBusiness(authUser.user_metadata?.business || "");
      setEmail(authUser.email || "");
    }
  }, [authUser]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!fullName.trim()) return setMessage("Full name is required.");
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setMessage("Please enter a valid email.");

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { ...authUser?.user_metadata, full_name: fullName.trim(), business: business.trim() },
      });
      if (updateError) throw updateError;

      setMessage("Profile saved.");
      setLoading(false);
      setTimeout(() => setMessage(null), 2500);
    } catch (err: unknown) {
      setLoading(false);
      setMessage(err instanceof Error ? err.message : "Unable to save profile.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Update your profile information shown across the dashboard.</p>
      </div>

      <form onSubmit={save} className="grid gap-6">
        <div className="grid gap-3">
          <label className="text-sm font-medium">Full name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-medium">Business name</label>
          <Input value={business} onChange={(e) => setBusiness(e.target.value)} />
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-medium">Email address</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save profile"}</Button>
          <button type="button" className="text-sm text-[var(--muted)]" onClick={() => router.push("/s")}>Back to landing page</button>
        </div>

        {message ? <div className="text-sm text-[var(--muted)]">{message}</div> : null}
      </form>
    </div>
  );
}
