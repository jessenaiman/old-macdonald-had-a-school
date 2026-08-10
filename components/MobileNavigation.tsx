"use client";

import Link from "next/link";
import { useState } from "react";
import type { ActivePage, GradeNavigationItem } from "./SiteShell";

export function MobileNavigation({ active, grades }: { active?: ActivePage; grades: readonly GradeNavigationItem[] }) {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className={`site-mobile-menu${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="site-mobile-menu-trigger"
        aria-expanded={open}
        aria-controls="mobile-primary-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{open ? "Close menu" : "Menu"}</span>
      </button>
      {open ? (
        <nav id="mobile-primary-navigation" aria-label="Mobile navigation">
          <Link className="site-nav-utility" href="/" aria-current={active === "home" ? "page" : undefined} onClick={closeMenu}>Home</Link>
          {grades.map((grade) => (
            <Link className={`site-nav-grade site-nav-grade-${grade.key}`} href={grade.href} aria-current={active === grade.key ? "page" : undefined} onClick={closeMenu} key={grade.key}>
              <span>{grade.label}</span>
            </Link>
          ))}
          <Link className="site-nav-utility" href="/search" aria-current={active === "search" ? "page" : undefined} onClick={closeMenu}>Search</Link>
          <Link className="site-nav-utility" href="/about" aria-current={active === "about" ? "page" : undefined} onClick={closeMenu}>About</Link>
        </nav>
      ) : null}
    </div>
  );
}
