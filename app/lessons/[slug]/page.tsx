import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MusicLesson } from "../../../components/lessons/MusicLesson";
import { VideoLesson } from "../../../components/lessons/VideoLesson";
import { LessonTemplate, TopicTemplate } from "../../../components/builder/CurriculumTemplates";
import { SiteShell } from "../../../components/SiteShell";
import { getAllLessons, getLesson } from "../../../lib/content/lessons";
import {
  getLesson as getCanonicalLesson,
  isSingleLesson,
} from "../../../lib/mdx-content";

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ slug: lesson.metadata.slug }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson not found | Old MacDonald Had a School" };

  return {
    title: `${lesson.metadata.title} | Old MacDonald Had a School`,
    description: lesson.metadata.summary,
    openGraph: {
      title: lesson.metadata.title,
      description: lesson.metadata.summary,
      type: "article",
    },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  if (lesson.metadata.template === "video") {
    const canonicalLesson = getCanonicalLesson(slug);
    if (canonicalLesson) {
      return (
        <SiteShell active="topics">
          {isSingleLesson(canonicalLesson) ? <LessonTemplate lesson={canonicalLesson} /> : <TopicTemplate lesson={canonicalLesson} />}
        </SiteShell>
      );
    }
  }

  return (
    <SiteShell active="topics">
      {lesson.metadata.template === "music" ? <MusicLesson lesson={lesson} /> : <VideoLesson lesson={lesson} />}
    </SiteShell>
  );
}
