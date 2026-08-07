import { GradeTemplate, type GradeTemplateProps } from "../../builder/CurriculumTemplates";
import styles from "./KindergartenTemplate.module.css";

export function KindergartenTemplate(props: GradeTemplateProps) {
  return (
    <GradeTemplate
      {...props}
      grade="Kindergarten"
      age="Ages 4–6"
      leadName="Mr Rusty"
      leadImage="/icons/staff/mr-rusty.png"
      leadQuote="Where can one good question take us?"
      headline="Turn curiosity into"
      accentHeadline="a day of discovery."
      className={styles.template}
    />
  );
}
