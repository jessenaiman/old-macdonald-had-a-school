import type { Metadata } from "next";
import {
  Boogaloo,
  Lilita_One,
  Nunito,
  Playfair_Display,
} from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { BRAND_IMAGE_ASSETS } from "../data/brand/image-registry";
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
    {
      path: "../public/design-assets/background-textures/Caveat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/design-assets/background-textures/Caveat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-farm-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teacher Resources | Old MacDonald Had a School",
  description:
    "Where familiar songs become new places to learn. Pick your classroom, browse new lessons, and find teacher-ready resources for every early-years grade.",
  icons: {
    icon: [
      {
        url: BRAND_IMAGE_ASSETS.emblem.micro,
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: BRAND_IMAGE_ASSETS.emblem.favicon,
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: BRAND_IMAGE_ASSETS.emblem.favicon,
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
      className={cn(
        bodyFont.variable,
        displayFont.variable,
        sectionFont.variable,
        brandFont.variable,
        handFont.variable
      )}
      data-brand="omhas"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only fixed left-4 top-4 z-50 rounded-md bg-brand-navy px-4 py-3 font-bold text-brand-navy-foreground shadow-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-brand-paper focus:ring-offset-2 focus:ring-offset-brand-navy"
          >
            Skip to lesson content
          </a>
          <main id="main-content" className="flex min-h-dvh min-w-0 flex-col">
            {children}
          </main>
        </ThemeProvider>
        {/* impeccable-live-start */}
        {/* impeccable-live-end */}
      </body>
    </html>
  );
}
