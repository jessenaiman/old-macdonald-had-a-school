import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Search } from "lucide-react";

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

function HeroBanner() {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_auto_0.95fr]">
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.05] text-brand-navy">
          Where familiar songs become{" "}
          <em className="not-italic text-[var(--rose-warm)]">new places</em> to learn.
        </h1>
        {/* New this week list */}
        <div className="rounded-2xl border border-[var(--brand-navy)]/10 bg-[var(--brand-paper)] p-5 shadow-sm">
          <div className="flex items-baseline justify-between px-1 pb-2">
            <span className="font-hand text-xl italic text-[var(--rose-warm)]">New this week</span>
            <span className="font-hand text-base italic text-[var(--brand-paper-foreground)]">Best for</span>
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
                    <span key={tag} className="rounded-md border border-[var(--gold-bright)] px-2 py-0.5 text-xs font-bold text-[var(--brand-paper-foreground)]">
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
          <span className="size-2 rounded-full bg-[var(--gold-bright)]" />
          <div className="rounded-md border-2 border-dashed border-[var(--gold-bright)]/70 bg-brand-navy px-1.5 py-10 shadow-lg">
            <span className="font-hand block whitespace-nowrap text-2xl leading-none text-brand-navy-foreground [writing-mode:vertical-rl]">
              {RIBBON_WORDS.join("  •  ")}
            </span>
          </div>
          <span className="size-2 rounded-full bg-[var(--gold-bright)]" />
        </div>
      </div>

      {/* Pinned illustration (Polaroid) */}
      <div className="relative mx-auto w-full max-w-sm">
        <span className="absolute left-3 top-3 z-10 size-4 rounded-full bg-[var(--gold-bright)] shadow" aria-hidden />
        <span className="absolute right-3 top-3 z-10 size-4 rounded-full bg-[var(--gold-bright)] shadow" aria-hidden />
        <div className="rotate-[2.5deg] rounded-xl border-[10px] border-white bg-white p-2 pb-3 shadow-xl">
          <Image
            src={HERO_PHOTO}
            alt="Old MacDonald reading with his animal students"
            width={1536}
            height={1024}
            className="aspect-[4/3] w-full rounded-md object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

/* --- Pick your classroom (staff cards, shared artifact) --- */

const TEACHER_GRADES = [
  { key: "daycare", label: "Daycare", teacher: "Miss Puddles", face: "/characters/face-patch-transparent/miss-puddles-purple.webp" },
  { key: "pre-school", label: "Pre-School", teacher: "Miss Maisy", face: "/characters/face-patch-transparent/miss-maisy-purple.webp" },
  { key: "kindergarten", label: "Kindergarten", teacher: "Mr Rusty", face: "/characters/face-patch-transparent/mr-rusty-blue.webp" },
  { key: "grade-one", label: "Grade 1", teacher: "Miss Hayley", face: "/characters/face-patch-transparent/miss-hayley-purple.webp" },
  { key: "grade-two", label: "Grade 2", teacher: "Mr Maisy", face: "/characters/face-patch-transparent/mr-maisy-orange.webp" },
] as const;

function ClassroomPicker() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <div
        className="mt-10 rounded-3xl border-2 border-dashed border-brand-navy-foreground/35 bg-brand-navy p-6 shadow-[0_10px_30px_rgba(30,42,46,0.14)]"
      >
        <div className="pointer-events-none relative mx-auto -mt-2 mb-2 flex h-2 w-2 items-center justify-center">
          <span className="block size-3.5 rounded-full bg-[var(--grade-two-color)] shadow ring-4 ring-brand-navy/0" />
        </div>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 text-brand-navy-foreground">
          <h2 className="font-heading text-[22px] font-bold">Pick your classroom</h2>
          <p className="text-sm text-brand-navy-foreground/75">
            Each grade has its own teacher, felt colors, and lesson set.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {TEACHER_GRADES.map((g, i) => (
            <Link
              key={g.key}
              href={`/grade/${g.key}`}
              data-grade={g.key}
              className={`group relative flex flex-col overflow-hidden rounded-[18px] bg-[var(--brand-paper)] shadow-[0_4px_0_rgba(0,0,0,0.28)] transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(0,0,0,0.28)] ${
                i % 2 === 0 ? "rotate-[-1.2deg]" : "rotate-[1.2deg]"
              } hover:rotate-0`}
            >
              <span className="absolute left-1/2 top-2 z-10 size-3.5 -translate-x-1/2 rounded-full bg-[var(--grade-two-color)] shadow" aria-hidden />
              <div className="grade-surface relative flex h-24 items-end justify-center">
                <Image
                  src={g.face}
                  alt={g.teacher}
                  width={84}
                  height={84}
                  className="h-[84px] w-[84px] translate-y-[34px] rounded-full border-[3px] border-[var(--brand-paper)] object-cover shadow"
                />
              </div>
              <div className="flex flex-1 flex-col items-center gap-1 px-3 pb-3.5 pt-11 text-center">
                <h3 className="font-heading text-[17px] font-bold text-[var(--brand-paper-foreground)]">{g.label}</h3>
                <span className="text-xs font-semibold text-[var(--brand-paper-muted)]">{g.teacher}</span>
                <span className="mt-1.5 rounded-full bg-[var(--brand-paper-foreground)] px-4 py-1.5 text-xs font-bold text-[var(--brand-paper)] transition-colors group-hover:bg-[var(--gold-bright)]">
                  Open grade →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- What's New (songs, shared artifact) --- */

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
    <section className="mx-auto w-full max-w-7xl pt-12" id="whats-new">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-[26px] font-extrabold text-foreground">What's New</h2>
        <span className="font-hand text-[21px] text-[var(--gold-muted)]">fresh songs from the barnyard studio</span>
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
        <span className="text-[13.5px] text-muted-foreground">Videos play right here — no leaving the site.</span>
      </div>
    </section>
  );
}

/* --- Search + curriculum planner (shared artifact) --- */

function CurriculumPlanner() {
  return (
    <section className="mx-auto w-full max-w-7xl pt-12 pb-4">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-[26px] font-extrabold text-foreground">Find a lesson, in seconds</h2>
        <span className="font-hand text-[21px] text-[var(--gold-muted)]">search all lessons · or browse by subject</span>
      </div>
      <div className="rounded-3xl border border-[var(--brand-navy)]/10 bg-[var(--brand-paper)] p-6 sm:p-7 shadow-sm">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-[20px] font-extrabold text-[var(--brand-paper-foreground)]">Search lessons</h3>
            <p className="mb-4 text-sm text-[var(--brand-paper-muted)]">Type a topic, song, or skill. The full search page also shows the curriculum.</p>
            <form className="flex items-center gap-2.5 rounded-2xl border-2 border-[var(--brand-navy)]/15 bg-background py-1.5 pl-4 pr-1.5 transition-[border-color,box-shadow] focus-within:border-[var(--gold-bright)] focus-within:shadow-[0_0_0_4px_rgba(212,168,42,0.18)]" action="/search" method="get" role="search">
              <Search className="size-[18px] text-muted-foreground" aria-hidden />
              <input
                name="q"
                className="w-full flex-1 border-0 bg-transparent text-[16px] text-foreground outline-none"
                type="search"
                placeholder="Try “steady beat”, “shapes”, “feelings”…"
                aria-label="Search lessons"
              />
              <button className="rounded-xl bg-brand-navy px-5 py-2 text-sm font-bold text-brand-navy-foreground transition-colors hover:bg-[var(--gold-bright)] hover:text-brand-navy" type="submit">Search</button>
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
    <section className="flex w-full flex-col gap-10 pb-6">
      <HeroBanner />
      <ClassroomPicker />
      <WhatsNew />
      <CurriculumPlanner />
    </section>
  );
}