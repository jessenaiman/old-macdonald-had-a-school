import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { GradeKey } from "@/lib/grade-routes";

const HOME_GRADES: readonly { key: GradeKey; label: string }[] = [
  { key: "daycare", label: "Daycare" },
  { key: "pre-school", label: "Pre-School" },
  { key: "kindergarten", label: "Kindergarten" },
  { key: "grade-one", label: "Grade 1" },
  { key: "grade-two", label: "Grade 2" },
] as const;

export function HomeGradeNav() {
  return (
    <section className="mt-5 border-t border-dashed border-current/50 pt-4" aria-labelledby="home-grades-title">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-xl" id="home-grades-title">Start with your grade</h2>
        <p className="text-sm opacity-80">Open curriculum, planning, and grade search</p>
      </div>
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" aria-label="Grade pages">
        {HOME_GRADES.map((grade) => (
          <Card className="grade-surface relative min-w-0 gap-0 overflow-hidden rounded-xl border-2 py-0 shadow-sm after:pointer-events-none after:absolute after:inset-1.5 after:rounded-lg after:border after:border-dashed after:border-current after:opacity-45" data-grade={grade.key} key={grade.key}>
            <Link className="relative z-1 flex min-h-14 items-center gap-2 p-2 focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-4" href={`/grade/${grade.key}`}>
              <span className="brand-asset grade-icon icon-small shrink-0" data-grade-icon={grade.key} aria-hidden="true" />
              <strong className="min-w-0 font-heading text-base leading-none">{grade.label}</strong>
            </Link>
          </Card>
        ))}
      </nav>
    </section>
  );
}
