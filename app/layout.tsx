import type { Metadata } from "next";
import { Boogaloo, Lilita_One, Nunito, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "../components/ThemeProvider";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
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
    { path: "../public/background-textures/Caveat-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/background-textures/Caveat-Bold.ttf", weight: "700", style: "normal" },
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
      { url: "/design-assets/brand-emblem-v1/individual-marks/brand-emblem-micro-16.png", sizes: "16x16", type: "image/png" },
      { url: "/design-assets/brand-emblem-v1/individual-marks/brand-emblem-favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/design-assets/brand-emblem-v1/individual-marks/brand-emblem-favicon-32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(bodyFont.variable, displayFont.variable, sectionFont.variable, brandFont.variable, handFont.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          themes={["light", "dark"]}
          disableTransitionOnChange
        >
          <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <SiteHeader />
            <main className="material-surface material-leather-indigo flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="mx-auto w-full min-w-0 flex-1 flex-col px-3 py-5 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
