import { GradeOneTemplate } from "../../../components/grades/grade-one/GradeOneTemplate";
import { SiteShell } from "../../../components/SiteShell";
import { getAllLessons } from "../../../lib/content";
import { gradeKeysForLabel, lessonHref, lessonIcon } from "../../../lib/grade-routes";

export default async function GradeOnePage() {
  const lessons = (await getAllLessons()).filter((lesson) => gradeKeysForLabel(lesson.metadata.grade).includes("grade-one"));
  const items = lessons.slice(0, 4).map((lesson) => ({
    title: lesson.metadata.title,
    kicker: lesson.metadata.subject,
    summary: lesson.metadata.summary,
    href: lessonHref(lesson.metadata),
    icon: lessonIcon(lesson.metadata.subject, lesson.metadata.category),
  }));
  return <SiteShell active="grade-one"><GradeOneTemplate summary="Reading and rhythm" items={items} /></SiteShell>;
}
