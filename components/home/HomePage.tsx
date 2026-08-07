import Image from "next/image";
import Link from "next/link";
import styles from "./HomePage.module.css";

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

type SubjectLesson = {
  title: string;
  grade: string;
  href: string;
  staffAsset: string;
  ready?: boolean;
};

type SubjectGroup = {
  key: string;
  filterKey: string;
  label: string;
  icon: string;
  tone: "words" | "numbers" | "music" | "heart";
  fastener: string;
  fastenerStyle: "paperclip" | "pushpin" | "tape" | "clip";
  rows: readonly SubjectLesson[];
  more: number;
};

const SUBJECTS: readonly SubjectGroup[] = [
  {
    key: "language",
    filterKey: "words",
    label: "Language & Communication",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png",
    tone: "words",
    fastener: "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png",
    fastenerStyle: "paperclip",
    rows: [
      { title: "Story Time: Board Books", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
      { title: "Show & Tell Story Circle", grade: "Pre-School", href: "/grade/pre-school", staffAsset: "/staff_and_students/miss-maisy-transparent-circle.png" },
      { title: "Phonics: Long & Short Vowel Sounds", grade: "Gr 1", href: "/grade/grade-one", staffAsset: "/staff_and_students/miss-hayley-transparent-circle.png", ready: true },
      { title: "Rhyming & Sound Play", grade: "Gr 1", href: "/grade/grade-one", staffAsset: "/staff_and_students/miss-hayley-transparent-circle.png" },
    ],
    more: 1,
  },
  {
    key: "math",
    filterKey: "numbers",
    label: "Math & Inquiry",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-math-building.png",
    tone: "numbers",
    fastener: "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png",
    fastenerStyle: "pushpin",
    rows: [
      { title: "Sensory Tray Exploration", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
      { title: "Shape Hunt Outdoors", grade: "Pre-School", href: "/grade/pre-school", staffAsset: "/staff_and_students/miss-maisy-transparent-circle.png" },
      { title: "Nature Observation Journal", grade: "Gr 1", href: "/grade/grade-one", staffAsset: "/staff_and_students/mr-puddles-transparent-circle.png" },
      { title: "Adding with Equal Groups", grade: "Gr 2", href: "/grade/grade-two", staffAsset: "/staff_and_students/mr-sam-transparent-circle.png" },
    ],
    more: 1,
  },
  {
    key: "music",
    filterKey: "music",
    label: "Music, Movement & Community",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png",
    tone: "music",
    fastener: "/design-assets/classroom-fasteners-v1/individual-icons/06-washi-tape.png",
    fastenerStyle: "tape",
    rows: [
      { title: "Barnyard Animal Sounds & Action Imitation", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png", ready: true },
      { title: "Circle Time Songs", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
      { title: "Fingerplay & Movement", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
      { title: "Follow the Music Trail", grade: "Pre-School", href: "/grade/pre-school", staffAsset: "/staff_and_students/mr-rusty-transparent-circle.png" },
    ],
    more: 2,
  },
  {
    key: "routines",
    filterKey: "heart",
    label: "Routines & Regulation",
    icon: "/brand-kit-icon-sheets/individual-icons/subject-community-leadership.png",
    tone: "heart",
    fastener: "/design-assets/classroom-fasteners-v1/individual-icons/04-binder-clip.png",
    fastenerStyle: "clip",
    rows: [
      { title: "Mix, Measure & Munch", grade: "Pre-School", href: "/grade/pre-school", staffAsset: "/staff_and_students/miss-maisy-transparent-circle.png", ready: true },
      { title: "Feelings Check-In", grade: "Daycare", href: "/grade/daycare", staffAsset: "/staff_and_students/miss-puddles-transparent-circle.png" },
      { title: "Clean Up Song Sequence", grade: "Pre-School", href: "/grade/pre-school", staffAsset: "/staff_and_students/miss-maisy-transparent-circle.png" },
      { title: "Kind Hands, Kind Words", grade: "Gr 1", href: "/grade/grade-one", staffAsset: "/staff_and_students/miss-hayley-transparent-circle.png" },
    ],
    more: 1,
  },
] as const;

const JOURNEY = [
  {
    number: "1",
    title: "Sing & Spark Interest",
    copy: "Start with a song or story that captures attention and builds background.",
    image: "/scenes/home-journey-spark-v1.png",
    alt: "A pig and a sheep reading a picture book together",
    patch: "/design-assets/blank-felt-patches-v1/individual-patches/10-whiskers-circle.png",
  },
  {
    number: "2",
    title: "Explore & Practice",
    copy: "Hands-on activities and playful practice help children try, explore, and make connections.",
    image: "/scenes/home-journey-explore-v1.png",
    alt: "A cow, donkey, and chick exploring shapes together",
    patch: "/design-assets/blank-felt-patches-v1/individual-patches/11-scout-circle.png",
  },
  {
    number: "3",
    title: "Reflect & Apply",
    copy: "Children share, reflect, and use what they have learned in meaningful ways.",
    image: "/scenes/home-journey-reflect-v1.png",
    alt: "A chicken, pig, sheep, and chick observing a garden plant",
    patch: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-circle.png",
  },
] as const;

export function HomePage({ hero }: HomePageProps) {
  return (
    <div className={`home-page ${styles.homePage}`}>
      <section className={styles.hero} aria-labelledby="home-title">
        <Image
          className={styles.heroImage}
          src="/scenes/home-schoolhouse-classroom-hero-v1.png"
          alt="Old MacDonald teaching the farm-school children in a warm classroom"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroPanel}>
          <Image className={styles.heroPinLeft} src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={52} height={52} aria-hidden="true" />
          <Image className={styles.heroPinRight} src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={52} height={52} aria-hidden="true" />
          {hero.eyebrow && <p className={styles.heroEyebrow}>{hero.eyebrow}</p>}
          <h1 id="home-title">{hero.title ?? "Where familiar songs become new places to learn."}</h1>
          <p>{hero.summary ?? "One clear teaching sequence, carefully selected resources, and better searches when you need another option."}</p>
          <Link className={styles.heroButton} href="#grade-navigation">Start with your grade <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className={`${styles.subjectBoard} subject-bulletin`} id="browse-by-subject" aria-labelledby="discover-title">
        <header className={styles.subjectHeading}>
          <h2 id="discover-title">Browse by Subject</h2>
          <p>Topics are organized into four subject clusters. Each cluster grows with your students.</p>
        </header>
        <div className={styles.subjectGrid}>
          {SUBJECTS.map((group) => (
            <article className={`${styles.subjectCard} ${styles[group.tone]}`} key={group.key}>
              <Image className={`${styles.fastener} ${styles[group.fastenerStyle]} subject-fastener`} src={group.fastener} alt="" width={76} height={76} aria-hidden="true" />
              <header className={styles.subjectCardHead}>
                <Image src={group.icon} alt="" width={46} height={46} aria-hidden="true" />
                <h3>{group.label}</h3>
              </header>
              <ul className={styles.lessonList}>
                {group.rows.map((lesson) => (
                  <li key={lesson.title}>
                    <Link href={lesson.href}>
                      <Image src={lesson.staffAsset} alt="" width={24} height={24} sizes="24px" aria-hidden="true" />
                      <span>{lesson.title}</span>
                      <small>{lesson.grade}{lesson.ready && <b>Ready</b>}</small>
                    </Link>
                  </li>
                ))}
              </ul>
              {group.more > 0 && <Link className={styles.moreLink} href={`/topics?cluster=${group.filterKey}`}>+ {group.more} more...</Link>}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.journey} aria-labelledby="journey-title">
        <header>
          <h2 id="journey-title">Your lesson journey</h2>
          <p>Every topic follows a simple path from first song to real understanding.</p>
        </header>
        <div className={styles.journeyGrid}>
          {JOURNEY.map((step) => (
            <article className={styles.journeyCard} key={step.number}>
              <span className={styles.stepNumber} aria-hidden="true">
                <Image src={step.patch} alt="" fill sizes="52px" />
                <b>{step.number}</b>
              </span>
              <div className={styles.journeyImage}>
                <Image src={step.image} alt={step.alt} fill sizes="(max-width: 760px) 86vw, 280px" />
              </div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
          <aside className={styles.journeyNote}>
            <Image src="/design-assets/classroom-fasteners-v1/individual-icons/12-reinforcement-ring.png" alt="" width={54} height={54} aria-hidden="true" />
            <p>Again.<br />Another way.<br />Another day.</p>
          </aside>
        </div>
      </section>

      <section className={styles.story} aria-labelledby="story-title">
        <div className={styles.storyArt}>
          <Image src="/pressed-flowers.png" alt="Children holding hands in a circle among pressed flowers" fill sizes="100vw" />
        </div>
        <div className={styles.storyCopy}>
          <p>Welcome to Old MacDonald Had a School</p>
          <h2 id="story-title">Familiar songs.<br />New places to learn.</h2>
          <span>We turn music children already know into visual worlds they can move through, notice and join.</span>
          <Link href="/grade/daycare/singing-together">Follow the first story <b aria-hidden="true">→</b></Link>
          <small>by Jesse Naiman</small>
        </div>
      </section>
    </div>
  );
}
