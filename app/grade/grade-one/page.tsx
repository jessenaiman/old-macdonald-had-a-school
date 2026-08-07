import { GradeOneTemplate } from "../../../components/grades/grade-one/GradeOneTemplate";
import { SiteShell } from "../../../components/SiteShell";
import { getAllLessons } from "../../../lib/content";
import { lessonHref, lessonIcon } from "../../../lib/grade-routes";
import { GRADE_META, matchesGrade } from "../../../lib/grades";

export default async function GradeOnePage() {
  const meta = GRADE_META["grade-one"];
  const lessons = (await getAllLessons()).filter((lesson) => matchesGrade(lesson.metadata.grade, "grade-one"));
  const items = lessons.slice(0, 4).map((lesson) => ({
    title: lesson.metadata.title,
    kicker: lesson.metadata.subject,
    summary: lesson.metadata.summary,
    href: lessonHref(lesson.metadata),
    icon: lessonIcon(lesson.metadata.subject, lesson.metadata.category),
  }));
  return <SiteShell active="grade-one"><GradeOneTemplate summary={meta.tagline} items={items} /></SiteShell>;
}
