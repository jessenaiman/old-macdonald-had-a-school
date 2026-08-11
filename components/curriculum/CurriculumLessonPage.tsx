import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "../SiteShell";
import { getCurriculumLessonBySlug, type CurriculumLesson } from "../../lib/curriculum-lesson";
import styles from "./CurriculumLessonPage.module.css";

interface Props {
  slug: string;
}

export async function CurriculumLessonPage({ slug }: Props) {
  const lesson = getCurriculumLessonBySlug(slug);
  if (!lesson) notFound();

  return (
    <SiteShell active="topics">
      <div className={styles.page}>
        <article className={styles.lesson}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.breadcrumb}>
              <Link href="/topics">Curriculum</Link>
              <span aria-hidden="true">›</span>
              <span>{lesson.subject}</span>
              <span aria-hidden="true">›</span>
              <span>{lesson.topic}</span>
            </div>
            <h1 className={styles.title}>{lesson.topic}</h1>
            {lesson.skillStatement && (
              <p className={styles.skill}>{lesson.skillStatement}</p>
            )}
            <div className={styles.meta}>
              {lesson.grades.length > 0 && (
                <span className={styles.badge}>{lesson.grades.join(', ')}</span>
              )}
              {lesson.ageRange && (
                <span className={styles.age}>{lesson.ageRange}</span>
              )}
              {lesson.category && (
                <span className={styles.category}>{lesson.category}</span>
              )}
            </div>
          </header>

          {/* Standards */}
          {lesson.standards.length > 0 && (
            <section className={styles.section}>
              <h2>Standards</h2>
              <ul className={styles.standards}>
                {lesson.standards.map((s, i) => (
                  <li key={i}>
                    <strong>{s.code}</strong>
                    <span>{s.fullText}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tags */}
          {lesson.tags.length > 0 && (
            <section className={styles.section}>
              <h2>Tags</h2>
              <div className={styles.tags}>
                {lesson.tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </section>
          )}

          {/* Materials */}
          {lesson.materials.length > 0 && (
            <section className={styles.section}>
              <h2>Materials</h2>
              <div className={styles.materials}>
                {lesson.materials.map((m, i) => (
                  <div key={i} className={styles.material}>
                    <div className={styles.materialHeader}>
                      <span className={styles.materialKind}>{m.kind}</span>
                      {m.role && <span className={styles.role}>{m.role}</span>}
                      {m.useInPhase && <span className={styles.phase}>{m.useInPhase}</span>}
                    </div>
                    <h3 className={styles.materialTitle}>{m.title}</h3>
                    {m.lyrics && (
                      <details className={styles.lyrics}>
                        <summary>View lyrics</summary>
                        <pre>{m.lyrics}</pre>
                      </details>
                    )}
                    {m.actions && (
                      <details className={styles.actions}>
                        <summary>View actions</summary>
                        <p>{m.actions}</p>
                      </details>
                    )}
                    {m.url && (
                      <a href={m.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        Open resource →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Assets */}
          {lesson.assets.length > 0 && (
            <section className={styles.section}>
              <h2>Printable Resources</h2>
              <div className={styles.assets}>
                {lesson.assets.map((a, i) => (
                  <a key={i} href={a.filePath || '#'} className={styles.asset} download>
                    <Image
                      src={a.type === 'poster' ? '/icons/document-poster.png' : '/icons/document-worksheet.png'}
                      alt=""
                      width={48}
                      height={48}
                    />
                    <div>
                      <strong>{a.title}</strong>
                      <span>{a.type} {a.format && `• ${a.format.toUpperCase()}`}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Pacing */}
          {lesson.pacing.length > 0 && (
            <section className={styles.section}>
              <h2>When to Teach</h2>
              <div className={styles.pacing}>
                {lesson.pacing.map((p, i) => (
                  <span key={i} className={styles.week}>
                    Week {p.week} • {p.month}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Teacher Notes */}
          <section className={styles.notes}>
            <h2>Teacher Planning Notes</h2>
            <div className={styles.noteGrid}>
              <div className={styles.note}>
                <h3>Before learners arrive</h3>
                <p>Gather materials and review the skill focus.</p>
              </div>
              <div className={styles.note}>
                <h3>As we learn</h3>
                <p>Watch for student engagement and understanding.</p>
              </div>
              <div className={styles.note}>
                <h3>For next time</h3>
                <p>Note what to repeat or extend.</p>
              </div>
            </div>
          </section>

          {/* Back link */}
          <div className={styles.back}>
            <Link href="/topics">← Back to curriculum</Link>
          </div>
        </article>
      </div>
    </SiteShell>
  );
}
