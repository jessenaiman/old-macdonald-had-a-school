import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const brass = "/design-assets/classroom-fasteners-v1/individual-icons/17-brass-rivet-top-v01.png";

export function SiteFooter() {
  return <footer className="site-footer material-site-leather">
    <span className="site-footer-fastener site-footer-fastener-left" aria-hidden="true"><Image src={brass} width={96} height={96} alt="" /></span>
    <span className="site-footer-fastener site-footer-fastener-right" aria-hidden="true"><Image src={brass} width={96} height={96} alt="" /></span>
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
        <div className="max-w-sm"><Link className="site-footer-brand" href="/" aria-label="Old MacDonald Had a School home"><Image src="/brand-emblem.png" alt="" width={48} height={48} /><span><strong>Old MacDonald Had a School</strong><small>Teacher lesson resources</small></span></Link><p className="site-footer-summary">Practical, playful lesson ideas organized for the grade and subject you teach.</p></div>
        <nav className="site-footer-nav" aria-label="Plan lessons"><strong>Plan lessons</strong><Link href="/lessons">Browse all lessons</Link><Link href="/#browse-by-subject">Browse by subject</Link><Link href="/search">Search lessons</Link></nav>
        <nav className="site-footer-nav" aria-label="About the school"><strong>The farm school</strong><Link href="/about">About</Link><Link href="/branding">Brand &amp; cast guide</Link><Link href="/about#contact">Contact</Link></nav>
      </div>
      <Separator className="my-6 bg-white/15" />
      <div className="site-footer-legal flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="m-0">© 2024 Old MacDonald Had a School</p><div className="flex flex-wrap gap-x-6 gap-y-2"><Link href="/about#privacy-policy">Privacy Policy</Link><Link href="/about#terms-of-use">Terms of Use</Link><Link href="/about#contact">Contact</Link></div></div>
    </div>
  </footer>;
}
