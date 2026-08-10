"use client";
import type { GradePathItem } from "../../builder/CurriculumTemplates";
import workStyles from "../../builder/CurriculumTemplates.module.css";
import { DefaultGradeTemplate } from "../DefaultGradeTemplate";
import styles from "./GradeOneTemplate.module.css";

type GradeOneTemplateProps = { summary: string; items: GradePathItem[] };

export function GradeOneTemplate({ summary, items }: GradeOneTemplateProps) {
  return <DefaultGradeTemplate gradeKey="grade-one" grade="Grade 1" age="5–6 yrs" badge="/brand-kit-icon-sheets/individual-icons/grade-1.png" reminder="Invite a choice. Notice the story." greeting="Curriculum workroom" headline="Think, create, and" accentHeadline="share with purpose." summary={summary} leadName="Miss Hayley" leadImage="/icons/staff/miss-hayley.png" leadQuote="What can they notice, explain, and share today?" items={items} showNotesLink gradeClassName={styles.template} wallClassNames={[workStyles.gradeOneWall]} />;
}
