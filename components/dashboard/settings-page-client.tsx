"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Bot,
  Check,
  LockKeyhole,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Store as StoreIcon,
  Sun,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LogoutButton from "@/components/auth/LogoutButton";
import useAuth from "@/hooks/useAuth";
import { useStore } from "@/lib/store-context";
import { supabase } from "@/lib/supabase";

const sections = [
  { id: "profile", label: "Profile & Account", icon: UserRound },
  { id: "store", label: "Store Settings", icon: StoreIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "ai", label: "AI / Groq", icon: Bot },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "account", label: "Account Actions", icon: LockKeyhole },
] as const;

type SectionId = (typeof sections)[number]["id"];

function SectionCard({ id, title, description, icon: Icon, children }: { id: SectionId; title: string; description: string; icon: typeof UserRound; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-6 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_-32px_rgba(55,35,120,0.55)] sm:p-6"><div className="flex items-start gap-3 border-b border-[var(--border)] pb-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.875rem] bg-[var(--primary-soft)] text-[var(--primary)]"><Icon className="h-5 w-5" /></div><div><h2 className="text-base font-semibold text-[var(--text)]">{title}</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p></div></div><div className="pt-5">{children}</div></section>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="text-sm font-medium text-[var(--text)]">{label}</span>{children}{hint ? <span className="block text-xs leading-5 text-[var(--muted)]">{hint}</span> : null}</label>;
}

function DisabledPreference({ label, description }: { label: string; description: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 opacity-75"><div><p className="text-sm font-medium text-[var(--text)]">{label}</p><p className="mt-1 text-xs text-[var(--muted)]">{description}</p></div><div aria-hidden="true" className="h-5 w-9 rounded-full bg-slate-200 p-0.5"><div className="h-4 w-4 rounded-full bg-white shadow-sm" /></div></div>;
}

export function SettingsPageClient() {
  const { user, loading: authLoading } = useAuth();
  const { store, loading: storeLoading, error: storeError, refreshStore } = useStore();
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [fullName, setFullName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingStore, setSavingStore] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetState, setResetState] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate editable profile fields from Supabase Auth
    setFullName(user?.user_metadata?.full_name || user?.user_metadata?.name || "");
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate editable store fields from the owner-scoped store query
    setStoreName(store?.name ?? "");
    setStoreDescription(store?.description ?? "");
    setStoreSlug(store?.slug ?? "");
  }, [store]);

  const initials = useMemo(() => (fullName || user?.email || "U").trim().split(/\s+/).slice(0, 2).map((part: string) => part[0]?.toUpperCase()).join(""), [fullName, user?.email]);
  const groqAvailable = typeof process.env.NEXT_PUBLIC_GROQ_ENABLED === "string" && process.env.NEXT_PUBLIC_GROQ_ENABLED === "true";

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    setSavingProfile(true);
    setError(null);
    setMessage(null);
    const { error: updateError } = await supabase.auth.updateUser({ data: { ...user.user_metadata, full_name: fullName.trim() } });
    setSavingProfile(false);
    if (updateError) setError(updateError.message);
    else setMessage("Profile changes saved.");
  };

  const saveStore = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!store) {
      setError("Create a store before editing store settings.");
      return;
    }
    setSavingStore(true);
    setError(null);
    setMessage(null);
    const { error: updateError } = await supabase.from("stores").update({ name: storeName.trim(), description: storeDescription.trim() }).eq("id", store.id).eq("owner_id", user?.id ?? "");
    setSavingStore(false);
    if (updateError) setError(updateError.message);
    else {
      await refreshStore();
      setMessage("Store settings saved.");
    }
  };

  const sendPasswordReset = async () => {
    if (!user?.email) return;
    setResetState(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email);
    setResetState(resetError ? resetError.message : "Password reset instructions sent to your email.");
  };

  if (authLoading || storeLoading) return <div className="space-y-5" aria-label="Loading settings"><div className="h-28 animate-pulse rounded-[1.25rem] bg-slate-100" /><div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]"><div className="h-72 animate-pulse rounded-[1.25rem] bg-slate-100" /><div className="space-y-4"><div className="h-56 animate-pulse rounded-[1.25rem] bg-slate-100" /><div className="h-56 animate-pulse rounded-[1.25rem] bg-slate-100" /></div></div></div>;

  return <div className="space-y-5">
    <section className="rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(110deg,#ffffff_0%,#fbf9ff_72%,#f4edff_100%)] px-5 py-5 shadow-sm sm:px-6"><p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--primary)]">Workspace configuration</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">Settings</h1><p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">Manage your account, store preferences, notifications, security, and AI configuration.</p></section>
    {storeError || error ? <div className="flex flex-col gap-2 rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"><span>{error ?? storeError}</span><button type="button" onClick={() => { setError(null); void refreshStore(); }} className="font-semibold underline">Retry</button></div> : null}
    {message ? <div className="flex items-center gap-2 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><Check className="h-4 w-4" />{message}</div> : null}
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start"><aside className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm"><label className="sr-only" htmlFor="settings-section">Settings section</label><select id="settings-section" value={activeSection} onChange={(event) => setActiveSection(event.target.value as SectionId)} className="h-11 w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-3 text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--primary)] lg:hidden">{sections.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}</select><nav className="hidden space-y-1 lg:block" aria-label="Settings sections">{sections.map((section) => <button type="button" key={section.id} onClick={() => setActiveSection(section.id)} className={`flex w-full items-center gap-3 rounded-[0.875rem] px-3 py-2.5 text-left text-sm font-semibold transition ${activeSection === section.id ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--muted)] hover:bg-slate-50 hover:text-[var(--text)]"}`}><section.icon className="h-4 w-4 shrink-0" /><span className="min-w-0 truncate">{section.label}</span></button>)}</nav></aside>
      <main className="min-w-0 space-y-4">
        {activeSection === "profile" ? <SectionCard id="profile" title="Profile & Account" description="Your identity and account details used across the workspace." icon={UserRound}><form onSubmit={saveProfile} className="space-y-5"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--primary)] text-lg font-semibold text-white">{initials}</div><div><p className="font-semibold text-[var(--text)]">{fullName || "Your profile"}</p><p className="text-sm text-[var(--muted)]">Admin account</p></div></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name"><Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" /></Field><Field label="Email address" hint="Email is managed by Supabase Auth and cannot be edited here."><Input value={user?.email ?? ""} readOnly disabled /></Field><Field label="Business name" hint="Your business name is managed through Store Settings."><Input value={store?.name ?? "No store created"} readOnly disabled /></Field></div><Button type="submit" disabled={savingProfile}><Save className="mr-2 h-4 w-4" />{savingProfile ? "Saving..." : "Save profile"}</Button></form></SectionCard> : null}
        {activeSection === "store" ? <SectionCard id="store" title="Store Settings" description="Update the store owned by your authenticated admin account." icon={StoreIcon}>{store ? <form onSubmit={saveStore} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Store name"><Input value={storeName} onChange={(event) => setStoreName(event.target.value)} /></Field><Field label="Store slug" hint="The store URL identifier cannot be edited here."><Input value={storeSlug} readOnly disabled /></Field></div><Field label="Store description"><textarea value={storeDescription} onChange={(event) => setStoreDescription(event.target.value)} rows={4} className="w-full rounded-[0.875rem] border border-[var(--border)] bg-slate-50 px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]" /></Field><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Status</p><p className="mt-1 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{store.status ?? "Active"}</p></div><Button type="submit" disabled={savingStore}><Save className="mr-2 h-4 w-4" />{savingStore ? "Saving..." : "Save store settings"}</Button></div></form> : <div className="rounded-[0.875rem] border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">No store is connected to this admin account yet.</div>}</SectionCard> : null}
        {activeSection === "notifications" ? <SectionCard id="notifications" title="Notifications" description="Notification preferences will be available when persistence is enabled for this workspace." icon={Bell}><div className="space-y-3"><DisabledPreference label="Order notifications" description="Persistence is not configured yet." /><DisabledPreference label="Revenue alerts" description="Persistence is not configured yet." /><DisabledPreference label="AI insight notifications" description="Persistence is not configured yet." /><DisabledPreference label="System notifications" description="Persistence is not configured yet." /></div></SectionCard> : null}
        {activeSection === "security" ? <SectionCard id="security" title="Security" description="Review account access and manage your authentication security." icon={ShieldCheck}><div className="space-y-4"><div className="flex items-center justify-between gap-4 rounded-[0.875rem] border border-[var(--border)] p-4"><div><p className="text-sm font-semibold text-[var(--text)]">Authenticated email</p><p className="mt-1 text-sm text-[var(--muted)]">{user?.email ?? "Unavailable"}</p></div><ShieldCheck className="h-5 w-5 text-emerald-600" /></div><div className="flex flex-col gap-3 rounded-[0.875rem] bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[var(--text)]">Password management</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Supabase Auth will send a secure reset link to your account email.</p></div><Button type="button" variant="secondary" onClick={() => void sendPasswordReset()}>Send reset link</Button></div>{resetState ? <p className="text-sm text-[var(--muted)]">{resetState}</p> : null}</div></SectionCard> : null}
        {activeSection === "ai" ? <SectionCard id="ai" title="AI / Groq Settings" description="Understand how analysis is configured without exposing service credentials." icon={Bot}><div className="space-y-4"><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-[0.875rem] bg-[var(--primary-soft)] p-4"><p className="text-xs text-[var(--muted)]">AI Insights</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">Available</p></div><div className="rounded-[0.875rem] border border-[var(--border)] p-4"><p className="text-xs text-[var(--muted)]">Groq integration</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">{groqAvailable ? "Enabled" : "Not configured"}</p></div><div className="rounded-[0.875rem] border border-[var(--border)] p-4"><p className="text-xs text-[var(--muted)]">Analysis mode</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">{groqAvailable ? "Configured service" : "Store data rules"}</p></div></div><p className="rounded-[0.875rem] bg-slate-50 p-4 text-sm leading-6 text-[var(--muted)]">AI Revenue analyzes current-store orders, products, and customer activity to surface evidence-based insights. Credentials are never displayed in this interface.</p></div></SectionCard> : null}
        {activeSection === "appearance" ? <SectionCard id="appearance" title="Appearance" description="The current application uses the light AI Revenue workspace theme." icon={Palette}><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-[0.875rem] border-2 border-[var(--primary)] bg-[var(--primary-soft)] p-4"><Sun className="h-4 w-4 text-[var(--primary)]" /><p className="mt-3 text-sm font-semibold text-[var(--text)]">Light</p><p className="mt-1 text-xs text-[var(--muted)]">Current theme</p></div><div className="rounded-[0.875rem] border border-[var(--border)] p-4 opacity-60"><Moon className="h-4 w-4 text-[var(--muted)]" /><p className="mt-3 text-sm font-semibold text-[var(--text)]">Dark</p><p className="mt-1 text-xs text-[var(--muted)]">Not enabled</p></div><div className="rounded-[0.875rem] border border-[var(--border)] p-4 opacity-60"><Palette className="h-4 w-4 text-[var(--muted)]" /><p className="mt-3 text-sm font-semibold text-[var(--text)]">System</p><p className="mt-1 text-xs text-[var(--muted)]">Not enabled</p></div></div></SectionCard> : null}
        {activeSection === "account" ? <SectionCard id="account" title="Account Actions" description="Manage your current session and account access." icon={LockKeyhole}><div className="flex flex-col gap-4 rounded-[0.875rem] bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[var(--text)]">Sign out</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">End the current authenticated session on this device.</p></div><LogoutButton /></div></SectionCard> : null}
      </main>
    </div>
  </div>;
}
