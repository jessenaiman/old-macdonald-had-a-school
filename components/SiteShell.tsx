import Image from "next/image";
import Link from "next/link";
import { LuChevronDown, LuMenu } from "react-icons/lu";

export type ActivePage =
  | "home" | "topics" | "lessons" | "about" | "cast-guide"
  | "daycare" | "preschool" | "kindergarten" | "grade-one" | "grade-two";

const EARLY_YEARS = [
  { key: "daycare", label: "Daycare", href: "/daycare", age: "0–2 yrs" },
  { key: "preschool", label: "Preschool", href: "/preschool", age: "3–4 yrs" },
  { key: "kindergarten", label: "Kindergarten", href: "/kindergarten", age: "4–5 yrs" },
] as const;

const PRIMARY_GRADES = [
  { key: "grade-one", label: "Grade 1", href: "/band/grade-one", age: "5–6 yrs" },
  { key: "grade-two", label: "Grade 2", href: "/band/grade-two", age: "6–7 yrs" },
] as const;

const FOOTER_BANDS = [
  { label: "Daycare", href: "/daycare" },
  { label: "Preschool", href: "/preschool" },
  { label: "Grade 1", href: "/band/grade-one" },
  { label: "Grade 2", href: "/band/grade-two" },
] as const;

function CurriculumMenu({
  label,
  items,
  active,
}: {
  label: string;
  items: readonly { key: ActivePage; label: string; href: string; age: string }[];
  active?: ActivePage;
}) {
  const groupIsActive = items.some((item) => item.key === active);

  return (
    <details className={`site-menu${groupIsActive ? " is-active" : ""}`}>
      <summary className="site-menu-summary">
        <span>{label}</span>
        <LuChevronDown aria-hidden="true" />
      </summary>
      <div className="site-menu-panel">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={active === item.key ? "is-active" : undefined}
            aria-current={active === item.key ? "page" : undefined}
          >
            <span>{item.label}</span>
            <small>{item.age}</small>
          </Link>
        ))}
      </div>
    </details>
  );
}

function CurriculumLinks({ active }: { active?: ActivePage }) {
  return (
    <>
      <CurriculumMenu label="Early Years" items={EARLY_YEARS} active={active} />
      <CurriculumMenu label="Primary Grades" items={PRIMARY_GRADES} active={active} />
    </>
  );
}

export function SiteShell({ children, active }: { children: React.ReactNode; active?: ActivePage }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" href="/" aria-label="Old MacDonald Had a School home">
            <Image src="/brand-emblem.png" alt="" width={44} height={44} priority />
            <span>
              <strong>Old MacDonald<br />Had a School</strong>
              <small>Teacher lesson resources</small>
            </span>
          </Link>

          <nav className="site-nav site-nav-desktop" aria-label="Primary navigation">
            <Link className={`site-nav-link${active === "home" ? " is-active" : ""}`} href="/" aria-current={active === "home" ? "page" : undefined}>Home</Link>
            <Link className={`site-nav-link${active === "daycare" || active === "preschool" ? " is-active" : ""}`} href="/daycare">Early Years</Link>
            <Link className={`site-nav-link${active === "kindergarten" ? " is-active" : ""}`} href="/kindergarten">Kindergarten</Link>
            <Link className={`site-nav-link${active === "grade-one" ? " is-active" : ""}`} href="/band/grade-one">Grade 1</Link>
            <Link className={`site-nav-link${active === "grade-two" ? " is-active" : ""}`} href="/band/grade-two">Grade 2</Link>
            <Link className={`site-nav-link site-nav-link-subtle${active === "cast-guide" ? " is-active" : ""}`} href="/cast" aria-current={active === "cast-guide" ? "page" : undefined}>Cast Guide</Link>
          </nav>

          <div className="site-mobile-actions">
            <details className="site-mobile-menu">
              <summary aria-label="Open navigation menu"><LuMenu aria-hidden="true" /><span>Menu</span></summary>
              <nav aria-label="Mobile navigation">
                <Link href="/" aria-current={active === "home" ? "page" : undefined}>Home</Link>
                <Link href="/daycare">Early Years</Link>
                <Link href="/kindergarten">Kindergarten</Link>
                <Link href="/band/grade-one">Grade 1</Link>
                <Link href="/band/grade-two">Grade 2</Link>
                <Link href="/cast" aria-current={active === "cast-guide" ? "page" : undefined}>Cast Guide</Link>
              </nav>
            </details>
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
            {FOOTER_BANDS.map((band) => <Link key={band.href} href={band.href}>{band.label}</Link>)}
            <Link href="/topics">All lesson topics</Link>
            <Link href="/cast">Cast Guide</Link>
          </nav>
          <p className="footer-tagline">Rooted in play. Growing confident learners.</p>
        </div>
      </footer>
    </div>
  );
}
