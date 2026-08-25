import { GradeTwoTemplate } from "../../../components/grades/grade-two/GradeTwoTemplate";
import type { Metadata } from "next";

import { getAllLessons } from "../../../lib/content";
import { gradeKeysForLabel, lessonHref, lessonIcon } from "../../../lib/grade-routes";

export const metadata: Metadata = {
  title: "Grade 2 Lesson Plans | Old MacDonald Had a School",
  description:
    "Teacher-ready Grade 2 lesson plans focused on building fluency and proof, with clear teaching sequences and print-and-go resources.",
};

export default async function GradeTwoPage() {
  const lessons = (await getAllLessons()).filter((lesson) => gradeKeysForLabel(lesson.metadata.grade).includes("grade-two"));
  const items = lessons.slice(0, 4).map((lesson) => ({
    title: lesson.metadata.title,
    kicker: lesson.metadata.subject,
    summary: lesson.metadata.summary,
    href: lessonHref(lesson.metadata),
    icon: lessonIcon(lesson.metadata.subject, lesson.metadata.category),
  }));
  return <GradeTwoTemplate summary="Building fluency and proof" items={items} />;
}
