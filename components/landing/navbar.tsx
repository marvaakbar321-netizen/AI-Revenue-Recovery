"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { landingNav } from "@/lib/landing-data";
import logoImage from "@/app/logo.png";

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
}

export function Navbar({ onOpenLogin, onOpenSignUp }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 xl:px-8">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-[1.25rem] bg-[var(--primary-soft)] shadow-sm">
            <Image src={logoImage} alt="Site logo" fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-[var(--text)]">AI Revenue Recovery</p>
            <p className="text-xs text-[var(--muted)]">Recover revenue, faster.</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {landingNav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-semibold text-[var(--text)] transition hover:text-[var(--primary)]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button type="button" onClick={onOpenSignUp} className="text-sm font-semibold text-[var(--text)] transition hover:text-[var(--primary)]">
            Sign Up
          </button>
          <button type="button" onClick={onOpenLogin} className="text-sm font-semibold text-[var(--text)] transition hover:text-[var(--primary)]">
            Login
          </button>
          <Button variant="primary" onClick={onOpenSignUp}>Get Started</Button>
        </div>

        <button className="inline-flex items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text)] transition hover:bg-slate-50 md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] p-4 md:hidden">
          <div className="space-y-3">
            {landingNav.map((item) => (
              <a key={item.href} href={item.href} className="block rounded-[1rem] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-slate-50">
                {item.label}
              </a>
            ))}
            <button type="button" onClick={onOpenLogin} className="block w-full rounded-[1rem] px-4 py-3 text-left text-sm font-semibold text-[var(--text)] transition hover:bg-slate-50">
              Login
            </button>
            <Button className="w-full" onClick={onOpenSignUp}>Get Started</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
