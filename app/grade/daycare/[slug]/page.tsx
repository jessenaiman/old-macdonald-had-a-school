import { GradeLessonPage } from "../../../../components/grades/GradeLessonPage";

import { getLessonSlugsForGrade } from "../../../../lib/content";

export async function generateStaticParams() {
  return (await getLessonSlugsForGrade("daycare")).map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GradeLessonPage slug={slug} grade="daycare" active="daycare" className="grade-daycare-template" />;
}
