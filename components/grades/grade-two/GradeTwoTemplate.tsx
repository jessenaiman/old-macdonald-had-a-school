"use client";
import Link from "next/link";
import { GradePlanningNotes, GradePathways, GradeRail, GradeTeacherPanel, type GradePathItem } from "../../builder/CurriculumTemplates";
import workStyles from "../../builder/CurriculumTemplates.module.css";
import styles from "./GradeTwoTemplate.module.css";

type GradeTwoTemplateProps = { summary: string; items: GradePathItem[] };

export function GradeTwoTemplate({ summary, items }: GradeTwoTemplateProps) {
  return <div className={`${workStyles.wall} ${workStyles.gradeWall} ${workStyles.gradeOneWall} ${workStyles.gradeTwoWall} ${styles.template}`} data-grade-template="grade-two">
    <GradeRail grade="Grade 2" age="6–7 yrs" badge="/brand-kit-icon-sheets/individual-icons/grade-2.png" reminder="Ask for evidence and another way." />
    <main className={workStyles.stage}><span className={workStyles.pageGreeting}>Curriculum workroom</span>
      <section className={workStyles.hero} id="today"><div className={workStyles.heroCopy}><h1>Ask deeper, solve bigger,<em>and learn together.</em></h1><p>{summary}</p><div className={workStyles.heroActions}><Link href={items[0]?.href ?? "#curriculum"} className={workStyles.feltButton}>Build this lesson</Link><a href="#curriculum" className={workStyles.paperButton}>Browse learning paths</a></div></div><GradeTeacherPanel leadName="Mr Sam" leadImage="/staff_and_students/mr-sam-transparent-circle.png" leadQuote="What evidence will help them explain their thinking?" showNotesLink /></section>
      <GradePathways grade="Grade 2" items={items} /><GradePlanningNotes grade="Grade 2" item={items[0]} href={items[0]?.href} />
    </main>
  </div>;
}
