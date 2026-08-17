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

/**
 * Site-specific header that composes the installed NavigationMenu and mobile
 * Sheet navigation around the project route configuration.
 * Navigation order: Grades → Subjects → Search → About
 */
export function SiteHeader() {
  const active = activePageFromPathname(usePathname());

  return (
    <header className="bg-primary/5 border-b border-border sticky top-0 z-40">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2 shrink-0"
          href="/"
          aria-label="Old MacDonald Had a School home"
        >
          <ResponsiveBrandEmblem className="h-8 w-auto" />
        </Link>

        <NavigationMenu
          className="hidden flex-1 font-display lg:flex"
          aria-label="Primary navigation"
          viewport={false}
        >
          <NavigationMenuList className="flex items-center gap-1">
            {/* Grades - first, as teachers navigate by grade level */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground">
                Grades
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-56">
                <ul className="grid gap-1 p-1">
                  {TEACHER_GRADE_ITEMS.map((grade) => (
                    <li key={grade.key}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={grade.href}
                          aria-current={active === grade.key ? "page" : undefined}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {grade.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Subjects */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/#browse-by-subject"
                  aria-current={active === "topics" ? "page" : undefined}
                  className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
                >
                  Subjects
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Search */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/search"
                  aria-label="Search lessons"
                  aria-current={active === "search" ? "page" : undefined}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
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
                  className="px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeSwitcher />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <MobileNavigation active={active} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}