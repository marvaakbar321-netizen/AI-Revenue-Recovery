import { Badge } from "@/components/ui/badge";
import { ExternalLink, Link2, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-10 sm:px-6 xl:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-[1.25rem] bg-[var(--primary-soft)] px-4 py-3 text-[var(--primary)]">
            <span className="font-semibold">AI</span>
            <span>Revenue Recovery</span>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
            Premium AI recovery for ecommerce that keeps revenue flowing and order operations aligned.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text)]">Product</p>
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <p>Features</p>
              <p>How it Works</p>
              <p>Pricing</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text)]">Resources</p>
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <p>Blog</p>
              <p>Guides</p>
              <p>Help Center</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text)]">Company</p>
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <p>About</p>
              <p>Careers</p>
              <p>Contact</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text)]">Follow</p>
            <div className="flex items-center gap-3 text-[var(--muted)]">
              <ExternalLink className="h-5 w-5" />
              <Link2 className="h-5 w-5" />
              <Share2 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1400px] border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
        © 2026 AI Revenue Recovery. All rights reserved. Terms · Privacy
      </div>
    </footer>
  );
}
