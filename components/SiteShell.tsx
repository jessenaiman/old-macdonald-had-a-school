import Image from "next/image";
import Link from "next/link";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

export type ActivePage =
  | "home" | "topics" | "lessons" | "about" | "cast-guide"
  | "daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two";

const FOOTER_GRADES = [
  { label: "Daycare", href: "/grade/daycare" },
  { label: "Pre-School", href: "/grade/pre-school" },
  { label: "Kindergarten", href: "/grade/kindergarten" },
  { label: "Grade 1", href: "/grade/grade-one" },
  { label: "Grade 2", href: "/grade/grade-two" },
] as const;

export type GradeNavigationItem = {
  key: Extract<ActivePage, "daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two">;
  label: string;
  href: string;
  avatar: string;
  patch: string;
};

const GRADE_NAV_ITEMS: readonly GradeNavigationItem[] = [
  { key: "daycare", label: "Daycare", href: "/grade/daycare", avatar: "/staff_and_students/miss-puddles-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-circle.png" },
  { key: "pre-school", label: "Pre-School", href: "/grade/pre-school", avatar: "/staff_and_students/miss-maisy-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/08-miss-maisy-circle.png" },
  { key: "kindergarten", label: "Kindergarten", href: "/grade/kindergarten", avatar: "/staff_and_students/mr-rusty-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/03-mr-rusty-circle.png" },
  { key: "grade-one", label: "Grade 1", href: "/grade/grade-one", avatar: "/staff_and_students/miss-hayley-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-circle.png" },
  { key: "grade-two", label: "Grade 2", href: "/grade/grade-two", avatar: "/staff_and_students/mr-sam-transparent-circle.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/05-mr-sam-circle.png" },
] as const;

export function SiteShell({ children, active }: { children: React.ReactNode; active?: ActivePage }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" href="/" aria-label="Old MacDonald Had a School home">
            <Image src="/brand-emblem.png" alt="" width={44} height={44} priority />
            <span>
              <strong><span className="site-brand-full">Old MacDonald Had a School</span><span className="site-brand-short">Old MacDonald</span></strong>
              <small>Teacher lesson resources</small>
            </span>
          </Link>

          <nav className="site-nav site-nav-desktop" aria-label="Primary navigation">
            <Link className={`site-nav-link${active === "home" ? " is-active" : ""}`} href="/" aria-current={active === "home" ? "page" : undefined}>Home</Link>
            {GRADE_NAV_ITEMS.map((grade) => (
              <Link className={`site-nav-link site-nav-grade site-nav-grade-${grade.key}${active === grade.key ? " is-active" : ""}`} href={grade.href} aria-current={active === grade.key ? "page" : undefined} key={grade.key}>
                <span className="site-nav-patch" aria-hidden="true">
                  <Image className="site-nav-patch-base" src={grade.patch} alt="" width={34} height={34} />
                  <Image className="site-nav-patch-person" src={grade.avatar} alt="" width={28} height={28} />
                </span>
                <span>{grade.label}</span>
              </Link>
            ))}
            <Link className={`site-nav-link site-nav-link-subtle${active === "about" ? " is-active" : ""}`} href="/about" aria-current={active === "about" ? "page" : undefined}>About</Link>
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
        <div className="site-footer-inner">
          <div className="footer-brand">
            <Image src="/brand-emblem.png" alt="" width={40} height={40} />
            <div><strong>Old MacDonald<br />Had a School</strong><small>by Jesse Neiman</small></div>
          </div>
          <nav className="footer-links" aria-label="Footer">
            {FOOTER_GRADES.map((grade) => <Link key={grade.href} href={grade.href}>{grade.label}</Link>)}
            <Link href="/topics">All lesson topics</Link>
            <Link href="/about">About</Link>
            <Link href="/cast">Cast Guide</Link>
          </nav>
          <p className="footer-tagline">Rooted in play. Growing confident learners.</p>
        </div>
      </footer>
    </div>
  );
}
