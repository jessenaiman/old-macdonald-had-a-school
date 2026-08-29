import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ResponsiveBrandEmblem } from "./brand/ResponsiveBrandEmblem";
import { BookOpen, Search, Wrench, HelpCircle } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-brand-navy text-brand-navy-foreground border-t border-brand-navy-foreground/10" aria-labelledby="footer-heading">
      <div className="relative px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <h2 id="footer-heading" className="sr-only">Site footer</h2>
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10" aria-label="Main navigation">
          <Link href="/topics" className="flex min-h-[44px] items-center gap-2 text-sm font-medium hover:text-brand-navy-foreground/70 transition-colors group" aria-label="Plan by topic">
            <BookOpen className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>Plan by topic</span>
          </Link>
          <Link href="/lessons" className="flex min-h-[44px] items-center gap-2 text-sm font-medium hover:text-brand-navy-foreground/70 transition-colors group" aria-label="Teacher toolbox">
            <Wrench className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>Teacher toolbox</span>
          </Link>
          <Link href="/search" className="flex min-h-[44px] items-center gap-2 text-sm font-medium hover:text-brand-navy-foreground/70 transition-colors group" aria-label="Search lessons">
            <Search className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>Search lessons</span>
          </Link>
          <Link href="/about" className="flex min-h-[44px] items-center gap-2 text-sm font-medium hover:text-brand-navy-foreground/70 transition-colors group" aria-label="About us">
            <HelpCircle className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>About</span>
          </Link>
        </nav>
        <Separator className="border-brand-navy-foreground/10 mb-8" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex min-h-[44px] items-center" aria-label="Old MacDonald Had a School home">
              <ResponsiveBrandEmblem className="h-8 w-auto" />
            </Link>
            <p className="font-hand hidden text-lg text-brand-navy-foreground/80 sm:block">Songs teachers know. Lessons children love.</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
            <Link href="/about#privacy-policy" className="flex min-h-[44px] items-center text-brand-navy-foreground/70 hover:text-brand-navy-foreground transition-colors">Privacy</Link>
            <Link href="/about#terms-of-use" className="flex min-h-[44px] items-center text-brand-navy-foreground/70 hover:text-brand-navy-foreground transition-colors">Terms</Link>
            <Link href="/about#contact" className="flex min-h-[44px] items-center text-brand-navy-foreground/70 hover:text-brand-navy-foreground transition-colors">Contact</Link>
            <Link href="https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ" target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-1 text-brand-navy-foreground/70 hover:text-brand-navy-foreground transition-colors" aria-label="YouTube channel">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.166 3.166 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.166 3.166 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.166 3.166 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.166 3.166 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-brand-navy-foreground/50 text-center md:text-left">&copy; {new Date().getFullYear()} Old MacDonald Had a School. All rights reserved.</p>
      </div>
    </footer>
  );
}
