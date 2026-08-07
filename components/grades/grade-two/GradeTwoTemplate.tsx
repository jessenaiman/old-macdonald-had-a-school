import { GradeTemplate, type GradePathItem } from "../../builder/CurriculumTemplates";
import styles from "./GradeTwoTemplate.module.css";

type GradeTwoTemplateProps = {
  summary: string;
  items: GradePathItem[];
};

export function GradeTwoTemplate(props: GradeTwoTemplateProps) {
  return (
    <GradeTemplate
      {...props}
      grade="Grade 2"
      age="6–7 yrs"
      leadName="Mr Sam"
      leadImage="/staff_and_students/mr-sam-transparent-circle.png"
      leadQuote="What evidence will help them explain their thinking?"
      headline="Ask deeper, solve bigger,"
      accentHeadline="and learn together."
      className={styles.template}
    />
  );
}
