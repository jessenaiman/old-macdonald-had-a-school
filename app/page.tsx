import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HomeCarousel, type HomeCarouselSlide } from "@/components/home/HomeCarousel";
import { CreativeArtsSection } from "@/components/home/CreativeArtsSection";
import { HomeSubjectNote } from "@/components/home/HomeSubjectNote";
import { HOME_SUBJECTS, SUBJECT_LEARNERS } from "@/components/home/home-data";

const CAROUSEL_SLIDES = [
  {
    assetClass: "home-scene-class-gathering",
    alt: "Old MacDonald and the class gathered for outdoor music",
    label: "Browse curriculum topics",
    href: "/topics",
  },
  {
    assetClass: "home-scene-growing-together",
    alt: "Friends observing and caring for a young plant",
    label: "Choose a ready-to-teach lesson",
    href: "/lessons",
  },
  {
    assetClass: "home-scene-music-landscape",
    alt: "Old MacDonald and friends discovering music in an imaginative stitched landscape",
    label: "Find music teaching resources",
    href: "/search?q=music",
  },
  {
    assetClass: "home-scene-schoolhouse",
    alt: "The welcoming red barn schoolhouse",
    label: "Plan for a grade",
    href: "/grade/pre-school",
  },
] as const satisfies readonly HomeCarouselSlide[];

const NEW_THIS_WEEK = [
  {
    title: "Find the Steady Beat",
    summary: "Feel and clap the heartbeat of songs.",
    href: "https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/search?query=steady%20beat",
    icon: "music-hand-drum",
  },
  {
    title: "Animal Action March",
    summary: "Move like the animals in the song.",
    href: "https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/search?query=animal%20action%20march",
    icon: "dance-turning-footprints",
  },
  {
    title: "Old MacDonald Orchestra",
    summary: "Explore classroom instruments.",
    href: "https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/search?query=Old%20MacDonald%20Orchestra",
    icon: "music-fiddle",
  },
] as const;

export default function Home() {
  return (
    <div className="material-surface material-leather-indigo grid min-w-0 gap-7 pb-7 pt-5">
      <section className="relative mx-4 rounded-xl border border-dashed border-accent/60 p-4 sm:p-6" aria-labelledby="home-title">
        <div className="grid min-w-0 items-center gap-4 md:grid-cols-2 md:gap-6">
          <div className="min-w-0 px-2 py-4 text-foreground sm:px-4 sm:py-6">
            <div className="max-w-xl">
              <h1 className="text-balance font-heading text-3xl leading-none sm:text-4xl" id="home-title">
                Where familiar songs become <em className="not-italic text-destructive">new places</em> to learn.
              </h1>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-foreground/85">
              Familiar songs, practical lessons, and playful learning for every grade.
            </p>
            <Card className="material-surface material-cardboard-paper mt-5 overflow-hidden py-0 text-card-foreground shadow-md">
              <CardHeader className="flex-row items-center justify-between gap-4 border-b py-3">
                <CardTitle className="font-hand text-2xl">New this week</CardTitle>
                <Button asChild size="sm" variant="link">
                  <Link href="/lessons">See all <span aria-hidden="true">→</span></Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="grid list-none">
                  {NEW_THIS_WEEK.map((lesson) => (
                    <li className="grid min-h-14 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-3 border-b border-border px-4 py-2 last:border-b-0" key={lesson.title}>
                      <span className={`brand-asset ${lesson.icon} icon-micro row-span-2`} aria-hidden="true" />
                      <Link className="min-w-0 text-sm font-extrabold leading-tight" href={lesson.href} target="_blank" rel="noreferrer">
                        {lesson.title}
                      </Link>
                      <p className="col-start-2 text-xs leading-snug text-muted-foreground">{lesson.summary}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="min-w-0">
            <HomeCarousel
              slides={CAROUSEL_SLIDES}
              title="From the school to your lesson plan"
              description="Choose a classroom path"
              ariaLabel="Featured teaching resources"
              pickerLabel="Choose a featured scene"
            />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button asChild size="sm"><Link href="#browse-by-subject">Browse subjects</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/search">Search lessons</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="material-surface material-cork mx-4 rounded-2xl border-4 border-[color-mix(in_srgb,var(--theme-wood)_72%,var(--foreground))] p-4 shadow-lg sm:p-6" id="browse-by-subject" aria-labelledby="subjects-title">
        <header className="material-surface material-cardboard-paper relative mx-auto mb-6 w-fit max-w-full rotate-[-0.4deg] rounded-md border px-6 py-3 text-center shadow-sm motion-reduce:rotate-0">
          <span className="brand-asset fastener-masking-tape icon-small absolute -top-4 left-1/2 -translate-x-1/2" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Direct curriculum links</p>
          <h2 className="font-heading text-3xl" id="subjects-title">Find a lesson by subject</h2>
        </header>
        <div className="grid auto-rows-fr items-stretch gap-3 md:grid-cols-2 xl:grid-cols-6">
          {HOME_SUBJECTS.map((subject) => (
            <HomeSubjectNote
              fastenerClass={subject.fastenerClass}
              guideCharacter={SUBJECT_LEARNERS[subject.key].character}
              highlights={subject.highlights}
              href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}
              iconClass={subject.iconClass}
              key={subject.key}
              subject={subject.key}
              teacherReason={subject.teacherReason}
              title={subject.title}
            />
          ))}
        </div>
      </section>

      <CreativeArtsSection />
    </div>
  );
}
