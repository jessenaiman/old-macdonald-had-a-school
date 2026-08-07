"use client";

import Image from "next/image";
import Link from "next/link";
import { LuMenu, LuX } from "react-icons/lu";
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
        {open ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      {open ? (
        <nav id="mobile-primary-navigation" aria-label="Mobile navigation">
          <Link href="/" aria-current={active === "home" ? "page" : undefined} onClick={closeMenu}>Home</Link>
          {grades.map((grade) => (
            <Link className={`site-nav-grade site-nav-grade-${grade.key}`} href={grade.href} aria-current={active === grade.key ? "page" : undefined} onClick={closeMenu} key={grade.key}>
              <span className="site-nav-patch" aria-hidden="true">
                <Image className="site-nav-patch-base" src={grade.patch} alt="" width={42} height={42} />
                <Image className="site-nav-patch-person" src={grade.avatar} alt="" width={34} height={34} />
              </span>
              <span>{grade.label}</span>
            </Link>
          ))}
          <Link href="/about" aria-current={active === "about" ? "page" : undefined} onClick={closeMenu}>About</Link>
        </nav>
      ) : null}
    </div>
  );
}
