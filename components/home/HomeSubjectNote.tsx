import Image from "next/image";
import Link from "next/link";
import { CAST } from "@/lib/cast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export type SubjectNoteShape = "torn" | "grid" | "deckled" | "ruled" | "scalloped" | "folded";

export type HomeSubjectNoteProps = {
  subject: "language" | "math" | "science" | "music" | "arts" | "health";
  title: string;
  href: string;
  iconClass: string;
  teacherReason: string;
  highlights: readonly string[];
  fastenerClass: string;
  noteShape: SubjectNoteShape;
  guideCharacter?: "whiskers" | "sam" | "scout" | "penny" | "puddles" | "hopper";
  rotation?: "left" | "none" | "right";
};

export function HomeSubjectNote({
  subject,
  title,
  href,
  iconClass,
  teacherReason,
  highlights,
  fastenerClass,
  noteShape,
  guideCharacter,
  rotation = "none",
}: HomeSubjectNoteProps) {
  const guide = guideCharacter ? CAST[guideCharacter] : undefined;
  return (
    <Card
      className="relative min-h-72 overflow-visible border-0 bg-transparent bg-[image:var(--subject-note-paper)] bg-[length:100%_100%] bg-center bg-no-repeat py-8 shadow-none"
      data-subject={subject}
      data-note-shape={noteShape}
      data-rotation={rotation}
    >
      <span className={`brand-asset ${fastenerClass} icon-medium absolute -top-5 left-1/2 z-10 -translate-x-1/2 drop-shadow-md`} aria-hidden="true" />
      <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-8 pb-2">
        <span className={`brand-asset ${iconClass} icon-small`} aria-hidden="true" />
        <div className="min-w-0">
          <Badge variant="secondary">Teach through</Badge>
          <CardTitle className="mt-2 text-[var(--subject-color)]"><Link href={href}>{title}</Link></CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-8">
        <p className="border-b border-[var(--subject-color)]/30 pb-3 font-hand text-xl font-bold text-foreground">{teacherReason}</p>
        <ul className="mt-2 grid list-none" aria-label={`${title} learning areas`}>
          {highlights.map((highlight) => (
            <li className="border-b border-border last:border-b-0" key={highlight}>
              <Link className="block py-2 font-bold hover:underline focus-visible:underline" href={`/search?q=${encodeURIComponent(`${title} ${highlight}`)}`}>{highlight}</Link>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2 px-8 pt-0">
          {guide ? (
            <span className="flex items-center gap-2 text-sm font-bold text-[var(--subject-color)]">
              <Image src={guide.portrait} alt="" width={32} height={32} />
              <span>{guide.name}</span>
            </span>
          ) : <span />}
          <Link href={href} className="font-bold text-[var(--subject-color)] underline underline-offset-4">Explore lessons <span aria-hidden="true">→</span></Link>
      </CardFooter>
    </Card>
  );
}
