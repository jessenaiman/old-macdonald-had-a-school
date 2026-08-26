import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BrandIcon } from "@/components/brand-icon";

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
    face: "/characters/face-patch-transparent/miss-hayley-purple.webp",
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
    face: "/characters/face-patch-transparent/mr-sam-blue.webp",
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
    face: "/characters/face-patch-transparent/miss-maisy-purple.webp",
  },
  {
    key: "Music",
    label: "Music",
    verbs: "Sing, play, move",
    count: "50 lessons",
    href: "/search?q=music%20rhythm",
    accentColor: "var(--characters-mr-maisy-color)",
    icon: "music-hand-drum",
    teacher: "Old MacDonald",
    face: "/characters/face-patch-transparent/old-macdonald-yellow.webp",
  },
  {
    key: "Arts",
    label: "The arts",
    verbs: "Create, express, imagine",
    count: "50 lessons",
    href: "/search?q=art%20creative",
    accentColor: "var(--rose-warm)",
    icon: "painting-easel",
    teacher: "Mr Puddles",
    face: "/characters/face-patch-transparent/mr-puddles-green.webp",
  },
  {
    key: "Health",
    label: "Health & movement",
    verbs: "Move, stretch, feel good",
    count: "31 lessons",
    href: "/search?q=physical%20health",
    accentColor: "var(--characters-miss-puddles-color)",
    icon: "physical-education-icon",
    teacher: "Miss Puddles",
    face: "/characters/face-patch-transparent/miss-puddles-purple.webp",
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
        className="rounded-3xl border-2 border-dashed border-foreground/10 bg-[var(--brand-paper)] p-6 shadow-[0_10px_30px_rgba(30,42,46,0.10)]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in_srgb, var(--brand-paper-muted) 24%, transparent), color-mix(in_srgb, var(--brand-paper-muted) 24%, transparent)), var(--asset-cork-repeat-web)",
        }}
      >
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {SUBJECT_TEACHERS.map((s) => (
            <Link key={s.key} href={s.href} className="group block">
              <Card className="relative min-w-0 overflow-hidden border-border/40 bg-card shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-150 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.18)]">
                {/* Pushpin icon */}
                <span className="absolute left-1/2 top-2 z-10 size-4 -translate-x-1/2" aria-hidden>
                  <span className="block size-4 rounded-full border-2 border-[var(--gold-bright)] bg-background" />
                </span>

                <CardHeader className="flex flex-col items-center gap-0 pb-0 text-center">
                  <span
                    className="flex size-12 items-center justify-center rounded-full bg-muted shadow-sm"
                    style={{ backgroundColor: s.accentColor + "20" }}
                  >
                    <BrandIcon icon={s.icon} size="small" className="icon-small" />
                  </span>
                  <CardTitle
                    className="mt-2.5 text-[15px] font-bold leading-tight font-heading text-[var(--ink-primary)]"
                  >
                    {s.label}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-0 px-4 pb-0 pt-2 text-center">
                  <p className="text-xs text-muted-foreground">{s.verbs}</p>
                  <span className="mt-1 text-[11px] font-semibold text-muted-foreground">
                    {s.count}
                  </span>
                  <span className="mt-2 text-xs font-semibold text-[var(--ink-primary)] transition-colors group-hover:text-[var(--gold-bright)]">
                    Explore <span aria-hidden>→</span>
                  </span>
                </CardContent>

                <Separator className="mx-auto my-3 w-[calc(100%-2rem)]" />

                <CardFooter className="flex items-center justify-center gap-2 px-4 pb-3 pt-0">
                  <Avatar className="size-8">
                    <AvatarImage src={s.face} alt={s.teacher} />
                    <AvatarFallback className="text-[10px]">{s.teacher.charAt(0)}</AvatarFallback>
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
