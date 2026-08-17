"use client";

import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";

type LessonPrintActionsProps = {
  label?: string;
  className?: string;
};

/**
 * Small domain action that invokes the browser print dialog through the
 * installed shadcn Button; it does not define a separate control primitive.
 */
export function LessonPrintActions({ label = "Print lesson", className = "" }: LessonPrintActionsProps) {
  return (
    <div className={className}>
      <Button type="button" variant="ghost" onClick={() => window.print()}>
        <PrinterIcon data-icon="inline-start" />
        {label}
      </Button>
    </div>
  );
}
