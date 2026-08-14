import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="material-surface material-leather-indigo relative z-0 mt-3 border-t-2 border-border text-foreground before:pointer-events-none before:absolute before:-top-3 before:left-2 before:right-2 before:-z-10 before:h-5 before:rounded-t-xl before:border before:border-b-0 before:border-border before:bg-[image:var(--material-image)] before:bg-[length:var(--material-size)] before:content-['']">
      <div className="mx-2 grid gap-3 rounded-lg border border-dashed border-accent/60 px-4 py-3 sm:mx-auto sm:w-full sm:max-w-screen-2xl">
        <nav className="grid grid-cols-2 gap-3 border-b border-foreground/15 pb-3 text-center sm:flex sm:flex-wrap sm:justify-center sm:gap-x-8 [&_a:last-child]:col-span-2" aria-label="Site links">
          <Link href="/lessons">Browse all lessons</Link>
          <Link href="/#browse-by-subject">Browse by subject</Link>
          <Link href="/search">Search lessons</Link>
          <Link href="/about">About</Link>
          <Link href="/branding">Brand &amp; cast guide</Link>
        </nav>
        <div className="flex flex-col items-center justify-between gap-2 text-center text-xs sm:flex-row sm:text-left">
          <p className="text-foreground/80">© {new Date().getFullYear()} Old MacDonald Had a School</p>
          <nav
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 [&_a:hover]:text-accent [&_a:hover]:underline [&_a:hover]:underline-offset-4"
            aria-label="Legal and contact links"
          >
            <Link href="/about#privacy-policy">Privacy Policy</Link>
            <Link href="/about#terms-of-use">Terms of Use</Link>
            <Link href="/about#contact">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
