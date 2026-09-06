import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProblemItem } from "@/lib/dashboard-data";

const severityVariant: Record<string, "danger" | "warning" | "info"> = {
  Critical: "danger",
  High: "warning",
  Medium: "info",
};

export function RevenueProblems({ problems }: { problems: ProblemItem[] }) {
  return (
    <Card className="overflow-hidden border border-[var(--border)]">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <CardTitle>Revenue Problems</CardTitle>
            <p className="text-sm text-[var(--muted)]">
              Issues with the highest estimated impact on monthly revenue.
            </p>
          </div>
          <div className="shrink-0 rounded-[0.875rem] bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
            {problems.length} {problems.length === 1 ? "issue" : "issues"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {problems.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-[var(--border)] bg-slate-50 p-6 text-center text-sm text-[var(--muted)]">
            No revenue problems detected. Your store is performing well.
          </div>
        ) : (
          problems.map((problem) => (
            <div
              key={problem.id}
              className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.12)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={severityVariant[problem.severity]}>{problem.severity}</Badge>
                    <span className="rounded-full border border-[var(--border)] bg-slate-50 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">
                      {problem.priority}
                    </span>
                  </div>
                  <div>
                    <h3 className="break-words text-base font-semibold text-[var(--text)]">{problem.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{problem.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <p className="text-sm font-semibold text-[var(--text)]">{problem.impact}</p>
                  <Button variant="primary" className="rounded-full px-4 py-2">
                    Investigate
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-3 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span className="break-words">Review problems and focus on the most urgent recovery opportunities.</span>
          <Button variant="secondary" className="w-full sm:w-auto">View all issues</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
