import { AboutProductPage } from "@/components/about/AboutProductPage";
import type { Metadata } from "next";
import AboutContent from "../../content/pages/about.mdx";

export const metadata: Metadata = {
  title: "About Old MacDonald Had a School",
  description: "Learn how Old MacDonald Had a School organizes practical music and early-years teaching resources.",
};

export default function AboutPage() {
  return <AboutProductPage story={<AboutContent />} />;
}
