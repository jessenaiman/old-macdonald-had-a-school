import { getAllLessons } from "@/lib/content";
import { gradeKeysForLabel, lessonHref, lessonIcon } from "@/lib/grade-routes";
import { GradeInteractionLane } from "./GradeInteractionLane";
import { GRADE_INTERACTION_CONFIGS } from "./grade-config";

/**
 * Branding renders the same Grade 2 data query, mapping, configuration, and
 * shared workroom control as /grade/grade-two. It is not a demo fixture.
 */
export async function GradeControlsReference() {
  const lessons = (await getAllLessons()).filter((lesson) =>
    gradeKeysForLabel(lesson.metadata.grade).includes("grade-two"),
  );
  const items = lessons.slice(0, 4).map((lesson) => ({
    title: lesson.metadata.title,
    kicker: lesson.metadata.subject,
    summary: lesson.metadata.summary,
    href: lessonHref(lesson.metadata),
    icon: lessonIcon(lesson.metadata.subject, lesson.metadata.category),
  }));

  return (
    <div className="not-prose" data-branding-example="production-grade-two-workroom">
      <GradeInteractionLane
        config={GRADE_INTERACTION_CONFIGS["grade-two"]}
        summary="Building fluency and proof"
        items={items}
        headingLevel="h2"
      />
    </div>
  );
}
