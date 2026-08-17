import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HOME_SUBJECTS, SUBJECT_LEARNERS, HOME_VIDEO_SONGS } from "@/components/home/home-data";
import { CAST } from "@/data/brand/cast-registry";
import { BRAND_IMAGE_ASSETS } from "@/data/brand/image-registry";
import { cn } from "@/lib/utils";
import type { CastKey } from "@/data/brand/cast-registry";

type GradeCardType = {
  key: "daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two";
  label: string;
  castKey: CastKey;
};

const GRADE_CARDS: readonly GradeCardType[] = [
  { key: "daycare", label: "Daycare", castKey: "miss-puddles" },
  { key: "pre-school", label: "Pre-School", castKey: "miss-maisy" },
  { key: "kindergarten", label: "Kindergarten", castKey: "mr-rusty" },
  { key: "grade-one", label: "Grade 1", castKey: "miss-hayley" },
  { key: "grade-two", label: "Grade 2", castKey: "mr-maisy" },
];

type SubjectCardType = {
  key: "language" | "math" | "science" | "music" | "arts" | "health";
  title: string;
  icon: string;
  guide: CastKey;
};

const SUBJECT_CARDS: readonly SubjectCardType[] = [
  { key: "language", title: "Language & literacy", icon: "drama-storytelling-icon", guide: "whiskers" },
  { key: "math", title: "Math", icon: "math-building-icon", guide: "sam" },
  { key: "science", title: "Nature & science", icon: "gardening-health-icon", guide: "scout" },
  { key: "music", title: "Music", icon: "music-hand-drum", guide: "penny" },
  { key: "arts", title: "Arts", icon: "painting-easel", guide: "puddles" },
  { key: "health", title: "Health & PE", icon: "physical-education-icon", guide: "hopper" },
];

const NEW_THIS_WEEK = [
  { title: "Five Little Ducks", summary: "Counting down with fingerplay." },
  { title: "The Itsy Bitsy Spider", summary: "Coordination and rhythm." },
  { title: "Find the Steady Beat", summary: "Feel the heartbeat of songs." },
];

function CastAvatar({ castKey, className }: { castKey: CastKey; className?: string }) {
  const cast = CAST[castKey];
  const badges = BRAND_IMAGE_ASSETS.badges as Record<string, string | undefined>;
  const src = badges[castKey];
  return (
    <Avatar size="sm" className={className}>
      {src ? <AvatarImage src={src} alt={cast?.name ?? ""} /> : null}
      <AvatarFallback>{cast?.name?.charAt(0) ?? "?"}</AvatarFallback>
    </Avatar>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6 md:max-w-6xl">
      {/* Hero — plain section with theme primary surface */}
      <section className="bg-primary text-primary-foreground rounded-xl px-6 py-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-3xl leading-tight sm:text-4xl md:text-5xl">
            Songs teachers know.
            <br />
            Places children can <em className="not-italic text-accent">grow.</em>
          </h1>
          <p className="max-w-xl font-hand text-xl text-primary-foreground/90 sm:text-2xl">
            Practical, playful lessons built around familiar songs so every child can
            listen, move, hum, sing, and invent.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#grades">Browse by grade</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/search">Search lessons</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Grades — up top: teachers navigate by grade first */}
      <section id="grades" aria-labelledby="grades-heading" className="flex flex-col gap-3">
        <h2 id="grades-heading" className="font-heading text-xl sm:text-2xl">
          Explore by grade
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {GRADE_CARDS.map((grade) => {
            const teacher = CAST[grade.castKey];
            return (
              <Card key={grade.key} className="transition-colors hover:bg-accent">
                <CardContent className="flex items-center gap-3">
                  <CastAvatar castKey={grade.castKey} className="size-12 shrink-0" />
                  <Button asChild variant="ghost" size="sm" className="px-0 text-left h-auto justify-start">
                    <Link href={`/grade/${grade.key}`} className="flex flex-col items-start gap-0.5">
                      <span className="font-semibold">{grade.label}</span>
                      <span className="font-hand text-sm text-muted-foreground">with {teacher?.name}</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Subject board */}
      <section id="subjects" aria-labelledby="subjects-heading" className="flex flex-col gap-3">
        <h2 id="subjects-heading" className="font-heading text-2xl sm:text-3xl">
          Find a lesson by subject.
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SUBJECT_CARDS.map((subject) => {
            const guide = CAST[subject.guide];
            const meta = HOME_SUBJECTS.find((entry) => entry.key === subject.key);
            return (
              <Card key={subject.key} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className={`brand-asset ${subject.icon} icon-control`} aria-hidden="true" />
                    <CardTitle className="font-heading text-lg sm:text-xl">{subject.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground sm:text-base">{meta?.teacherReason}</p>
                  <Button asChild variant="link" className="justify-start px-0">
                    <Link href={`/search?q=${encodeURIComponent(meta?.searchQuery ?? subject.title)}`}>
                      Explore subject <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                  <CastAvatar castKey={subject.guide} className="size-8" />
                  <span className="text-xs sm:text-sm">
                    <small className="block text-muted-foreground">Guided by</small>
                    <span className="font-semibold">{guide?.name}</span>
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Songs + new this week */}
      <Card>
        <CardHeader>
          <CardTitle>Songs to repeat & new this week</CardTitle>
          <CardDescription>Classroom favourites and fresh additions.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h3 className="font-hand text-lg">♫ Songs to repeat</h3>
            {HOME_VIDEO_SONGS.slice(0, 3).map((song) => (
              <Link
                key={song.slug}
                href={song.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent"
              >
                <span className="text-primary">♫</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{song.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{song.grade}</span>
                </span>
              </Link>
            ))}
          </div>
          <Separator className="md:hidden" />
          <div className="flex flex-col gap-2">
            <h3 className="font-hand text-lg">★ New this week</h3>
            {NEW_THIS_WEEK.map((lesson) => (
              <Link
                key={lesson.title}
                href={`/search?q=${encodeURIComponent(lesson.title)}`}
                className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent"
              >
                <span className="text-primary">★</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{lesson.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{lesson.summary}</span>
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Closing statement */}
      <Card className="bg-muted">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Plan with intention</Badge>
          <CardTitle className="font-heading text-2xl leading-tight sm:text-3xl md:text-4xl">
            Build learning around familiar songs and clear routines.
          </CardTitle>
          <CardDescription className="max-w-xl">
            Practical, character-driven planning for the real classroom moments that matter.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/search">Find a lesson</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">About the approach</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/lessons">Browse all lessons <ArrowRight data-icon="inline-end" /></Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}