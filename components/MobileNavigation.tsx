"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ActivePage, GradeNavigationItem } from "./site-navigation";
import styles from "./SiteChrome.module.css";

export function MobileNavigation({ active, grades }: { active?: ActivePage; grades: readonly GradeNavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const gradeLinks: { key: ActivePage; label: string; href: string }[] = [];

  for (const grade of grades) {
    if (grade.children) gradeLinks.push(...grade.children);
    else gradeLinks.push({ key: grade.key, label: grade.label, href: grade.href });
  }

  return (
    <div className={styles.mobileMenu}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className={styles.menuTrigger} variant="ghost" size="icon-lg" aria-label="Open navigation menu">
            <FaBars aria-hidden="true" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent className={styles.menuSheet} side="right" showCloseButton={false}>
          <SheetHeader className={styles.menuSheetHeader}>
            <Image src="/brand-emblem.png" alt="" width={48} height={48} />
            <div className={styles.menuSheetHeading}>
              <SheetTitle>Old MacDonald Had a School</SheetTitle>
              <SheetDescription>Lessons, subjects, and grade workspaces</SheetDescription>
            </div>
            <SheetClose asChild>
              <Button className={styles.menuClose} variant="ghost" size="icon" aria-label="Close navigation menu">
                <FaXmark aria-hidden="true" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <nav className={styles.menuLinks} aria-label="Mobile navigation">
            <Button asChild variant="ghost">
              <Link href="/" aria-current={active === "home" ? "page" : undefined} onClick={() => setOpen(false)}>Home</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/lessons" aria-current={active === "lessons" ? "page" : undefined} onClick={() => setOpen(false)}>Find lessons</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/songs" aria-current={active === "songs" ? "page" : undefined} onClick={() => setOpen(false)}>Teacher songbook</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/search" aria-current={active === "search" ? "page" : undefined} onClick={() => setOpen(false)}>Search lessons</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/#browse-by-subject" onClick={() => setOpen(false)}>Browse subjects</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/about" aria-current={active === "about" ? "page" : undefined} onClick={() => setOpen(false)}>About the school</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/branding" aria-current={active === "cast-guide" ? "page" : undefined} onClick={() => setOpen(false)}>Brand &amp; cast guide</Link>
            </Button>
          </nav>

          <Separator className={styles.menuSeparator} />

          <section className={styles.menuGrades} aria-labelledby="mobile-grade-heading">
            <h2 id="mobile-grade-heading">Grade workspaces</h2>
            <div>
              {gradeLinks.map((grade) => (
                <Button asChild variant="outline" key={grade.key}>
                  <Link
                    className={styles.gradeLink}
                    data-grade={grade.key}
                    href={grade.href}
                    aria-current={active === grade.key ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {grade.label}
                  </Link>
                </Button>
              ))}
            </div>
          </section>
        </SheetContent>
      </Sheet>
    </div>
  );
}
