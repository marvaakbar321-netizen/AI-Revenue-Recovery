import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function StepCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <Card className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-30px_rgba(15,23,42,0.16)]">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-[1.5rem] bg-[var(--primary-soft)] text-[var(--primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
    </Card>
  );
}
