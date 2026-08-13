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
import styles from "./SiteChrome.module.css";

export function SiteHeader() {
  const active = activePageFromPathname(usePathname());

  return <header className={styles.header}>
    <div className={styles.headerInner}>
      <Link className={styles.brand} href="/" aria-label="Old MacDonald Had a School home">
        <Image src="/brand-emblem.png" alt="" width={44} height={44} priority />
        <span><strong><span className={styles.brandFull}>Old MacDonald Had a School</span><span className={styles.brandShort}>Old MacDonald</span></strong><small>Had a School</small></span>
      </Link>
      <NavigationMenu className={styles.desktopNav} aria-label="Primary navigation" viewport={false}>
        <NavigationMenuList className={styles.primaryList}>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "home"}><Link className={styles.navLink} href="/" aria-current={active === "home" ? "page" : undefined}>Home</Link></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "lessons"}><Link className={styles.navLink} href="/lessons" aria-current={active === "lessons" ? "page" : undefined}>Lessons</Link></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "songs"}><Link className={styles.navLink} href="/songs" aria-current={active === "songs" ? "page" : undefined}>Songs</Link></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "topics"}><Link className={styles.navLink} href="/#browse-by-subject" aria-current={active === "topics" ? "page" : undefined}>Subjects</Link></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "about"}><Link className={styles.navLink} href="/about" aria-current={active === "about" ? "page" : undefined}>About</Link></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink asChild active={active === "search"}><Link className={styles.searchLink} href="/search" aria-label="Search lessons" aria-current={active === "search" ? "page" : undefined}><FaMagnifyingGlass aria-hidden="true" /><span>Search</span></Link></NavigationMenuLink></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className={styles.desktopTheme}><ThemeSwitcher /></div>
      <div className={styles.mobileActions}>
        <MobileNavigation active={active} grades={GRADE_NAV_ITEMS} />
        <ThemeSwitcher />
      </div>
    </div>
  </header>;
}
