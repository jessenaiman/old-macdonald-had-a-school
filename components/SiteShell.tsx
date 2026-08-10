import Image from "next/image";
import Link from "next/link";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

export type ActivePage =
  | "home" | "topics" | "lessons" | "about" | "search" | "cast-guide"
  | "daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two";

const FOOTER_TOPICS = [
  { label: "Language & stories", href: "/topics?cluster=words" },
  { label: "Numbers & making", href: "/topics?cluster=numbers" },
  { label: "Music & movement", href: "/topics?cluster=music" },
  { label: "Art & nature", href: "/topics?cluster=art" },
  { label: "Routines & wellbeing", href: "/topics?cluster=heart" },
] as const;

export type GradeNavigationItem = {
  key: Extract<ActivePage, "daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two">;
  label: string;
  href: string;
};

const GRADE_NAV_ITEMS: readonly GradeNavigationItem[] = [
  { key: "daycare", label: "Daycare", href: "/grade/daycare" },
  { key: "pre-school", label: "Pre-School", href: "/grade/pre-school" },
  { key: "kindergarten", label: "Kindergarten", href: "/grade/kindergarten" },
  { key: "grade-one", label: "Grade 1", href: "/grade/grade-one" },
  { key: "grade-two", label: "Grade 2", href: "/grade/grade-two" },
] as const;

export function SiteShell({ children, active }: { children: React.ReactNode; active?: ActivePage }) {
  return (
    <div className="site-shell site-review">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" href="/" aria-label="Old MacDonald Had a School home">
            <Image src="/brand-emblem.png" alt="" width={44} height={44} priority />
            <span>
              <strong><span className="site-brand-full">Old MacDonald Had a School</span><span className="site-brand-short">Old MacDonald</span></strong>
              <small>Teacher lesson resources</small>
            </span>
          </Link>

          <nav className="site-nav site-nav-desktop" id="grade-navigation" aria-label="Primary navigation">
            <Link className={`site-nav-link site-nav-utility${active === "home" ? " is-active" : ""}`} href="/" aria-current={active === "home" ? "page" : undefined}>Home</Link>
            {GRADE_NAV_ITEMS.map((grade) => (
              <Link className={`site-nav-link site-nav-grade site-nav-grade-${grade.key}${active === grade.key ? " is-active" : ""}`} href={grade.href} aria-current={active === grade.key ? "page" : undefined} key={grade.key}>
                <span>{grade.label}</span>
              </Link>
            ))}
            <Link className={`site-nav-link site-nav-utility${active === "search" ? " is-active" : ""}`} href="/search" aria-current={active === "search" ? "page" : undefined}>Search</Link>
            <Link className={`site-nav-link site-nav-utility${active === "about" ? " is-active" : ""}`} href="/about" aria-current={active === "about" ? "page" : undefined}>About</Link>
            <ThemeSwitcher />
          </nav>

          <div className="site-mobile-actions">
            <ThemeSwitcher />
            <MobileNavigation active={active} grades={GRADE_NAV_ITEMS} />
          </div>
        </div>
      </header>

      <main className="site-page">{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner footer-planning-tray">
          <section className="footer-card footer-brand-card" aria-label="Old MacDonald Had a School">
            <Image className="footer-fastener footer-paperclip" src="/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png" alt="" width={42} height={42} />
            <div className="footer-brand">
              <Image src="/brand-emblem.png" alt="" width={48} height={48} />
              <div><strong>Old MacDonald<br />Had a School</strong><small>Teacher lesson resources</small></div>
            </div>
            <p className="footer-brand-note">Familiar songs, practical planning, and room for every learner.</p>
          </section>
          <nav className="footer-card footer-grade-card" aria-label="Plan by topic">
            <Image className="footer-fastener footer-pin" src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={38} height={38} />
            <strong className="footer-card-title">Plan by topic</strong>
            <div className="footer-links footer-grade-links">
              {FOOTER_TOPICS.map((topic) => <Link key={topic.href} href={topic.href}>{topic.label}</Link>)}
            </div>
          </nav>
          <nav className="footer-card footer-tool-card" aria-label="Teacher toolbox">
            <Image className="footer-fastener footer-tape" src="/design-assets/classroom-fasteners-v1/individual-icons/06-washi-tape.png" alt="" width={72} height={72} />
            <strong className="footer-card-title">Teacher toolbox</strong>
            <div className="footer-links footer-tool-links">
              <Link href="/">Home</Link>
              <Link href="/search">Search lessons</Link>
              <Link href="/topics">All lesson topics</Link>
              <Link href="/about">About</Link>
            </div>
          </nav>
          <div className="footer-tagline footer-felt-strip">
            <Image src="/design-assets/classroom-fasteners-v1/individual-icons/09-wooden-clothespin.png" alt="" width={38} height={38} />
            <p>Rooted in play. Growing confident learners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
