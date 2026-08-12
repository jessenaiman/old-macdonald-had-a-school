import type { Metadata } from "next";
import BrandingGuide from "../../../content/pages/branding-guide.mdx";

export const metadata: Metadata = {
  title: "Branding guide source | Old MacDonald Had a School",
  description: "The scan-friendly MDX source behind the Old MacDonald Had a School branding reference.",
};

export default function BrandingGuidePage() {
  return <article className="typeset-farm-reading mx-auto my-8 max-w-4xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-10"><BrandingGuide /></article>;
}
