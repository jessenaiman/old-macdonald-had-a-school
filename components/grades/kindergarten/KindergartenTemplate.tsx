"use client";
import Link from "next/link";
import { GradePlanningNotes, GradePathways, GradeRail, GradeTeacherPanel, type GradeTemplateProps } from "../../builder/CurriculumTemplates";
import workStyles from "../../builder/CurriculumTemplates.module.css";
import styles from "./KindergartenTemplate.module.css";

export function KindergartenTemplate({ summary, items, activeIndex = 0, onSelect, onPreview }: GradeTemplateProps) {
  return <div className={`${workStyles.wall} ${workStyles.gradeWall} ${workStyles.kindergartenWall} ${styles.template}`} data-grade-template="kindergarten">
    <GradeRail grade="Kindergarten" age="Ages 4–6" badge="/brand-kit-icon-sheets/individual-icons/grade-kindergarten.png" reminder="Ask one good question and wait." />
    <main className={workStyles.stage}><span className={workStyles.pageGreeting}>Curriculum workroom</span>
      <section className={workStyles.hero} id="today"><div className={workStyles.heroCopy}><span className={workStyles.eyebrow}>Choose a starting point</span><h1>Turn curiosity into<em>a day of discovery.</em></h1><p>{summary}</p><div className={workStyles.heroActions}>{items[activeIndex]?.href ? <Link href={items[activeIndex].href} className={workStyles.feltButton}>Build this lesson</Link> : onPreview ? <button type="button" className={workStyles.feltButton} onClick={onPreview}>Preview the story</button> : null}<a href="#curriculum" className={workStyles.paperButton}>Browse learning paths</a></div></div><GradeTeacherPanel leadName="Mr Rusty" leadImage="/icons/staff/mr-rusty.png" leadQuote="Where can one good question take us?" showNotesLink /></section>
      <GradePathways grade="Kindergarten" items={items} activeIndex={activeIndex} onSelect={onSelect} /><GradePlanningNotes grade="Kindergarten" item={items[activeIndex] ?? items[0]} href={items[activeIndex]?.href} />
    </main>
  </div>;
}
