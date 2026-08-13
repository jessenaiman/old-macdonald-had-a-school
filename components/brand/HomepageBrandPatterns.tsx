import { FolkArtsSection } from "@/components/home/FolkArtsSection";
import { HOME_SUBJECTS, SUBJECT_LEARNERS } from "@/components/home/home-data";
import { HomeSubjectNote } from "@/components/home/HomeSubjectNote";
import styles from "@/components/home/HomePage.module.css";

export function HomepageBrandPatterns() {
  return (
    <div className={styles.homePage}>
      <section className={`${styles.bulletinBoard} !w-full`} aria-labelledby="branding-home-note-title">
        <header className={styles.subjectHeading}><h2 id="branding-home-note-title">Homepage subject notes</h2></header>
        <div className={styles.subjectGrid}>
          {HOME_SUBJECTS.map((subject) => (
            <HomeSubjectNote
              key={subject.key}
              title={subject.title}
              href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}
                color={subject.color as `#${string}`}
                iconClass={subject.iconClass}
                teacherReason={subject.teacherReason}
                highlights={subject.highlights}
              fastenerClass={subject.fastenerClass}
              paperAsset={subject.paperAsset}
              noteShape={subject.noteShape}
              rotation={subject.rotation}
              guideName={SUBJECT_LEARNERS[subject.key]?.name}
              guidePortrait={SUBJECT_LEARNERS[subject.key]?.portrait}
            />
          ))}
        </div>
      </section>
      <FolkArtsSection />
    </div>
  );
}
