import { Button } from "@/components/ui/button";
import styles from "./BrandSystemExamples.module.css";
import { TeacherNote } from "@/components/grades/GradeInteractionLane";

export function LessonTypographyExample() {
  return <article className={styles.lessonSheet}>
    <span className="brand-asset fastener-masking-tape icon-medium" aria-hidden="true" />
    <div>
      <p className={styles.eyebrow}>Grade 1 · language and drama</p>
      <h3>Build a story together.<em>Then make room to perform it.</em></h3>
      <p className={styles.bodyCopy}>Display type names the learning invitation. Handwriting adds one short human cue. The body face carries instructions at a comfortable measure and line height.</p>
      <div className={styles.lessonActions}><Button>Build this lesson</Button><Button variant="outline">Browse learning paths</Button></div>
    </div>
    <aside className={styles.taskNote}><strong>Typography recipe</strong><p>One display heading, one handwritten emphasis, and readable body copy. Do not use handwriting for instructions or controls.</p><code>heading · note · body</code></aside>
  </article>;
}

export function CharacterActionExample() {
  return <TeacherNote character="mr-maisy" quote="Choose a way to move that feels strong and safe." actionHref="/grade/grade-two" />;
}
