import Image from "next/image";
import Link from "next/link";
import { LuBookOpen, LuListOrdered, LuMusic2, LuSprout } from "react-icons/lu";

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
  { label: "Daycare & Preschool", href: "/daycare", avatar: "/staff_and_students/miss-puddles-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-circle.png", tone: "early-years" },
  { label: "Kindergarten", href: "/kindergarten", avatar: "/staff_and_students/mr-rusty-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/03-mr-rusty-circle.png", tone: "kindergarten" },
  { label: "Grade 1", href: "/band/grade-one", avatar: "/staff_and_students/miss-hayley-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-circle.png", tone: "grade-one" },
  { label: "Grade 2", href: "/band/grade-two", avatar: "/staff_and_students/mr-sam-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/05-mr-sam-circle.png", tone: "grade-two" },
] as const;

const SUBJECTS = [
  { key: "language", filterKey: "words", label: "Language & Communication", Icon: LuBookOpen, tone: "words", rows: [
    { title: "Story Time: Board Books", grade: "Daycare", href: "/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
    { title: "Show & Tell Story Circle", grade: "Preschool", href: "/preschool", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
    { title: "Phonics: Long & Short Vowel Sounds", grade: "Gr 1", href: "/band/grade-one", staffAsset: "/staff_and_students/miss-hayley-transparent-circle.png", ready: true },
    { title: "Rhyming & Sound Play", grade: "Gr 1", href: "/band/grade-one", staffAsset: "/staff_and_students/miss-hayley-transparent-circle.png" },
  ], more: 1 },
  { key: "math", filterKey: "numbers", label: "Math & Inquiry", Icon: LuListOrdered, tone: "numbers", rows: [
    { title: "Sensory Tray Exploration", grade: "Daycare", href: "/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
    { title: "Shape Hunt Outdoors", grade: "Preschool", href: "/preschool", staffAsset: "/staff_and_students/mr-maisy-transparent-circle.png" },
    { title: "Nature Observation Journal", grade: "Gr 1", href: "/band/grade-one", staffAsset: "/staff_and_students/mr-puddles-transparent-circle.png" },
    { title: "Adding with Equal Groups", grade: "Gr 2", href: "/band/grade-two", staffAsset: "/staff_and_students/mr-sam-transparent-circle.png" },
  ], more: 1 },
  { key: "music", filterKey: "music", label: "Music, Movement & Community", Icon: LuMusic2, tone: "music", rows: [
    { title: "Barnyard Animal Sounds & Action Imitation", grade: "Daycare", href: "/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png", ready: true },
    { title: "Circle Time Songs", grade: "Daycare", href: "/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
    { title: "Fingerplay & Movement", grade: "Daycare", href: "/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
    { title: "Follow the Music Trail", grade: "Preschool", href: "/preschool", staffAsset: "/staff_and_students/mr-rusty-transparent-circle.png" },
  ], more: 2 },
  { key: "routines", filterKey: "heart", label: "Routines & Regulation", Icon: LuSprout, tone: "heart", rows: [
    { title: "Mix, Measure & Munch", grade: "Preschool", href: "/preschool", staffAsset: "/staff_and_students/miss-maisy-transparent-circle.png", ready: true },
  ], more: 0 },
];

export function HomePage({}: HomePageProps) {
  return (
    <div className="home-page">
      <section className="band-ribbon" aria-label="Choose a grade">
        <div className="band-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {BANDS.map((band) => {
            return (
              <Link className={`band-card band-card-${band.tone}`} href={band.href} key={band.label} aria-label={band.label}>
                <div className="band-card-leads">
                  <span className="band-card-avatar">
                    <Image className="band-card-avatar-patch" src={band.patch} alt="" width={64} height={64} sizes="64px" />
                    <Image className="band-card-avatar-image" src={band.avatar} alt="" width={52} height={52} sizes="52px" />
                  </span>
                </div>
                <div className="band-card-copy">
                  <h3>{band.label}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-hero-board" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-kicker">Old MacDonald Had a School · Teacher Resources</p>
          <h1 id="home-title">A better place to begin tomorrow’s lesson.</h1>
          <p className="home-hero-byline">Where familiar songs become new places to learn.</p>
          <p className="home-hero-summary">One clear teaching sequence, one carefully selected starting resource, and better searches when you need another option.</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/topics">Browse lesson topics</Link>
            <Link className="text-link" href="/about">Why this site exists <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <figure className="home-hero-art">
          <div className="home-hero-image-wrap">
            <Image src="/scenes/old-mac-and-barnyard-music-circle.png" alt="Old MacDonald leading a barnyard music circle with the children" fill priority sizes="(max-width: 760px) 86vw, 350px" />
          </div>
        </figure>
      </section>

      <section className="discover-home" aria-labelledby="discover-title">
        <div className="subject-section-intro">
          <h2 id="discover-title">Browse by Subject</h2>
          <p>Topics are organized into four subject clusters. Each cluster spans all grade bands so one theme can grow with your students.</p>
        </div>
        <div className="subject-grid">
          {SUBJECTS.map((group) => {
            const SubjectIcon = group.Icon;
            return (
              <article className={`subject-card subject-${group.tone}`} key={group.key}>
                <header className="subject-card-head">
                  <span className="subject-icon" aria-hidden="true"><SubjectIcon /></span>
                  <h3>{group.label}</h3>
                </header>
                <ul className="subject-lesson-list">
                  {group.rows.map((lesson) => (
                    <li key={lesson.title}>
                      <Link href={lesson.href}>
                        <span className="subject-row-icon" aria-hidden="true">
                          <Image src={lesson.staffAsset} alt="" width={28} height={28} sizes="28px" />
                        </span>
                        <span className="subject-lesson-title">{lesson.title}</span>
                        <span className="subject-lesson-meta"><span>{lesson.grade}</span>{lesson.ready && <b>Ready</b>}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {group.more > 0 && <Link className="subject-more" href={`/topics?cluster=${group.filterKey}`}>+ {group.more} more...</Link>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="feature-resource" aria-labelledby="feature-title">
        <div className="feature-resource-copy"><p className="eyebrow">Preschool · real activity page</p><h2 id="feature-title">A Barn Band Day</h2><p>Children choose an instrument, keep a beat, and share with a peer — a hands-on preschool routine with an illustrated activity page, ready to open and use.</p><Link className="farm-button farm-button-red" href="/preschool">Open Preschool Lessons <span className="farm-button-arrow" aria-hidden="true">→</span></Link></div>
        <div className="feature-resource-art"><Image src="/scenes/early-years-worksheet-example.png" alt="A Barn Band Day preschool instrument activity page" fill sizes="(max-width: 760px) 92vw, 44vw" /></div>
      </section>
    </div>
  );
}
