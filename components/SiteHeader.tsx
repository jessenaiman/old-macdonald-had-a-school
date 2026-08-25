"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ResponsiveBrandEmblem } from "./brand/ResponsiveBrandEmblem";
import { Search } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  activePageFromPathname,
  GRADE_TAB_COLORS,
  NAV_ITEMS,
  TEACHER_GRADE_ITEMS,
} from "./site-navigation";
import { cn } from "@/lib/utils";

const HEADER_LINK_CLASS = cn(
  navigationMenuTriggerStyle(),
  "min-h-11 bg-transparent px-3 text-brand-navy-foreground/80 hover:bg-brand-navy-foreground/10 hover:text-brand-navy-foreground focus:bg-brand-navy-foreground/10 focus:text-brand-navy-foreground data-[state=open]:bg-transparent aria-[current=page]:text-accent"
);

export function SiteHeader() {
  const active = activePageFromPathname(usePathname());

  return (
    <header className="bg-brand-navy border-b border-brand-navy-foreground/10 sticky top-0 z-40">
      <div className="relative min-w-0 w-full min-h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <Link
          className="inline-flex min-h-11 items-center gap-3 shrink-0"
          href="/"
          aria-label="Old MacDonald Had a School home"
        >
          <ResponsiveBrandEmblem className="h-8 w-auto" />
          <span className="hidden sm:inline-flex flex-col items-start">
            <strong className="font-brand text-sm leading-none sm:text-base text-brand-navy-foreground">
              Old MacDonald Had a School
            </strong>
            <small className="text-xs font-black uppercase tracking-widest text-accent">
              Teacher Lesson Resources
            </small>
          </span>
        </Link>

        {/* Desktop/tablet navigation — shadcn NavigationMenu, grades inline (no dropdown) */}
        <NavigationMenu className="hidden flex-1 lg:flex max-w-full" viewport={false}>
          <NavigationMenuList className="flex-1 gap-1">
            {NAV_ITEMS.map((item) => (
              <NavigationMenuItem key={item.key}>
                <NavigationMenuLink asChild className={HEADER_LINK_CLASS}>
                  <Link
                    href={item.href}
                    aria-current={active === item.key ? "page" : undefined}
                    className={item.key === "search" ? "gap-1.5" : undefined}
                  >
                    {item.key === "search" ? <><Search className="size-4" aria-hidden="true" /><span>Search</span></> : item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            {TEACHER_GRADE_ITEMS.map((grade) => (
              <NavigationMenuItem key={grade.key} className="flex-1">
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "flex w-full min-h-11 whitespace-nowrap items-center justify-center px-4 py-1.5 text-center text-sm font-medium rounded",
                    GRADE_TAB_COLORS[grade.key].surface,
                    GRADE_TAB_COLORS[grade.key].ink
                  )}
                >
                  <Link
                    href={grade.href}
                    aria-current={active === grade.key ? "page" : undefined}
                  >
                    {grade.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop right side */}
        <div className="hidden items-center gap-4 lg:flex">
          <ThemeSwitcher />
        </div>

        {/* Mobile/tablet hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <MobileNavigation active={active} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
