import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonDocument } from "../../../components/LessonDocument";
import { SiteShell } from "../../../components/SiteShell";
import { getLesson, getLessonSlugs } from "../../../lib/content";

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLesson(slug);
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
  const lesson = await getLesson(slug);
  if (!lesson) notFound();

  return (
    <SiteShell active="topics">
      <LessonDocument Content={lesson.Content} metadata={lesson.metadata} />
    </SiteShell>
  );
}
