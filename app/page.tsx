import Link from "next/link";
import { ArrowRight, Play, Move, Music, Smile, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HOME_SUBJECTS, SUBJECT_LEARNERS, HOME_VIDEO_SONGS } from "@/components/home/home-data";
import { CAST } from "@/data/brand/cast-registry";
import { BRAND_IMAGE_ASSETS } from "@/data/brand/image-registry";
import { ResponsiveBrandEmblem } from "@/components/brand/ResponsiveBrandEmblem";
import type { CastKey } from "@/data/brand/cast-registry";

type GradeAvatarType = {
  key: "daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two";
  label: string;
  castKey: CastKey;
  studentKey: CastKey;
};

const GRADE_AVATARS: readonly GradeAvatarType[] = [
  { key: "daycare", label: "Daycare", castKey: "miss-puddles", studentKey: "puddles" },
  { key: "pre-school", label: "Pre-School", castKey: "miss-maisy", studentKey: "maisy" },
  { key: "kindergarten", label: "Kindergarten", castKey: "mr-rusty", studentKey: "rusty" },
  { key: "grade-one", label: "Grade 1", castKey: "miss-hayley", studentKey: "hopper" },
  { key: "grade-two", label: "Grade 2", castKey: "mr-maisy", studentKey: "sam" },
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
] as const;

function SubjectCard({ subject, guideKey }: { subject: SubjectCardType; guideKey: CastKey }) {
  const guide = CAST[guideKey];
  return (
    <Card className="group h-full flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex flex-col items-center text-center pb-4">
        <div className="relative mb-4">
          <Avatar className="size-20 ring-4 ring-background shadow-lg">
            <AvatarImage src={guide?.portrait} alt={guide?.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {guide?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <span className={`brand-asset ${subject.icon} icon-medium`} aria-hidden="true" />
        <CardTitle className="mt-3 text-xl">{subject.title}</CardTitle>
        <CardDescription className="mt-2 max-w-xs">
          {HOME_SUBJECTS.find((s) => s.key === subject.key)?.teacherReason}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Avatar className="size-6">
              <AvatarImage src={guide?.portrait} alt={guide?.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {guide?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            Guided by {guide?.name}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/search?q=${encodeURIComponent(HOME_SUBJECTS.find((s) => s.key === subject.key)?.searchQuery ?? subject.title)}`}>
            Explore {subject.title.toLowerCase()} <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function GradeAvatar({ grade }: { grade: GradeAvatarType }) {
  const cast = CAST[grade.castKey];
  const student = CAST[grade.studentKey];
  return (
    <Link href={`/grade/${grade.key}`} className="group flex flex-col items-center gap-2">
      <div className="relative">
        <Avatar className="size-20 ring-4 ring-background shadow-lg group-hover:ring-2 group-hover:ring-primary/50 transition-colors">
          <AvatarImage src={cast?.portrait} alt={cast?.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {cast?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-1 -right-1 size-6 rounded-full bg-background/80 backdrop-blur-sm ring-2 ring-background flex items-center justify-center">
          <Avatar className="size-5">
            <AvatarImage src={student?.portrait} alt={student?.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-[8px]">
              {student?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </span>
      </div>
      <span className="text-sm font-medium text-center max-w-[80px]">{grade.label}</span>
    </Link>
  );
}

function SongRow({ song }: { song: { readonly slug: string; readonly title: string; readonly summary: string; readonly grade: string; readonly icon: string; readonly href: string } }) {
  return (
    <Link
      href={song.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent/10 hover:border-accent transition-colors group"
    >
      <span className={`brand-asset ${song.icon} icon-control shrink-0 text-primary`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{song.title}</p>
        <p className="text-sm text-muted-foreground truncate">{song.summary || song.grade}</p>
      </div>
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
        <Play className="size-5" aria-hidden="true" />
        <span className="sr-only">Play {song.title}</span>
      </Button>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4 text-sm">
                Songs teachers know. Lessons children love.
              </Badge>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-foreground">
                Start where children already feel at home.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl">
                Familiar songs, practical lessons, and playful learning for every grade — from daycare through Grade 2.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Link href="/grade/pre-school">
                    Browse by grade <ArrowRight className="size-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 bg-background border-border hover:bg-accent/10">
                  <Link href="/search">
                    <Search className="size-5" aria-hidden="true" />
                    Search lessons
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden bg-muted border border-border shadow-xl">
              <span className="brand-asset home-scene-class-gathering absolute inset-0 block size-full" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 sm:py-24 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">Find a teaching thread</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
              Browse by subject
            </h2>
            <p className="text-muted-foreground text-lg">
              Follow an idea from a child&apos;s first question to a classroom activity.
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {SUBJECT_CARDS.map((subject) => (
              <SubjectCard
                key={subject.key}
                subject={subject}
                guideKey={SUBJECT_LEARNERS[subject.key as keyof typeof SUBJECT_LEARNERS].character}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Songs to Repeat */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <Badge variant="secondary" className="mb-2">Songs to repeat</Badge>
              <h2 className="font-heading text-3xl sm:text-4xl">Classroom favourites teachers come back to</h2>
            </div>
            <Button asChild variant="ghost" className="mt-4 sm:mt-0">
              <Link href="/songs">View all songs <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
            </Button>
          </header>
          <div className="space-y-3" role="list" aria-label="Songs to repeat">
            {HOME_VIDEO_SONGS.slice(0, 3).map((song): React.ReactElement => (
              <SongRow key={song.slug} song={song} />
            ))}
          </div>
        </div>
      </section>

      {/* New This Week */}
      <section className="py-16 sm:py-24 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-2">New this week</Badge>
              <h2 className="font-heading text-3xl sm:text-4xl">Fresh lessons and resources</h2>
            </div>
            <Button asChild variant="ghost" className="mt-4 sm:mt-0">
              <Link href="/lessons">View all lessons <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
            </Button>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Find the Steady Beat", summary: "Feel and clap the heartbeat of songs.", subject: "Music", grade: "All grades" },
              { title: "Animal Action March", summary: "Move like the animals in the song.", subject: "Health & PE", grade: "Daycare, Pre-School" },
              { title: "Old MacDonald Orchestra", summary: "Explore classroom instruments.", subject: "Music", grade: "Kindergarten, Grade 1" },
              { title: "The Itsy Bitsy Spider", summary: "Fingerplay for coordination and rhythm.", subject: "Fine motor", grade: "Daycare, Pre-School, Kindergarten" },
              { title: "Plant Your Seeds", summary: "A growing pattern song for spring.", subject: "Nature & science", grade: "Pre-School, Kindergarten" },
              { title: "Seven Jumps", summary: "Movement game with musical cues.", subject: "Health & PE", grade: "Kindergarten, Grade 1, Grade 2" },
            ].map((song, i) => (
              <Card key={i} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{song.subject}</Badge>
                    <Badge variant="outline" className="text-xs">{song.grade}</Badge>
                  </div>
                  <CardTitle className="mt-3">{song.title}</CardTitle>
                  <CardDescription>{song.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1" />
                <CardFooter className="pt-0">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/search?q=${encodeURIComponent(song.title)}`}>View lesson <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Navigation */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Start with your group</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
              Find your grade
            </h2>
            <p className="text-muted-foreground text-lg">
              Open curriculum, planning, and grade-specific search.
            </p>
          </header>
          <nav className="flex flex-wrap justify-center gap-6 sm:gap-8" aria-label="Grade pages">
            {GRADE_AVATARS.map((grade) => (
              <GradeAvatar key={grade.key} grade={grade} />
            ))}
          </nav>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl mb-4">
            Ready to plan your next lesson?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Browse by topic, search for a specific goal, or start with a song your class already knows.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 gap-2">
              <Link href="/topics">
                Browse topics <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/50 hover:bg-primary-foreground/10 gap-2">
              <Link href="/search">
                <Search className="size-5" aria-hidden="true" />
                Search lessons
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}