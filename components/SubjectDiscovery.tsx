import Link from "next/link";
import Image from "next/image";

type SlimLesson = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  summary: string;
  gradeBand: string;
};

const SubjectIcon = ({ src, alt }: { src: string; alt: string }) => (
  <Image src={src} alt={alt} width={44} height={44} />
);

export const CLUSTERS = [
  { key: "words", title: "Words & Stories", tone: "words", icon: <SubjectIcon src="/icons/old-macdonald-icon-pack/topic-language.png" alt="" />, match: /literacy|phonics|language|reading|vocabulary/i },
  { key: "numbers", title: "Numbers & Making", tone: "numbers", icon: <SubjectIcon src="/icons/old-macdonald-icon-pack/topic-math.png" alt="" />, match: /math|numeracy|fine motor/i },
  { key: "music", title: "Music, Movement & Nature", tone: "music", icon: <SubjectIcon src="/icons/old-macdonald-icon-pack/topic-music-movement.png" alt="" />, match: /music|science|nature|motor|movement/i },
  { key: "heart", title: "Heart & Home", tone: "heart", icon: <SubjectIcon src="/icons/old-macdonald-icon-pack/topic-routines-regulation.png" alt="" />, match: /sel|social|emotional|routine|regulation/i },
] as const;

export function clusterFor(subject: string) {
  for (const c of CLUSTERS) {
    if (c.match.test(subject)) return c.key;
  }
  return "heart";
}

export function SubjectDiscovery({ lessons }: { lessons: SlimLesson[] }) {
  const buckets = CLUSTERS.map((c) => ({
    ...c,
    lessons: lessons.filter((l) => clusterFor(l.subject) === c.key),
  }));

  return (
    <section className="home-section discover-section" aria-label="Browse by subject">
      <div className="section-intro">
        <span className="eyebrow">Start with a subject</span>
        <h2>Discover by subject.</h2>
        <p>Four clusters, every grade band inside each one — the same theme grows from Daycare through Grade 2.</p>
      </div>
      <div className="cluster-grid">
        {buckets.map((c) => (
          <article className={`cluster-card stitch tone-${c.tone}`} key={c.key}>
            <div className="cluster-head">
              <span className="cluster-icon">{c.icon}</span>
              <h3>{c.title}</h3>
            </div>
            {c.lessons.length > 0 ? (
              <ul className="cluster-list">
                {c.lessons.slice(0, 4).map((l) => (
                  <li key={l.slug}>
                    <Link href={`/topics/${l.slug}`}>
                      <span className="cluster-list-body">
                        <span className="cluster-list-title">{l.title}</span>
                        <span className="cluster-list-meta"><span className="cluster-band">{l.gradeBand}</span><span className="cluster-ready">Ready</span></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cluster-empty">More {c.title.toLowerCase()} topics are on the way.</p>
            )}
            {c.lessons.length > 4 && (
              <Link className="cluster-more" href={`/topics?cluster=${c.key}`}>+{c.lessons.length - 4} more →</Link>
            )}
            {c.lessons.length > 0 && c.lessons.length <= 4 && (
              <Link className="cluster-more" href={`/topics?cluster=${c.key}`}>Browse {c.title.toLowerCase()} →</Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
