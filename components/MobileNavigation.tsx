"use client";

import Link from "next/link";
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
import type { ActivePage, GradeNavigationItem } from "./SiteShell";

export function MobileNavigation({ active, grades }: { active?: ActivePage; grades: readonly GradeNavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const gradeLinks: { key: ActivePage; label: string; href: string }[] = [];

  for (const grade of grades) {
    if (grade.children) gradeLinks.push(...grade.children);
    else gradeLinks.push({ key: grade.key, label: grade.label, href: grade.href });
  }

  return (
    <div className="site-mobile-menu">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="site-mobile-menu-trigger" variant="ghost" aria-label="Open navigation menu">
            <FaBars aria-hidden="true" />
            <span>Menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent className="site-menu-sheet" side="right" showCloseButton={false}>
          <SheetHeader className="site-menu-sheet-header">
            <div>
              <SheetTitle>Teacher shortcuts</SheetTitle>
              <SheetDescription>Choose where you want to start.</SheetDescription>
            </div>
            <SheetClose asChild>
              <Button className="site-menu-sheet-close" variant="ghost" size="icon" aria-label="Close navigation menu">
                <FaXmark aria-hidden="true" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <nav className="site-menu-sheet-links" aria-label="Mobile navigation">
            <Button asChild variant="ghost">
              <Link href="/" aria-current={active === "home" ? "page" : undefined} onClick={() => setOpen(false)}>Home</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/lessons" aria-current={active === "lessons" ? "page" : undefined} onClick={() => setOpen(false)}>Find lessons</Link>
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

          <Separator className="site-menu-sheet-separator" />

          <section className="site-menu-sheet-grades" aria-labelledby="mobile-grade-heading">
            <h2 id="mobile-grade-heading">Choose a grade</h2>
            <div>
              {gradeLinks.map((grade) => (
                <Button asChild variant="outline" key={grade.key}>
                  <Link
                    className={`site-nav-grade site-nav-grade-${grade.key}`}
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
