"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { activePageFromPathname, GRADE_NAV_ITEMS } from "./site-navigation";

export function SiteHeader() {
  const active = activePageFromPathname(usePathname());

  return <header className="site-header material-site-fabric">
    <div className="site-header-inner">
      <Link className="site-brand" href="/" aria-label="Old MacDonald Had a School home">
        <Image src="/brand-emblem.png" alt="" width={44} height={44} priority />
        <span><strong><span className="site-brand-full">Old MacDonald Had a School</span><span className="site-brand-short">Old MacDonald</span></strong><small>Had a School</small></span>
      </Link>
      <NavigationMenu className="site-nav-desktop" aria-label="Primary navigation" viewport={false}>
        <NavigationMenuList>
          {GRADE_NAV_ITEMS.map((grade) => {
            const isActive = active === grade.key || grade.children?.some((child) => child.key === active);
            return <NavigationMenuItem key={grade.key}>
              <NavigationMenuLink asChild active={isActive}>
                <Link className={`site-nav-link site-nav-grade site-nav-grade-${grade.key}${isActive ? " is-active" : ""}`} href={grade.href} aria-current={isActive ? "page" : undefined}>{grade.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>;
          })}
          <NavigationMenuItem>
            <NavigationMenuLink asChild active={active === "search"}>
              <Link className={`site-nav-search${active === "search" ? " is-active" : ""}`} href="/search" aria-label="Search lessons" aria-current={active === "search" ? "page" : undefined}><FaMagnifyingGlass aria-hidden="true" /><span>Search</span></Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="site-desktop-theme"><ThemeSwitcher /></div>
      <div className="site-mobile-actions">
        <Button asChild variant="ghost" size="icon" className="site-mobile-search">
          <Link href="/search" aria-label="Search lessons" aria-current={active === "search" ? "page" : undefined}>
            <FaMagnifyingGlass aria-hidden="true" />
            <span className="sr-only">Search lessons</span>
          </Link>
        </Button>
        <MobileNavigation active={active} grades={GRADE_NAV_ITEMS} />
        <ThemeSwitcher />
      </div>
    </div>
  </header>;
}
