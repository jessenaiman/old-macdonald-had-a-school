import Link from "next/link";
import type { ElementType } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreativeArtsSection } from "./CreativeArtsSection";
import { HomeCarousel } from "./HomeCarousel";
import { HomeGradeNav } from "./HomeGradeNav";
import { HomeSubjectNote } from "./HomeSubjectNote";
import { HOME_SUBJECTS, HOME_VIDEO_SONGS, SUBJECT_LEARNERS } from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";

type HomePageProps = { hero: { title?: string } };

function HeroTitle({ title, as: Heading = "h1", id = "home-title" }: { title?: string; as?: ElementType; id?: string }) {
  const resolvedTitle = title ?? "Where familiar songs become new places to learn.";
  if (resolvedTitle === "Where familiar songs become new places to learn.") {
    return <Heading className="text-balance font-heading text-3xl leading-none sm:text-4xl" id={id}>Where familiar songs become <em className="not-italic text-destructive">new places</em> to learn.</Heading>;
  }
  return <Heading className="text-balance font-heading text-3xl leading-none sm:text-4xl" id={id}>{resolvedTitle}</Heading>;
}

export function HomeHero({ title, headingLevel = "h1" }: { title?: string; headingLevel?: "h1" | "h2" }) {
  const headingId = headingLevel === "h1" ? "home-title" : "home-example-title";
  return (
    <section className="relative mx-4 rounded-xl border border-dashed border-accent/60 p-4 sm:p-6" aria-labelledby={headingId}>
      <div className="grid min-w-0 items-center gap-4 md:grid-cols-2 md:gap-6">
        <div className="min-w-0 px-2 py-4 text-primary-foreground sm:px-4 sm:py-6">
          <div className="max-w-xl"><HeroTitle title={title} as={headingLevel} id={headingId} /></div>
          <p className="mt-3 max-w-md text-sm leading-6 text-primary-foreground/85">Familiar songs, practical lessons, and playful learning for every grade.</p>
          <Card className="material-surface material-cardboard-paper mt-5 gap-0 overflow-hidden py-0 text-card-foreground shadow-md">
            <WeeklyLessonList lessons={HOME_VIDEO_SONGS} title="New this week" limit={3} />
          </Card>
        </div>
        <div className="min-w-0">
          <HomeCarousel />
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button asChild size="sm"><Link href="#browse-by-subject">Browse subjects</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/search">Search lessons</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage({ hero }: HomePageProps) {
  return (
    <div className="material-surface material-leather-indigo grid min-w-0 gap-7 pb-7 pt-5">
      <HomeHero title={hero.title} />
      <section className="material-surface material-cork mx-4 rounded-2xl border-4 border-[color-mix(in_srgb,var(--theme-wood)_72%,var(--foreground))] p-4 shadow-lg sm:p-6" id="browse-by-subject" aria-labelledby="subjects-title">
        <header className="material-surface material-cardboard-paper relative mx-auto mb-6 w-fit max-w-full rotate-[-0.4deg] rounded-md border px-6 py-3 text-center shadow-sm motion-reduce:rotate-0">
          <span className="brand-asset fastener-masking-tape icon-small absolute -top-4 left-1/2 -translate-x-1/2" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Direct curriculum links</p>
          <h2 className="font-heading text-3xl" id="subjects-title">Find a lesson by subject</h2>
        </header>
        <div className="grid auto-rows-fr items-stretch gap-3 md:grid-cols-2 xl:grid-cols-6">
          {HOME_SUBJECTS.map((subject) => (
            <HomeSubjectNote key={subject.key} subject={subject.key} title={subject.title} href={`/search?q=${encodeURIComponent(subject.searchQuery)}`} iconClass={subject.iconClass} teacherReason={subject.teacherReason} highlights={subject.highlights} fastenerClass={subject.fastenerClass} guideCharacter={SUBJECT_LEARNERS[subject.key].character} />
          ))}
        </div>
      </section>
      <CreativeArtsSection />
      <div className="mx-4"><HomeGradeNav /></div>
    </div>
  );
}

export { type HomePageProps };
