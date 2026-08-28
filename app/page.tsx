import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { SubjectTeachers } from "@/components/home/SubjectTeachers";
import { HomeGradeNav } from "@/components/home/HomeGradeNav";
import { BRAND_IMAGE_ASSETS } from "@/data/brand/image-registry";

export const metadata = {
  title: "Teacher Home | Old MacDonald Had a School",
  description:
    "Where familiar songs become new places to learn. Pick your classroom, browse new lessons, and find teacher-ready resources for every early-years grade.",
};

/* --- The designed hero (shared artifact) --- */

const HERO_PHOTO = BRAND_IMAGE_ASSETS.scenes["old-macs-open-circle-gathering"];

const NEW_LESSONS = [
  { title: "Find the Steady Beat", desc: "Feel and clap the heartbeat of songs." },
  { title: "Animal Action March", desc: "Move like the animals in the song." },
  { title: "Old MacDonald Orchestra", desc: "Explore classroom instruments and sounds." },
] as const;

const RIBBON_WORDS = ["Sing", "Play", "Learn", "Together"];

const PAGE_SHELL = "mx-auto min-w-0 w-full max-w-7xl px-3 sm:px-6";

function HeroBanner() {
  return (
    <section className="relative min-w-0 w-full grid items-center gap-8 lg:grid-cols-[1.05fr_auto_0.95fr]">
      <div className="flex min-w-0 flex-col gap-6">
        <h1 className="break-words font-heading text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.05] text-foreground">
          Where familiar songs become{" "}
          <em className="not-italic text-rose-muted">new places</em> to learn.
        </h1>
        {/* New this week list — paper note taped to the wall */}
        <div className="card-paper relative min-w-0 w-full max-w-full rounded-2xl border-brand-navy/10 p-5 shadow-lg">
          <span aria-hidden className="absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2 rounded-sm bg-gold-soft/50 shadow-sm [clip-path:polygon(3%_0,97%_6%,100%_88%,0_100%)]" />
          <div className="flex items-baseline justify-between px-1 pb-2">
            <span className="font-hand text-xl italic text-brand-paper-foreground">New this week</span>
            <span className="font-hand text-base italic text-brand-paper-muted">Kindergarten–Grade 2</span>
          </div>
          <ul className="divide-y divide-brand-paper-foreground/10">
            {NEW_LESSONS.map((lesson) => (
              <li key={lesson.title} className="flex min-w-0 items-center gap-3 py-3">
                <span className="size-2 shrink-0 rounded-full bg-rose-warm" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-brand-paper-foreground">{lesson.title}</p>
                  <p className="truncate text-xs text-brand-paper-muted">{lesson.desc}</p>
                </div>
                <span className="min-w-0 shrink-0 text-xs font-bold uppercase tracking-wide text-brand-paper-muted">K–2</span>
              </li>
            ))}
          </ul>
          <Link className="mt-2 flex min-h-11 items-center justify-center gap-1 rounded-md text-sm font-semibold text-brand-navy hover:text-rose-warm focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-[-3px]" href="/songs">
            See all new lessons <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Vertical ribbon (signature) */}
      <div className="hidden h-full lg:flex" aria-hidden>
        <div className="flex w-full flex-col items-center justify-center gap-2 px-1">
          <span className="size-2 rounded-full bg-gold-bright shadow-sm" />
          <div className="rotate-[-1.5deg] rounded-md border-2 border-dashed border-gold-bright/70 bg-brand-navy px-1.5 py-10 shadow-lg">
            <span className="font-hand block whitespace-nowrap text-2xl leading-none text-brand-navy-foreground [writing-mode:vertical-rl]">
              {RIBBON_WORDS.join("  •  ")}
            </span>
          </div>
          <span className="size-2 rounded-full bg-gold-bright shadow-sm" />
        </div>
      </div>

      {/* Pinned illustration (Polaroid) */}
      <div className="mx-auto w-full max-w-sm">
        <figure className="relative rotate-[2.5deg] rounded-xl border-[10px] border-white bg-white p-2 pb-3 shadow-lg">
          <span aria-hidden className="absolute left-3 -top-[5px] z-10 size-4 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--gold-soft),var(--gold-muted))] shadow-sm" />
          <span aria-hidden className="absolute right-3 -top-[5px] z-10 size-4 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--gold-soft),var(--gold-muted))] shadow-sm" />
          <Image
            src={HERO_PHOTO}
            alt="Old MacDonald reading with his animal students"
            width={1536}
            height={1024}
            className="aspect-[4/3] w-full rounded-md object-cover"
            priority
          />
          <figcaption className="font-hand pt-1.5 text-center text-lg italic text-brand-paper-foreground">
            morning circle — week one
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

const LATEST_VIDEOS = [
  {
    id: "HIPiJHj6wKw",
    title: "The Barnyard Song",
    summary: "Sing along with Old MacDonald and the whole barnyard crew.",
    tag: "Just released",
    thumb: "https://i.ytimg.com/vi/HIPiJHj6wKw/hqdefault.jpg",
  },
  {
    id: "IpuswcYQiG8",
    title: "Down by the Fishing Hole",
    summary: "Rhythm, rhyme, and a wiggly worm — perfect for movement time.",
    tag: "Latest video",
    thumb: "https://i.ytimg.com/vi/IpuswcYQiG8/hqdefault.jpg",
  },
] as const;

function WhatsNew() {
  return (
    <section
      className="relative w-full pt-12"
      id="whats-new"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-[26px] font-extrabold text-foreground">What&apos;s New</h2>
        <span className="font-hand text-[21px] text-ink-secondary">fresh songs from the barnyard studio</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {LATEST_VIDEOS.map((v) => (
          <article key={v.id} className="card-paper rounded-[18px] border-brand-navy/10 transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-xl">
            <a
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener"
              aria-label={`${v.title} — watch on YouTube`}
              className="flex flex-col gap-4 rounded-[18px] p-3 focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-[-3px] sm:flex-row"
            >
              <div className="relative h-36 w-full flex-shrink-0 overflow-hidden rounded-xl bg-muted sm:w-[220px]">
                <Image
                  src={v.thumb}
                  alt={`${v.title} video thumbnail`}
                  fill
                  sizes="(min-width: 640px) 220px, 100vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
                  <span className="flex size-11 items-center justify-center rounded-full bg-black/40 text-white"><Play className="size-5" /></span>
                </span>
              </div>
              <div className="flex flex-col justify-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-brand-paper-foreground">{v.tag}</span>
                <h3 className="font-heading text-[18px] font-bold leading-tight text-brand-paper-foreground">{v.title}</h3>
                <p className="text-sm text-brand-paper-muted">{v.summary}</p>
                <span className="text-xs text-brand-paper-muted">New on YouTube</span>
              </div>
            </a>
          </article>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link href="https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/" target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-foreground px-5 py-2 text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-[-3px]">
          <Play className="size-4" aria-hidden /> Watch the whole channel
        </Link>
        <span className="text-[13.5px] font-semibold text-ink-secondary">Videos live on our YouTube channel — every link opens in a new tab.</span>
      </div>
    </section>
  );
}

/* --- Search + curriculum planner (shared artifact) --- */

function CurriculumPlanner() {
  return (
    <section className="relative w-full pt-12 pb-4">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-[26px] font-extrabold text-foreground">Find a lesson, in seconds</h2>
        <span className="font-hand text-[21px] text-ink-secondary">search all lessons · or browse by subject</span>
      </div>
      <div className="card-paper rounded-3xl border-brand-navy/10 p-6 shadow-sm sm:p-7">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-[20px] font-extrabold text-brand-paper-foreground">Search lessons</h3>
            <p className="mb-4 text-sm text-brand-paper-muted">Type a topic, song, or skill. The full search page also shows the curriculum.</p>
            <form
              className="flex items-center gap-2.5 rounded-2xl border-2 border-brand-navy/15 bg-brand-paper py-1.5 pl-4 pr-1.5 transition-[border-color,box-shadow] focus-within:border-gold-bright focus-within:ring-4 focus-within:ring-gold-bright/20"
              action="/search"
              method="get"
              role="search"
            >
              <Search className="size-[18px] text-muted-foreground" aria-hidden />
              <Input
                name="q"
                className="h-11 border-0 bg-transparent px-0 text-[16px] text-brand-paper-foreground shadow-none focus-visible:ring-0"
                type="search"
                placeholder="Try “steady beat”, “shapes”, “feelings”…"
                aria-label="Search lessons"
              />
              <Button
                size="sm"
                type="submit"
                className="h-11 rounded-xl bg-brand-navy px-5 font-bold text-brand-navy-foreground hover:bg-gold-bright hover:text-brand-navy"
              >
                Search
              </Button>
            </form>
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-bold text-brand-paper-muted">Popular:</span>
              {["Steady beat", "Shapes", "Feelings", "Phonics"].map((t) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-brand-navy/15 bg-transparent px-3.5 py-1.5 text-[13px] font-semibold text-brand-paper-foreground transition-[transform,border-color] hover:-translate-y-px hover:border-gold-bright focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-[-3px]">{t}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-heading text-[20px] font-extrabold text-brand-paper-foreground">Browse the curriculum</h3>
            <p className="mb-4 text-sm text-brand-paper-muted">Lessons are organised by subject — and subjects change by grade.</p>
            <Link href="/search" className="inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-brand-paper-foreground px-5 py-2 text-sm font-bold text-brand-paper-foreground transition-colors hover:bg-brand-paper-foreground hover:text-brand-paper focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-[-3px]">
              Open the full search + curriculum <ArrowRight className="size-4" aria-hidden />
            </Link>
            <p className="mt-4 text-[13.5px] text-brand-paper-muted">
              <b className="text-brand-paper-foreground">Tip:</b> the subject buttons are grade-aware — a non-verbal infant doesn&apos;t learn formal math, so Daycare keeps only the subjects that fit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileQuickSearch() {
  return (
    <form
      className="flex items-center gap-2 rounded-2xl border-2 border-brand-navy/15 bg-background py-1.5 pl-4 pr-1.5 transition-[border-color,box-shadow] focus-within:border-gold-bright focus-within:ring-4 focus-within:ring-gold-bright/20 lg:hidden"
      action="/search"
      method="get"
      role="search"
      aria-label="Quick lesson search"
    >
      <Search className="size-[18px] shrink-0 text-muted-foreground" aria-hidden />
      <Input
        name="q"
        className="h-11 min-w-0 border-0 bg-transparent px-0 text-[16px] text-foreground shadow-none focus-visible:ring-0"
        type="search"
        placeholder="Try “steady beat” or “shapes”…"
        aria-label="Search lessons by topic, song, or skill"
      />
      <Button
        size="sm"
        type="submit"
        className="h-11 shrink-0 rounded-xl bg-brand-navy px-4 font-bold text-brand-navy-foreground hover:bg-gold-bright hover:text-brand-navy"
      >
        Search
      </Button>
    </form>
  );
}

export default function HomePage() {
  return (
    <section className={`flex w-full flex-col gap-10 pb-6 ${PAGE_SHELL}`}>
      <HomeGradeNav />
      <MobileQuickSearch />
      <HeroBanner />
      <Separator className="w-full" />
      <SubjectTeachers />
      <Separator className="w-full" />
      <WhatsNew />
      <Separator className="w-full" />
      <CurriculumPlanner />
    </section>
  );
}
