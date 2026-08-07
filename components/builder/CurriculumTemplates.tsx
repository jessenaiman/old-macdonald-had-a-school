"use client";

import Image from "next/image";
import Link from "next/link";
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

type PlannerCrew = readonly string[];

const plannerCrewByGrade: Record<string, PlannerCrew> = {
  daycare: ["/staff_and_students/miss-puddles-transparent-circle.png", "/staff_and_students/puddles-transparent-circle.png", "/staff_and_students/penny-transparent-circle.png"],
  preschool: ["/staff_and_students/miss-maisy-transparent-circle.png", "/staff_and_students/mr-rusty-transparent-circle.png", "/staff_and_students/maisy-transparent-circle.png"],
  kindergarten: ["/staff_and_students/mr-rusty-transparent-circle.png", "/staff_and_students/puddles-transparent-circle.png", "/staff_and_students/mr-puddles-transparent-circle.png"],
  "grade-1": ["/staff_and_students/miss-hayley-transparent-circle.png", "/staff_and_students/rusty-transparent-circle.png", "/staff_and_students/maisy-transparent-circle.png"],
  "grade-2": ["/staff_and_students/mr-sam-transparent-circle.png", "/staff_and_students/sam-transparent-circle.png", "/staff_and_students/rusty-transparent-circle.png"],
};

const plannerCrewByLeadName: Record<string, PlannerCrew> = {
  "Miss Puddles": ["/staff_and_students/miss-puddles-transparent-circle.png", "/staff_and_students/puddles-transparent-circle.png", "/staff_and_students/mr-puddles-transparent-circle.png"],
  "Mr Rusty": ["/staff_and_students/mr-rusty-transparent-circle.png", "/staff_and_students/mr-maisy-transparent-circle.png", "/staff_and_students/puddles-transparent-circle.png"],
  "Miss Hayley": ["/staff_and_students/miss-hayley-transparent-circle.png", "/staff_and_students/whiskers-transparent-circle.png", "/staff_and_students/penny-transparent-circle.png"],
  "Mr Sam": ["/staff_and_students/mr-sam-transparent-circle.png", "/staff_and_students/sam-transparent-circle.png", "/staff_and_students/whiskers-transparent-circle.png"],
  "Mr Maisy": ["/staff_and_students/mr-maisy-transparent-circle.png", "/staff_and_students/maisy-transparent-circle.png", "/staff_and_students/rusty-transparent-circle.png"],
  "Miss Maisy": ["/staff_and_students/miss-maisy-transparent-circle.png", "/staff_and_students/penny-transparent-circle.png", "/staff_and_students/hopper-transparent-circle.png"],
};

const defaultPlannerCrew = ["/staff_and_students/miss-puddles-transparent-circle.png", "/staff_and_students/mr-maisy-transparent-circle.png", "/staff_and_students/maisy-transparent-circle.png"];

function plannerGradeKey(grade: string) {
  const slug = grade.toLowerCase();
  if (slug.includes("daycare")) return "daycare";
  if (slug.includes("preschool")) return "preschool";
  if (slug.includes("kindergarten")) return "kindergarten";
  if (slug.includes("grade 1")) return "grade-1";
  if (slug.includes("grade 2")) return "grade-2";
  return "kindergarten";
}

function plannerCrewForGrade(grade: string, leadName: string) {
  return plannerCrewByLeadName[leadName] ?? plannerCrewByGrade[plannerGradeKey(grade)] ?? defaultPlannerCrew;
}

function makeGoalSummary(item: GradePathItem | undefined) {
  if (!item) return { title: "Pick a lesson to begin", kicker: "Choose a path", summary: "Open one path above to load the current goal and resources." };
  return {
    title: item.title,
    kicker: item.kicker,
    summary: item.summary || "Open this planning entry to begin a teacher-focused sequence.",
  };
}

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

  const planningGoal = makeGoalSummary(items[activeIndex] ?? items[0]);
  const planningCrew = plannerCrewForGrade(grade, leadName);
  const planningResources = items.slice(0, 3);

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

        <section className={styles.planningReference} id="planner" aria-label={`${grade} lesson planning resources`}>
          <header className={styles.planningGoal}>
            <span className={styles.eyebrow}>Current lesson goal</span>
            <h2>{planningGoal.title}</h2>
            <p className={styles.planningKicker}>{planningGoal.kicker}</p>
            <p className={styles.planningSummary}>{planningGoal.summary}</p>
          </header>
          <div className={styles.planningActions}>
            <Link className={`${styles.planningAction} ${styles.planningPrimary}`} href={items[activeIndex]?.href ?? "#curriculum"}>Edit goal</Link>
            <a className={`${styles.planningAction} ${styles.planningSecondary}`} href="#today">Save to week</a>
          </div>
          <div className={styles.planningResourceStrip}>
            {planningResources.map((item, index) => (
              <Link
                className={styles.planningResourceCard}
                href={item.href ?? "#curriculum"}
                key={`planning-resource-${item.title}`}
                aria-label={`Open planning resource ${item.title}`}
              >
                <Image src="/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png" width={26} height={26} alt="" className={styles.planningResourcePin} />
                <Image src={planningCrew[index] ?? planningCrew[0]} width={48} height={48} alt="" className={styles.planningResourcePersona} />
                <Image src={item.icon || curriculumIcon(item.kicker, item.summary)} width={34} height={34} alt="" className={styles.planningResourceIcon} />
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <b>Open resource</b>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
