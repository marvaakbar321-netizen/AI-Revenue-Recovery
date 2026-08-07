"use client";

import { useState } from "react";
import Image from "next/image";
import logoImage from "@/app/logo.png";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.replace("/dashboard");
        return;
      }

      setError("Unable to sign in.");
      setLoading(false);
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-8 shadow-[0_40px_120px_-70px_rgba(124,92,252,0.35)]">
              <div className="space-y-3 text-center">
              <div className="mx-auto relative h-16 w-16 overflow-hidden rounded-[1.75rem] bg-[var(--primary-soft)]">
                <Image src={logoImage} alt="Site logo" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">AI Revenue Recovery</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">Welcome back.</h1>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Sign in to continue protecting revenue with AI-first order recovery.</p>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-[1.25rem] border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">{error}</div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-[var(--text)]">
                Email
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" disabled={loading} className="mt-3" />
              </label>

              <label className="block text-sm font-semibold text-[var(--text)]">
                Password
                <div className="relative mt-3">
                  <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" disabled={loading} className="pr-20" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-soft)]">{showPassword ? "Hide" : "Show"}</button>
                </div>
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-[var(--text)]">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} disabled={loading} className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]" />
                  Remember me
                </label>
                <button type="button" className="text-sm font-semibold text-[var(--primary)] transition hover:text-[var(--primary)]" disabled={loading}>Forgot password?</button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
