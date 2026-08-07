import Image from "next/image";
import Link from "next/link";

type SlimLesson = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  summary: string;
  grade: string;
};

type HomePageProps = {
  hero: { eyebrow?: string; title?: string; summary?: string };
  lessons: SlimLesson[];
};

const SUBJECTS = [
  { key: "language", filterKey: "words", label: "Language & Communication", icon: "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png", tone: "words", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png", fastenerStyle: "paperclip", rows: [
    { title: "Story Time: Board Books", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
    { title: "Show & Tell Story Circle", grade: "Pre-School", href: "/grade/pre-school", staffAsset: "/staff_and_students/miss-maisy-transparent-circle.png" },
    { title: "Phonics: Long & Short Vowel Sounds", grade: "Gr 1", href: "/grade/grade-one", staffAsset: "/staff_and_students/miss-hayley-transparent-circle.png", ready: true },
    { title: "Rhyming & Sound Play", grade: "Gr 1", href: "/grade/grade-one", staffAsset: "/staff_and_students/miss-hayley-transparent-circle.png" },
  ], more: 1 },
  { key: "math", filterKey: "numbers", label: "Math & Inquiry", icon: "/brand-kit-icon-sheets/individual-icons/subject-math-building.png", tone: "numbers", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png", fastenerStyle: "pushpin", rows: [
    { title: "Sensory Tray Exploration", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
    { title: "Shape Hunt Outdoors", grade: "Pre-School", href: "/grade/pre-school", staffAsset: "/staff_and_students/miss-maisy-transparent-circle.png" },
    { title: "Nature Observation Journal", grade: "Gr 1", href: "/grade/grade-one", staffAsset: "/staff_and_students/mr-puddles-transparent-circle.png" },
    { title: "Adding with Equal Groups", grade: "Gr 2", href: "/grade/grade-two", staffAsset: "/staff_and_students/mr-sam-transparent-circle.png" },
  ], more: 1 },
  { key: "music", filterKey: "music", label: "Music, Movement & Community", icon: "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png", tone: "music", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/06-washi-tape.png", fastenerStyle: "tape", rows: [
    { title: "Barnyard Animal Sounds & Action Imitation", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png", ready: true },
    { title: "Circle Time Songs", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
    { title: "Fingerplay & Movement", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
    { title: "Follow the Music Trail", grade: "Pre-School", href: "/grade/pre-school", staffAsset: "/staff_and_students/mr-rusty-transparent-circle.png" },
  ], more: 2 },
  { key: "routines", filterKey: "heart", label: "Routines & Regulation", icon: "/brand-kit-icon-sheets/individual-icons/subject-community-leadership.png", tone: "heart", fastener: "/design-assets/classroom-fasteners-v1/individual-icons/04-binder-clip.png", fastenerStyle: "clip", rows: [
    { title: "Mix, Measure & Munch", grade: "Pre-School", href: "/grade/pre-school", staffAsset: "/staff_and_students/miss-maisy-transparent-circle.png", ready: true },
  ], more: 0 },
];

export function HomePage({}: HomePageProps) {
  return (
    <div className="home-page">
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

      <section className="discover-home subject-bulletin" aria-labelledby="discover-title">
        <div className="subject-section-intro">
          <h2 id="discover-title">Browse by Subject</h2>
          <p>Topics are organized into four subject clusters. Each cluster spans every grade so one theme can grow with your students.</p>
        </div>
        <div className="subject-grid">
          {SUBJECTS.map((group) => {
            return (
              <article className={`subject-card subject-${group.tone}`} key={group.key}>
                <Image className={`subject-fastener subject-fastener-${group.fastenerStyle}`} src={group.fastener} alt="" width={76} height={76} aria-hidden="true" />
                <header className="subject-card-head">
                  <span className="subject-icon" aria-hidden="true"><Image src={group.icon} alt="" width={42} height={42} /></span>
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
        <div className="feature-resource-copy"><p className="eyebrow">Pre-School · real activity page</p><h2 id="feature-title">A Barn Band Day</h2><p>Children choose an instrument, keep a beat, and share with a peer — a hands-on Pre-School routine with an illustrated activity page, ready to open and use.</p><Link className="farm-button farm-button-red" href="/grade/pre-school">Open Pre-School Lessons <span className="farm-button-arrow" aria-hidden="true">→</span></Link></div>
        <div className="feature-resource-art"><Image src="/scenes/early-years-worksheet-example.png" alt="A Barn Band Day Pre-School instrument activity page" fill sizes="(max-width: 760px) 92vw, 44vw" /></div>
      </section>

      <section className="home-about" aria-labelledby="home-about-title">
        <div className="home-about-art">
          <Image
            src="/scenes/singing-together-on-old-macs-farm.png"
            alt="The Old MacDonald Had a School community singing and learning together"
            fill
            sizes="(max-width: 760px) 100vw, 980px"
          />
        </div>
        <div className="home-about-copy">
          <p>Welcome to Old MacDonald Had a School</p>
          <h2 id="home-about-title">Familiar songs.<br />New places to learn.</h2>
          <span>We turn music children already know into visual worlds they can move through, notice and join.</span>
          <Link href="/grade/daycare/singing-together">Follow the first story <b aria-hidden="true">→</b></Link>
          <small>by Jesse Naiman</small>
        </div>
      </section>
    </div>
  );
}
