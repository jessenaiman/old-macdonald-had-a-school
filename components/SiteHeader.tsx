"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { activePageFromPathname, GRADE_NAV_ITEMS, TEACHER_GRADE_ITEMS } from "./site-navigation";

export function SiteHeader() {
  const active = activePageFromPathname(usePathname());
  const teacherMenuIsActive = TEACHER_GRADE_ITEMS.some((grade) => grade.key === active);

  return <header className="site-header">
    <div className="site-header-inner container mx-auto !w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <Link className="site-brand" href="/" aria-label="Old MacDonald Had a School home">
        <Image src="/brand-emblem.png" alt="" width={44} height={44} priority />
        <span><strong><span className="site-brand-full">Old MacDonald Had a School</span><span className="site-brand-short">Old MacDonald</span></strong><small>Had a School</small></span>
      </Link>
      <nav className="site-nav-desktop" aria-label="Primary navigation">
        <Link className={`site-nav-link${active === "lessons" ? " is-active" : ""}`} href="/lessons" aria-current={active === "lessons" ? "page" : undefined}>Lessons</Link>
        <Link className={`site-nav-link${active === "topics" ? " is-active" : ""}`} href="/#browse-by-subject" aria-current={active === "topics" ? "page" : undefined}>Subjects</Link>
        <details className="site-teacher-menu"><summary className={`site-nav-link${teacherMenuIsActive ? " is-active" : ""}`}>For Teachers</summary><nav aria-label="Grade destinations">{TEACHER_GRADE_ITEMS.map((grade) => <Link href={grade.href} key={grade.key} aria-current={active === grade.key ? "page" : undefined}>{grade.label}</Link>)}</nav></details>
        <Link className={`site-nav-link${active === "cast-guide" ? " is-active" : ""}`} href="/branding" aria-current={active === "cast-guide" ? "page" : undefined}>Brand guide</Link>
        <Link className={`site-nav-link${active === "about" ? " is-active" : ""}`} href="/about" aria-current={active === "about" ? "page" : undefined}>About</Link>
        <Link className={`site-nav-search${active === "search" ? " is-active" : ""}`} href="/search" aria-label="Search lessons" aria-current={active === "search" ? "page" : undefined}><FaMagnifyingGlass aria-hidden="true" /><span>Search</span></Link>
      </nav>
      <div className="site-desktop-theme"><ThemeSwitcher /></div>
      <div className="site-mobile-actions"><Link className="site-mobile-search" href="/search" aria-label="Search lessons"><FaMagnifyingGlass aria-hidden="true" /><span>Search</span></Link><MobileNavigation active={active} grades={GRADE_NAV_ITEMS} /><ThemeSwitcher /></div>
    </div>
  </header>;
}
