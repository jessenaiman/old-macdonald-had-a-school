import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreativeArtsSection } from "./CreativeArtsSection";
import { HomeCarousel } from "./HomeCarousel";
import { HomeSubjectNote } from "./HomeSubjectNote";
import { HOME_SUBJECTS, HOME_VIDEO_SONGS, SUBJECT_LEARNERS, type HomeLesson } from "./home-data";
import { WeeklyLessonList } from "./WeeklyLessonList";

type HomePageProps = { hero: { title?: string }; lessons: HomeLesson[] };

export function pickLessons(lessons: HomeLesson[], slugs: readonly string[]) {
  return slugs.map((slug) => lessons.find((lesson) => lesson.slug === slug)).filter((lesson): lesson is HomeLesson => Boolean(lesson));
}

function HeroTitle({ title }: { title?: string }) {
  const resolvedTitle = title ?? "Where familiar songs become new places to learn.";
  if (resolvedTitle === "Where familiar songs become new places to learn.") {
    return <h1 className="text-balance font-heading text-3xl leading-none sm:text-4xl" id="home-title">Where familiar songs become <em className="not-italic text-destructive">new places</em> to learn.</h1>;
  }
  return <h1 className="text-balance font-heading text-3xl leading-none sm:text-4xl" id="home-title">{resolvedTitle}</h1>;
}

export function HomeHero({ title }: { title?: string }) {
  return (
    <section className="material-surface material-leather-blue relative mx-4 rounded-xl border border-border p-4 shadow-lg sm:p-6" aria-labelledby="home-title">
      <div className="grid min-w-0 items-center gap-4 md:grid-cols-2 md:gap-6">
        <Card className="material-surface material-cardboard-paper min-w-0 gap-0 overflow-hidden py-0 shadow-sm">
          <CardHeader className="border-b border-border py-4">
            <CardTitle><HeroTitle title={title} /></CardTitle>
            <CardDescription>Choose a classroom starting point, then move straight into teaching.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 py-3">
            <Button asChild size="sm"><Link href="#browse-by-subject">Browse subjects</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/lessons">All lessons</Link></Button>
          </CardContent>
          <WeeklyLessonList lessons={HOME_VIDEO_SONGS} title="New this week" limit={3} />
        </Card>
        <HomeCarousel />
      </div>
    </section>
  );
}

export function HomePage({ hero }: HomePageProps) {
  return (
    <div className="grid min-w-0 gap-5 py-5">
      <HomeHero title={hero.title} />
      <section className="mx-4 rounded-xl border-2 bg-background p-4 shadow-sm sm:p-6" id="browse-by-subject" aria-labelledby="subjects-title">
        <header className="mb-5 flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold text-muted-foreground">Direct curriculum links</p><h2 className="font-heading text-3xl" id="subjects-title">Find a lesson by subject</h2></div>
          <p className="text-sm text-muted-foreground">Choose a subject, then go straight to a classroom focus.</p>
        </header>
        <div className="grid auto-rows-fr items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {HOME_SUBJECTS.map((subject) => (
            <HomeSubjectNote key={subject.key} subject={subject.key} title={subject.title} href={`/search?q=${encodeURIComponent(subject.searchQuery)}`} iconClass={subject.iconClass} teacherReason={subject.teacherReason} highlights={subject.highlights} fastenerClass={subject.fastenerClass} guideCharacter={SUBJECT_LEARNERS[subject.key].character} />
          ))}
        </div>
      </section>
      <CreativeArtsSection />
    </div>
  );
}

export { type HomePageProps };
