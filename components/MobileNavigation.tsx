"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ActivePage } from "./site-navigation";
import styles from "./MobileNavigation.module.css";

export function MobileNavigation({ active }: { active?: ActivePage }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.mobileMenu}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            className={styles.menuTrigger}
            variant="ghost"
            size="icon-lg"
            aria-label="Open navigation menu"
          >
            <FaBars aria-hidden="true" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          className={`${styles.menuSheet} material-surface material-leather-blue`}
          side="right"
          showCloseButton={false}
        >
          <SheetHeader className={styles.menuSheetHeader}>
            <Image src="/brand-emblem.png" alt="" width={48} height={48} />
            <div className={styles.menuSheetHeading}>
              <SheetTitle>Old MacDonald Had a School</SheetTitle>
              <SheetDescription>
                Lessons, subjects, and teacher resources
              </SheetDescription>
            </div>
            <SheetClose asChild>
              <Button
                className={styles.menuClose}
                variant="ghost"
                size="icon"
                aria-label="Close navigation menu"
              >
                <FaXmark aria-hidden="true" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <nav className={styles.menuLinks} aria-label="Mobile navigation">
            <Button asChild variant="ghost">
              <Link
                href="/lessons"
                aria-current={active === "lessons" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                Lessons
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/#browse-by-subject" onClick={() => setOpen(false)}>
                Subjects
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link
                href="/songs"
                aria-current={active === "songs" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                For Teachers
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link
                href="/about"
                aria-current={active === "about" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                About
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link
                href="/search"
                aria-current={active === "search" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                Search
              </Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
