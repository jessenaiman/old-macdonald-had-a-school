import { SiteShell } from "../components/SiteShell";
import { HomePage } from "../components/home/HomePage";
import { getAllLessons, getPageContent } from "../lib/content";

export default function Home() {
  const page = getPageContent("home");
  const allLessons = getAllLessons();
  const lessons = allLessons.map((lesson) => ({
    slug: lesson.meta.slug,
    title: lesson.meta.title,
    subject: lesson.meta.subject,
    category: lesson.meta.category,
    summary: lesson.meta.summary,
    gradeBand: lesson.meta.gradeBand,
  }));
  return <SiteShell active="home"><HomePage hero={page.meta} lessons={lessons} /></SiteShell>;
}
