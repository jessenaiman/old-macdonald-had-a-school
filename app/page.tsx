import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { SubjectTeachers } from "@/components/home/SubjectTeachers";

export const metadata = {
  title: "Teacher Home | Old MacDonald Had a School",
  description:
    "Where familiar songs become new places to learn. Pick your classroom, browse new lessons, and find teacher-ready resources for every early-years grade.",
};

/* --- The designed hero (shared artifact) --- */

const HERO_PHOTO = "/hero/old-macs-open-circle-gathering.webp";

const NEW_LESSONS = [
  { title: "Find the Steady Beat", desc: "Feel and clap the heartbeat of songs.", tags: ["K", "1", "2"] },
  { title: "Animal Action March", desc: "Move like the animals in the song.", tags: ["K", "1", "2"] },
  { title: "Old MacDonald Orchestra", desc: "Explore classroom instruments and sounds.", tags: ["K", "1", "2"] },
] as const;

const RIBBON_WORDS = ["Sing", "Play", "Learn", "Together"];

const PAGE_SHELL = "mx-auto min-w-0 w-full max-w-7xl px-3 sm:px-6";

function HeroBanner() {
  return (
    <section className="relative w-full grid items-center gap-8 lg:grid-cols-[1.05fr_auto_0.95fr]">
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.05] text-brand-navy">
          Where familiar songs become{" "}
          <em className="not-italic text-[var(--rose-muted)]">new places</em> to learn.
        </h1>
        {/* New this week list — paper note taped to the wall */}
        <div className="relative rounded-2xl border border-[var(--brand-navy)]/10 bg-[var(--brand-paper)] p-5 shadow-[0_2px_10px_rgba(30,42,56,0.08),0_8px_24px_rgba(30,42,56,0.06)]">
          <span aria-hidden className="absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2 rounded-sm bg-[var(--gold-soft)]/50 shadow-sm [clip-path:polygon(3%_0,97%_6%,100%_88%,0_100%)]" />
          <div className="flex items-baseline justify-between px-1 pb-2">
            <span className="font-hand text-xl italic text-[var(--rose-muted)]">New this week</span>
            <span className="font-hand text-base italic text-[var(--brand-paper-foreground)]">Grades</span>
          </div>
          <ul className="divide-y divide-[var(--brand-paper-foreground)]/10">
            {NEW_LESSONS.map((lesson) => (
              <li key={lesson.title} className="flex items-center gap-3 py-3">
                <span className="size-2 shrink-0 rounded-full bg-[var(--rose-warm)]" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[var(--brand-paper-foreground)]">{lesson.title}</p>
                  <p className="truncate text-xs text-[var(--brand-paper-muted)]">{lesson.desc}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {lesson.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-[var(--gold-bright)] bg-[var(--gold-bright)]/15 px-2 py-0.5 text-xs font-bold text-[var(--brand-paper-foreground)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <Link className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-[var(--brand-navy)] hover:text-[var(--rose-warm)]" href="/songs">
            See all new lessons <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Vertical ribbon (signature) */}
      <div className="hidden h-full lg:flex" aria-hidden>
        <div className="flex w-full flex-col items-center justify-center gap-2 px-1">
          <span className="size-2 rounded-full bg-[var(--gold-bright)] shadow-[0_1px_2px_rgba(30,42,56,0.4)]" />
          <div className="rotate-[-1.5deg] rounded-md border-2 border-dashed border-[var(--gold-bright)]/70 bg-brand-navy px-1.5 py-10 shadow-[0_4px_14px_rgba(30,42,56,0.25)]">
            <span className="font-hand block whitespace-nowrap text-2xl leading-none text-brand-navy-foreground [writing-mode:vertical-rl]">
              {RIBBON_WORDS.join("  •  ")}
            </span>
          </div>
          <span className="size-2 rounded-full bg-[var(--gold-bright)] shadow-[0_1px_2px_rgba(30,42,56,0.4)]" />
        </div>
      </div>

      {/* Pinned illustration (Polaroid) */}
      <div className="relative mx-auto w-full max-w-sm">
        <span aria-hidden className="absolute left-3 top-3 z-10 size-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--gold-soft),var(--gold-muted))] shadow-[0_2px_3px_rgba(30,42,56,0.35)]" />
        <span aria-hidden className="absolute right-3 top-3 z-10 size-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--gold-soft),var(--gold-muted))] shadow-[0_2px_3px_rgba(30,42,56,0.35)]" />
        <figure className="rotate-[2.5deg] rounded-xl border-[10px] border-white bg-white p-2 pb-3 shadow-[0_4px_18px_rgba(30,42,56,0.18)]">
          <Image
            src={HERO_PHOTO}
            alt="Old MacDonald reading with his animal students"
            width={1536}
            height={1024}
            className="aspect-[4/3] w-full rounded-md object-cover"
            priority
          />
          <figcaption className="font-hand pt-1.5 text-center text-lg italic text-[var(--ink-primary)]">
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
        <h2 className="font-heading text-[26px] font-extrabold text-foreground">What's New</h2>
        <span className="font-hand text-[21px] text-[var(--ink-secondary)]">fresh songs from the barnyard studio</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {LATEST_VIDEOS.map((v) => (
          <article key={v.id} className="flex flex-col gap-4 rounded-[18px] border border-[var(--brand-navy)]/10 bg-[var(--brand-paper)] p-3 transition-all hover:-translate-y-1 hover:shadow-xl sm:flex-row">
            <div className="relative h-36 w-full flex-shrink-0 overflow-hidden rounded-xl bg-muted sm:w-[220px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumb} alt={`${v.title} video thumbnail`} className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
                <span className="flex size-11 items-center justify-center rounded-full bg-black/40 text-white"><Play className="size-5" /></span>
              </span>
            </div>
            <div className="flex flex-col justify-center gap-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--gold-bright)]">{v.tag}</span>
              <h3 className="font-heading text-[18px] font-bold leading-tight text-[var(--brand-paper-foreground)]">{v.title}</h3>
              <p className="text-sm text-[var(--brand-paper-muted)]">{v.summary}</p>
              <span className="text-xs text-[var(--brand-paper-muted)]">New on YouTube</span>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link href="https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-foreground px-5 py-2 text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-background">
          <Play className="size-4" aria-hidden /> Watch the whole channel
        </Link>
        <span className="text-[13.5px] font-semibold text-[var(--ink-secondary)]">Videos play right here — no leaving the site.</span>
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
        <span className="font-hand text-[21px] text-[var(--ink-secondary)]">search all lessons · or browse by subject</span>
      </div>
      <div className="rounded-3xl border border-[var(--brand-navy)]/10 bg-[var(--brand-paper)] p-6 sm:p-7 shadow-sm">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-[20px] font-extrabold text-[var(--brand-paper-foreground)]">Search lessons</h3>
            <p className="mb-4 text-sm text-[var(--brand-paper-muted)]">Type a topic, song, or skill. The full search page also shows the curriculum.</p>
            <form
              className="flex items-center gap-2.5 rounded-2xl border-2 border-[var(--brand-navy)]/15 bg-background py-1.5 pl-4 pr-1.5 transition-[border-color,box-shadow] focus-within:border-[var(--gold-bright)] focus-within:shadow-[0_0_0_4px_rgba(212,168,42,0.18)]"
              action="/search"
              method="get"
              role="search"
            >
              <Search className="size-[18px] text-muted-foreground" aria-hidden />
              <Input
                name="q"
                className="h-11 border-0 bg-transparent px-0 text-[16px] text-foreground shadow-none focus-visible:ring-0"
                type="search"
                placeholder="Try “steady beat”, “shapes”, “feelings”…"
                aria-label="Search lessons"
              />
              <Button
                size="sm"
                type="submit"
                className="h-9 rounded-xl bg-brand-navy px-5 font-bold text-brand-navy-foreground hover:bg-[var(--gold-bright)] hover:text-brand-navy"
              >
                Search
              </Button>
            </form>
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-bold text-[var(--brand-paper-muted)]">Popular:</span>
              {["Steady beat", "Shapes", "Feelings", "Phonics"].map((t) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="rounded-full border-[1.5px] border-[var(--brand-navy)]/15 bg-background px-3.5 py-1.5 text-[13px] font-semibold text-[var(--brand-paper-foreground)] transition-all hover:-translate-y-px hover:border-[var(--gold-bright)]">{t}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-heading text-[20px] font-extrabold text-[var(--brand-paper-foreground)]">Browse the curriculum</h3>
            <p className="mb-4 text-sm text-[var(--brand-paper-muted)]">Lessons are organised by subject — and subjects change by grade.</p>
            <Link href="/search" className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--brand-paper-foreground)] px-5 py-2 text-sm font-bold text-[var(--brand-paper-foreground)] transition-colors hover:bg-[var(--brand-paper-foreground)] hover:text-[var(--brand-paper)]">
              Open the full search + curriculum <ArrowRight className="size-4" aria-hidden />
            </Link>
            <p className="mt-4 text-[13.5px] text-[var(--brand-paper-muted)]">
              <b className="text-[var(--brand-paper-foreground)]">Tip:</b> the subject buttons are grade-aware — a non-verbal infant doesn't learn formal math, so Daycare keeps only the subjects that fit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <section className={`flex w-full flex-col gap-10 pb-6 ${PAGE_SHELL}`}>
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
