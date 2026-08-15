"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";

function getLocalDemoUser() {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("airevenue_demo_user") : null;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const local = getLocalDemoUser();
    if (local) {
      setFullName(local.fullName || local.full_name || "");
      setBusiness(local.business || "");
      setEmail(local.email || "");
      return;
    }

    // Otherwise, populate from auth user if present
    if (authUser) {
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
      const payload = { fullName, business, email, updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem("airevenue_demo_user", JSON.stringify(payload));
      } catch (err) {}

      setMessage("Profile saved.");
      setLoading(false);
      setTimeout(() => setMessage(null), 2500);
    } catch (err: any) {
      setLoading(false);
      setMessage(err?.message ?? "Unable to save profile.");
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
          <button type="button" className="text-sm text-[var(--muted)]" onClick={() => { localStorage.removeItem("airevenue_demo_user"); router.push("/"); }}>Delete demo profile</button>
        </div>

        {message ? <div className="text-sm text-[var(--muted)]">{message}</div> : null}
      </form>
    </div>
  );
}
