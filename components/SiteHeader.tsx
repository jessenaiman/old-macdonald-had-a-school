"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ResponsiveBrandEmblem } from "./brand/ResponsiveBrandEmblem";
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
  "bg-transparent px-3 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground focus:bg-primary-foreground/10 focus:text-primary-foreground data-[state=open]:bg-transparent aria-[current=page]:text-accent"
);

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

        {/* Desktop/tablet navigation — shadcn NavigationMenu, grades inline (no dropdown) */}
        <NavigationMenu
          className="hidden flex-1 lg:flex max-w-full justify-end"
          viewport={false}
        >
          <NavigationMenuList className="flex-1 justify-end gap-1">
            {NAV_ITEMS.map((item) => (
              <NavigationMenuItem key={item.key}>
                <NavigationMenuLink asChild className={HEADER_LINK_CLASS}>
                  <Link
                    href={item.href}
                    aria-current={active === item.key ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            {TEACHER_GRADE_ITEMS.map((grade) => (
              <NavigationMenuItem key={grade.key} className="flex-1">
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "block w-full whitespace-nowrap px-4 py-1.5 text-center text-sm font-medium text-white rounded",
                    GRADE_TAB_COLORS[grade.key]
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
