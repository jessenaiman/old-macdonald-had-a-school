import { HomeCarousel } from "./HomeCarousel";
import { FolkArtsSection } from "./FolkArtsSection";
import { HomeSubjectNote } from "./HomeSubjectNote";
import { HOME_SUBJECTS, HOME_VIDEO_SONGS, SUBJECT_LEARNERS, type HomeLesson } from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";
import { Card } from "@/components/ui/card";

type HomePageProps = {
  hero: { title?: string };
  lessons: HomeLesson[];
};

export function pickLessons(lessons: HomeLesson[], slugs: readonly string[]) {
  return slugs
    .map((slug) => lessons.find((lesson) => lesson.slug === slug))
    .filter((lesson): lesson is HomeLesson => Boolean(lesson));
}

function HeroTitle({ title }: { title?: string }) {
  const resolvedTitle = title ?? "Where familiar songs become new places to learn.";

  if (resolvedTitle === "Where familiar songs become new places to learn.") {
    return <h1 className="mx-auto max-w-4xl text-balance font-heading text-4xl leading-none text-foreground sm:text-5xl lg:text-6xl" id="home-title">Where familiar songs become <em className="not-italic text-destructive">new places</em> to learn.</h1>;
  }

  if (resolvedTitle === "The whole school, in character.") {
    return <h1 className="mx-auto max-w-4xl text-balance font-heading text-4xl leading-none text-foreground sm:text-5xl lg:text-6xl" id="home-title">The whole school, <em className="not-italic text-destructive">in character.</em></h1>;
  }

  return <h1 className="mx-auto max-w-4xl text-balance font-heading text-4xl leading-none text-foreground sm:text-5xl lg:text-6xl" id="home-title">{resolvedTitle}</h1>;
}

export function HomeHero({ title }: { title?: string }) {
  return (
    <div className="material-surface material-leather-blue py-4 sm:py-6">
      <section className="relative mx-auto w-full max-w-screen-2xl rounded-2xl border border-border p-5 shadow-lg after:pointer-events-none after:absolute after:inset-3 after:rounded-xl after:border after:border-dashed after:border-accent/60 sm:p-8" aria-labelledby="home-title">
        <Card className="material-surface material-cardboard-paper relative z-10 mx-auto mb-5 w-fit max-w-4xl rotate-[-0.12deg] px-6 py-4 text-center shadow-md sm:px-10">
          <span className="brand-asset fastener-masking-tape icon-medium absolute -top-7 left-1/2 -translate-x-1/2 -rotate-2" aria-hidden="true" />
          <HeroTitle title={title} />
        </Card>
        <div className="relative z-10 grid grid-cols-1 items-center gap-5 lg:grid-cols-2 lg:gap-10">
          <Card className="material-surface material-cardboard-paper relative rotate-[-0.18deg] overflow-visible p-0 shadow-md">
            <span className="brand-asset fastener-paperclip icon-medium absolute -left-2 -top-6 z-20 rotate-6 drop-shadow-md" aria-hidden="true" />
            <WeeklyLessonList lessons={HOME_VIDEO_SONGS.slice(0, 3)} title="New this week" limit={3} participation selected />
          </Card>
          <HomeCarousel selected />
        </div>
      </section>
    </div>
  );
}

export function HomePage({ hero }: HomePageProps) {
  return (
    <div className="grid min-w-0 gap-4 pb-6">
      <div className="-mt-3"><HomeHero title={hero.title} /></div>

      <section className="material-surface material-cork relative mx-4 rounded-2xl border-8 border-[var(--theme-wood)] px-4 pb-6 pt-16 shadow-lg sm:px-8" id="browse-by-subject" aria-labelledby="subjects-title">
        <header className="absolute left-1/2 top-4 -translate-x-1/2">
          <span className="brand-asset fastener-masking-tape absolute -top-5 left-1/2 z-10 -translate-x-1/2" aria-hidden="true" />
          <h2 className="material-surface material-cardboard-paper w-max max-w-[calc(100vw-4rem)] px-5 py-2 text-center font-hand text-2xl" id="subjects-title">Find a lesson by subject.</h2>
        </header>
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                noteShape={subject.noteShape}
                rotation={subject.rotation}
                guideCharacter={SUBJECT_LEARNERS[subject.key]?.character}
              />
          ))}
        </div>
      </section>

      <FolkArtsSection />

    </div>
  );
}

export { type HomePageProps };
