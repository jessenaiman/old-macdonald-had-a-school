import Overview from "../../content/pages/branding/overview.mdx"
import PageRecipe from "../../content/pages/branding/page-recipe.mdx"
import Assets from "../../content/pages/branding/assets.mdx"
import Fabrics from "../../content/pages/branding/fabrics.mdx"
import HomepageSurface from "../../content/pages/branding/homepage-surface.mdx"
import LogoFamily from "../../content/pages/branding/logo-family.mdx"
import IconSizes from "../../content/pages/branding/icon-sizes.mdx"
import SubjectCards from "../../content/pages/branding/subject-cards.mdx"
import BadgeRecipe from "../../content/pages/branding/badge-recipe.mdx"
import Typography from "../../content/pages/branding/typography.mdx"
import Buttons from "../../content/pages/branding/buttons.mdx"
import Controls from "../../content/pages/branding/controls.mdx"
import Grades from "../../content/pages/branding/grades.mdx"
import Sources from "../../content/pages/branding/sources.mdx"
import Palette from "../../content/pages/branding/palette.mdx"
import { BrandingLookup } from "@/components/brand/BrandingOverview"

export const metadata = {
  title: "Brand and asset guide | Old MacDonald Had a School",
  description: "Find allowed assets, production components, and the files that own the site theme.",
}

export default function BrandingPage() {
  return (
    <div>
      <Overview />
      <BrandingLookup />
      <PageRecipe />
      <Assets />
      <Fabrics />
      <HomepageSurface />
      <LogoFamily />
      <IconSizes />
      <SubjectCards />
      <BadgeRecipe />
      <Typography />
      <Buttons />
      <Controls />
      <Grades />
      <Sources />
      <Palette />
    </div>
  )
}
