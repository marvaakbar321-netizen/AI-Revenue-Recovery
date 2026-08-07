"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logoImage from "@/app/logo.png";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { supabase } from "@/lib/supabase";

interface LoginModalProps {
  open: boolean;
  mode?: "login" | "signup";
  onClose: () => void;
}

export function LoginModal({ open, mode = "login", onClose }: LoginModalProps) {
  const [activeMode, setActiveMode] = useState<"login" | "signup">(mode);
  const isSignUp = activeMode === "signup";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setActiveMode(mode);
      setError("");
      setMessage("");
      setLoading(false);
    }
  }, [open, mode]);

  const validate = () => {
    if (!email.trim()) return "Email is required.";
    // simple email regex
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Please enter a valid email.";
    if (!password) return "Password is required.";
    if (isSignUp) {
      if (password.length < 6) return "Password must be at least 6 characters.";
      if (password !== confirmPassword) return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        // If a session is returned the user is signed in automatically.
        if (data?.session) {
          setMessage("Account created. Redirecting...");
          setLoading(false);
          onClose();
          router.push("/dashboard");
          return;
        }

        // Otherwise the user must confirm their email.
        setMessage("Account created. Check your email to confirm your account.");
        setLoading(false);
        return;
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        // On success redirect to dashboard
        if (data?.session) {
          setLoading(false);
          onClose();
          router.push("/dashboard");
          return;
        }

        setError("Unable to sign in.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isSignUp ? "Create your AI Revenue account" : "Login to AI Revenue Recovery"}
    >
      <div className="relative bg-white p-10">
        <button
          type="button"
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-700 transition hover:bg-slate-50"
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          ×
        </button>

        <div className="space-y-5 text-center">
          <div className="mx-auto relative h-14 w-14 overflow-hidden rounded-[20px] bg-[var(--primary-soft)] shadow-sm">
            <Image src={logoImage} alt="Site logo" fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">AI Revenue Recovery</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)]">{isSignUp ? "Create your account" : "Welcome back"}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
              {isSignUp ? "Start recovering revenue with AI-driven insights and a unified dashboard." : "Log in to continue managing your revenue recovery workflows."}
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-[20px] border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">{error}</div>
        ) : null}

        {message ? (
          <div className="mt-6 rounded-[20px] border border-[var(--success)]/20 bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">{message}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {isSignUp ? (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[var(--text)]">Full name</label>
              <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" autoComplete="name" disabled={loading} className="h-[52px] w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text)] transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" />
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text)]">Email address</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" disabled={loading} className="h-[52px] w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text)] transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text)]">Password</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete={isSignUp ? "new-password" : "current-password"} disabled={loading} className="h-[52px] w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 pr-24 text-sm text-[var(--text)] transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-soft)]">{showPassword ? "Hide" : "Show"}</button>
            </div>
          </div>

          {isSignUp ? (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[var(--text)]">Confirm password</label>
              <Input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" autoComplete="new-password" disabled={loading} className="h-[52px] w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text)] transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" />
            </div>
          ) : null}

          <Button type="submit" className="h-[52px] w-full rounded-[14px] text-base shadow-sm transition duration-300 ease-out hover:scale-[1.02]" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                {isSignUp ? "Creating account..." : "Logging in..."}
              </span>
            ) : (
              isSignUp ? "Create account" : "Login"
            )}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-[var(--muted)]">
          <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
          <button type="button" onClick={() => setActiveMode(isSignUp ? "login" : "signup")} className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary)]">{isSignUp ? "Login" : "Sign up"}</button>
        </div>
      </div>
    </Modal>
  );
}
