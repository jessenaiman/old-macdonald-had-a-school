"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNavigation } from "./MobileNavigation";
import { ResponsiveBrandEmblem } from "./brand/ResponsiveBrandEmblem";
import { activePageFromPathname, NAV_ITEMS, TEACHER_GRADE_ITEMS } from "./site-navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";

const HEADER_LINK_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-medium text-brand-navy-foreground/80 hover:bg-brand-navy-foreground/10 hover:text-brand-navy-foreground aria-[current=page]:text-accent";

export function SiteHeader() {
  const active = activePageFromPathname(usePathname());

  return (
    <header className="sticky top-0 z-40 border-b border-brand-navy-foreground/10 bg-brand-navy">
      <div className="relative flex min-h-16 w-full min-w-0 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="inline-flex min-h-11 shrink-0 items-center gap-3"
          href="/"
          aria-label="Old MacDonald Had a School home"
        >
          <ResponsiveBrandEmblem className="h-8 w-auto" />
          <span className="hidden flex-col items-start sm:inline-flex">
            <strong className="font-brand text-sm leading-none text-brand-navy-foreground sm:text-base">
              Old MacDonald Had a School
            </strong>
            <small className="text-xs font-black uppercase tracking-widest text-accent">
              Teacher Lesson Resources
            </small>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 xl:block" aria-label="Main">
          <ul className="flex items-center justify-end gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active === item.key ? "page" : undefined}
                  className={cn(HEADER_LINK_CLASS, item.key === "search" && "gap-1.5")}
                >
                  {item.key === "search" && <Search className="size-4" aria-hidden />}
                  {item.key === "search" ? "Search" : item.label}
                </Link>
              </li>
            ))}
            {TEACHER_GRADE_ITEMS.map((grade) => (
              <li key={grade.key}>
                <Link
                  href={grade.href}
                  data-grade={grade.key}
                  aria-current={active === grade.key ? "page" : undefined}
                  className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md bg-grade px-2.5 text-sm font-medium text-grade-foreground hover:bg-grade/90 aria-[current=page]:ring-2 aria-[current=page]:ring-grade-foreground"
                >
                  {grade.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden xl:block">
          <ThemeSwitcher />
        </div>

        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <MobileNavigation active={active} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
