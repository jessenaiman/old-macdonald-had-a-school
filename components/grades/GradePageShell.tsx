import type { ReactNode } from "react";
import { SiteShell, type ActivePage } from "../SiteShell";

export type GradePage = Extract<
  ActivePage,
  "daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two"
>;

/** Shared site chrome around every grade landing page and grade lesson. */
export function GradePageShell({ active, children }: { active: GradePage; children: ReactNode }) {
  return (
    <SiteShell active={active}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-0 py-2 sm:px-3 sm:py-4 lg:px-5">
        {children}
      </div>
    </SiteShell>
  );
}
