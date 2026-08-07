import { GradeTemplate, type GradeTemplateProps } from "../../builder/CurriculumTemplates";
import styles from "./DaycareTemplate.module.css";

export function DaycareTemplate(props: GradeTemplateProps) {
  return (
    <GradeTemplate
      {...props}
      grade="Daycare"
      age="Ages 2–3"
      leadName="Miss Puddles"
      leadImage="/staff_and_students/miss-puddles-transparent-circle.png"
      leadQuote="What will make joining in feel safe today?"
      headline="Plan for little hands,"
      accentHeadline="big feelings."
      badgeImage="/brand-kit-icon-sheets/individual-icons/grade-daycare.png"
      className={styles.template}
    />
  );
}
