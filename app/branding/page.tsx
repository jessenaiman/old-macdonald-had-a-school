import Overview from "../../content/pages/branding/overview.mdx"
import PageRecipe from "../../content/pages/branding/page-recipe.mdx"
import Assets from "../../content/pages/branding/assets.mdx"
import HomepageSurface from "../../content/pages/branding/homepage-surface.mdx"
import LogoFamily from "../../content/pages/branding/logo-family.mdx"
import Icons from "../../content/pages/branding/icons.mdx"
import IconSizes from "../../content/pages/branding/icon-sizes.mdx"
import Cast from "../../content/pages/branding/cast.mdx"
import SubjectCards from "../../content/pages/branding/subject-cards.mdx"
import BadgeRecipe from "../../content/pages/branding/badge-recipe.mdx"
import Typography from "../../content/pages/branding/typography.mdx"
import Buttons from "../../content/pages/branding/buttons.mdx"
import Controls from "../../content/pages/branding/controls.mdx"
import Grades from "../../content/pages/branding/grades.mdx"
import Governance from "../../content/pages/branding/governance.mdx"
import Sources from "../../content/pages/branding/sources.mdx"
import Palette from "../../content/pages/branding/palette.mdx"

export const metadata = {
  title: "Brand and asset guide | Old MacDonald Had a School",
  description: "Find allowed assets, production components, and the files that own the site theme.",
}

export default function BrandingPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-8">
      <Overview />
      <PageRecipe />
      <Assets />
      <HomepageSurface />
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
      <Palette />
    </div>
  )
}
