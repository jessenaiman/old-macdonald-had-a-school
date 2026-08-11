import { AboutProductPage } from "@/components/about/AboutProductPage";
import { SiteShell } from "../../components/SiteShell";
import AboutContent from "../../content/pages/about.mdx";

export default function AboutPage() {
  return (
    <SiteShell active="about">
      <AboutProductPage story={<AboutContent />} />
    </SiteShell>
  );
}
