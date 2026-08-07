import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onOpenSignUp: () => void;
}

export function CTASection({ onOpenSignUp }: CTASectionProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-white px-6 py-12 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.15)] sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Ready to recover lost revenue?</p>
        <h2 className="text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">Turn order issues into recovery opportunities.</h2>
        <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Start with a free recovery plan and see how AI Revenue Recovery protects your ecommerce business.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="primary" onClick={onOpenSignUp}>Start Free</Button>
          <Button variant="secondary" onClick={onOpenSignUp}>Book Demo</Button>
        </div>
      </div>
    </section>
  );
}
