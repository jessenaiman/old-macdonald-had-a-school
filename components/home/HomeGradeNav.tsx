import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { GradeKey } from "@/lib/grade-routes";

const HOME_GRADES: readonly { key: GradeKey; label: string }[] = [
  { key: "daycare", label: "Daycare" },
  { key: "pre-school", label: "Preschool" },
  { key: "kindergarten", label: "Kindergarten" },
  { key: "grade-one", label: "Grade 1" },
  { key: "grade-two", label: "Grade 2" },
] as const;

/**
 * Grade-route index for the home page. It is custom only for the project’s
 * grade metadata and approved grade artwork; each item composes a shadcn Card.
 */
export function HomeGradeNav() {
  return (
    <section className="grid gap-5" aria-labelledby="home-grades-title">
      <div>
        <h2 className="font-section text-[26px]" id="home-grades-title">Find your grade</h2>
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">Open curriculum, planning, and grade search.</p>
      </div>
      <nav className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Grade pages">
        {HOME_GRADES.map((grade) => (
          <Card className="grade-surface working-wall-patch relative min-w-0 gap-0 rounded-xl py-0 transition-transform hover:-translate-y-0.5" data-grade={grade.key} key={grade.key}>
            <Link className="relative flex min-h-20 items-center gap-3 p-4 focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-[-3px]" href={`/grade/${grade.key}`}>
              <span className="brand-asset grade-icon icon-small shrink-0" data-grade-icon={grade.key} aria-hidden="true" />
              <strong className="min-w-0 font-heading text-xl leading-none">{grade.label}</strong>
            </Link>
          </Card>
        ))}
      </nav>
    </section>
  );
}
