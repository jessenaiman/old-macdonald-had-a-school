import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HomeCarousel, type HomeCarouselSlide } from "@/components/home/HomeCarousel";

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

const SUBJECTS = [
  {
    key: "language",
    title: "Language & literacy",
    href: "/search?q=language%20literacy",
    icon: "drama-storytelling-icon",
    reason: "Build confident talk, reading, and storytelling.",
    highlights: ["Build vocabulary", "Explore phonics", "Tell and retell stories"],
    fastener: "fastener-paperclip",
    owner: "cast-whiskers",
    paper: "material-cardboard-paper",
  },
  {
    key: "math",
    title: "Math",
    href: "/search?q=math%20numeracy",
    icon: "math-building-icon",
    reason: "Make counting, shape, and patterns visible.",
    highlights: ["Count and compare", "Explore shapes", "Find patterns in songs"],
    fastener: "fastener-push-pin",
    owner: "cast-sam",
    paper: "material-cardboard-paper material-cardboard-kraft",
  },
  {
    key: "science",
    title: "Nature & science",
    href: "/search?q=science%20nature",
    icon: "gardening-health-icon",
    reason: "Explore seasons, weather, and living things.",
    highlights: ["Observe and explore", "Seasons and weather", "Living things"],
    fastener: "fastener-binder-clip",
    owner: "cast-scout",
    paper: "material-cardboard-paper",
  },
  {
    key: "health",
    title: "Health & physical education",
    href: "/search?q=physical%20health%20development",
    icon: "physical-education-icon",
    reason: "Practise movement, cooperation, and healthy routines.",
    highlights: ["Move your body", "Play and cooperate", "Stay healthy"],
    fastener: "fastener-masking-tape",
    owner: "cast-hopper",
    paper: "material-cardboard-paper material-cardboard-kraft",
  },
  {
    key: "sel",
    title: "Social-emotional learning",
    href: "/search?q=social%20emotional%20learning%20SEL",
    icon: "community-helping",
    reason: "Build belonging, empathy, and confident participation.",
    highlights: ["Name feelings", "Practise kindness", "Learn together"],
    fastener: "fastener-gingham-tape",
    owner: "cast-penny",
    paper: "material-cardboard-paper",
  },
  {
    key: "fine-motor",
    title: "Fine motor skills",
    href: "/search?q=fine%20motor%20skills",
    icon: "early-learning-lacing",
    reason: "Strengthen the hands children use to make, draw, and write.",
    highlights: ["Pinch and place", "Thread and build", "Draw and prepare to write"],
    fastener: "fastener-apple-peg",
    owner: "cast-puddles",
    paper: "material-cardboard-paper material-cardboard-kraft",
  },
] as const;

const CREATIVE_AREAS = [
  {
    title: "Music",
    description: "Sing, listen, play, and find the beat.",
    href: "/search?q=music",
    icon: "music-hand-drum",
    owner: "cast-mr-rusty",
  },
  {
    title: "Art",
    description: "Make marks, mix colour, and create.",
    href: "/search?q=art",
    icon: "painting-easel",
    owner: "cast-mr-puddles",
  },
  {
    title: "Drama",
    description: "Pretend, tell stories, and perform.",
    href: "/search?q=drama",
    icon: "acting-theatre-masks",
    owner: "cast-miss-hayley",
  },
  {
    title: "Dancing",
    description: "Move, turn, travel, and dance together.",
    href: "/search?q=dance",
    icon: "dance-spiralling-scarves",
    owner: "cast-mr-rusty",
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
          {SUBJECTS.map((subject) => (
            <Card className={`${subject.owner} material-surface ${subject.paper} relative h-full min-w-0 gap-0 overflow-visible border-2 py-0 pt-8 shadow-[0_0.35rem_0_color-mix(in_srgb,var(--foreground)_18%,transparent)]`} data-subject={subject.key} key={subject.key}>
              <span className={`brand-asset ${subject.fastener} icon-small pointer-events-none absolute -top-4 left-1/2 z-10 -translate-x-1/2 drop-shadow-sm`} aria-hidden="true" />
              <CardHeader className="character-surface material-surface material-felt mx-2 flex min-h-28 flex-row items-center gap-3 rounded-lg border border-current p-3 shadow-sm">
                <span className={`brand-asset ${subject.icon} icon-medium shrink-0`} aria-hidden="true" />
                <div className="min-w-0">
                  <CardTitle><Link href={subject.href}>{subject.title}</Link></CardTitle>
                  <CardDescription className="mt-1 leading-5 text-inherit">{subject.reason}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-4 flex-1 p-0">
                <nav className="grid" aria-label={`${subject.title} lesson topics`}>
                  {subject.highlights.map((highlight) => (
                    <Link className="border-b border-border px-3 py-3 text-sm font-semibold last:border-b-0 hover:bg-accent focus-visible:bg-accent" href={`/search?q=${encodeURIComponent(`${subject.title} ${highlight}`)}`} key={highlight}>
                      {highlight} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </nav>
              </CardContent>
              <CardFooter className="min-h-16 border-t border-border px-3 py-3">
                <Link className="text-sm font-bold underline underline-offset-4" href={subject.href}>View all {subject.title.toLowerCase()} lessons <span aria-hidden="true">→</span></Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="material-surface material-cardboard-paper mx-4 rounded-xl border-2 border-border p-5 shadow-sm sm:p-6" aria-labelledby="creative-arts-title">
        <header className="mx-auto mb-6 max-w-2xl text-center">
          <p className="font-hand text-xl">Make some noise. Make something new.</p>
          <h2 className="font-heading text-3xl sm:text-4xl" id="creative-arts-title">Creative Arts</h2>
          <p className="mt-2 text-muted-foreground">Music, art, drama, and dancing turn imagination into something children can share.</p>
        </header>
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CREATIVE_AREAS.map((area) => (
            <Card className={`${area.owner} character-surface material-surface material-felt relative h-full min-w-0 border-2 shadow-[0_0.35rem_0_color-mix(in_srgb,var(--character-color)_55%,var(--foreground))] after:pointer-events-none after:absolute after:inset-2 after:rounded-[calc(var(--radius)-0.25rem)] after:border after:border-dashed after:border-current after:opacity-45`} key={area.title}>
              <CardHeader className="flex flex-col items-center text-center">
                <span className={`brand-asset ${area.icon} icon-medium`} aria-hidden="true" />
                <CardTitle>{area.title}</CardTitle>
                <CardDescription className="w-full max-w-xs text-balance text-inherit">{area.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="justify-center">
                <Link className="font-bold underline underline-offset-4" href={area.href}>Explore {area.title.toLowerCase()} <span aria-hidden="true">→</span></Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
