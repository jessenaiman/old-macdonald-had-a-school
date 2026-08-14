"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ResponsiveBrandEmblem } from "./brand/ResponsiveBrandEmblem";
import { activePageFromPathname, TEACHER_GRADE_ITEMS } from "./site-navigation";

export function SiteHeader() {
  const active = activePageFromPathname(usePathname());

  return (
    <header className="material-surface material-leather-indigo relative z-40 border-b-2 border-border shadow-lg after:pointer-events-none after:absolute after:inset-2 after:z-0 after:rounded-xl after:border after:border-dashed after:border-accent/60 after:content-['']">
      <div className="relative z-10 mx-auto flex min-h-20 w-full max-w-screen-2xl items-center gap-3 px-3 sm:px-4 lg:gap-6">
        <Link
          className="inline-flex min-h-11 min-w-0 flex-1 items-center gap-2 lg:max-w-xs lg:gap-3"
          href="/"
          aria-label="Old MacDonald Had a School home"
        >
          <ResponsiveBrandEmblem className="shrink-0" />
          <span className="min-w-0">
            <strong className="block font-brand text-sm leading-none sm:text-base">
              <span className="hidden xl:inline">
                Old MacDonald Had a School
              </span>
              <span className="xl:hidden">Old MacDonald</span>
            </strong>
            <small className="mt-1 block text-xs font-black uppercase tracking-wider text-accent">Had a School</small>
          </span>
        </Link>
        <NavigationMenu
          className="hidden min-w-0 flex-1 font-display lg:flex"
          aria-label="Primary navigation"
          viewport={false}
        >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/lessons"
                  aria-current={active === "lessons" ? "page" : undefined}
                >
                  Lessons
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/#browse-by-subject"
                  aria-current={active === "topics" ? "page" : undefined}
                >
                  Subjects
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Grades</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-64 gap-1 p-1">
                  {TEACHER_GRADE_ITEMS.map((grade) => (
                    <li key={grade.key}>
                      <NavigationMenuLink asChild>
                        <Link href={grade.href} aria-current={active === grade.key ? "page" : undefined}>
                          <span className="font-medium">{grade.label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/songs"
                  aria-current={active === "songs" ? "page" : undefined}
                >
                  For Teachers
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/about"
                  aria-current={active === "about" ? "page" : undefined}
                >
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  className="flex-row gap-2 whitespace-nowrap"
                  href="/search"
                  aria-label="Search lessons"
                  aria-current={active === "search" ? "page" : undefined}
                >
                  <Search aria-hidden="true" />
                  <span>Search</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden items-center lg:flex">
          <ThemeSwitcher />
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <MobileNavigation active={active} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
