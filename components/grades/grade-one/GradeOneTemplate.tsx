"use client";
import Link from "next/link";
import { GradePlanningNotes, GradePathways, GradeRail, GradeTeacherPanel, type GradePathItem } from "../../builder/CurriculumTemplates";
import workStyles from "../../builder/CurriculumTemplates.module.css";
import styles from "./GradeOneTemplate.module.css";

type GradeOneTemplateProps = { summary: string; items: GradePathItem[] };

export function GradeOneTemplate({ summary, items }: GradeOneTemplateProps) {
  return <div className={`${workStyles.wall} ${workStyles.gradeWall} ${workStyles.gradeOneWall} ${styles.template}`} data-grade-template="grade-one">
    <GradeRail grade="Grade 1" age="5–6 yrs" badge="/brand-kit-icon-sheets/individual-icons/grade-1.png" reminder="Invite a choice. Notice the story." />
    <main className={workStyles.stage}><span className={workStyles.pageGreeting}>Curriculum workroom</span>
      <section className={workStyles.hero} id="today"><div className={workStyles.heroCopy}><h1>Think, create, and<em>share with purpose.</em></h1><p>{summary}</p><div className={workStyles.heroActions}><Link href={items[0]?.href ?? "#curriculum"} className={workStyles.feltButton}>Build this lesson</Link><a href="#curriculum" className={workStyles.paperButton}>Browse learning paths</a></div></div><GradeTeacherPanel leadName="Miss Hayley" leadImage="/icons/staff/miss-hayley.png" leadQuote="What can they notice, explain, and share today?" showNotesLink /></section>
      <GradePathways grade="Grade 1" items={items} /><GradePlanningNotes grade="Grade 1" item={items[0]} href={items[0]?.href} />
    </main>
  </div>;
}
