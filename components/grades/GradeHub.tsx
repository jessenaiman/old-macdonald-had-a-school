import { getAllLessons } from "../../lib/content";
import { gradeKeysForLabel, lessonHref, lessonIcon, type GradeKey } from "../../lib/grade-routes";
import { GradeInteractionLane } from "./GradeInteractionLane";
import { GRADE_INTERACTION_CONFIGS } from "./grade-config";

export async function GradeHub({ grade, tagline }: { grade: GradeKey; tagline: string }) {
  const items = (await getAllLessons())
    .filter((lesson) => gradeKeysForLabel(lesson.metadata.grade).includes(grade))
    .map((lesson) => ({
      title: lesson.metadata.title,
      kicker: lesson.metadata.subject,
      summary: lesson.metadata.summary,
      href: lessonHref(lesson.metadata),
      icon: lessonIcon(lesson.metadata.subject, lesson.metadata.category),
    }));

  return <GradeInteractionLane config={GRADE_INTERACTION_CONFIGS[grade]} summary={tagline} items={items} />;
}
