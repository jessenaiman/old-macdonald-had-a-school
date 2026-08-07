import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonTemplate, TopicTemplate } from "../../../components/builder/CurriculumTemplates";
import { SiteShell } from "../../../components/SiteShell";
import { getAllLessons, getLesson, isSingleLesson } from "../../../lib/content";

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ slug: lesson.meta.slug }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson not found | Old MacDonald Had a School" };

  return {
    title: `${lesson.meta.title} | Old MacDonald Had a School`,
    description: lesson.meta.summary,
    openGraph: {
      title: lesson.meta.title,
      description: lesson.meta.summary,
      type: "article",
    },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  return (
    <SiteShell active="topics">
      {isSingleLesson(lesson) ? <LessonTemplate lesson={lesson} /> : <TopicTemplate lesson={lesson} />}
    </SiteShell>
  );
}
