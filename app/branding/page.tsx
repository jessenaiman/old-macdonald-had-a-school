import Overview from "../../content/pages/branding/overview.mdx"

export const metadata = {
  title: "Brand and asset guide | Old MacDonald Had a School",
  description: "Find allowed assets, production components, and the files that own the site theme.",
}

export default function BrandingPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-8">
      <Overview />
    </div>
  )
}
