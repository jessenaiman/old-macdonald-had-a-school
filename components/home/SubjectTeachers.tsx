import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BrandIcon } from "@/components/brand-icon";
import { BRAND_IMAGE_ASSETS } from "@/data/brand/image-registry";

const SUBJECT_TEACHERS = [
  {
    key: "Language",
    label: "Language & literacy",
    verbs: "Listen, read, name",
    count: "44 lessons",
    href: "/search?q=language%20literacy",
    accentColor: "var(--characters-miss-hayley-color)",
    icon: "drama-storytelling-icon",
    teacher: "Miss Hayley",
    face: BRAND_IMAGE_ASSETS.facePatches["miss-hayley"],
  },
  {
    key: "Math",
    label: "Math",
    verbs: "Solve, count, estimate",
    count: "44 lessons",
    href: "/search?q=math%20numeracy",
    accentColor: "var(--characters-mr-sam-color)",
    icon: "math-building-icon",
    teacher: "Mr Sam",
    face: BRAND_IMAGE_ASSETS.facePatches["mr-sam"],
  },
  {
    key: "Science",
    label: "Nature & science",
    verbs: "Notice, explore, care",
    count: "23 lessons",
    href: "/search?q=science%20nature",
    accentColor: "var(--characters-miss-maisy-color)",
    icon: "gardening-health-icon",
    teacher: "Miss Maisy",
    face: BRAND_IMAGE_ASSETS.facePatches["miss-maisy"],
  },
  {
    key: "Music",
    label: "Music",
    verbs: "Sing, play, move",
    count: "50 lessons",
    href: "/search?q=music%20rhythm",
    accentColor: "var(--characters-old-macdonald-color)",
    icon: "music-hand-drum",
    teacher: "Old MacDonald",
    face: BRAND_IMAGE_ASSETS.facePatches["old-macdonald"],
  },
  {
    key: "Arts",
    label: "The arts",
    verbs: "Create, express, imagine",
    count: "50 lessons",
    href: "/search?q=art%20creative",
    accentColor: "var(--characters-mr-puddles-color)",
    icon: "painting-easel",
    teacher: "Mr Puddles",
    face: BRAND_IMAGE_ASSETS.facePatches["mr-puddles"],
  },
  {
    key: "Health",
    label: "Health & movement",
    verbs: "Move, stretch, feel good",
    count: "31 lessons",
    href: "/search?q=physical%20health",
    accentColor: "var(--characters-mr-maisy-color)",
    icon: "physical-education-icon",
    teacher: "Mr Maisy",
    face: BRAND_IMAGE_ASSETS.facePatches["mr-maisy"],
  },
] as const;

export function SubjectTeachers() {
  return (
    <section
      className="w-full"
      aria-labelledby="st-title"
    >
      <span
        id="st-title"
        className="mb-6 inline-block rounded-xl border border-border bg-card px-6 py-3 font-hand text-[22px] text-card-foreground shadow-sm"
      >
        Find a lesson by subject.
      </span>

      <div
        className="material-surface material-cork rounded-3xl border-2 border-dashed border-foreground/10 p-6 shadow-lg"
      >
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {SUBJECT_TEACHERS.map((s) => (
            <Link key={s.key} href={s.href} className="group block">
              <Card className="card-paper relative min-w-0 overflow-hidden border-border/40 bg-brand-paper text-brand-paper-foreground shadow-md transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-lg">
                {/* Pushpin icon */}
                <span className="absolute left-1/2 top-2 z-10 size-4 -translate-x-1/2" aria-hidden>
                  <span className="block size-4 rounded-full border-2 border-gold-bright bg-background" />
                </span>

                <CardHeader className="flex flex-col items-center gap-0 pb-0 text-center">
                  <span
                    className="flex size-12 items-center justify-center rounded-full bg-muted shadow-sm"
                    style={{ backgroundColor: `color-mix(in srgb, ${s.accentColor} 20%, transparent)` }}
                  >
                    <BrandIcon icon={s.icon} size="small" className="icon-small" />
                  </span>
                  <CardTitle
                    className="mt-2.5 font-heading text-[15px] font-bold leading-tight text-ink-primary"
                  >
                    {s.label}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-0 px-4 pb-0 pt-2 text-center">
                  <p className="text-xs text-muted-foreground">{s.verbs}</p>
                  <span className="mt-1 text-[11px] font-semibold text-muted-foreground">
                    {s.count}
                  </span>
                  <span className="mt-2 text-xs font-semibold text-ink-primary transition-colors group-hover:text-gold-bright">
                    Explore <span aria-hidden>→</span>
                  </span>
                </CardContent>

                <Separator className="mx-auto my-3 w-[calc(100%-2rem)]" />

                <CardFooter className="flex items-center justify-center gap-2 px-4 pb-3 pt-0">
                  <Avatar className="size-8">
                    <AvatarImage src={s.face} alt={s.teacher} />
                    <AvatarFallback className="text-[11px]">{s.teacher.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-[11.5px] leading-tight text-muted-foreground">
                    Guided by{" "}
                    <strong className="text-foreground">{s.teacher}</strong>
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
