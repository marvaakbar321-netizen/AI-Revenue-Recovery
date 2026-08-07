"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        )).filter((element) => !element.hasAttribute("disabled"));

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    const timer = window.setTimeout(() => {
      const dialog = dialogRef.current;
      const focusable = dialog?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      focusable?.focus();
    }, 10);

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-950/80 backdrop-blur-xl px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
      aria-label={title ?? "Authentication modal"}
    >
      <div
        ref={dialogRef}
        className={cn(
          "relative w-full max-w-[min(90vw,500px)] max-h-[90vh] overflow-y-auto rounded-[24px] border border-white/10 bg-white/95 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.18)] transition duration-250 ease-out",
        )}
        style={{ animation: "modalFadeScale 240ms ease-out" }}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes modalFadeScale {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
