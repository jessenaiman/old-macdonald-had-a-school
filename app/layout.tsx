import type { Metadata } from "next";
import { Boogaloo, Lilita_One, Nunito, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { BookOpen, HelpCircle, Menu, Moon, Search, Sun, Wrench } from "lucide-react";
import { BRAND_IMAGE_ASSETS } from "../data/brand/image-registry";
import { ResponsiveBrandEmblem } from "../components/brand/ResponsiveBrandEmblem";
import { NAV_ITEMS, TEACHER_GRADE_ITEMS } from "../components/site-navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import "./globals.css";

const bodyFont = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-farm-body",
  display: "swap",
});

const displayFont = Boogaloo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-farm-display",
  display: "swap",
});

const sectionFont = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-farm-section",
  display: "swap",
});

const brandFont = Playfair_Display({
  subsets: ["latin"],
  weight: "700",
  style: "italic",
  variable: "--font-farm-brand",
  display: "swap",
});

const handFont = localFont({
  src: [
    { path: "../public/design-assets/background-textures/Caveat-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/design-assets/background-textures/Caveat-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-farm-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teacher Resources | Old MacDonald Had a School",
  description:
    "Curriculum-organized lesson starting points for individual grades, with clear teaching sequences and practical resources.",
  icons: {
    icon: [
      { url: BRAND_IMAGE_ASSETS.emblem.micro, sizes: "16x16", type: "image/png" },
      { url: BRAND_IMAGE_ASSETS.emblem.favicon, sizes: "32x32", type: "image/png" },
    ],
    shortcut: BRAND_IMAGE_ASSETS.emblem.favicon,
  },
};

const HEADER_LINK_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-medium text-brand-navy-foreground/80 hover:bg-brand-navy-foreground/10 hover:text-brand-navy-foreground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(bodyFont.variable, displayFont.variable, sectionFont.variable, brandFont.variable, handFont.variable)}
      data-brand="omhas"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
  var KEY = "theme";
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  var dark = stored === "dark" || (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  var root = document.documentElement;
  root.classList.toggle("dark", dark);
  function onReady(fn) {
    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", fn); }
    else { fn(); }
  }
  onReady(function () {
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    function update() {
      root.classList.toggle("dark", dark);
      var label = "Switch to " + (dark ? "light" : "dark") + " theme";
      buttons.forEach(function (btn) {
        btn.setAttribute("aria-label", label);
        btn.setAttribute("title", label);
        btn.querySelectorAll("[data-theme-icon]").forEach(function (icon) {
          icon.hidden = icon.getAttribute("data-theme-icon") !== (dark ? "sun" : "moon");
        });
      });
    }
    update();
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        dark = !dark;
        try { localStorage.setItem(KEY, dark ? "dark" : "light"); } catch (e) {}
        update();
      });
    });
  });
})();`,
          }}
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col text-foreground">
          <a
            href="#main-content"
            className="sr-only fixed left-4 top-4 z-50 rounded-md bg-brand-navy px-4 py-3 font-bold text-brand-navy-foreground shadow-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-brand-paper focus:ring-offset-2 focus:ring-offset-brand-navy"
          >
            Skip to lesson content
          </a>

          <header className="sticky top-0 z-40 border-b border-brand-navy-foreground/10 bg-brand-navy">
            <div className="relative flex min-h-16 w-full min-w-0 items-center gap-4 px-4 sm:px-6 lg:px-8">
              <Link
                className="inline-flex min-h-11 shrink-0 items-center gap-3"
                href="/"
                aria-label="Old MacDonald Had a School home"
              >
                <ResponsiveBrandEmblem className="h-8 w-auto" />
                <span className="hidden flex-col items-start sm:inline-flex">
                  <strong className="font-brand text-sm leading-none text-brand-navy-foreground sm:text-base">
                    Old MacDonald Had a School
                  </strong>
                  <small className="text-xs font-black uppercase tracking-widest text-accent">
                    Teacher Lesson Resources
                  </small>
                </span>
              </Link>

              <nav className="hidden min-w-0 flex-1 xl:block" aria-label="Main">
                <ul className="flex items-center justify-end gap-1">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.key}>
                      <Link href={item.href} className={cn(HEADER_LINK_CLASS, item.key === "search" && "gap-1.5")}>
                        {item.key === "search" && <Search className="size-4" aria-hidden />}
                        {item.key === "search" ? "Search" : item.label}
                      </Link>
                    </li>
                  ))}
                  {TEACHER_GRADE_ITEMS.map((grade) => (
                    <li key={grade.key}>
                      <Link
                        href={grade.href}
                        data-grade={grade.key}
                        className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md bg-grade px-2.5 text-sm font-medium text-grade-foreground hover:bg-grade/90"
                      >
                        {grade.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="hidden xl:block">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-theme-toggle
                  aria-label="Switch theme"
                  title="Switch theme"
                  className="size-11 text-brand-navy-foreground"
                >
                  <span data-theme-icon="sun" hidden aria-hidden="true"><Sun data-icon="inline-start" /></span>
                  <span data-theme-icon="moon" hidden aria-hidden="true"><Moon data-icon="inline-start" /></span>
                </Button>
              </div>

              <div className="ml-auto flex items-center gap-2 xl:hidden">
                <details className="group">
                  <summary className="flex min-h-11 list-none cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-medium text-brand-navy-foreground hover:bg-brand-navy-foreground/10 [&::-webkit-details-marker]:hidden">
                    <Menu className="size-5" aria-hidden="true" />
                    <span>Menu</span>
                  </summary>
                  <nav
                    aria-label="Mobile navigation"
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 rounded-md border border-brand-navy-foreground/15 bg-brand-navy p-3 shadow-2xl"
                  >
                    <ul className="flex flex-col gap-0.5">
                      {NAV_ITEMS.map((item) => (
                        <li key={item.key}>
                          <Link href={item.href} className={HEADER_LINK_CLASS}>
                            {item.key === "search" ? "Search" : item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="px-3 pb-1 pt-3 text-xs font-black uppercase tracking-widest text-brand-navy-foreground/60">
                      Grades
                    </p>
                    <ul className="flex flex-col gap-0.5">
                      {TEACHER_GRADE_ITEMS.map((grade) => (
                        <li key={grade.key}>
                          <Link
                            href={grade.href}
                            data-grade={grade.key}
                            className="inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-md bg-grade px-2.5 text-sm font-medium text-grade-foreground hover:bg-grade/90"
                          >
                            {grade.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </details>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-theme-toggle
                  aria-label="Switch theme"
                  title="Switch theme"
                  className="size-11 text-brand-navy-foreground"
                >
                  <span data-theme-icon="sun" hidden aria-hidden="true"><Sun data-icon="inline-start" /></span>
                  <span data-theme-icon="moon" hidden aria-hidden="true"><Moon data-icon="inline-start" /></span>
                </Button>
              </div>
            </div>
          </header>

          <main id="main-content" className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="min-w-0 flex-1 flex-col">{children}</div>
          </main>

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
        </div>
      </body>
    </html>
  );
}