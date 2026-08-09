import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";

const bodyFont = localFont({
  src: [
    { path: "../public/background-textures/InstrumentSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/background-textures/InstrumentSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-farm-body",
  display: "swap",
});

const displayFont = localFont({
  src: "../public/background-textures/BricolageGrotesque-Bold.ttf",
  weight: "700",
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
    icon: "/brand-emblem.png",
    shortcut: "/brand-emblem.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} ${handFont.variable}`} suppressHydrationWarning>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
