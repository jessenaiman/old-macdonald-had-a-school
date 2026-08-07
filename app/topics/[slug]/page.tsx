import { notFound } from "next/navigation";
import { LessonTemplate, TopicTemplate } from "../../../components/builder/CurriculumTemplates";
import { SiteShell } from "../../../components/SiteShell";
import { getAllLessons, getLesson, isSingleLesson } from "../../../lib/mdx-content";

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ slug: lesson.meta.slug }));
}

export default async function TopicPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ band?: string }> }) {
  const { slug } = await params;
  const { band } = await searchParams;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  if (isSingleLesson(lesson)) {
    return <SiteShell active="topics"><LessonTemplate lesson={lesson} band={band} /></SiteShell>;
  }
  return <SiteShell active="topics"><TopicTemplate lesson={lesson} band={band} /></SiteShell>;
}
