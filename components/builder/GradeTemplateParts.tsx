"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./CurriculumTemplates.module.css";
import { Button } from "@/components/ui/button";

export type GradePathItem = {
  title: string;
  kicker: string;
  summary: string;
  icon: string;
  href?: string;
};

export type GradeTemplateProps = {
  grade: string;
  age: string;
  leadName: string;
  leadImage: string;
  leadQuote: string;
  headline: string;
  accentHeadline: string;
  summary: string;
  items: GradePathItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
  onPreview?: () => void;
  className?: string;
  badgeImage?: string;
};

const activityIcons = [
  "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png",
  "/brand-kit-icon-sheets/individual-icons/subject-math-building.png",
  "/brand-kit-icon-sheets/individual-icons/subject-gardening-health.png",
  "/brand-kit-icon-sheets/individual-icons/subject-art-photography.png",
];

export function GradeRail({ grade, age, badge, reminder }: { grade: string; age: string; badge: string; reminder: string }) {
  return (
    <aside className={styles.rail} aria-label={`${grade} planning sections`}>
      <div className={styles.railIdentity}>
        <Image src={badge} width={72} height={72} alt="" className={styles.gradeBadge} />
        <div><span>Learning plan</span><strong>{grade}</strong><small>{age}</small></div>
      </div>
      <nav className={styles.railNav}>
        <a href="#today"><b>01</b><span>Today</span></a>
        <a href="#curriculum"><b>02</b><span>Curriculum</span></a>
        <a href="#planner"><b>03</b><span>Planner</span></a>
        <a href="#resources"><b>04</b><span>Resources</span></a>
      </nav>
      <div className={styles.reminder}>
        <Image src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" width={30} height={30} alt="" />
        <span>Planning reminder</span><strong>{reminder}</strong>
      </div>
    </aside>
  );
}

export function GradeTeacherPanel({ leadName, leadImage, leadQuote, showNotesLink = false }: Pick<GradeTemplateProps, "leadName" | "leadImage" | "leadQuote"> & { showNotesLink?: boolean }) {
  return (
    <aside className={styles.teacherCard} aria-label={`A note from ${leadName}`}>
      <span>A note from {leadName}</span>
      <blockquote>“{leadQuote}”</blockquote>
      <Image src={leadImage} width={230} height={230} alt={leadName} priority className={styles.teacherImage} />
      {showNotesLink && <a href="#planner" className={styles.teacherNotesLink}>Open teacher notes</a>}
    </aside>
  );
}

export function GradePathways({ grade, items, activeIndex = 0, onSelect }: { grade: string; items: GradePathItem[]; activeIndex?: number; onSelect?: (index: number) => void }) {
  return (
    <section className={styles.paths} id="curriculum">
      <header className={styles.sectionHeader}>
        <div><span className={styles.eyebrow}>Pick a starting point</span><h2>Learning paths for {grade}</h2></div>
        <a href="#resources">See planning resources</a>
      </header>
      <div className={styles.pathGrid}>
        {items.map((item, index) => {
          const body = <>
            <Image src="/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png" width={22} height={22} alt="" className={styles.pathPin} />
            <Image src={item.icon || activityIcons[index % activityIcons.length]} width={112} height={112} alt="" className={styles.pathIcon} />
            <span>{item.kicker}</span><h3>{item.title}</h3><p>{item.summary}</p><b>View path →</b>
          </>;
          return item.href ? <Link href={item.href} className={`${styles.pathCard} ${index === activeIndex ? styles.pathCardActive : ""}`} key={item.title}>{body}</Link> : <Button variant="ghost" type="button" className={`${styles.pathCard} ${index === activeIndex ? styles.pathCardActive : ""}`} aria-pressed={index === activeIndex} onClick={() => onSelect?.(index)} key={item.title}>{body}</Button>;
        })}
      </div>
    </section>
  );
}

export function GradePlanningNotes({ grade, item, href }: { grade: string; item?: GradePathItem; href?: string }) {
  const notes = [
    ["Today's intention", "Name the one thing learners might notice, try, or share.", "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png"],
    ["Gather before you begin", "Leave room for the materials, song, book, or visual support.", "/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png"],
    ["Notice and carry forward", "Jot what children showed you and one possible next step.", "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png"],
  ];
  return (
    <section className={styles.planningReference} id="planner" aria-label={`${grade} planning notes`}>
      <header className={styles.planningGoal}>
        <span className={styles.eyebrow}>Current lesson goal</span>
        <h2>{item?.title ?? "Choose a lesson to begin"}</h2>
        <p className={styles.planningKicker}>{item?.kicker ?? "Choose a path"}</p>
        <p className={styles.planningSummary}>{item?.summary ?? "Open one path above to load the current goal."}</p>
      </header>
      <div className={styles.planningActions}>
        <Link className={`${styles.planningAction} ${styles.planningPrimary}`} href={href ?? "#curriculum"}>Open lesson</Link>
        <a className={`${styles.planningAction} ${styles.planningSecondary}`} href="#today">Back to overview</a>
      </div>
      <div className={styles.planningNoteGrid} aria-label="Printable planning notes">
        {notes.map(([label, prompt, fastener]) => <article className={styles.planningNote} key={label}>
          <Image src={fastener} width={34} height={34} alt="" className={styles.planningNoteFastener} />
          <span>{label}</span><p>{prompt}</p><div className={styles.planningLines} aria-hidden="true"><i /><i /><i /></div>
        </article>)}
      </div>
    </section>
  );
}
