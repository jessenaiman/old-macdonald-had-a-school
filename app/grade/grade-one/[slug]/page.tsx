import { GradeLessonPage } from "../../../../components/grades/GradeLessonPage";
import styles from "../../../../components/grades/grade-one/GradeOneTemplate.module.css";
import { getLessonSlugsForGrade } from "../../../../lib/content";

export async function generateStaticParams() {
  return (await getLessonSlugsForGrade("grade-one")).map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GradeLessonPage slug={slug} grade="grade-one" active="grade-one" className={styles.template} />;
}
