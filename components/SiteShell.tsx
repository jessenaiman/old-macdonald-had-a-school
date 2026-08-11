import Image from "next/image";
import Link from "next/link";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

export type ActivePage =
  | "home" | "topics" | "lessons" | "about" | "search" | "cast-guide"
  | "early-years" | "daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two";

export type GradeNavigationItem = {
  key: Extract<ActivePage, "early-years" | "kindergarten" | "grade-one" | "grade-two">;
  label: string;
  href: string;
  children?: readonly { key: Extract<ActivePage, "daycare" | "pre-school">; label: string; href: string }[];
};

const GRADE_NAV_ITEMS: readonly GradeNavigationItem[] = [
  { key: "early-years", label: "Early Years", href: "/grade/daycare", children: [
    { key: "daycare", label: "Daycare", href: "/grade/daycare" },
    { key: "pre-school", label: "Pre-School", href: "/grade/pre-school" },
  ] },
  { key: "kindergarten", label: "Kindergarten", href: "/grade/kindergarten" },
  { key: "grade-one", label: "Grade 1", href: "/grade/grade-one" },
  { key: "grade-two", label: "Grade 2", href: "/grade/grade-two" },
] as const;

const TEACHER_GRADE_ITEMS = [
  { key: "daycare", label: "Daycare", href: "/grade/daycare" },
  { key: "pre-school", label: "Pre-School", href: "/grade/pre-school" },
  { key: "kindergarten", label: "Kindergarten", href: "/grade/kindergarten" },
  { key: "grade-one", label: "Grade 1", href: "/grade/grade-one" },
  { key: "grade-two", label: "Grade 2", href: "/grade/grade-two" },
] as const;

export function SiteShell({ children, active }: { children: React.ReactNode; active?: ActivePage }) {
  return (
    <div className={`site-shell site-review site-chrome-home site-shell-${active ?? "page"}`}>
      <header className="site-header">
        <div className="site-header-inner container mx-auto !w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link className="site-brand" href="/" aria-label="Old MacDonald Had a School home">
            <Image src="/brand-emblem.png" alt="" width={44} height={44} priority />
            <span>
              <strong><span className="site-brand-full">Old MacDonald Had a School</span><span className="site-brand-short">Old MacDonald</span></strong>
              <small>Had a School</small>
            </span>
          </Link>

          <nav className="site-nav-desktop" aria-label="Primary navigation">
            <Link className={`site-nav-link${active === "lessons" ? " is-active" : ""}`} href="/lessons">Lessons</Link>
            <Link className="site-nav-link" href="/#browse-by-subject">Subjects</Link>
            <details className="site-teacher-menu">
              <summary className="site-nav-link" role="button" aria-haspopup="menu">For Teachers</summary>
              <nav aria-label="Grade destinations">
                {TEACHER_GRADE_ITEMS.map((grade) => (
                  <Link href={grade.href} key={grade.key}>{grade.label}</Link>
                ))}
              </nav>
            </details>
            <Link className={`site-nav-link${active === "cast-guide" ? " is-active" : ""}`} href="/branding">Brand guide</Link>
            <Link className={`site-nav-link${active === "about" ? " is-active" : ""}`} href="/about">About</Link>
            <Link className={`site-nav-search${active === "search" ? " is-active" : ""}`} href="/search" aria-label="Search lessons"><FaMagnifyingGlass aria-hidden="true" /><span>Search</span></Link>
          </nav>

          <div className="site-desktop-theme"><ThemeSwitcher /></div>
          <div className="site-mobile-actions">
            <Link className="site-mobile-search" href="/search" aria-label="Search lessons"><FaMagnifyingGlass aria-hidden="true" /><span>Search</span></Link>
            <MobileNavigation active={active} grades={GRADE_NAV_ITEMS} />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="site-page">{children}</main>

      <footer className="site-footer">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
            <div className="max-w-sm">
              <Link className="site-footer-brand" href="/" aria-label="Old MacDonald Had a School home">
                <Image src="/brand-emblem.png" alt="" width={48} height={48} />
                <span><strong>Old MacDonald Had a School</strong><small>Teacher lesson resources</small></span>
              </Link>
              <p className="site-footer-summary">Practical, playful lesson ideas organized for the grade and subject you teach.</p>
            </div>

            <nav className="site-footer-nav" aria-label="Plan lessons">
              <strong>Plan lessons</strong>
              <Link href="/lessons">Browse all lessons</Link>
              <Link href="/#browse-by-subject">Browse by subject</Link>
              <Link href="/search">Search lessons</Link>
            </nav>

            <nav className="site-footer-nav" aria-label="About the school">
              <strong>The farm school</strong>
              <Link href="/about">About</Link>
              <Link href="/branding">Brand &amp; cast guide</Link>
              <Link href="/about#contact">Contact</Link>
            </nav>
          </div>

          <Separator className="my-6 bg-white/15" />

          <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0">© 2024 Old MacDonald Had a School</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/about#privacy-policy">Privacy Policy</Link>
              <Link href="/about#terms-of-use">Terms of Use</Link>
              <Link href="/about#contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
