import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Page not found | Old MacDonald Had a School",
  description: "Find your way back to songs, grades, and teacher-ready resources.",
};

const GRADE_LINKS = [
  ["Daycare", "/grade/daycare"],
  ["Pre-school", "/grade/pre-school"],
  ["Kindergarten", "/grade/kindergarten"],
  ["Grade 1", "/grade/grade-one"],
  ["Grade 2", "/grade/grade-two"],
] as const;

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center px-4 py-12 sm:px-6">
      <Card className="card-paper relative w-full overflow-visible">
        <span className="brand-asset fastener-push-pin icon-small pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2" aria-hidden="true" />
        <CardHeader className="pt-10 text-center">
          <p className="font-hand text-xl italic text-[var(--ink-secondary)]">A note slipped off the working wall</p>
          <h1 className="mt-2 font-heading text-5xl leading-none text-brand-navy sm:text-7xl">That page wandered off.</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--ink-secondary)]">Let&apos;s get you back to something useful for the next classroom moment.</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pb-10">
          <div className="flex flex-wrap justify-center gap-3" aria-label="Primary recovery links">
            <Button asChild className="min-h-[44px]"><Link href="/songs">Browse songs <ArrowRight className="ml-1 size-4" aria-hidden="true" /></Link></Button>
            <Button asChild className="min-h-[44px]" variant="outline"><Link href="/search"><Search className="mr-1 size-4" aria-hidden="true" />Search lessons</Link></Button>
          </div>
          <nav className="flex max-w-2xl flex-wrap justify-center gap-2" aria-label="Grade hubs">
            {GRADE_LINKS.map(([label, href]) => <Button asChild className="min-h-[44px]" key={href} size="sm" variant="ghost"><Link href={href}>{label}</Link></Button>)}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}
