import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CharacterKey } from "@/data/brand/characters-registry";
import type { HomeSubject } from "./home-data";

type HomeSubjectNoteProps = Pick<HomeSubject, "title" | "iconClass" | "teacherReason" | "fastenerClass" | "highlights"> & {
  href: string;
  subject: HomeSubject["key"];
  guideCharacter: CharacterKey;
};

/**
 * Subject-specific card content for the home page. The custom data maps a
 * subject to approved farm-school assets while the surface uses shadcn Card parts.
 */
export function HomeSubjectNote({ title, href, iconClass, teacherReason, highlights, guideCharacter, fastenerClass }: HomeSubjectNoteProps) {
  return (
    <Card className={`characters-${guideCharacter} material-surface material-cardboard-paper relative h-full min-w-0 gap-0 overflow-visible border-border py-0 text-[var(--ink-primary)] transition-transform hover:-translate-y-0.5`}>
      <span className={`brand-asset ${fastenerClass} icon-small pointer-events-none absolute -top-4 left-1/2 z-10 -translate-x-1/2`} aria-hidden="true" />
      <CardHeader className="flex min-h-28 flex-row items-center gap-3 border-b border-border p-5">
        <span className={`brand-asset ${iconClass} icon-medium shrink-0`} aria-hidden="true" />
        <div className="min-w-0">
          <CardTitle className="font-heading text-2xl text-[var(--ink-primary)]"><Link className="focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-4" href={href}>{title}</Link></CardTitle>
          <p className="mt-2 text-sm leading-5 text-[var(--ink-secondary)]">{teacherReason}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <nav className="grid" aria-label={`${title} lesson topics`}>
          {highlights.map((highlight) => (
            <Link key={highlight} className="border-b border-border px-5 py-3 text-sm font-semibold text-[var(--ink-primary)] last:border-b-0 hover:bg-muted focus-visible:bg-muted focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-[-3px]" href={`/search?q=${encodeURIComponent(`${title} ${highlight}`)}`}>
              {highlight} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </CardContent>
      <CardFooter className="min-h-16 border-t border-border px-5 py-4">
        <Link className="text-sm font-bold text-[var(--ink-primary)] underline underline-offset-4" href={href}>View all {title.toLowerCase()} lessons <span aria-hidden="true">→</span></Link>
      </CardFooter>
    </Card>
  );
}
