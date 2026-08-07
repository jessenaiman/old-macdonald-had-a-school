import { GradeTemplate, type GradePathItem } from "../../builder/CurriculumTemplates";
import styles from "./GradeOneTemplate.module.css";

type GradeOneTemplateProps = {
  summary: string;
  items: GradePathItem[];
};

export function GradeOneTemplate(props: GradeOneTemplateProps) {
  return (
    <GradeTemplate
      {...props}
      grade="Grade 1"
      age="5–6 yrs"
      leadName="Miss Hayley"
      leadImage="/icons/staff/miss-hayley.png"
      leadQuote="What can they notice, explain, and share today?"
      headline="Think, create, and"
      accentHeadline="share with purpose."
      className={styles.template}
    />
  );
}
