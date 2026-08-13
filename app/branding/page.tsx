import Overview from "../../content/pages/branding/overview.mdx";
import PageRecipe from "../../content/pages/branding/page-recipe.mdx";
import Assets from "../../content/pages/branding/assets.mdx";
import Icons from "../../content/pages/branding/icons.mdx";
import IconSizes from "../../content/pages/branding/icon-sizes.mdx";
import Cast from "../../content/pages/branding/cast.mdx";
import BadgeRecipe from "../../content/pages/branding/badge-recipe.mdx";
import Typography from "../../content/pages/branding/typography.mdx";
import Buttons from "../../content/pages/branding/buttons.mdx";
import Controls from "../../content/pages/branding/controls.mdx";
import Grades from "../../content/pages/branding/grades.mdx";
import Governance from "../../content/pages/branding/governance.mdx";
import Sources from "../../content/pages/branding/sources.mdx";

export const metadata = {
  title: "Brand and asset guide | Old MacDonald Had a School",
  description: "The working visual reference for building consistent Old MacDonald Had a School pages.",
};

export default function BrandingPage() {
  return (
    <main className="w-full bg-[#dce7ea] px-[clamp(.5rem,4vw,5rem)] py-6 text-[#102842] max-sm:py-2">
      <div className="mx-auto max-w-[1280px]">
        <Overview />
        <PageRecipe />
        <Assets />
        <Icons />
        <IconSizes />
        <Cast />
        <BadgeRecipe />
        <Typography />
        <Buttons />
        <Controls />
        <Grades />
        <Governance />
        <Sources />
      </div>
    </main>
  );
}
