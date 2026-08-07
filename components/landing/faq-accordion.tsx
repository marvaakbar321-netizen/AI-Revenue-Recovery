"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <Card key={item.question} className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left"
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="text-sm font-semibold text-[var(--text)]">{item.question}</span>
              <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} />
            </button>
            {open ? <div className="border-t border-[var(--border)] px-6 py-5 text-sm leading-7 text-[var(--muted)]">{item.answer}</div> : null}
          </Card>
        );
      })}
    </div>
  );
}
