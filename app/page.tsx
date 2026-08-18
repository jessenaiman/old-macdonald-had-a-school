import Link from "next/link";
import { LayoutGrid, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeGradeNav } from "@/components/home/HomeGradeNav";
import { HomeSubjectNote } from "@/components/home/HomeSubjectNote";
import { CreativeArtsSection } from "@/components/home/CreativeArtsSection";
import { WorkingWallNote } from "@/components/working-wall/WorkingWallComponents";
import { HomeCarousel, type HomeCarouselSlide } from "@/components/home/HomeCarousel";
import { HOME_SUBJECTS, SUBJECT_LEARNERS, HOME_VIDEO_SONGS } from "@/components/home/home-data";

const NEW_THIS_WEEK = [
  { title: "Five Little Ducks", summary: "Counting down with fingerplay." },
  { title: "The Itsy Bitsy Spider", summary: "Coordination and rhythm." },
  { title: "Find the Steady Beat", summary: "Feel the heartbeat of songs." },
];

const SCENE_SLIDES: readonly HomeCarouselSlide[] = [
  { assetClass: "home-scene-class-gathering", alt: "Children gathered in a circle for storytime", label: "Class gathering", href: "/about" },
  { assetClass: "home-scene-growing-together", alt: "Children learning and growing together", label: "Growing together", href: "/about" },
  { assetClass: "home-scene-music-landscape", alt: "Music instruments across the farm", label: "Music on the farm", href: "/songs" },
  { assetClass: "home-scene-schoolhouse", alt: "The old MacDonald schoolhouse", label: "The schoolhouse", href: "/about" },
];

export default function Home() {
  return (
    <main className="flex flex-col gap-8 py-6 lg:py-10">
      {/* Hero — simple navy surface, gold primary CTA + ghost secondary (approved) */}
      <section className="bg-primary text-primary-foreground rounded-xl px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
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
            <Button asChild size="lg" variant="accent">
              <Link href="#grades">
                <LayoutGrid data-icon="inline-start" aria-hidden="true" />
                Browse by grade
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineForeground">
              <Link href="/search">
                <Search data-icon="inline-start" aria-hidden="true" />
                Search lessons
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Scenes — tilted polaroid carousel of the farm */}
      <section aria-label="A look around the farm">
        <HomeCarousel
          slides={SCENE_SLIDES}
          title="A look around the farm"
          ariaLabel="Classroom scenes"
          pickerLabel="Choose a scene"
        />
      </section>

      {/* Grades — felt grade cards pinned to a cork board */}
      <section id="grades" className="working-wall-board p-4 sm:p-6" aria-label="Explore by grade">
        <HomeGradeNav />
      </section>

      {/* Subjects — paper notes with fasteners, pinned to a cork board */}
      <section
        className="material-surface material-cork rounded-xl border border-border p-4 pt-8 sm:p-6 sm:pt-8"
        aria-labelledby="home-subjects-title"
      >
        <header className="mb-6 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-primary">
            Lessons for every area
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl" id="home-subjects-title">
            Find a lesson by subject
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Eight learning areas, each with a guide character and ready lesson topics.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {HOME_SUBJECTS.map((subject) => (
            <HomeSubjectNote
              key={subject.key}
              subject={subject.key}
              title={subject.title}
              href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}
              iconClass={subject.iconClass}
              teacherReason={subject.teacherReason}
              highlights={subject.highlights}
              fastenerClass={subject.fastenerClass}
              guideCharacter={SUBJECT_LEARNERS[subject.key].character}
            />
          ))}
        </div>
      </section>

      {/* Creative arts */}
      <CreativeArtsSection />

      {/* Songs + new this week — paper notes */}
      <section className="grid gap-6 md:grid-cols-2" aria-labelledby="home-songs-title">
        <h2 className="sr-only" id="home-songs-title">Songs to repeat and new this week</h2>
        <WorkingWallNote fastener="tape" heading="Songs to repeat" className="h-full">
          <ul className="flex flex-col gap-2">
            {HOME_VIDEO_SONGS.slice(0, 3).map((song) => (
              <li key={song.slug}>
                <Link
                  href={song.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent"
                >
                  <span className="text-primary" aria-hidden="true">♫</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{song.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{song.grade}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </WorkingWallNote>
        <WorkingWallNote fastener="clip" heading="New this week" className="h-full">
          <ul className="flex flex-col gap-2">
            {NEW_THIS_WEEK.map((lesson) => (
              <li key={lesson.title}>
                <Link
                  href={`/search?q=${encodeURIComponent(lesson.title)}`}
                  className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent"
                >
                  <span className="text-primary" aria-hidden="true">★</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{lesson.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{lesson.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </WorkingWallNote>
      </section>

      {/* Closing statement — pinned teacher note */}
      <WorkingWallNote fastener="pin" heading="Plan with intention" className="bg-muted">
        <Badge variant="secondary" className="w-fit">
          Plan with intention
        </Badge>
        <h2 className="mt-3 font-heading text-2xl leading-tight sm:text-3xl">
          Build learning around familiar songs and clear routines.
        </h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Practical, character-driven planning for the real classroom moments that matter.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/search">Find a lesson</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">About the approach</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/lessons">
              Browse all lessons <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>
      </WorkingWallNote>
    </main>
  );
}
