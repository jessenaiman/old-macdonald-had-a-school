import { GradeTwoTemplate } from "../../../components/grades/grade-two/GradeTwoTemplate";
import { SiteShell } from "../../../components/SiteShell";
import { getAllLessons } from "../../../lib/content";
import { lessonHref, lessonIcon } from "../../../lib/grade-routes";
import { GRADE_META, matchesGrade } from "../../../lib/grades";

export default async function GradeTwoPage() {
  const meta = GRADE_META["grade-two"];
  const lessons = (await getAllLessons()).filter((lesson) => matchesGrade(lesson.metadata.grade, "grade-two"));
  const items = lessons.slice(0, 4).map((lesson) => ({
    title: lesson.metadata.title,
    kicker: lesson.metadata.subject,
    summary: lesson.metadata.summary,
    href: lessonHref(lesson.metadata),
    icon: lessonIcon(lesson.metadata.subject, lesson.metadata.category),
  }));
  return <SiteShell active="grade-two"><GradeTwoTemplate summary={meta.tagline} items={items} /></SiteShell>;
}
