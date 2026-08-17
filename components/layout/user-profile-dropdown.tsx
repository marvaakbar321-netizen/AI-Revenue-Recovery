"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Settings, Store, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type UserProfileDropdownProps = {
  displayName: string;
};

export function UserProfileDropdown({ displayName }: UserProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (open && event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Logout failed", signOutError);
        setLoggingOut(false);
        return;
      }
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
      setLoggingOut(false);
    }
  };

  const menuItems = [
    { href: "/dashboard/profile", label: "Profile", icon: User, disabled: false },
    { href: "/dashboard/store", label: "Store Settings", icon: Store, disabled: false },
    { href: "/dashboard/settings", label: "Account Settings", icon: Settings, disabled: false },
    { href: "#", label: "Help & Support", icon: HelpCircle, disabled: true },
  ];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
        aria-label="Open account menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {initials}
      </button>

      {open ? (
        <div
          ref={menuRef}
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-[1rem] border border-[var(--border)] bg-white shadow-lg"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--text)]">{displayName}</p>
            <p className="text-xs text-[var(--muted)]">Account</p>
          </div>

          <div className="py-1">
            {menuItems.map((item) =>
              item.disabled ? (
                <button
                  key={item.label}
                  type="button"
                  disabled
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted)] opacity-70 cursor-not-allowed"
                  role="menuitem"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] transition hover:bg-slate-50"
                  role="menuitem"
                >
                  <item.icon className="h-4 w-4 text-[var(--muted)]" />
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="border-t border-[var(--border)] py-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50",
                loggingOut && "cursor-wait opacity-70",
              )}
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Logging out..." : "Sign Out"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
