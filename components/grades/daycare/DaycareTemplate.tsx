"use client";
import Link from "next/link";
import { GradePlanningNotes, GradePathways, GradeRail, GradeTeacherPanel, type GradeTemplateProps } from "../../builder/CurriculumTemplates";
import workStyles from "../../builder/CurriculumTemplates.module.css";
import styles from "./DaycareTemplate.module.css";

export function DaycareTemplate({ summary, items, activeIndex = 0, onSelect, onPreview }: GradeTemplateProps) {
  return <div className={`${workStyles.wall} ${workStyles.gradeWall} ${workStyles.daycareWall} ${styles.template}`} data-grade-template="daycare">
    <GradeRail grade="Daycare" age="Ages 2–3" badge="/brand-kit-icon-sheets/individual-icons/grade-daycare.png" reminder="Invite a choice. Notice the story." />
    <main className={workStyles.stage}><span className={workStyles.pageGreeting}>Welcome back, teacher</span>
      <section className={workStyles.hero} id="today"><div className={workStyles.heroCopy}><span className={workStyles.eyebrow}>Welcome back, teacher</span><h1>Plan for little hands,<em>big feelings.</em></h1><p>{summary}</p><div className={workStyles.heroActions}>{items[activeIndex]?.href ? <Link href={items[activeIndex].href} className={workStyles.feltButton}>Build this lesson</Link> : onPreview ? <button type="button" className={workStyles.feltButton} onClick={onPreview}>Preview the story</button> : null}<a href="#curriculum" className={workStyles.paperButton}>Browse learning paths</a></div></div><GradeTeacherPanel leadName="Miss Puddles" leadImage="/staff_and_students/miss-puddles-transparent-circle.png" leadQuote="What will make joining in feel safe today?" /></section>
      <GradePathways grade="Daycare" items={items} activeIndex={activeIndex} onSelect={onSelect} /><GradePlanningNotes grade="Daycare" item={items[activeIndex] ?? items[0]} href={items[activeIndex]?.href} />
    </main>
  </div>;
}
