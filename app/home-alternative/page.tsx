import { SiteShell } from "../../components/SiteShell";
import { HomePageAlternative } from "../../components/home/HomePageAlternative";
import { getAllLessons } from "../../lib/content";

export const metadata = { title: "Homepage alternative | Old MacDonald Had a School" };

export default async function HomeAlternativePage() {
  const lessons = (await getAllLessons()).map((lesson) => ({ slug: lesson.metadata.slug, title: lesson.metadata.title, subject: lesson.metadata.subject, category: lesson.metadata.category, summary: lesson.metadata.summary, grade: lesson.metadata.grade }));
  return <SiteShell active="home"><HomePageAlternative hero={{}} lessons={lessons} /></SiteShell>;
}
