import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CastKey } from "@/lib/cast";
import type { HomeSubject } from "./home-data";

type HomeSubjectNoteProps = Omit<HomeSubject, "key" | "earlyYearsLabel" | "matches" | "searchQuery"> & {
  href: string;
  subject: HomeSubject["key"];
  guideCharacter: CastKey;
};

export function HomeSubjectNote({ title, href, iconClass, teacherReason, highlights, subject, guideCharacter }: HomeSubjectNoteProps) {
  return (
    <Card className="h-full min-w-0 gap-0 overflow-hidden border-2 bg-card py-0 shadow-sm" data-subject={subject}>
      <CardHeader className={`cast-${guideCharacter} character-surface material-surface material-felt flex min-h-44 flex-col items-start gap-3 border-b p-5`}>
        <span className={`brand-asset ${iconClass} icon-large`} aria-hidden="true" />
        <div className="min-w-0">
          <CardTitle><Link href={href}>{title}</Link></CardTitle>
          <p className="mt-2 text-sm leading-6">{teacherReason}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <nav className="grid" aria-label={`${title} lesson topics`}>
          {highlights.map((highlight) => (
            <Link className="border-b border-border px-5 py-3 font-semibold last:border-b-0 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none" href={`/search?q=${encodeURIComponent(`${title} ${highlight}`)}`} key={highlight}>
              {highlight} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </CardContent>
      <CardFooter className="border-t border-border p-5">
        <Link className="font-bold underline underline-offset-4" href={href}>View all {title.toLowerCase()} lessons <span aria-hidden="true">→</span></Link>
      </CardFooter>
    </Card>
  );
}
