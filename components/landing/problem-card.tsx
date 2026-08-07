import { Card } from "@/components/ui/card";

export function ProblemCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-30px_rgba(15,23,42,0.16)]">
      <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
    </Card>
  );
}
