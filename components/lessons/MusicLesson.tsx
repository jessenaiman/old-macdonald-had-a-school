import { getLessonSections, type LessonEntry } from "../../lib/content/lessons";
import { LessonHeader } from "./LessonHeader";
import { LessonMarkdown } from "./LessonMarkdown";

export function MusicLesson({ lesson }: { lesson: LessonEntry }) {
  const sections = getLessonSections(lesson.body);
  const core = sections.find((section) => /^(song|sing|listen)$/i.test(section.heading)) ?? sections[0];
  const supports = sections.filter((section) => section !== core);

  return (
    <article className="lesson-article lesson-article--music" data-template="music">
      <LessonHeader lesson={lesson} templateLabel="Music" />
      <section className="lesson-core lesson-core--music" aria-labelledby="music-core-heading">
        <p className="lesson-section-label">Core song</p>
        <h2 id="music-core-heading">{core.heading}</h2>
        <LessonMarkdown source={core.body} />
      </section>
      <div className="lesson-supports lesson-supports--music" aria-label="Music lesson supports">
        {supports.map((section) => (
          <section className="lesson-support lesson-support--music" key={section.heading}>
            <h2>{section.heading}</h2>
            <LessonMarkdown source={section.body} />
          </section>
        ))}
      </div>
    </article>
  );
}
