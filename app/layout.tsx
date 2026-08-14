import type { Metadata } from "next";
import { Lilita_One, Nunito } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "../components/ThemeProvider";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import "./globals.css";

const bodyFont = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-farm-body",
  display: "swap",
});

const displayFont = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-farm-display",
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
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} ${handFont.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
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
            <main className="material-surface material-cardboard-kraft flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
