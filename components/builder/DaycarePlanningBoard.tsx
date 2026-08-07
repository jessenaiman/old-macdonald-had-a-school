"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./DaycarePlanningBoard.module.css";

const planItems = ["Morning Circle", "Story & Songs", "Explore & Play", "Snack & Chat", "Rest & Reflect", "Goodbye Circle"];
const pathItems = [
  ["Story & songs", "Books, songs, and rhymes", "/icons/early-years/face-patches/puddles-blue.png"],
  ["Explore & discover", "Hands-on play, sensory fun", "/icons/early-years/face-patches/penny-orange.png"],
  ["Create & express", "Art, movement, and pretend play", "/icons/early-years/face-patches/hopper-red.png"],
  ["Care & connect", "Feelings, friends, and routines", "/icons/early-years/face-patches/maisy-yellow.png"],
] as const;
const noteCards = [
  ["Goal & opener", "Today’s focus and how we’ll begin.", "/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png", "gold"],
  ["Materials & adaptations", "What I need and ways to support all learners.", "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png", "green"],
  ["Notes & reflection", "What worked, what we’ll try next, and celebrations.", "/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png", "purple"],
] as const;

export function DaycarePlanningBoard() {
  const [checked, setChecked] = useState([true, true, false, false, false, false]);
  const [selectedPath, setSelectedPath] = useState(0);

  return <section className={styles.board} aria-label="Daycare teacher planning board">
    <aside className={styles.sidebar} aria-label="Daycare planning navigation">
      <div className={styles.sidebarIdentity}>
        <Image className={styles.daycareBadge} src="/brand-kit-icon-sheets/individual-icons/grade-daycare.png" width={76} height={76} alt="Daycare" priority />
        <span className={styles.daycareTab}>Daycare</span>
        <p>Old MacDonald’s<br /><strong>Farm School</strong></p>
      </div>
      <section className={styles.todayPlan} aria-labelledby="today-plan"><h2 id="today-plan">Today’s plan</h2>
        {planItems.map((item, index) => <label key={item} className={styles.planCheck}><input type="checkbox" checked={checked[index]} onChange={() => setChecked(values => values.map((value, i) => i === index ? !value : value))} /><span>{item}</span></label>)}
      </section>
      <nav className={styles.planningTools} aria-label="Planning tools"><h2>Planning tools</h2>
        <Link href="/lessons">Lesson Library</Link><Link href="/topics">Printable Resources</Link><span>Picture Cards</span><span>Classroom Helpers</span><a href="#planning-notes">Assessment Notes</a>
      </nav>
      <section className={styles.quickLinks}><h2>Quick links</h2><a href="#today-plan">Daily Schedule</a><span>Routine Cards</span><span>Behavior Supports</span><Link href="/about">Family Connection</Link></section>
      <aside className={styles.selfCare}><Image src="/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png" width={30} height={30} alt="" /><span>Teacher self-care</span><strong>I will take one small<br />break today.</strong></aside>
    </aside>
    <div className={styles.mainPanel}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}><p className={styles.welcome}>Welcome back, teacher!</p><h1>A calm start<br />leads to a happy day.</h1><h2>Learning Goal</h2><p className={styles.goalCopy}>Children feel safe, connected, and curious as they explore, play, and build early friendships.</p></div>
        <aside className={styles.promptCard}><span>Teacher prompt</span><strong>What helps each child feel safe and included today?</strong><p>Jot a few ideas before circle time.</p></aside>
        <div className={styles.teacherPortrait}><Image src="/icons/staff/miss-puddles.png" width={340} height={340} alt="Miss Puddles, the Daycare teacher" priority /><span><b>Miss Puddles</b>Daycare Teacher</span></div>
      </header>
      <nav className={styles.learningPaths} aria-label="Today’s learning paths"><h2>Today’s<br />learning paths</h2>
        {pathItems.map(([title, summary, icon], index) => <Link href="/topics" key={title} className={selectedPath === index ? styles.pathSelected : undefined} onClick={() => setSelectedPath(index)}><Image src={icon} width={62} height={62} alt="" /><span><b>{title}</b>{summary}</span></Link>)}
      </nav>
      <section className={styles.corkArea} id="planning-notes" aria-label="Planning notes"><div className={styles.noteGrid}>
        {noteCards.map(([title, description, fastener, accent], index) => <article className={styles.planningCard} key={title}>
          <Image className={`${styles.cardFastener} ${styles[accent]}`} src={fastener} width={46} height={46} alt="" /><header><span>{title}</span><p>{description}</p></header><textarea aria-label={`${title} notes`} />
          {index === 1 && <aside className={styles.inclusionNote}><b>Inclusion ideas</b><textarea aria-label="Inclusion ideas" /><Image src="/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png" width={25} height={25} alt="" /></aside>}
          {index === 2 && <aside className={styles.tomorrowNote}><b>Tomorrow I will…</b><textarea aria-label="Tomorrow I will" /><Image src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" width={28} height={28} alt="" /></aside>}
        </article>)}
      </div></section>
    </div>
  </section>;
}
