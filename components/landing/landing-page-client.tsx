"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { ProblemCard } from "@/components/landing/problem-card";
import { StepCard } from "@/components/landing/step-card";
import { FeatureCard } from "@/components/landing/feature-card";
import { TestimonialCard } from "@/components/landing/testimonial-card";
import { FAQAccordion } from "@/components/landing/faq-accordion";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { LoginModal } from "@/components/auth/login-modal";
import SignUpModal from "@/components/auth/SignUpModal";
import { problems, steps, features, benefits, testimonials, faqs } from "@/lib/landing-data";

export function LandingPageClient() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") {
      setAuthMode("login");
      setAuthOpen(true);
      params.delete("login");
      const baseUrl = `${window.location.origin}${window.location.pathname}`;
      const query = params.toString();
      window.history.replaceState({}, "", query ? `${baseUrl}?${query}` : baseUrl);
    }
  }, []);

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openSignUp = () => {
    setAuthMode("signup");
    setAuthOpen(true);
  };

  return (
    <div className="bg-[var(--background)] text-[var(--text)]">
      <Navbar onOpenLogin={openLogin} onOpenSignUp={openSignUp} />
      <main className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-20 px-4 py-10 sm:px-6 xl:px-8">
        <Hero onOpenSignUp={openSignUp} />

        <section id="problem" className="space-y-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Problem</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)]">Order problems are costing stores millions every month.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {problems.map((problem) => (
              <ProblemCard key={problem.title} title={problem.title} description={problem.description} />
            ))}
          </div>
        </section>

        <section id="solution" className="space-y-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Solution</p>
              <h2 className="text-4xl font-semibold tracking-tight text-[var(--text)]">AI Revenue Recovery finds order leaks before they become urgent.</h2>
              <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Our platform continuously analyzes your order flow, highlights revenue-risk orders, and delivers prioritized actions so teams can act quickly.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="rounded-[1.75rem] bg-[var(--primary-soft)] p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">AI workflow</div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-[var(--text)]">Monitor order flow</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">Track payments, fulfillment and revenue health in one place.</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-[var(--text)]">Detect issues fast</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">AI surfaces revenue-impacting order issues instantly.</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-[var(--text)]">Act with confidence</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">Get clear recovery actions and follow-up recommendations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="space-y-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">How It Works</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)]">Four simple steps to recover lost revenue.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {steps.map((step) => (
              <StepCard key={step.title} icon={step.icon} title={step.title} description={step.description} />
            ))}
          </div>
        </section>

        <section id="features" className="space-y-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Features</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)]">Premium tools for intelligent order recovery.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </section>

        <section id="benefits" className="space-y-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Why Choose Us</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)]">Built for ecommerce teams who care about revenue.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <FeatureCard key={benefit.title} icon={benefit.icon} title={benefit.title} description={benefit.description} />
            ))}
          </div>
        </section>

        <section id="showcase" className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="absolute -right-16 top-10 h-44 w-44 rounded-full bg-[var(--secondary)]/10 blur-3xl" />
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.8fr] xl:grid-cols-[1fr_0.7fr]">
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--background)] p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Dashboard preview</p>
                  <h3 className="mt-3 text-2xl font-semibold text-[var(--text)]">Live order recovery insights</h3>
                </div>
                <div className="rounded-[1.5rem] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-sm">Beta</div>
              </div>
              <div className="space-y-4">
                <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--muted)]">Revenue impact</p>
                      <p className="mt-2 text-3xl font-semibold text-[var(--text)]">$81.4K</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--primary)]">+12.8%</div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-2/3 rounded-full bg-[var(--primary)]" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                      <p className="text-sm text-[var(--muted)]">Orders at risk</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">18</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                      <p className="text-sm text-[var(--muted)]">Failed payments</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">7</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                      <p className="text-sm text-[var(--muted)]">Recovery actions</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Showcase</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--text)]">A beautiful dashboard for order recovery.</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Preview how AI Revenue Recovery surfaces order risk, failed payments, and recommended actions in one polished workspace.
              </p>
              <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
                <div className="h-[260px] rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(124,92,252,0.12),rgba(116,185,255,0.08))] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Order dashboard</p>
                      <p className="mt-2 text-xl font-semibold text-[var(--text)]">Recovery insights at a glance</p>
                    </div>
                    <div className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)] shadow-sm">Live</div>
                  </div>
                  <div className="mt-8 grid gap-4">
                    <div className="rounded-[1rem] bg-white p-4 shadow-sm">
                      <p className="text-sm text-[var(--muted)]">Orders at risk</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">18</p>
                    </div>
                    <div className="rounded-[1rem] bg-white p-4 shadow-sm">
                      <p className="text-sm text-[var(--muted)]">Failed payments</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">7</p>
                    </div>
                    <div className="rounded-[1rem] bg-white p-4 shadow-sm">
                      <p className="text-sm text-[var(--muted)]">Recovery actions</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="space-y-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Testimonials</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)]">Trusted by ecommerce leaders who care about revenue.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} quote={testimonial.quote} name={testimonial.name} role={testimonial.role} company={testimonial.company} />
            ))}
          </div>
        </section>

        <section id="faq" className="space-y-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">FAQ</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)]">Common questions about AI Revenue Recovery.</h2>
          </div>
          <FAQAccordion items={faqs} />
        </section>

        <CTASection onOpenSignUp={openSignUp} />
      </main>
      <Footer />
      <LoginModal open={authOpen && authMode === "login"} mode={authMode} onClose={() => setAuthOpen(false)} />
      <SignUpModal open={authOpen && authMode === "signup"} onClose={() => setAuthOpen(false)} onOpenLogin={() => { setAuthMode("login"); setAuthOpen(true); }} />
    </div>
  );
}
