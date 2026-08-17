import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeCarousel, type HomeCarouselSlide } from "@/components/home/HomeCarousel";
import { CreativeArtsSection } from "@/components/home/CreativeArtsSection";
import { HomeGradeNav } from "@/components/home/HomeGradeNav";
import { HomeSubjectNote } from "@/components/home/HomeSubjectNote";
import { HOME_SUBJECTS, SUBJECT_LEARNERS } from "@/components/home/home-data";

const CAROUSEL_SLIDES = [
  { assetClass: "home-scene-class-gathering", alt: "Old MacDonald and the class gathered for outdoor music", label: "Explore curriculum topics", href: "/topics" },
  { assetClass: "home-scene-growing-together", alt: "Friends observing and caring for a young plant", label: "Choose a ready-to-teach lesson", href: "/lessons" },
  { assetClass: "home-scene-music-landscape", alt: "Old MacDonald and friends discovering music in an imaginative stitched landscape", label: "Find music teaching resources", href: "/search?q=music" },
  { assetClass: "home-scene-schoolhouse", alt: "The welcoming red barn schoolhouse", label: "Plan for a grade", href: "/grade/pre-school" },
] as const satisfies readonly HomeCarouselSlide[];

const NEW_THIS_WEEK = [
  { title: "Find the Steady Beat", summary: "Feel and clap the heartbeat of songs.", href: "https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/search?query=steady%20beat", icon: "music-hand-drum" },
  { title: "Animal Action March", summary: "Move like the animals in the song.", href: "https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/search?query=animal%20action%20march", icon: "dance-turning-footprints" },
  { title: "Old MacDonald Orchestra", summary: "Explore classroom instruments.", href: "https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ/search?query=Old%20MacDonald%20Orchestra", icon: "music-fiddle" },
] as const;

export default function Home() {
  return (
    <div className="-mx-3 -my-5 min-h-full px-3 py-6 text-foreground sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="working-wall-stage mx-auto grid w-full max-w-7xl gap-12 p-4 sm:p-7 lg:p-10">
        <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,.65fr)] lg:items-start" aria-labelledby="home-title">
          <div className="grid gap-5">
            <div className="grid gap-3">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-primary">Old MacDonald Had a School</p>
              <h1 className="max-w-3xl font-heading text-5xl leading-[.9] tracking-tight sm:text-6xl" id="home-title">Start where children already feel at home.</h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Familiar songs, practical lessons, and playful learning for every grade.</p>
            </div>
            <HomeCarousel slides={CAROUSEL_SLIDES} title="Choose a place to begin" description="Four paths into today’s planning" ariaLabel="Featured teaching resources" pickerLabel="Choose a featured scene" />
            <div className="flex flex-wrap gap-3"><Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90"><Link href="/topics">Browse lesson topics <ArrowRight /></Link></Button><Button asChild variant="outline" className="bg-background"><Link href="/search">Search lessons</Link></Button></div>
          </div>

          <Card className="gap-0 rounded-2xl border-border bg-background py-0 shadow-sm">
            <CardHeader className="flex-row items-center justify-between gap-4 border-b border-border px-5 py-5"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-primary">Fresh on the table</p><CardTitle className="mt-1 font-heading text-3xl">New this week</CardTitle></div><Link className="text-sm font-bold text-primary underline-offset-4 hover:underline" href="/lessons">See all</Link></CardHeader>
            <CardContent className="p-0"><ul className="divide-y divide-border">{NEW_THIS_WEEK.map((lesson) => <li key={lesson.title}><Link className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/60" href={lesson.href} target="_blank" rel="noreferrer"><span className={`brand-asset ${lesson.icon} icon-small`} aria-hidden="true" /><span className="grid gap-1"><strong className="text-sm leading-tight">{lesson.title}</strong><span className="text-sm leading-snug text-muted-foreground">{lesson.summary}</span></span><ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" /></Link></li>)}</ul></CardContent>
          </Card>
        </section>

        <HomeGradeNav />

        <section className="working-wall-board grid gap-6 p-4 sm:p-6" id="browse-by-subject" aria-labelledby="subjects-title">
          <header className="grid max-w-2xl gap-2"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-primary">Find a teaching thread</p><h2 className="font-heading text-4xl leading-none sm:text-5xl" id="subjects-title">Browse by subject</h2><p className="text-base leading-7 text-muted-foreground">Follow an idea from a child’s first question to a classroom activity.</p></header>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{HOME_SUBJECTS.map((subject) => <HomeSubjectNote fastenerClass={subject.fastenerClass} guideCharacter={SUBJECT_LEARNERS[subject.key].character} highlights={subject.highlights} href={`/search?q=${encodeURIComponent(subject.searchQuery)}`} iconClass={subject.iconClass} key={subject.key} subject={subject.key} teacherReason={subject.teacherReason} title={subject.title} />)}</div>
        </section>

        <CreativeArtsSection />
      </div>
    </div>
  );
}
