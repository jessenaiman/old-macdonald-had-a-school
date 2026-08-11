import { GradeTwoTemplate } from "../../../components/grades/grade-two/GradeTwoTemplate";
import { GradePageShell } from "../../../components/grades/GradePageShell";
import { getAllLessons } from "../../../lib/content";
import { gradeKeysForLabel, lessonHref, lessonIcon } from "../../../lib/grade-routes";

export default async function GradeTwoPage() {
  const lessons = (await getAllLessons()).filter((lesson) => gradeKeysForLabel(lesson.metadata.grade).includes("grade-two"));
  const items = lessons.slice(0, 4).map((lesson) => ({
    title: lesson.metadata.title,
    kicker: lesson.metadata.subject,
    summary: lesson.metadata.summary,
    href: lessonHref(lesson.metadata),
    icon: lessonIcon(lesson.metadata.subject, lesson.metadata.category),
  }));
  return <GradePageShell active="grade-two"><GradeTwoTemplate summary="Building fluency and proof" items={items} /></GradePageShell>;
}
