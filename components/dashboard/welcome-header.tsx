import { Card, CardContent } from "@/components/ui/card";

export function WelcomeHeader() {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white via-slate-100 to-slate-100">
      <CardContent className="space-y-4 p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Welcome back 👋</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Here&apos;s what&apos;s happening in your business today.
          </h1>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          The AI Revenue Recovery dashboard highlights revenue risks, root causes, and prioritized actions so you can fix the biggest issues first.
        </p>
      </CardContent>
    </Card>
  );
}
