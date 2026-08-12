import { AboutProductPage } from "@/components/about/AboutProductPage";
import AboutContent from "../../content/pages/about.mdx";

export default function AboutPage() {
  return <AboutProductPage story={<AboutContent />} />;
}
