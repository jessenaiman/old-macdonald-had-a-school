import { GradeTemplate, type GradeTemplateProps } from "../../builder/CurriculumTemplates";
import styles from "./PreschoolTemplate.module.css";

export function PreschoolTemplate(props: GradeTemplateProps) {
  return (
    <GradeTemplate
      {...props}
      grade="Pre-School"
      age="Ages 3–4"
      leadName="Miss Maisy"
      leadImage="/icons/staff/miss-maisy.png"
      leadQuote="What can they choose, try, and tell us about?"
      headline="Grow confidence through"
      accentHeadline="story and sensation."
      badgeImage="/icons/early-years/face-patches/miss-maisy-purple.png"
      className={styles.template}
    />
  );
}
