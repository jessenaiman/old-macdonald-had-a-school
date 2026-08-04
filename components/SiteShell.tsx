import Link from "next/link";
import Image from "next/image";
import { ThemeSwitcher } from "./ThemeSwitcher";

export type ActivePage =
  | "home" | "topics" | "lessons" | "about" | "cast-guide"
  | "daycare" | "preschool" | "kindergarten" | "grade-one" | "grade-two";

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "topics", label: "Lesson topics", href: "/topics" },
  { key: "lessons", label: "Music lessons", href: "/lessons" },
  { key: "daycare", label: "Daycare", href: "/daycare" },
  { key: "preschool", label: "Preschool", href: "/preschool" },
  { key: "kindergarten", label: "Kindergarten", href: "/kindergarten" },
  { key: "grade-one", label: "Grade 1", href: "/band/grade-one" },
  { key: "grade-two", label: "Grade 2", href: "/band/grade-two" },
] as const;

const FOOTER_BANDS = [
  { key: "daycare", label: "Daycare", href: "/daycare" },
  { key: "preschool", label: "Preschool", href: "/preschool" },
  { key: "grade-one", label: "Grade 1", href: "/band/grade-one" },
  { key: "grade-two", label: "Grade 2", href: "/band/grade-two" },
] as const;

export function SiteShell({ children, active }: { children: React.ReactNode; active?: ActivePage }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" href="/" aria-label="Old MacDonald Had a School home">
            <Image src="/brand-emblem.png" alt="" width={48} height={48} />
            <span><strong>Old MacDonald<br />Had a School</strong><small>Teacher lesson resources</small></span>
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <Link key={item.key} href={item.href} className={`site-nav-link${active === item.key ? " is-active" : ""}`} aria-current={active === item.key ? "page" : undefined}>{item.label}</Link>
            ))}
            <Link href="/about" className={`site-nav-link site-nav-link-subtle${active === "about" ? " is-active" : ""}`} aria-current={active === "about" ? "page" : undefined}>About</Link>
            <Link href="/cast-guide" className={`site-nav-link site-nav-link-subtle${active === "cast-guide" ? " is-active" : ""}`} aria-current={active === "cast-guide" ? "page" : undefined}>Cast guide</Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>
      <main className="site-page">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand"><Image src="/brand-emblem.png" alt="" width={40} height={40} /><div><strong>Old MacDonald Had a School</strong><small>by Jesse Neiman</small></div></div>
          <nav className="footer-links" aria-label="Footer">
            {FOOTER_BANDS.map((band) => <Link key={band.key} href={band.href}>{band.label}</Link>)}
            <Link href="/topics">All lesson topics</Link>
            <Link href="/cast-guide">Cast Guide</Link>
          </nav>
          <p className="footer-tagline">Rooted in play. Growing confident learners.</p>
        </div>
      </footer>
    </div>
  );
}
