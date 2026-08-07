import { notFound } from "next/navigation";
import { LessonDocument } from "../../../components/LessonDocument";
import { SiteShell } from "../../../components/SiteShell";
import { getLesson, getLessonSlugs } from "../../../lib/content";

export function generateStaticParams() {
  return getLessonSlugs().map((slug) => ({ slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) notFound();
  return <SiteShell active="topics"><LessonDocument Content={lesson.Content} metadata={lesson.metadata} /></SiteShell>;
}
