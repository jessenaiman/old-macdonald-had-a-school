import { GradeLessonPage } from "../../../../components/grades/GradeLessonPage";
import styles from "../../../../components/grades/pre-school/PreschoolTemplate.module.css";
import { getLessonSlugsForGrade } from "../../../../lib/content";

export async function generateStaticParams() {
  return (await getLessonSlugsForGrade("pre-school")).map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GradeLessonPage slug={slug} grade="pre-school" active="pre-school" className={styles.template} />;
}
