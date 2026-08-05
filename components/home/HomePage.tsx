import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import { LuArrowUpRight, LuBookOpen, LuCalculator, LuLeaf, LuMusic2 } from "react-icons/lu";
import { CharacterBadge } from "../CharacterBadge";
import { STAFF } from "../../lib/cast";

type SlimLesson = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  summary: string;
  gradeBand: string;
};

type HomePageProps = {
  hero: { eyebrow?: string; title?: string; summary?: string };
  lessons: SlimLesson[];
};

const BANDS = [
  { label: "Early Years", age: "0-4 yrs", href: "/daycare", leadKeys: ["miss-puddles"], tone: "early-years", subtitle: "Daycare & Preschool", lessons: "9 lessons" },
  { label: "Kindergarten", age: "4-5 yrs", href: "/kindergarten", leadKeys: ["mr-rusty"], tone: "kindergarten", subtitle: "Music and movement", lessons: "4 lessons" },
  { label: "Grade 1", age: "5-6 yrs", href: "/band/grade-one", leadKeys: ["mr-rusty", "miss-hayley"], tone: "grade-one", subtitle: "Reading and rhythm", lessons: "4 lessons" },
  { label: "Grade 2", age: "6-7 yrs", href: "/band/grade-two", leadKeys: ["miss-hayley", "mr-sam"], tone: "grade-two", subtitle: "Thinking and making", lessons: "4 lessons" },
] as const;

const SUBJECTS: {
  key: string;
  filterKey: string;
  label: string;
  match: RegExp;
  tone: string;
  Icon: IconType;
}[] = [
  { key: "language", filterKey: "words", label: "Language & Communication", match: /literacy|phonics|language|reading|vocabulary/i, tone: "words", Icon: LuBookOpen },
  { key: "math", filterKey: "numbers", label: "Math & Inquiry", match: /math|mathematics|numeracy|science|inquiry/i, tone: "numbers", Icon: LuCalculator },
  { key: "music", filterKey: "music", label: "Music, Movement & Community", match: /music|movement|community/i, tone: "music", Icon: LuMusic2 },
  { key: "routines", filterKey: "heart", label: "Routines & Regulation", match: /sel|social|emotional|routine|regulation|health/i, tone: "heart", Icon: LuLeaf },
];

function staffFor(key: string) {
  return STAFF.find((member) => member.key === key);
}

function shortBand(gradeBand: string) {
  if (/Grade 1.*2|Grade 1–2/i.test(gradeBand)) return "Gr 1–2";
  if (/Grade 2/i.test(gradeBand)) return "Gr 2";
  if (/Grade 1/i.test(gradeBand)) return "Gr 1";
  if (/Daycare/i.test(gradeBand)) return "Daycare";
  if (/Preschool/i.test(gradeBand)) return "Preschool";
  const ages = gradeBand.match(/Ages?\s+([0-9]+)[–-]([0-9]+)/i);
  return ages ? `Ages ${ages[1]}–${ages[2]}` : gradeBand;
}

export function HomePage({ lessons }: HomePageProps) {
  const subjectGroups = SUBJECTS.map((subject) => {
    const published = lessons
      .filter((lesson) => subject.match.test(`${lesson.subject} ${lesson.category}`))
      .map((lesson) => ({ ...lesson, href: `/topics/${lesson.slug}` }));
    const rows = subject.key === "routines"
      ? [{ slug: "mix-measure-munch", title: "Mix, Measure & Munch", subject: "Routines", category: "Preschool routine", summary: "", gradeBand: "Preschool", href: "/preschool" }, ...published]
      : published;
    return { ...subject, rows };
  });

  return (
    <div className="home-page">
      <section className="band-ribbon" aria-label="Choose a grade">
        <div className="band-grid">
          {BANDS.map((band) => {
            const leads = band.leadKeys.map(staffFor).filter((member) => member !== undefined);
            return (
              <Link className={`band-card band-card-${band.tone}`} href={band.href} key={band.label} aria-label={`${band.label}: ${band.lessons}`}>
                <div className="band-card-leads" aria-label={`Led by ${leads.map((member) => member.name).join(" and ")}`}>
                  <CharacterBadge charKey={leads[0]?.key ?? ""} color={leads[0]?.color ?? "transparent"} name={leads[0]?.name ?? ""} size={66} />
                </div>
                <div className="band-card-copy">
                  <p>{band.age}</p>
                  <h3>{band.label}</h3>
                  <span>{band.subtitle}</span>
                  <small>Led by {leads.map((member) => member.name).join(" & ")}</small>
                  <b>{band.lessons} <span aria-hidden="true">→</span></b>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-hero-board" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-kicker">Music · Learning · Visual storytelling</p>
          <h1 id="home-title">Old MacDonald Had a School</h1>
          <p className="home-hero-byline">by Jesse Neiman</p>
          <p className="home-hero-summary">Where familiar songs become new places to learn.</p>
        </div>
        <figure className="home-hero-art">
          <div className="home-hero-image-wrap">
            <Image src="/scenes/old-macs-open-circle-gathering.png" alt="Old MacDonald's farm school gathering" fill priority sizes="(max-width: 760px) 92vw, 30vw" />
          </div>
        </figure>
      </section>

      <section className="discover-home" aria-labelledby="discover-title">
        <div className="subject-section-intro">
          <h2 id="discover-title">Browse by Subject</h2>
          <p>Topics are organized into four subject clusters. Each cluster spans all grade bands so one theme can grow with your students.</p>
        </div>
        <div className="subject-grid">
          {subjectGroups.map((group) => {
            const Icon = group.Icon;
            return (
              <article className={`subject-card subject-${group.tone}`} key={group.key}>
                <header className="subject-card-head">
                  <span className="subject-icon"><Icon aria-hidden="true" /></span>
                  <h3>{group.label}</h3>
                </header>
                <ul className="subject-lesson-list">
                  {group.rows.slice(0, 4).map((lesson) => (
                    <li key={lesson.slug}>
                      <Link href={lesson.href}>
                        <span className="subject-row-icon"><Icon aria-hidden="true" /></span>
                        <span className="subject-lesson-title">{lesson.title}</span>
                        <span className="subject-lesson-meta"><span>{shortBand(lesson.gradeBand)}</span><b>Ready</b></span>
                      </Link>
                    </li>
                  ))}
                  {!group.rows.length && <li className="subject-empty" />}
                </ul>
                {group.rows.length > 4 && <Link className="subject-more" href={group.key === "routines" ? "/preschool" : `/topics?cluster=${group.filterKey}`}>+ {group.rows.length - 4} more...</Link>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="feature-resource" aria-labelledby="feature-title">
        <div className="feature-resource-copy"><p className="eyebrow">Preschool · real activity page</p><h2 id="feature-title">A Barn Band Day</h2><p>Children choose an instrument, keep a beat, and share with a peer — a hands-on preschool routine with an illustrated activity page, ready to open and use.</p><Link className="farm-button farm-button-red" href="/preschool">Open Preschool lessons <LuArrowUpRight aria-hidden="true" /></Link></div>
        <div className="feature-resource-art"><Image src="/scenes/early-years-worksheet-example.png" alt="A Barn Band Day preschool instrument activity page" fill sizes="(max-width: 760px) 92vw, 44vw" /></div>
      </section>
    </div>
  );
}
