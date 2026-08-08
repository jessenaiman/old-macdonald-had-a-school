"use client";
import Link from "next/link";
import { GradePlanningNotes, GradePathways, GradeRail, GradeTeacherPanel, type GradeTemplateProps } from "../../builder/CurriculumTemplates";
import workStyles from "../../builder/CurriculumTemplates.module.css";
import styles from "./PreschoolTemplate.module.css";

export function PreschoolTemplate({ summary, items, activeIndex = 0, onSelect, onPreview }: GradeTemplateProps) {
  return <div className={`${workStyles.wall} ${workStyles.gradeWall} ${styles.template}`} data-grade-template="pre-school">
    <GradeRail grade="Pre-School" age="Ages 3–4" badge="/icons/early-years/face-patches/miss-maisy-purple.png" reminder="Leave room for choice and change." />
    <main className={workStyles.stage}><span className={workStyles.pageGreeting}>Welcome back, teacher</span>
      <section className={workStyles.hero} id="today"><div className={workStyles.heroCopy}><span className={workStyles.eyebrow}>Welcome back, teacher</span><h1>Grow confidence through<em>story and sensation.</em></h1><p>{summary}</p><div className={workStyles.heroActions}>{items[activeIndex]?.href ? <Link href={items[activeIndex].href} className={workStyles.feltButton}>Build this lesson</Link> : onPreview ? <button type="button" className={workStyles.feltButton} onClick={onPreview}>Preview the story</button> : null}<a href="#curriculum" className={workStyles.paperButton}>Browse learning paths</a></div></div><GradeTeacherPanel leadName="Miss Maisy" leadImage="/icons/staff/miss-maisy.png" leadQuote="What can they choose, try, and tell us about?" /></section>
      <GradePathways grade="Pre-School" items={items} activeIndex={activeIndex} onSelect={onSelect} /><GradePlanningNotes grade="Pre-School" item={items[activeIndex] ?? items[0]} href={items[activeIndex]?.href} />
    </main>
  </div>;
}
