"use client";

import { Button } from "@/components/ui/button";

type LessonPrintActionsProps = {
  label?: string;
  className?: string;
};

function PrintIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
      <path d="M18 12h.01" />
    </svg>
  );
}

export function LessonPrintActions({ label = "Print lesson", className = "" }: LessonPrintActionsProps) {
  return (
    <div className={`lesson-print-actions ${className}`.trim()}>
      <Button type="button" variant="ghost" className="lp-btn-ghost" onClick={() => window.print()}>
        <PrintIcon />
        {label}
      </Button>
    </div>
  );
}
