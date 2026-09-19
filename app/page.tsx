import Image from "next/image";
import Link from "next/link";

import { ResponsiveBrandEmblem } from "@/components/brand/ResponsiveBrandEmblem";
import { BRAND_IMAGE_ASSETS } from "@/data/brand/image-registry";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search lessons" },
  { href: "/about", label: "About" },
] as const;

const GRADES = [
  { key: "daycare", label: "Daycare", href: "/grade/daycare" },
  { key: "pre-school", label: "Preschool", href: "/grade/pre-school" },
  { key: "kindergarten", label: "Kindergarten", href: "/grade/kindergarten" },
  { key: "grade-one", label: "Grade 1", href: "/grade/grade-one" },
  { key: "grade-two", label: "Grade 2", href: "/grade/grade-two" },
] as const;

const NEW_LESSONS = [
  { title: "Find the Steady Beat", desc: "Feel and clap the heartbeat of songs.", tags: ["K", "1", "2"] },
  { title: "Animal Action March", desc: "Move like the animals in the song.", tags: ["K", "1", "2"] },
  { title: "Old MacDonald Orchestra", desc: "Explore classroom instruments and sounds.", tags: ["K", "1", "2"] },
] as const;

const VIDEOS = [
  {
    id: "HIPiJHj6wKw",
    title: "The Barnyard Song",
    summary: "Sing along with Old MacDonald and the whole barnyard crew.",
    tag: "Just released",
  },
  {
    id: "IpuswcYQiG8",
    title: "Down by the Fishing Hole",
    summary: "Rhythm, rhyme, and a wiggly worm — perfect for movement time.",
    tag: "Latest video",
  },
] as const;

const SUBJECTS = [
  { key: "miss-hayley", label: "Language & literacy", verbs: "Listen, read, name", count: "44 lessons", teacher: "Miss Hayley", query: "language literacy" },
  { key: "mr-sam", label: "Math", verbs: "Solve, count, estimate", count: "44 lessons", teacher: "Mr Sam", query: "math numeracy" },
  { key: "miss-maisy", label: "Nature & science", verbs: "Notice, explore, care", count: "23 lessons", teacher: "Miss Maisy", query: "science nature" },
  { key: "mr-rusty", label: "Music", verbs: "Sing, play, move", count: "50 lessons", teacher: "Mr Rusty", query: "music rhythm" },
  { key: "mr-puddles", label: "The arts", verbs: "Create, express, imagine", count: "50 lessons", teacher: "Mr Puddles", query: "art creative" },
  { key: "mr-maisy", label: "Health & movement", verbs: "Move, stretch, feel good", count: "31 lessons", teacher: "Mr Maisy", query: "physical health" },
] as const;

const HERO_PHOTO = BRAND_IMAGE_ASSETS.scenes["old-macs-open-circle-gathering"];

const sectionHeading = "font-section text-[26px] text-foreground";

function Masthead() {
  return (
    <header className="border-b-2 border-wood-warm bg-brand-navy px-3 py-3 text-brand-navy-foreground sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/" aria-label="Old MacDonald Had a School home" className="inline-flex min-h-11 shrink-0 items-center gap-3">
          <ResponsiveBrandEmblem className="h-9 w-auto" />
          <span className="flex flex-col items-start">
            <strong className="font-brand text-base leading-none">Old MacDonald Had a School</strong>
            <small className="text-xs font-black uppercase tracking-widest text-gold-bright">Teacher lesson resources</small>
          </span>
        </Link>

        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-brand-navy-foreground/85 transition-colors hover:bg-brand-navy-foreground/10 hover:text-brand-navy-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Grades" className="flex flex-wrap items-center gap-2">
          {GRADES.map((grade) => (
            <Link
              key={grade.key}
              href={grade.href}
              data-grade={grade.key}
              className="grade-surface inline-flex min-h-11 items-center rounded-md px-3 text-sm font-bold transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
            >
              {grade.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HeroSheet() {
  return (
    <section className="working-wall-board grid gap-8 rounded-xl p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex min-w-0 flex-col gap-5">
        <h1 className="font-heading text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.05] text-foreground">
          Where familiar songs become new places to learn.
        </h1>

        <article className="brand-patch-card relative rounded-lg p-5" data-brand-card="pinned">
          <span aria-hidden className="brand-asset fastener-push-pin icon-control brand-patch-fastener" />
          <div className="flex items-baseline justify-between gap-3 pb-2">
            <h2 className="font-hand text-xl italic">New this week</h2>
            <span className="font-hand text-base italic">Grades</span>
          </div>
          <ul className="divide-y divide-border">
            {NEW_LESSONS.map((lesson) => (
              <li key={lesson.title} className="flex min-w-0 items-center gap-3 py-3">
                <span aria-hidden className="size-2 shrink-0 rounded-full bg-rose-warm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{lesson.title}</p>
                  <p className="text-xs">{lesson.desc}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {lesson.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-gold-bright bg-gold-bright/15 px-2 py-0.5 text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/lessons"
            className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            See all new lessons
          </Link>
        </article>
      </div>

      <figure className="relative mx-auto w-full max-w-sm rotate-[1.5deg] rounded-lg bg-brand-paper p-3 shadow-lg">
        <span aria-hidden className="brand-asset fastener-masking-tape icon-control absolute -top-3 left-1/2 -translate-x-1/2" />
        <Image
          src={HERO_PHOTO}
          alt="Old MacDonald reading with his animal students"
          width={1536}
          height={1024}
          className="aspect-[4/3] w-full rounded-md object-cover"
          priority
        />
        <figcaption className="pt-2 text-center font-hand text-lg italic text-brand-paper-foreground">
          morning circle — week one
        </figcaption>
      </figure>
    </section>
  );
}

function VideoSheets() {
  return (
    <section className="flex w-full flex-col gap-5 pt-12" id="whats-new">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={sectionHeading}>What&apos;s new</h2>
        <span className="font-hand text-[21px] text-ink-secondary">fresh songs from the barnyard studio</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {VIDEOS.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener"
            aria-label={`${video.title} — watch on YouTube`}
            className="brand-patch-card group relative flex flex-col gap-4 rounded-lg p-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            data-brand-card="pinned"
          >
            <span aria-hidden className="brand-asset fastener-paperclip icon-control brand-patch-fastener" />
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
              <Image
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt={`${video.title} video thumbnail`}
                fill
                sizes="(min-width: 640px) 45vw, 100vw"
                className="object-cover transition-transform duration-150 group-hover:scale-[1.02] motion-reduce:transition-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.08em]">{video.tag}</span>
              <h3 className="font-heading text-[18px] leading-tight">{video.title}</h3>
              <p className="text-sm">{video.summary}</p>
            </div>
          </a>
        ))}
      </div>

      <p className="text-[13px] font-semibold text-ink-secondary">
        Videos live on the YouTube channel — every link opens in a new tab.
      </p>
    </section>
  );
}

function FindALesson() {
  return (
    <section className="flex w-full flex-col gap-5 pt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={sectionHeading}>Find a lesson, in seconds</h2>
        <span className="font-hand text-[21px] text-ink-secondary">search all lessons</span>
      </div>

      <form
        action="/search"
        method="get"
        role="search"
        className="card-paper-ruled flex flex-wrap items-center gap-3 rounded-lg p-5"
      >
        <label className="sr-only" htmlFor="lesson-search">
          Search lessons
        </label>
        <input
          id="lesson-search"
          name="q"
          type="search"
          placeholder="Try “steady beat”, “shapes”, “feelings”…"
          className="min-h-11 min-w-0 flex-1 rounded-md border-2 border-input bg-background px-3 text-base text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Search
        </button>
        <div className="flex w-full flex-wrap items-center gap-2 pt-1">
          <span className="text-[13px] font-bold text-muted-foreground">Popular:</span>
          {["Steady beat", "Shapes", "Feelings", "Phonics"].map((topic) => (
            <Link
              key={topic}
              href={`/search?q=${encodeURIComponent(topic)}`}
              className="inline-flex min-h-11 items-center rounded-md border border-border px-3 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {topic}
            </Link>
          ))}
        </div>
      </form>
    </section>
  );
}

function SubjectSheets() {
  return (
    <section className="flex w-full flex-col gap-5 pt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={sectionHeading}>Find a lesson by subject</h2>
        <span className="font-hand text-[21px] text-ink-secondary">every subject has a teacher</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map((subject) => (
          <Link
            key={subject.key}
            href={`/search?q=${encodeURIComponent(subject.query)}`}
            className="brand-patch-card group relative flex flex-col gap-3 rounded-lg p-5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            data-brand-card="pinned"
          >
            <span aria-hidden className="brand-asset fastener-gingham-tape icon-control brand-patch-fastener" />
            <div className="flex items-center gap-3">
              <span className={`characters-surface characters-${subject.key} flex size-12 shrink-0 items-center justify-center rounded-full`}>
                <Image
                  src={BRAND_IMAGE_ASSETS.facePatches[subject.key]}
                  alt=""
                  width={96}
                  height={96}
                  className="size-10 rounded-full object-contain"
                />
              </span>
              <h3 className="font-heading text-[17px] leading-tight">{subject.label}</h3>
            </div>
            <p className="text-xs">{subject.verbs}</p>
            <div className="mt-auto flex items-baseline justify-between gap-2">
              <span className="text-xs font-semibold">{subject.teacher}</span>
              <span className="text-[11px] font-semibold">{subject.count}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Colophon() {
  return (
    <footer className="mt-16 border-t-2 border-wood-warm bg-brand-navy px-3 py-10 text-brand-navy-foreground sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/" className="inline-flex min-h-11 items-center" aria-label="Old MacDonald Had a School home">
            <ResponsiveBrandEmblem className="h-8 w-auto" />
          </Link>
          <p className="font-hand text-lg">Songs teachers know. Lessons children love.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <Link href="/topics" className="inline-flex min-h-11 items-center hover:underline">Plan by topic</Link>
          <Link href="/lessons" className="inline-flex min-h-11 items-center hover:underline">Teacher toolbox</Link>
          <Link href="/songs" className="inline-flex min-h-11 items-center hover:underline">Songbook</Link>
          <Link href="/about" className="inline-flex min-h-11 items-center hover:underline">About</Link>
          <Link href="/about#privacy-policy" className="inline-flex min-h-11 items-center hover:underline">Privacy</Link>
          <Link href="/about#terms-of-use" className="inline-flex min-h-11 items-center hover:underline">Terms</Link>
          <Link href="/about#contact" className="inline-flex min-h-11 items-center hover:underline">Contact</Link>
          <a
            href="https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center hover:underline"
          >
            YouTube
          </a>
          <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:underline">
            Ko-fi
          </a>
        </nav>
        <p className="text-xs text-brand-navy-foreground/60">
          &copy; {new Date().getFullYear()} Old MacDonald Had a School. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-paper-ivory">
      <Masthead />
      <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-10 px-3 py-8 sm:px-6">
        <HeroSheet />
        <VideoSheets />
        <FindALesson />
        <SubjectSheets />
      </div>
      <Colophon />
    </div>
  );
}
