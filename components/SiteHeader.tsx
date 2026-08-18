"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
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
    <header className="bg-primary border-b border-primary-foreground/10 sticky top-0 z-40">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-3 shrink-0"
          href="/"
          aria-label="Old MacDonald Had a School home"
        >
          <ResponsiveBrandEmblem className="h-8 w-auto" />
          <span className="hidden sm:inline-flex flex-col items-start">
            <strong className="font-brand text-sm leading-none sm:text-base text-primary-foreground">
              Old MacDonald Had a School
            </strong>
            <small className="text-xs font-black uppercase tracking-widest text-accent">
              Teacher Lesson Resources
            </small>
          </span>
        </Link>

        {/* Desktop Navigation - visible at md+ (768px+) */}
        <NavigationMenu
          className="hidden flex-1 font-display md:flex"
          aria-label="Primary navigation"
          viewport={false}
        >
          <NavigationMenuList className="flex items-center gap-1">
            {/* Lessons */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/lessons"
                  aria-current={active === "lessons" ? "page" : undefined}
                  className="px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 border-b-2 border-transparent transition-colors hover:border-accent border-accent data-[state=active]:border-accent data-[state=active]:text-accent"
                >
                  Lessons
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Subjects */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/topics"
                  aria-current={active === "topics" ? "page" : undefined}
                  className="px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 border-b-2 border-transparent transition-colors hover:border-accent border-accent data-[state=active]:border-accent data-[state=active]:text-accent"
                >
                  Subjects
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Grades dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 border-b-2 border-transparent transition-colors hover:border-accent border-accent data-[state=open]:border-accent data-[state=open]:text-accent">
                Grades
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-56 bg-primary border-primary-foreground/10">
                <ul className="grid gap-1 p-1">
                  {TEACHER_GRADE_ITEMS.map((grade) => (
                    <li key={grade.key}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={grade.href}
                          aria-current={active === grade.key ? "page" : undefined}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-md transition-colors"
                        >
                          {grade.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Search */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/search"
                  aria-label="Search lessons"
                  aria-current={active === "search" ? "page" : undefined}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 border-b-2 border-transparent transition-colors hover:border-accent border-accent data-[state=active]:border-accent data-[state=active]:text-accent"
                >
                  <Search className="size-4" aria-hidden="true" />
                  <span>Search</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* About */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/about"
                  aria-current={active === "about" ? "page" : undefined}
                  className="px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 border-b-2 border-transparent transition-colors hover:border-accent border-accent data-[state=active]:border-accent data-[state=active]:text-accent"
                >
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop right side - theme toggle */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeSwitcher />
        </div>

        {/* Mobile hamburger button - below md only */}
        <div className="flex items-center gap-2 md:hidden">
          <MobileNavigation active={active} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}