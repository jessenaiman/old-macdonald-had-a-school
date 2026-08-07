import { notFound, redirect } from "next/navigation";
import { getLesson, getLessonSlugs } from "../../../lib/content";
import { lessonHref } from "../../../lib/grade-routes";

export function generateStaticParams() {
  return getLessonSlugs().map((slug) => ({ slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) notFound();
  redirect(lessonHref(lesson.metadata));
}
