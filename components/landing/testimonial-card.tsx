import { Card } from "@/components/ui/card";

export function TestimonialCard({ quote, name, role, company }: { quote: string; name: string; role: string; company: string }) {
  return (
    <Card className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-sm transition hover:shadow-[0_18px_50px_-30px_rgba(15,23,42,0.16)]">
      <p className="text-lg leading-8 text-[var(--text)]">“{quote}”</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-[1.5rem] bg-[var(--primary-soft)] text-[var(--primary)] font-semibold">{name.split(" ").map((n) => n[0]).join("")}</div>
        <div>
          <p className="font-semibold text-[var(--text)]">{name}</p>
          <p className="text-sm text-[var(--muted)]">{role} • {company}</p>
        </div>
      </div>
    </Card>
  );
}
