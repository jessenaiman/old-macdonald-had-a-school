import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "../SiteShell";
import { getCurriculumLessonBySlug } from "../../lib/curriculum-lesson";
import styles from "./CurriculumLessonPage.module.css";

interface Props {
  slug: string;
}

const FRAME_LABELS: Record<string, string> = {
  BC: "Belonging & Contributing",
  SRWB: "Self-Regulation & Well-Being",
  DLMB: "Literacy & Mathematics Behaviours",
  PSI: "Problem Solving & Innovating",
};

export async function CurriculumLessonPage({ slug }: Props) {
  const lesson = getCurriculumLessonBySlug(slug);
  if (!lesson) notFound();

  const focus = lesson.materials.filter(m => m.role === "focus");
  const supporting = lesson.materials.filter(m => m.role === "supporting");
  const songs = lesson.materials.filter(m => m.kind === "song");
  const resources = lesson.materials.filter(m => m.kind === "resource");

  // Group standards by framework
  const standardsByFramework = new Map<string, typeof lesson.standards>();
  for (const s of lesson.standards) {
    const list = standardsByFramework.get(s.framework) ?? [];
    list.push(s);
    standardsByFramework.set(s.framework, list);
  }

  const firstGrade = lesson.grades[0];

  return (
    <SiteShell active="topics">
      <div className={styles.page}>
        <article className={styles.lesson}>
          {/* ── Header ── */}
          <header className={styles.header}>
            <div className={styles.breadcrumb}>
              <Link href="/topics">Curriculum</Link>
              <span aria-hidden="true">›</span>
              <span>{lesson.subject}</span>
              <span aria-hidden="true">›</span>
              <span>{lesson.topic}</span>
            </div>
            <div className={styles.headerRow}>
              <div className={styles.titleBlock}>
                <h1 className={styles.title}>{lesson.topic}</h1>
                {lesson.skill && <p className={styles.skill}>{lesson.skill}</p>}
              </div>
              <div className={styles.badges}>
                {lesson.grades.map(g => (
                  <span key={g.label} className={styles.badge}>{g.label}{g.ageRange ? ` · ${g.ageRange}` : ""}</span>
                ))}
                {lesson.circleTime && <span className={styles.cycle}>Circle time: {lesson.circleTime}</span>}
                {lesson.pacing.length > 0 && (
                  <span className={styles.pacingBadge}>
                    Teach: {lesson.pacing.map(p => `${p.month}`).filter((v, i, a) => a.indexOf(v) === i).join(", ")}
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* ── Rapid glance: ratios ── */}
          <section className={styles.glance}>
            <div className={styles.glanceItem}><strong>{songs.length}</strong><span>songs &amp; rhymes</span></div>
            <div className={styles.glanceItem}><strong>{resources.length}</strong><span>resources</span></div>
            <div className={styles.glanceItem}><strong>{lesson.standards.length}</strong><span>standards</span></div>
            <div className={styles.glanceItem}><strong>{lesson.assets.length}</strong><span>printables</span></div>
          </section>

          {/* ── Curriculum focus ── */}
          <section className={styles.section}>
            <h2>Curriculum focus</h2>
            {standardsByFramework.size > 0 ? (
              [...standardsByFramework.entries()].map(([framework, list]) => (
                <div key={framework} className={styles.frameworkGroup}>
                  <h3>{framework}{framework.includes("Kindergarten") && <em> — full-day Kindergarten</em>}</h3>
                  <ul className={styles.standards}>
                    {list.map((s, i) => (
                      <li key={i}>
                        <strong>{s.code}</strong>
                        <span>{s.fullText}</span>
                        {s.frames && (
                          <small>{s.frames.split(",").map(f => FRAME_LABELS[f.trim()]).filter(Boolean).join(" · ")}</small>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className={styles.empty}>No verified standards are linked to this topic yet.</p>
            )}
          </section>

          {/* ── Focus materials ── */}
          {focus.length > 0 && (
            <section className={styles.section}>
              <h2>Focus materials <em className={styles.emphasis}>start here</em></h2>
              <div className={styles.materials}>
                {focus.slice(0, 8).map((m, i) => (
                  <MaterialCard key={`${m.kind}-${m.id}-${i}`} material={m} />
                ))}
              </div>
              {focus.length > 8 && <p className={styles.moreNote}>{focus.length - 8} more focus items in the full bank.</p>}
            </section>
          )}

          {/* ── Supporting bank ── */}
          {supporting.length > 0 && (
            <section className={styles.section}>
              <h2>Supporting bank</h2>
              <p className={styles.supportingNote}>Reinforce or vary the lesson with songs and resources on the same skill.</p>
              <div className={styles.materials}>
                {supporting.slice(0, 6).map((m, i) => (
                  <MaterialCard key={`${m.kind}-${m.id}-${i}`} material={m} compact />
                ))}
              </div>
              {supporting.length > 6 && <p className={styles.moreNote}>{supporting.length - 6} more supporting items in the full bank.</p>}
            </section>
          )}

          {/* ── Printables ── */}
          {lesson.assets.length > 0 && (
            <section className={styles.section}>
              <h2>Printable resources</h2>
              <div className={styles.assets}>
                {lesson.assets.map((a, i) => (
                  <a key={i} href={a.filePath || "#"} className={styles.asset} download>
                    <span className={styles.assetIcon} aria-hidden="true">{a.type === "poster" ? "🖼" : "📄"}</span>
                    <div>
                      <strong>{a.title}</strong>
                      <span>{a.type} {a.format && `• ${a.format.toUpperCase()}`}</span>
                    </div>
                    <span className={styles.downloadCue}>↓</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ── Teacher notes ── */}
          <section className={styles.notes}>
            <h2>Teacher planning notes</h2>
            <div className={styles.noteGrid}>
              <div className={styles.note}>
                <span className={styles.noteLabel}>Before learners arrive</span>
                <p>Gather focus materials and review the skill statement so you can name the goal aloud.</p>
              </div>
              <div className={styles.note}>
                <span className={styles.noteLabel}>As we learn</span>
                <p>Watch for whether children respond to the focus song or need the supporting bank as a slower entry.</p>
              </div>
              <div className={styles.note}>
                <span className={styles.noteLabel}>For next time</span>
                <p>Note which material children returned to, and whether the skill statement needs a different entry point.</p>
              </div>
            </div>
          </section>

          {/* ── Tags + back ── */}
          {lesson.tags.length > 0 && (
            <div className={styles.tags}>
              {lesson.tags.map((tag, i) => <span key={i} className={styles.tag}>{tag}</span>)}
            </div>
          )}
          <div className={styles.back}>
            <Link href="/topics">← Back to curriculum</Link>
          </div>
        </article>
      </div>
    </SiteShell>
  );
}

function MaterialCard({ material, compact = false }: {
  material: { kind: string; title: string; lyrics?: string | null; actions?: string | null; instructions?: string | null; url?: string | null };
  compact?: boolean;
}) {
  return (
    <div className={`${styles.material} ${compact ? styles.materialCompact : ""}`}>
      <div className={styles.materialHeader}>
        <span className={styles.materialKind}>{material.kind}</span>
        {material.url && <a className={styles.external} href={material.url} target="_blank" rel="noopener noreferrer">source ↗</a>}
      </div>
      <h3 className={styles.materialTitle}>{material.title}</h3>
      {(material.lyrics || material.actions || material.instructions) && (
        <details className={styles.materialDetail}>
          <summary>{material.lyrics ? "Preview lyrics" : material.actions ? "Preview actions" : "Preview"}</summary>
          {material.lyrics && <pre className={styles.lyrics}>{material.lyrics}</pre>}
          {material.actions && <p className={styles.actions}>{material.actions}</p>}
          {material.instructions && <p className={styles.instructions}>{material.instructions}</p>}
        </details>
      )}
    </div>
  );
}