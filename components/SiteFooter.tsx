import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return <footer className="site-footer material-site-leather">
    <span className="site-footer-fastener site-footer-fastener-left brand-asset fastener-brass-rivet" aria-hidden="true" />
    <span className="site-footer-fastener site-footer-fastener-right brand-asset fastener-brass-rivet" aria-hidden="true" />
    <Card className="site-footer-card typeset-farm-ui mx-auto max-w-7xl gap-0 border-0 bg-transparent px-5 py-0 text-inherit shadow-none sm:px-8">
      <CardHeader className="site-footer-main grid gap-6 px-0 py-7 md:grid-cols-[1.35fr_1fr_1fr] md:items-start md:gap-10">
        <div className="max-w-sm"><Link className="site-footer-brand" href="/" aria-label="Old MacDonald Had a School home"><Image src="/brand-emblem.png" alt="" width={48} height={48} /><span><strong>Old MacDonald Had a School</strong><small>Teacher lesson resources</small></span></Link><p className="site-footer-summary">Practical, playful lesson ideas organized for the grade and subject you teach.</p></div>
        <nav className="site-footer-nav" aria-label="Plan lessons"><strong>Plan lessons</strong><Link href="/lessons">Browse all lessons</Link><Link href="/#browse-by-subject">Browse by subject</Link><Link href="/search">Search lessons</Link></nav>
        <nav className="site-footer-nav" aria-label="About the school"><strong>The farm school</strong><Link href="/about">About</Link><Link href="/branding">Brand &amp; cast guide</Link><Link href="/about#contact">Contact</Link></nav>
      </CardHeader>
      <CardContent className="px-0"><Separator className="bg-white/15" /></CardContent>
      <CardFooter className="site-footer-legal flex flex-col gap-3 px-0 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="m-0">© 2024 Old MacDonald Had a School</p><div className="flex flex-wrap gap-x-6 gap-y-2"><Link href="/about#privacy-policy">Privacy Policy</Link><Link href="/about#terms-of-use">Terms of Use</Link><Link href="/about#contact">Contact</Link></div></CardFooter>
    </Card>
  </footer>;
}
