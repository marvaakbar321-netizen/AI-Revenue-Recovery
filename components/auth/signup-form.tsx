"use client";

import { useState } from "react";
import Image from "next/image";
import logoImage from "@/app/logo.png";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

function validateEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const strength = passwordStrength(password);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!fullName.trim()) return setError("Full name is required.");
    if (!business.trim()) return setError("Business name is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!terms) return setError("You must accept the terms and conditions.");

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            business: business.trim(),
          },
        },
      });

      if (signUpError || !data.user) {
        setError(signUpError?.message ?? "Unable to create account.");
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        auth_id: data.user.id,
        full_name: fullName.trim(),
        business_name: business.trim(),
        email: email.trim().toLowerCase(),
      });

      if (profileError) {
        setError("Your account was created, but we could not finish setting up your profile. Please try again.");
        setLoading(false);
        return;
      }

      setMessage("Account created! Redirecting to login...");
      setLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setError("We could not create your account. Please try again.");
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
                <h1 className="mt-3 text-[2rem] font-semibold leading-tight tracking-tight text-[var(--text)]">Get Started</h1>
                <p className="mt-2 text-sm text-[var(--muted)]">Create your account</p>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-[1.25rem] border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">{error}</div>
            ) : null}
            {message ? <div className="mt-6 rounded-[1.25rem] border border-[var(--success)]/20 bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">{message}</div> : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="form-group">
                <label htmlFor="signup-fullname" className="block text-sm font-semibold text-[var(--text)]">Full Name</label>
                <Input id="signup-fullname" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" autoComplete="name" disabled={loading} className="mt-2" />
              </div>

              <div className="form-group">
                <label htmlFor="signup-business" className="block text-sm font-semibold text-[var(--text)]">Business Name</label>
                <Input id="signup-business" type="text" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="e.g., Acme Co" autoComplete="organization" disabled={loading} className="mt-2" />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email" className="block text-sm font-semibold text-[var(--text)]">Email</label>
                <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" disabled={loading} className="mt-2" />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password" className="block text-sm font-semibold text-[var(--text)]">Password</label>
                <div className="relative mt-2">
                  <Input id="signup-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" autoComplete="new-password" disabled={loading} className="pr-20" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-soft)]">{showPassword ? "Hide" : "Show"}</button>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-yellow-300 transition-all" style={{ width: `${Math.min((strength / 4) * 100, 100)}%` }} />
                  </div>
                  <div className="text-xs font-medium text-[var(--muted)]">{strength >= 3 ? "Strong" : strength === 2 ? "Medium" : "Weak"}</div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm" className="block text-sm font-semibold text-[var(--text)]">Confirm Password</label>
                <div className="relative mt-2">
                  <Input id="signup-confirm" type={showConfirmPassword ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" autoComplete="new-password" disabled={loading} className="pr-20" />
                  <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-soft)]">{showConfirmPassword ? "Hide" : "Show"}</button>
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-[var(--text)]">
                <input id="terms" type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} disabled={loading} className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]" />
                <span>I agree to the <a href="#" className="font-semibold text-[var(--primary)]">Terms &amp; Conditions</a></span>
              </label>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--border)]" /><span>OR</span><span className="h-px flex-1 bg-[var(--border)]" /></div>
            <Button type="button" variant="secondary" className="w-full" disabled={loading} onClick={() => void handleGoogleSignIn()}>
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#4285F4]">G</span>
              Sign up with Google
            </Button>
            <p className="mt-6 text-center text-sm text-[var(--muted)]">Already have an account? <button type="button" onClick={() => router.push("/login")} className="font-semibold text-[var(--primary)]">Sign in</button></p>
          </Card>
        </div>
      </div>
    </div>
  );
}
