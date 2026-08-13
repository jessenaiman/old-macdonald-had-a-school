"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";
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

  return <header className="site-header material-site-leather">
    <div className="site-header-inner">
      <Link className="site-brand" href="/" aria-label="Old MacDonald Had a School home">
        <Image src="/brand-emblem.png" alt="" width={44} height={44} priority />
        <span><strong><span className="site-brand-full">Old MacDonald Had a School</span><span className="site-brand-short">Old MacDonald</span></strong><small>Had a School</small></span>
      </Link>
      <NavigationMenu className="site-nav-desktop" aria-label="Primary navigation" viewport={false}>
        <NavigationMenuList className="site-nav-primary-list">
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "home"}><Link className="site-nav-link" href="/" aria-current={active === "home" ? "page" : undefined}>Home</Link></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "lessons"}><Link className="site-nav-link" href="/lessons" aria-current={active === "lessons" ? "page" : undefined}>Lessons</Link></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "songs"}><Link className="site-nav-link" href="/songs" aria-current={active === "songs" ? "page" : undefined}>Songs</Link></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "topics"}><Link className="site-nav-link" href="/#browse-by-subject" aria-current={active === "topics" ? "page" : undefined}>Subjects</Link></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "about"}><Link className="site-nav-link" href="/about" aria-current={active === "about" ? "page" : undefined}>About</Link></NavigationMenuLink></NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList className="site-nav-grade-list" aria-label="Grade workspaces">
          <li className="site-nav-grade-label" aria-hidden="true">Grade workspaces</li>
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
        <MobileNavigation active={active} grades={GRADE_NAV_ITEMS} />
        <ThemeSwitcher />
      </div>
    </div>
  </header>;
}
