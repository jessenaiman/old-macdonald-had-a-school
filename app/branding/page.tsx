import Overview from "../../content/pages/branding/overview.mdx";
import PageRecipe from "../../content/pages/branding/page-recipe.mdx";
import Assets from "../../content/pages/branding/assets.mdx";
import LogoFamily from "../../content/pages/branding/logo-family.mdx";
import Icons from "../../content/pages/branding/icons.mdx";
import IconSizes from "../../content/pages/branding/icon-sizes.mdx";
import Cast from "../../content/pages/branding/cast.mdx";
import SubjectCards from "../../content/pages/branding/subject-cards.mdx";
import BadgeRecipe from "../../content/pages/branding/badge-recipe.mdx";
import Typography from "../../content/pages/branding/typography.mdx";
import Buttons from "../../content/pages/branding/buttons.mdx";
import Controls from "../../content/pages/branding/controls.mdx";
import Grades from "../../content/pages/branding/grades.mdx";
import Governance from "../../content/pages/branding/governance.mdx";
import Sources from "../../content/pages/branding/sources.mdx";
import Palette from "../../content/pages/branding/palette.mdx";

export const metadata = {
  title: "Brand and asset guide | Old MacDonald Had a School",
  description: "The working visual reference for building consistent Old MacDonald Had a School pages.",
};

export default function BrandingPage() {
  return (
    <main className="w-full bg-background px-2 py-2 text-foreground sm:px-6 sm:py-6 xl:px-20">
      <div className="mx-auto max-w-[1280px]">
        <Overview />
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <PageRecipe />
            <Assets />
            <LogoFamily />
            <Icons />
            <IconSizes />
            <Cast />
            <SubjectCards />
            <BadgeRecipe />
            <Typography />
            <Buttons />
            <Controls />
            <Grades />
            <Governance />
            <Sources />
          </div>
          <aside className="order-first min-w-0 xl:order-none xl:sticky xl:top-4" aria-label="Live branding reference">
            <Palette />
          </aside>
        </div>
      </div>
    </main>
  );
}
