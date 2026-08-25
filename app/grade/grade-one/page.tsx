import { GradeOneTemplate } from "../../../components/grades/grade-one/GradeOneTemplate";
import type { Metadata } from "next";

import { getAllLessons } from "../../../lib/content";
import { gradeKeysForLabel, lessonHref, lessonIcon } from "../../../lib/grade-routes";

export const metadata: Metadata = {
  title: "Grade 1 Lesson Plans | Old MacDonald Had a School",
  description:
    "Teacher-ready Grade 1 lesson plans that build reading and rhythm on familiar songs, with clear teaching sequences and print-and-go resources.",
};

export default async function GradeOnePage() {
  const lessons = (await getAllLessons()).filter((lesson) => gradeKeysForLabel(lesson.metadata.grade).includes("grade-one"));
  const items = lessons.slice(0, 4).map((lesson) => ({
    title: lesson.metadata.title,
    kicker: lesson.metadata.subject,
    summary: lesson.metadata.summary,
    href: lessonHref(lesson.metadata),
    icon: lessonIcon(lesson.metadata.subject, lesson.metadata.category),
  }));
  return <GradeOneTemplate summary="Reading and rhythm" items={items} />;
}
