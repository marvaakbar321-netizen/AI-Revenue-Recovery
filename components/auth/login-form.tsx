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
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setMessage("");
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (oauthError) {
      setError("Google sign in is unavailable. Please use your email and password.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/login` });
    setLoading(false);
    if (resetError) setError("We could not send password reset instructions. Please try again.");
    else setMessage("Password reset instructions were sent to your email.");
  };

  return (
    <div className="min-h-[100svh] overflow-x-hidden bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex min-h-[100svh] w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-[420px]">
          <Card className="overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-white p-6 shadow-[0_30px_90px_-60px_rgba(124,92,252,0.4)] sm:p-8">
            <div className="space-y-3 text-center">
              <div className="relative mx-auto h-12 w-12 overflow-hidden rounded-[1rem] bg-[var(--primary-soft)]">
                <Image src={logoImage} alt="Site logo" fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">AI Revenue Recovery</p>
                <h1 className="mt-3 text-[2rem] font-semibold leading-tight tracking-tight text-[var(--text)]">Welcome back</h1>
                <p className="mt-2 text-sm text-[var(--muted)]">Please enter your details</p>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-[1.25rem] border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">{error}</div>
            ) : null}
            {message ? <div className="mt-6 rounded-[1.25rem] border border-[var(--success)]/20 bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">{message}</div> : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="form-group">
                <label htmlFor="email" className="block text-sm font-semibold text-[var(--text)]">Email address</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" disabled={loading} className="mt-2" />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="block text-sm font-semibold text-[var(--text)]">Password</label>
                <div className="relative mt-2">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" disabled={loading} className="pr-20" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-soft)]">{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-[var(--text)]">
                  <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} disabled={loading} className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]" />
                  Remember for 30 days
                </label>
                <button type="button" onClick={() => void handleForgotPassword()} className="text-sm font-semibold text-[var(--primary)] transition hover:text-[var(--primary)]" disabled={loading}>Forgot password</button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                    Logging in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--border)]" /><span>OR</span><span className="h-px flex-1 bg-[var(--border)]" /></div>
            <Button type="button" variant="secondary" className="w-full" disabled={loading} onClick={() => void handleGoogleSignIn()}>
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#4285F4]">G</span>
              Sign in with Google
            </Button>
            <p className="mt-6 text-center text-sm text-[var(--muted)]">Don&apos;t have an account? <button type="button" onClick={() => router.push("/signup")} className="font-semibold text-[var(--primary)]">Sign up</button></p>
          </Card>
        </div>
      </div>
    </div>
  );
}
