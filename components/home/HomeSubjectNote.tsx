import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CastKey } from "@/data/brand/cast-registry";
import type { HomeSubject } from "./home-data";

type HomeSubjectNoteProps = Pick<HomeSubject, "title" | "iconClass" | "teacherReason" | "fastenerClass" | "highlights"> & {
  href: string;
  subject: HomeSubject["key"];
  guideCharacter: CastKey;
};

const SUBJECT_PAPER: Record<HomeSubject["key"], string> = {
  language: "material-cardboard-paper",
  math: "material-cardboard-paper material-cardboard-kraft",
  science: "material-cardboard-paper",
  health: "material-cardboard-paper material-cardboard-kraft",
  sel: "material-cardboard-paper",
  "fine-motor": "material-cardboard-paper material-cardboard-kraft",
};

export function HomeSubjectNote({ title, href, iconClass, teacherReason, highlights, subject, guideCharacter, fastenerClass }: HomeSubjectNoteProps) {
  return (
    <Card className={`cast-${guideCharacter} material-surface ${SUBJECT_PAPER[subject]} relative h-full min-w-0 gap-0 overflow-visible border-2 py-0 pt-8 shadow-[0_0.35rem_0_color-mix(in_srgb,var(--foreground)_18%,transparent)]`} data-subject={subject}>
      <span className={`brand-asset ${fastenerClass} icon-small pointer-events-none absolute -top-4 left-1/2 z-10 -translate-x-1/2 drop-shadow-sm`} aria-hidden="true" />
      <CardHeader className="character-surface material-surface material-felt mx-2 flex min-h-28 flex-row items-center gap-3 rounded-lg border border-current p-3 shadow-sm">
        <span className={`brand-asset ${iconClass} icon-medium shrink-0`} aria-hidden="true" />
        <div className="min-w-0">
          <CardTitle><Link className="focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-4" href={href}>{title}</Link></CardTitle>
          <p className="mt-1 text-sm leading-5">{teacherReason}</p>
        </div>
      </CardHeader>
      <CardContent className="mt-4 flex-1 p-0">
        <nav className="grid" aria-label={`${title} lesson topics`}>
          {highlights.map((highlight) => (
            <Link className="border-b border-border px-3 py-3 text-sm font-semibold last:border-b-0 hover:bg-accent focus-visible:bg-accent focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-[-3px]" href={`/search?q=${encodeURIComponent(`${title} ${highlight}`)}`} key={highlight}>
              {highlight} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </CardContent>
      <CardFooter className="min-h-16 border-t border-border px-3 py-3">
        <Link className="text-sm font-bold underline underline-offset-4" href={href}>View all {title.toLowerCase()} lessons <span aria-hidden="true">→</span></Link>
      </CardFooter>
    </Card>
  );
}
