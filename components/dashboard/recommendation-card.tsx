import { Cpu, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/lib/dashboard-data";

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <Card className="overflow-hidden border border-[var(--border)]">
      <CardHeader className="bg-[var(--primary-soft)] px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--primary)]/10 text-[var(--primary)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--primary)] sm:text-sm sm:tracking-[0.28em]">AI Recommendation</p>
            <CardTitle className="text-[var(--text)]">{recommendation.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center gap-3 rounded-[1.25rem] bg-[var(--secondary)]/10 px-4 py-3 text-sm text-[var(--text)]">
          <Cpu className="h-5 w-5 shrink-0 text-[var(--secondary)]" />
          <span className="break-words">{recommendation.impact}</span>
        </div>
        <p className="text-sm leading-7 text-[var(--muted)]">{recommendation.description}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <TrendingUp className="h-4 w-4 text-[var(--primary)]" />
            <span>Projected impact based on current store data</span>
          </div>
          <Button variant="primary" className="w-full sm:w-auto">Review recommendation</Button>
        </div>
      </CardContent>
    </Card>
  );
}
