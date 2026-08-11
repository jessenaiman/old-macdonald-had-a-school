import { CurriculumLessonPage } from "../../../components/curriculum/CurriculumLessonPage";
import { getAllCurriculumLessons } from "../../../lib/curriculum-lesson";

export async function generateStaticParams() {
  return getAllCurriculumLessons().map((lesson) => ({ slug: lesson.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CurriculumLessonPage slug={slug} />;
}
