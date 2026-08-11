import Image from "next/image";
import Link from "next/link";
import styles from "./SelectedHomePage.module.css";

const GRADES = [
  { label: "Daycare", href: "/grade/daycare", className: styles.gradeDaycare, staff: "Miss Puddles", portrait: "/icons/staff/miss-puddles.png" },
  { label: "Pre-School", href: "/grade/pre-school", className: styles.gradePreschool, staff: "Miss Maisy", portrait: "/icons/staff/miss-maisy.png" },
  { label: "Kindergarten", href: "/grade/kindergarten", className: styles.gradeKindergarten, staff: "Old MacDonald", portrait: "/icons/staff/old-mac.png" },
  { label: "Grade 1", href: "/grade/grade-one", className: styles.gradeOne, staff: "Mr Rusty", portrait: "/icons/staff/mr-rusty.png" },
  { label: "Grade 2", href: "/grade/grade-two", className: styles.gradeTwo, staff: "Mr Maisy", portrait: "/icons/staff/mr-maisy.png" },
] as const;

export function GradeSelectorShelf() {
  return (
    <section className={styles.gradeShelf} aria-labelledby="grade-shelf-title">
      <h2 id="grade-shelf-title">Early Years <span aria-hidden="true">|</span> Grades</h2>
      <nav aria-label="Choose a grade">
        {GRADES.map((grade) => (
          <Link className={`${styles.gradePatch} ${grade.className}`} href={grade.href} key={grade.label} aria-label={`${grade.label}, led by ${grade.staff}`}>
            <Image className={styles.gradeStaffPortrait} src={grade.portrait} alt="" width={48} height={48} />
            <span>{grade.label}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
