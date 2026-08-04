import Image from "next/image";
import Link from "next/link";
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
  { label: "Daycare", age: "0–2 yrs", href: "/daycare", leadKeys: ["miss-puddles"], tone: "yellow", note: "Lap and floor learning", cta: "Open Daycare lessons" },
  { label: "Preschool", age: "3–4 yrs", href: "/preschool", leadKeys: ["miss-puddles", "miss-maisy"], tone: "orange", note: "Story and sensation", cta: "Open Preschool lessons" },
  { label: "Kindergarten", age: "4–5 yrs", href: "/kindergarten", leadKeys: ["mr-rusty"], tone: "blue", note: "Music and movement", cta: "Open Kindergarten lessons" },
  { label: "Grade 1", age: "5–6 yrs", href: "/band/grade-one", leadKeys: ["mr-rusty", "miss-hayley"], tone: "pink", note: "Reading and rhythm", cta: "Open Grade 1 lessons" },
  { label: "Grade 2", age: "6–7 yrs", href: "/band/grade-two", leadKeys: ["miss-hayley", "mr-sam"], tone: "teal", note: "Thinking and making", cta: "Open Grade 2 lessons" },
] as const;

const SUBJECTS = [
  { key: "language", filterKey: "words", label: "Language & Communication", leadKey: "miss-hayley", match: /literacy|phonics|language|reading|vocabulary/i },
  { key: "math", filterKey: "numbers", label: "Math & Inquiry", leadKey: "mr-sam", match: /math|numeracy/i },
  { key: "music", filterKey: "music", label: "Music, Movement & Community", leadKey: "mr-rusty", match: /music|movement/i },
  { key: "routines", filterKey: "heart", label: "Routines & Regulation", leadKey: "miss-puddles", match: /sel|social|emotional|routine|regulation/i },
] as const;

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

    return { ...subject, rows, lead: staffFor(subject.leadKey) };
  });

  const featured = { title: "A Barn Band Day", gradeBand: "Preschool" };

  return (
    <div className="home-page">
      <section className="home-hero-board" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-kicker">Old MacDonald Had a School · Teacher Resources</p>
          <h1 id="home-title">A better place to begin tomorrow’s lesson.</h1>
          <p className="home-hero-byline">Where familiar songs become new places to learn.</p>
        </div>
        <figure className="home-hero-art">
          <div className="home-hero-image-wrap">
            <Image src="/scenes/old-mac-and-barnyard-music-circle.png" alt="Old MacDonald leading a barnyard music circle with the students" fill priority sizes="(max-width: 760px) 92vw, 42vw" />
          </div>
        </figure>
      </section>

      <section className="band-ribbon" aria-labelledby="band-title">
        <div className="section-heading section-heading-wide">
          <div><p className="eyebrow">Choose a starting place</p><h2 id="band-title">The school day, by band.</h2></div>
          <p>Choose an age or grade to see lesson posts suited to that stage.</p>
        </div>
        <div className="band-grid">
          {BANDS.map((band) => {
            const leads = band.leadKeys.map(staffFor).filter((member) => member !== undefined);
            return (
              <Link className={`band-card band-card-${band.tone}`} href={band.href} key={band.label} aria-label={`${band.cta}. ${band.note}.`}>
                <div className="band-card-leads" aria-label={`Led by ${leads.map((member) => member.name).join(" and ")}`}>
                  {leads.map((member) => <CharacterBadge key={member.key} charKey={member.key} color={member.color} name={member.name} size={44} shape="square" />)}
                </div>
                <div className="band-card-copy">
                  <p>{band.age}</p>
                  <h3>{band.label}</h3>
                  <span>{band.note}</span>
                  <small>Led by {leads.map((member) => member.name).join(" & ")}</small>
                  <b>{band.cta} <span aria-hidden="true">→</span></b>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="paper-section discover-home" aria-labelledby="discover-title">
        <div className="subject-section-intro">
          <h2 id="discover-title">Browse by Subject</h2>
          <p>Topics are organized into four subject clusters. Each cluster spans the available age and grade bands.</p>
        </div>
        <div className="subject-grid">
          {subjectGroups.map((group) => (
            <article className={`subject-card subject-${group.key}`} key={group.key}>
              <header className="subject-card-head">
                {group.lead ? <CharacterBadge className="subject-lead-icon" charKey={group.lead.key} color={group.lead.color} name={group.lead.name} size={46} shape="square" /> : null}
                <div><h3>{group.label}</h3>{group.lead ? <small>Guided by {group.lead.name}</small> : null}</div>
              </header>
              <ul className="subject-lesson-list">
                {group.rows.slice(0, 4).map((lesson) => (
                  <li key={lesson.slug}>
                    <Link href={lesson.href}>
                      <span className="subject-lesson-title">{lesson.title}</span>
                      <span className="subject-lesson-meta"><span>{shortBand(lesson.gradeBand)}</span><b>Ready</b></span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="subject-more" href={group.key === "routines" ? "/preschool" : `/topics?cluster=${group.filterKey}`}>
                {group.rows.length > 4 ? `+ ${group.rows.length - 4} more` : `Browse all ${group.label.toLowerCase()}`} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="teacher-path" aria-labelledby="path-title">
        <div className="teacher-path-copy"><p className="eyebrow">Plan from the lesson, not a catalogue</p><h2 id="path-title">A clear path through tomorrow’s lesson.</h2><p>This site organizes resources in the order a teacher actually uses them: introduce the idea, teach it together, let students practise, and check what they understood.</p><Link className="farm-button farm-button-navy" href="/preschool">Open a real starting point <span aria-hidden="true">→</span></Link></div>
        <ol className="teacher-path-steps"><li><span>01</span><strong>Choose one starting resource</strong><small>Every topic begins with a selected video, printable or activity.</small></li><li><span>02</span><strong>Teach together</strong><small>Teacher and student actions stay separate and easy to scan.</small></li><li><span>03</span><strong>Look for learning</strong><small>Check what children understood, then search with a purpose.</small></li></ol>
      </section>

      <section className="feature-resource" aria-labelledby="feature-title">
        <div className="feature-resource-copy"><p className="eyebrow">{featured.gradeBand} · real activity page</p><h2 id="feature-title">{featured.title}</h2><p>Children choose an instrument, keep a beat, and share with a peer — a hands-on preschool routine with an illustrated activity page, ready to open and use.</p><Link className="farm-button farm-button-red" href="/preschool">Open Preschool lessons <span aria-hidden="true">→</span></Link></div>
        <div className="feature-resource-art"><Image src="/scenes/early-years-worksheet-example.png" alt="A Barn Band Day preschool instrument activity page" fill sizes="(max-width: 760px) 92vw, 44vw" /></div>
      </section>

      <p className="home-cast-link"><Link href="/cast">Meet the farm-school cast <span aria-hidden="true">→</span></Link></p>
    </div>
  );
}
