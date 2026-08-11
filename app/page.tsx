import { HomePage } from "../components/home/HomePage";
import { getAllLessons } from "../lib/content";
import { metadata as homeMetadata } from "../content/pages/home.mdx";

export default async function Home() {
  const allLessons = await getAllLessons();
  const lessons = allLessons.map((lesson) => ({
    slug: lesson.metadata.slug,
    title: lesson.metadata.title,
    subject: lesson.metadata.subject,
    category: lesson.metadata.category,
    summary: lesson.metadata.summary,
    grade: lesson.metadata.grade,
  }));
  return <HomePage hero={homeMetadata} lessons={lessons} />;
}
