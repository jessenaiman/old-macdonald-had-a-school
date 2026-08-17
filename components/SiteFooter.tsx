import Link from "next/link";
import { ResponsiveBrandEmblem } from "./brand/ResponsiveBrandEmblem";
import { BookOpen, Search, Music, Menu as MenuIcon, HelpCircle } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <h2 id="footer-heading" className="sr-only">
          Site footer
        </h2>
        
        {/* Main navigation links - emphasized as the primary footer content */}
        <nav className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10" aria-label="Main navigation">
          {/* Plan by topic - with icon */}
          <Link 
            href="/topics" 
            className="flex items-center gap-2 text-sm font-medium hover:text-primary-foreground/70 transition-colors group"
            aria-label="Plan by topic"
          >
            <BookOpen className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>Plan by topic</span>
          </Link>
          
          {/* Grades - with icon */}
          <Link 
            href="/grade/daycare" 
            className="flex items-center gap-2 text-sm font-medium hover:text-primary-foreground/70 transition-colors group"
            aria-label="Browse by grade"
          >
            <MenuIcon className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>Grades</span>
          </Link>
          
          {/* Search */}
          <Link 
            href="/search" 
            className="flex items-center gap-2 text-sm font-medium hover:text-primary-foreground/70 transition-colors group"
            aria-label="Search lessons"
          >
            <Search className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>Search lessons</span>
          </Link>
          
          {/* Songs */}
          <Link 
            href="/songs" 
            className="flex items-center gap-2 text-sm font-medium hover:text-primary-foreground/70 transition-colors group"
            aria-label="Song library"
          >
            <Music className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>Song library</span>
          </Link>
          
          {/* About */}
          <Link 
            href="/about" 
            className="flex items-center gap-2 text-sm font-medium hover:text-primary-foreground/70 transition-colors group"
            aria-label="About us"
          >
            <HelpCircle className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>About</span>
          </Link>
        </nav>

        {/* Divider */}
        <hr className="border-primary-foreground/10 mb-8" />

        {/* Brand + legal */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center" aria-label="Old MacDonald Had a School home">
              <ResponsiveBrandEmblem className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-primary-foreground/70 hidden sm:block">
              Songs teachers know. Lessons children love.
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
            <Link href="/about#privacy-policy" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Privacy</Link>
            <Link href="/about#terms-of-use" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Terms</Link>
            <Link href="/about#contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact</Link>
            <Link href="https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-1" aria-label="YouTube channel">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.166 3.166 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.166 3.166 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.166 3.166 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.166 3.166 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-primary-foreground/50 text-center md:text-left">
          &copy; {new Date().getFullYear()} Old MacDonald Had a School. All rights reserved.
        </p>
      </div>
    </footer>
  );
}