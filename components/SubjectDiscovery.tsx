import Link from "next/link";
import { lessonHref } from "../lib/grade-routes";
import { BrandIcon } from "./brand-icon";

type SlimLesson = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  summary: string;
  grade: string;
};

export const CLUSTERS = [
  { key: "words", title: "Words & Stories", tone: "words", icon: <BrandIcon icon="acting-theatre-masks" size="small" />, match: /literacy|phonics|language|reading|vocabulary/i },
  { key: "numbers", title: "Numbers & Making", tone: "numbers", icon: <BrandIcon icon="math-abacus-ruler" size="small" />, match: /math|numeracy|fine motor/i },
  { key: "music", title: "Music, Movement & Nature", tone: "music", icon: <BrandIcon icon="music-banjo" size="small" />, match: /music|science|nature|motor|movement/i },
  { key: "heart", title: "Heart & Home", tone: "heart", icon: <BrandIcon icon="health-gingham-lunch" size="small" />, match: /sel|social|emotional|routine|regulation/i },
] as const;

const TONE_SURFACE = {
  words: "border-[var(--subject-language-color)]/45 bg-[color-mix(in_srgb,var(--card)_86%,transparent)]",
  numbers: "border-[var(--subject-math-color)]/45 bg-[color-mix(in_srgb,var(--card)_86%,transparent)]",
  music: "border-[var(--subject-music-color)]/45 bg-[color-mix(in_srgb,var(--card)_86%,transparent)]",
  heart: "border-[var(--subject-health-color)]/45 bg-[color-mix(in_srgb,var(--card)_86%,transparent)]",
} as const;

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
    <section className="w-full" aria-label="Browse by subject">
      <div className="mb-4 flex min-w-0 flex-col gap-2">
        <span className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
          Start with a subject
        </span>
        <h2>Discover by subject.</h2>
        <p>Four clusters, every grade inside each one — the same theme grows from Daycare through Grade 2.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {buckets.map((c) => (
          <article key={c.key} className={`rounded-xl border bg-card p-4 shadow-sm ${TONE_SURFACE[c.tone]}`}>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background p-2">
                {c.icon}
              </span>
              <h3>{c.title}</h3>
            </div>
            {c.lessons.length > 0 ? (
              <ul className="grid gap-2">
                {c.lessons.slice(0, 4).map((l) => (
                  <li key={l.slug}>
                    <Link href={lessonHref(l)}>
                      <span className="block rounded-md border border-transparent bg-card/60 p-2 transition-colors hover:bg-card">
                        <span className="block text-sm font-medium">{l.title}</span>
                        <span className="mt-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                          <span>{l.grade}</span>
                          <span className="text-[10px] font-black">Ready</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                More {c.title.toLowerCase()} topics are on the way.
              </p>
            )}
            <Link
              className="mt-3 inline-flex text-sm font-black text-primary"
              href={`/topics?cluster=${c.key}`}
            >
              {c.lessons.length > 4 ? `+${c.lessons.length - 4} more ` : `Browse ${c.title.toLowerCase()} `}
              →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
