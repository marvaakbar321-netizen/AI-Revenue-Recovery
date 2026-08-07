import { Cpu, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/lib/dashboard-data";

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <Card className="overflow-hidden border border-[var(--border)]">
      <CardHeader className="bg-[var(--primary-soft)] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--primary)]/10 text-[var(--primary)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--primary)]">AI Recommendation</p>
            <CardTitle className="text-[var(--text)]">{recommendation.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-[1.25rem] bg-[var(--secondary)]/10 px-4 py-4 text-sm text-[var(--text)]">
            <Cpu className="h-5 w-5 text-[var(--secondary)]" />
            <span>{recommendation.impact}</span>
          </div>
          <p className="text-sm leading-7 text-[var(--muted)]">{recommendation.description}</p>
          <Button variant="primary">Review recommendation</Button>
        </div>
        <div className="flex items-center justify-center rounded-[1.5rem] border border-[var(--border)] bg-slate-50 p-6 text-center text-sm text-[var(--muted)]">
          Illustration placeholder
        </div>
      </CardContent>
    </Card>
  );
}
