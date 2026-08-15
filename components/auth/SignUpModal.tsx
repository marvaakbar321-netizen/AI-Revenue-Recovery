"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

function validateEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score; // 0..4
}

export function SignUpModal({ open, onClose, onOpenLogin }: SignUpModalProps) {
  const [fullName, setFullName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(false);
      setLoading(false);
    }
  }, [open]);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError("Full name is required.");
    if (!business.trim()) return setError("Business name is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!terms) return setError("You must accept the terms and conditions.");

    setLoading(true);

    // Simulate network delay
    try {
      await new Promise((res) => setTimeout(res, 900));

      const dummy = {
        fullName,
        business,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem("airevenue_demo_user", JSON.stringify(dummy));
      } catch (err) {
        // ignore storage errors
      }

      setSuccess(true);
      setLoading(false);

      // After a short delay, close signup and open login modal
      setTimeout(() => {
        onClose();
        onOpenLogin?.();
      }, 900);
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create your AI Revenue account">
      <div className="relative bg-white p-8">
        <button
          type="button"
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-700 transition hover:bg-slate-50"
          onClick={onClose}
          aria-label="Close sign up modal"
        >
          ×
        </button>

        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Create your account</h2>
          <p className="text-sm text-[var(--muted)]">Start recovering revenue with AI-driven insights.</p>
        </div>

        {error ? <div className="mt-4 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="mt-4 rounded-[14px] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">Account created — opening login...</div> : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" disabled={loading || success} autoComplete="name" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">Business Name</label>
            <Input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="e.g., Acme Co" disabled={loading || success} autoComplete="organization" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">Email Address</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" disabled={loading || success} autoComplete="email" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">Password</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" disabled={loading || success} autoComplete="new-password" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--primary)]">{showPassword ? "Hide" : "Show"}</button>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex w-full items-center gap-2">
                <div className={`h-2 w-full grow rounded-full bg-slate-100 ${strength >= 1 ? "bg-yellow-300" : ""}`} style={{width: `${(strength/4)*100}%`}} />
              </div>
              <div className="text-xs font-medium text-[var(--muted)]">{strength >= 3 ? "Strong" : strength === 2 ? "Medium" : "Weak"}</div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">Confirm Password</label>
            <Input type={showPassword ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" disabled={loading || success} autoComplete="new-password" />
          </div>

          <div className="flex items-start gap-3">
            <input id="terms" type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} disabled={loading || success} className="mt-1 h-4 w-4 rounded border-[var(--border)]" />
            <label htmlFor="terms" className="text-sm text-[var(--muted)]">I agree to the <a href="#" className="font-semibold text-[var(--primary)]">Terms & Conditions</a></label>
          </div>

          <Button type="submit" className="w-full" disabled={loading || success}>
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

        <div className="mt-4 text-center text-sm text-[var(--muted)]">
          Already have an account? <button type="button" onClick={() => { onClose(); onOpenLogin?.(); }} className="font-semibold text-[var(--primary)]">Sign In</button>
        </div>
      </div>
    </Modal>
  );
}

export default SignUpModal;
