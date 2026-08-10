"use client";

import Link from "next/link";
import {
  GradePlanningNotes,
  GradePathways,
  GradeRail,
  GradeTeacherPanel,
  type GradePathItem,
} from "../builder/CurriculumTemplates";
import workStyles from "../builder/CurriculumTemplates.module.css";

export type DefaultGradeTemplateProps = {
  gradeKey: string;
  grade: string;
  age: string;
  badge: string;
  reminder: string;
  greeting: string;
  eyebrow?: string;
  headline: string;
  accentHeadline: string;
  summary: string;
  leadName: string;
  leadImage: string;
  leadQuote: string;
  items: GradePathItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
  onPreview?: () => void;
  showNotesLink?: boolean;
  gradeClassName: string;
  wallClassNames?: string[];
};

export function DefaultGradeTemplate({
  gradeKey,
  grade,
  age,
  badge,
  reminder,
  greeting,
  eyebrow,
  headline,
  accentHeadline,
  summary,
  leadName,
  leadImage,
  leadQuote,
  items,
  activeIndex = 0,
  onSelect,
  onPreview,
  showNotesLink = false,
  gradeClassName,
  wallClassNames = [],
}: DefaultGradeTemplateProps) {
  const currentItem = items[activeIndex] ?? items[0];

  return (
    <div
      className={[
        workStyles.wall,
        workStyles.gradeWall,
        ...wallClassNames,
        gradeClassName,
        "block! w-full! max-w-[1480px]! min-h-0! mx-auto! mt-0! mb-8! md:grid! md:grid-cols-[220px_minmax(0,1fr)]! md:mt-6! md:mb-14! xl:grid-cols-[240px_minmax(0,1fr)]!",
      ].join(" ")}
      data-grade-template={gradeKey}
    >
      <GradeRail grade={grade} age={age} badge={badge} reminder={reminder} />
      <main className={workStyles.stage}>
        <span className={workStyles.pageGreeting}>{greeting}</span>
        <section className={workStyles.hero} id="today">
          <div className={workStyles.heroCopy}>
            {eyebrow ? <span className={workStyles.eyebrow}>{eyebrow}</span> : null}
            <h1>{headline}<em>{accentHeadline}</em></h1>
            <p>{summary}</p>
            <div className={workStyles.heroActions}>
              {currentItem?.href ? (
                <Link href={currentItem.href} className={workStyles.feltButton}>Build this lesson</Link>
              ) : onPreview ? (
                <button type="button" className={workStyles.feltButton} onClick={onPreview}>Preview the story</button>
              ) : (
                <a href="#curriculum" className={workStyles.feltButton}>Choose a learning path</a>
              )}
              <a href="#curriculum" className={workStyles.paperButton}>Browse learning paths</a>
            </div>
          </div>
          <GradeTeacherPanel
            leadName={leadName}
            leadImage={leadImage}
            leadQuote={leadQuote}
            showNotesLink={showNotesLink}
          />
        </section>
        <GradePathways grade={grade} items={items} activeIndex={activeIndex} onSelect={onSelect} />
        <GradePlanningNotes grade={grade} item={currentItem} href={currentItem?.href} />
      </main>
    </div>
  );
}
