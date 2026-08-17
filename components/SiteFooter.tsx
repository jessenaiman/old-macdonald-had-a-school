import Link from "next/link";
import { ResponsiveBrandEmblem } from "./brand/ResponsiveBrandEmblem";

export function SiteFooter() {
  return (
    <footer className="bg-muted/50 border-t border-border" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h2 id="footer-heading" className="sr-only">
          Site footer
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6" aria-label="Old MacDonald Had a School home">
              <ResponsiveBrandEmblem className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Songs teachers know. Lessons children love. Curriculum-organized resources for early childhood through Grade 2.
            </p>
          </div>

          <nav aria-label="Plan by topic">
            <h3 className="font-semibold text-foreground mb-4">Plan by topic</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/topics" className="text-muted-foreground hover:text-foreground transition-colors">All curriculum topics</Link></li>
              <li><Link href="/grade/daycare" className="text-muted-foreground hover:text-foreground transition-colors">Daycare</Link></li>
              <li><Link href="/grade/pre-school" className="text-muted-foreground hover:text-foreground transition-colors">Pre-School</Link></li>
              <li><Link href="/grade/kindergarten" className="text-muted-foreground hover:text-foreground transition-colors">Kindergarten</Link></li>
              <li><Link href="/grade/grade-one" className="text-muted-foreground hover:text-foreground transition-colors">Grade 1</Link></li>
              <li><Link href="/grade/grade-two" className="text-muted-foreground hover:text-foreground transition-colors">Grade 2</Link></li>
            </ul>
          </nav>

          <nav aria-label="Teacher toolbox">
            <h3 className="font-semibold text-foreground mb-4">Teacher toolbox</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">Search lessons</Link></li>
              <li><Link href="/songs" className="text-muted-foreground hover:text-foreground transition-colors">Song library</Link></li>
              <li><Link href="/lessons" className="text-muted-foreground hover:text-foreground transition-colors">Browse all lessons</Link></li>
              <li><Link href="/topics" className="text-muted-foreground hover:text-foreground transition-colors">Topic index</Link></li>
              <li><Link href="/branding" className="text-muted-foreground hover:text-foreground transition-colors">Brand & cast guide</Link></li>
            </ul>
          </nav>

          <nav aria-label="Connect">
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact us</Link></li>
              <li><Link href="/about#privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy policy</Link></li>
              <li><Link href="/about#terms-of-use" className="text-muted-foreground hover:text-foreground transition-colors">Terms of use</Link></li>
              <li><Link href="https://www.youtube.com/channel/UC_THbKUe6o-K64vh7gWCPyQ" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.166 3.166 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.166 3.166 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.166 3.166 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.166 3.166 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube channel
              </Link></li>
            </ul>
          </nav>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Old MacDonald Had a School. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link href="/about#privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/about#terms-of-use" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link href="/about#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}