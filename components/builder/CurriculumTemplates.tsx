"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { LessonTopic, SingleLessonTopic } from "../../lib/mdx-content";
import styles from "./CurriculumTemplates.module.css";

export type GradePathItem = {
  title: string;
  kicker: string;
  summary: string;
  icon: string;
  href?: string;
};

type GradeTemplateProps = {
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
};

const activityIcons = [
  "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png",
  "/brand-kit-icon-sheets/individual-icons/subject-math-building.png",
  "/brand-kit-icon-sheets/individual-icons/subject-gardening-health.png",
  "/brand-kit-icon-sheets/individual-icons/subject-art-photography.png",
];

function curriculumIcon(subject = "", category = "") {
  const label = `${subject} ${category}`;
  if (/math|number|stem/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-math-building.png";
  if (/literacy|phonic|reading|writing|language|story/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png";
  if (/music|movement|dance/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png";
  if (/art|photo|visual/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-art-photography.png";
  if (/garden|health|nature/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-gardening-health.png";
  if (/physical|sport/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-physical-education.png";
  return "/brand-kit-icon-sheets/individual-icons/subject-early-learning.png";
}

function Rail({
  grade,
  age,
  badge,
  reminder,
}: {
  grade: string;
  age: string;
  badge: string;
  reminder: string;
}) {
  return (
    <aside className={styles.rail} aria-label={`${grade} planning sections`}>
      <div className={styles.railIdentity}>
        <Image src={badge} width={72} height={72} alt="" className={styles.gradeBadge} style={{ width: 72, height: 72 }} />
        <div>
          <span>Farm School</span>
          <strong>{grade}</strong>
          <small>{age}</small>
        </div>
      </div>
      <nav className={styles.railNav}>
        <a href="#today"><b>01</b><span>Today</span></a>
        <a href="#curriculum"><b>02</b><span>Curriculum</span></a>
        <a href="#planner"><b>03</b><span>Planner</span></a>
        <a href="#resources"><b>04</b><span>Resources</span></a>
      </nav>
      <div className={styles.reminder}>
        <Image src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" width={30} height={30} alt="" />
        <span>Planning reminder</span>
        <strong>{reminder}</strong>
      </div>
    </aside>
  );
}

export function GradeTemplate({
  grade,
  age,
  leadName,
  leadImage,
  leadQuote,
  headline,
  accentHeadline,
  summary,
  items,
  activeIndex = 0,
  onSelect,
  onPreview,
}: GradeTemplateProps) {
  const [checks, setChecks] = useState([false, false, false]);
  const isUpperGrade = grade === "Grade 1" || grade === "Grade 2" || grade === "Kindergarten";
  const badge = grade === "Grade 1"
    ? "/brand-kit-icon-sheets/individual-icons/grade-1.png"
    : grade === "Grade 2"
      ? "/brand-kit-icon-sheets/individual-icons/grade-2.png"
      : grade === "Kindergarten"
        ? "/brand-kit-icon-sheets/individual-icons/grade-kindergarten.png"
        : grade === "Preschool"
          ? "/icons/early-years/face-patches/miss-maisy-purple.png"
        : "/brand-kit-icon-sheets/individual-icons/grade-daycare.png";

  const planningSteps = [
    {
      label: "Set a goal",
      title: "Follow a simple sequence and make one meaningful choice",
      action: "Edit goal",
    },
    {
      label: "Gather what helps",
      title: "Pick resources, prompts, and supports",
      action: "Open resources",
    },
    {
      label: "Prepare your plan",
      title: "Map the lesson steps and learner needs",
      action: "Open planner",
    },
  ];

  return (
    <div
      className={`${styles.wall} ${styles.gradeWall} ${isUpperGrade ? styles.gradeOneWall : ""} ${grade === "Grade 2" ? styles.gradeTwoWall : ""} ${grade === "Kindergarten" ? styles.kindergartenWall : ""}`}
      data-grade-family={grade === "Grade 1" ? "grade-one" : grade === "Grade 2" ? "grade-two" : grade === "Kindergarten" ? "kindergarten" : undefined}
    >
      <Rail grade={grade} age={age} badge={badge} reminder="Invite a choice. Notice the story." />
      <div className={styles.stage}>
        <span className={styles.pageGreeting}>{isUpperGrade ? "Curriculum workroom" : "Welcome back, teacher"}</span>
        <section className={styles.hero} id="today">
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Welcome back, teacher</span>
            <h1>{headline}<em>{accentHeadline}</em></h1>
            <p>{summary}</p>
            <div className={styles.heroActions}>
              {onPreview ? (
                <button type="button" className={styles.feltButton} onClick={onPreview}>Build this lesson</button>
              ) : (
                <Link href={items[activeIndex]?.href ?? "#curriculum"} className={styles.feltButton}>Build this lesson</Link>
              )}
              <a href="#curriculum" className={styles.paperButton}>Browse learning paths</a>
            </div>
          </div>
          <aside className={styles.teacherCard} aria-label={`A note from ${leadName}`}>
            <span>A note from {leadName}</span>
            <blockquote>“{leadQuote}”</blockquote>
            <Image src={leadImage} width={230} height={230} alt={leadName} priority className={styles.teacherImage} />
            {isUpperGrade && <a href="#planner" className={styles.teacherNotesLink}>Open teacher notes</a>}
          </aside>
        </section>

        <section className={styles.paths} id="curriculum">
          <header className={styles.sectionHeader}>
            <div><span className={styles.eyebrow}>Pick a starting point</span><h2>Learning paths for {grade}</h2></div>
            <a href="#resources">See planning resources</a>
          </header>
          <div className={styles.pathGrid}>
            {items.slice(0, 4).map((item, index) => {
              const body = (
                <>
                  <Image src="/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png" width={22} height={22} alt="" className={styles.pathPin} />
                  <Image src={item.icon || activityIcons[index]} width={112} height={112} alt="" className={styles.pathIcon} />
                  <span>{item.kicker}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <b>View path →</b>
                </>
              );
              return item.href ? (
                <Link href={item.href} className={`${styles.pathCard} ${index === activeIndex ? styles.pathCardActive : ""}`} key={item.title}>{body}</Link>
              ) : (
                <button type="button" className={`${styles.pathCard} ${index === activeIndex ? styles.pathCardActive : ""}`} aria-pressed={index === activeIndex} onClick={() => onSelect?.(index)} key={item.title}>{body}</button>
              );
            })}
          </div>
        </section>

        <section className={styles.corkBoard} id="planner">
          <header>
            <div><span className={styles.eyebrow}>Today&apos;s planning board</span><h2>Plan ahead with a few helpful moves.</h2></div>
          </header>
          <div className={styles.noteGrid} id="resources">
            {planningSteps.map((step, index) => (
              <article className={styles.noteSheet} key={step.label}>
                <Image src={`/design-assets/classroom-fasteners-v1/individual-icons/${index === 0 ? "03-paperclip-double-loop" : index === 1 ? "05-masking-tape" : "01-push-pin-rounded"}.png`} width={34} height={34} alt="" />
                <span>{step.label}</span>
                <h3>{step.title}</h3>
                <label className={styles.checkRow}>
                  <input type="checkbox" checked={checks[index]} onChange={() => setChecks((current) => current.map((value, i) => i === index ? !value : value))} />
                  <b>{checks[index] ? "Ready" : step.action}</b>
                </label>
                <textarea aria-label={`Notes for ${step.label}`} placeholder="Teacher notes" />
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function TopicTemplate({ lesson, band }: { lesson: LessonTopic; band?: string }) {
  const grade = lesson.grades[0];
  const steps = grade?.steps ?? [];
  const [active, setActive] = useState(0);
  const current = steps[active];
  const isGradeTwo = band === "grade-two" || (!band && /2/.test(lesson.meta.gradeBand || ""));
  const displayGrade = band === "grade-two" ? "Grade 2" : band === "grade-one" ? "Grade 1" : lesson.meta.gradeBand || grade?.grade || "Curriculum";
  const topicTeacher = isGradeTwo ? "/icons/staff/mr-maisy.png" : "/icons/staff/miss-hayley.png";
  return (
    <div className={`${styles.wall} ${isGradeTwo ? styles.gradeTwoContext : ""}`}>
      <Rail grade={displayGrade} age="Teacher planning" badge={topicTeacher} reminder={lesson.planningNote || "Keep one clear goal visible."} />
      <div className={styles.stage}>
        <section className={styles.topicHeader} id="today">
          <Image src={curriculumIcon(lesson.meta.subject, lesson.meta.category)} width={92} height={92} alt="" />
          <div><span className={styles.eyebrow}>{lesson.meta.subject} · {lesson.meta.category}</span><h1>{lesson.meta.title}</h1><p>{lesson.meta.summary}</p></div>
        </section>
        <section className={styles.topicBoard} id="curriculum">
          <header><div><span className={styles.eyebrow}>Topic sequence</span><h2>Plan the learning path</h2></div><strong>{grade?.goal}</strong></header>
          <div className={styles.sequenceGrid}>
            {steps.slice(0, 4).map((step, index) => (
              <button type="button" key={`${step.label}-${step.title}`} className={`${styles.sequenceCard} ${active === index ? styles.sequenceActive : ""}`} onClick={() => setActive(index)}>
                <Image src={activityIcons[index]} width={56} height={56} alt="" />
                <span>Lesson {index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.teacher || step.students}</p>
              </button>
            ))}
          </div>
          {current && <div className={styles.topicFocus}><span className={styles.eyebrow}>Selected lesson</span><h2>{current.title}</h2><p><strong>Look for:</strong> {current.lookFor}</p></div>}
        </section>
        <section className={styles.topicNotes} id="planner">
          <article><span>Objective</span><h3>{grade?.goal}</h3><p>{grade?.standards}</p></article>
          <article><span>Materials</span><h3>Gather what helps</h3><p>{grade?.materials || "Choose only the materials this group needs."}</p></article>
          <article><span>Teacher message</span><h3>Make room to adapt</h3><p>{lesson.planningNote}</p></article>
        </section>
        <aside className={styles.teacherStrip}>
          <Image src={topicTeacher} width={126} height={126} alt="" />
          <div><span>From your teaching team</span><strong>Ask open questions, wait for ideas, and celebrate every thoughtful choice.</strong></div>
        </aside>
      </div>
    </div>
  );
}

export function LessonTemplate({ lesson, band }: { lesson: SingleLessonTopic; band?: string }) {
  const { meta } = lesson;
  const [active, setActive] = useState(0);
  const visibleSteps = (lesson.steps.length ? lesson.steps : [lesson.watch, lesson.try, lesson.practice, lesson.check]).slice(0, 4);
  const activeStep = visibleSteps[active];
  const isGradeTwo = band === "grade-two" || (!band && /2/.test(meta.gradeBand || meta.grade || ""));
  const displayGrade = band === "grade-two" ? "Grade 2" : band === "grade-one" ? "Grade 1" : meta.grade || meta.gradeBand || "Lesson";
  const planningMaterials = lesson.materials.length
    ? lesson.materials.slice(0, 4)
    : Array.from(new Set([lesson.watch.title, lesson.practice.title, ...lesson.printables.map((item) => item.title)].filter(Boolean))).slice(0, 4);
  return (
    <div className={`${styles.wall} ${isGradeTwo ? styles.gradeTwoContext : ""}`}>
      <Rail grade={displayGrade} age={meta.timeEstimate || "Teacher planning"} badge={isGradeTwo ? "/icons/staff/mr-maisy.png" : "/icons/staff/miss-hayley.png"} reminder={lesson.planningNote || "Choose one meaningful next step."} />
      <div className={styles.stage}>
        <header className={styles.lessonHeader} id="today">
          <div><span className={styles.eyebrow}>{meta.subject} · {meta.category}</span><small>Individual lesson</small><h1>{meta.title}</h1><p>{meta.summary}</p></div>
          <Image src={curriculumIcon(meta.subject, meta.category)} width={132} height={132} alt="" />
        </header>
        <section className={styles.lessonMeta}>
          <div><span>Estimated time</span><strong>{meta.timeEstimate || "25 minutes"}</strong></div>
          <div><span>Learners</span><strong>{meta.grouping || "Whole group"}</strong></div>
          <div><span>Focus</span><strong>{meta.focus || meta.category}</strong></div>
        </section>
        <section className={styles.planningCards} id="planner">
          <article><Image src={curriculumIcon(meta.subject, meta.category)} width={44} height={44} alt="" /><span>Today’s goal</span><h2>{lesson.goal || meta.focus}</h2></article>
          <article><Image src="/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png" width={44} height={44} alt="" /><span>Materials</span><ul>{planningMaterials.map((material) => <li key={material}>{material}</li>)}</ul></article>
          <article><Image src="/brand-kit-icon-sheets/individual-icons/subject-community-leadership.png" width={44} height={44} alt="" /><span>Curriculum path</span><ul>{lesson.curriculumPath.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul></article>
        </section>
        <div className={styles.lessonColumns} id="curriculum">
          <section className={styles.flowPanel}>
            <span className={styles.eyebrow}>Lesson flow</span>
            {visibleSteps.map((step, index) => (
              <button type="button" key={step.key} className={`${styles.flowRow} ${active === index ? styles.flowActive : ""}`} onClick={() => setActive(index)}>
                <b>{index + 1}</b><Image src={activityIcons[index % activityIcons.length]} width={46} height={46} alt="" /><span><small>{step.label}</small><strong>{"title" in step ? step.title : step.subtitle}</strong></span>
              </button>
            ))}
            {activeStep && <div className={styles.flowDetail}><span>{activeStep.label}</span><p>{"description" in activeStep ? activeStep.description : activeStep.subtitle}</p></div>}
          </section>
          <aside className={styles.supportBoard} id="resources">
            <article><Image src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" width={34} height={34} alt="" /><span>Teacher support</span><h3>Ways to adapt today</h3><p>{lesson.try.tip || lesson.planningNote}</p></article>
            <article><Image src="/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png" width={42} height={42} alt="" /><span>Look-for</span><h3>{lesson.check.title}</h3><p>{lesson.check.lookFor}</p></article>
          </aside>
        </div>
        <label className={styles.lessonNotes}><span>Teacher notes</span><textarea placeholder="What did learners notice, try, or need next?" /></label>
      </div>
    </div>
  );
}
