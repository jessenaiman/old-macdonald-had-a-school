"use client";

export function LessonPrintButton() {
  return (
    <button className="lp-btn-ghost" type="button" onClick={() => window.print()}>
      Print teacher plan
    </button>
  );
}
