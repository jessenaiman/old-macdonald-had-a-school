import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const proofPoints: ReadonlyArray<readonly [string, string]> = [
  [
    "Grade-first planning",
    "Lessons are surfaced by grade and subject first, so a teacher finds the right starting point without sorting through unrelated material.",
  ],
  [
    "Curriculum-based search",
    "Search pulls from the source curriculum records, so results keep standards context instead of flattening it into a list.",
  ],
  [
    "Planning-ready structure",
    "Lessons carry reusable metadata and teaching notes, making the next planning step concrete instead of starting from a blank page.",
  ],
];

const valueColumns: ReadonlyArray<{ title: string; bullets: string[] }> = [
  {
    title: "What teachers get",
    bullets: [
      "Clear route: grade, subject, then lesson.",
      "Readable routines and teaching notes.",
      "A simple planning flow, not another library to browse.",
    ],
  },
  {
    title: "What employers should know",
    bullets: [
      "Built as a product, not a static page.",
      "Typographic, asset, and responsive systems held together.",
      "Designed for fast, decision-first classroom workflows.",
    ],
  },
];

const summary =
  "Old MacDonald Had a School demonstrates an approach to educational web products: make the source material editable, keep the interface calm, and organize only the information that helps a teacher make the next decision. It is both a working teacher-resource product and a portfolio of curriculum thinking, content systems, and responsive product design working together.";

export function AboutProductPage({ story }: { story: ReactNode }) {
  return (
    <div className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-3 py-8 sm:px-6 sm:py-12">
        {/* Hero statement */}
        <section aria-labelledby="about-title" className="flex flex-col gap-4">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            {story ? "About the project and its creator" : "About"}
          </p>
          <h1
            id="about-title"
            className="max-w-3xl font-heading text-4xl leading-none text-balance sm:text-6xl"
          >
            I make lesson planning quick, practical, and{" "}
            <em className="font-hand text-primary not-italic">teachable.</em>
          </h1>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            {summary}
          </p>
        </section>

        {/* Design proof points — 3 column */}
        <section aria-labelledby="proof-heading">
          <h2
            id="proof-heading"
            className="font-heading text-2xl text-balance sm:text-3xl"
          >
            Design proof points
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {proofPoints.map(([title, body]) => (
              <Card key={title} className="h-full">
                <CardHeader className="gap-2">
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="text-xs font-black uppercase tracking-widest">
                    Design proof point
                  </CardDescription>
                </CardHeader>
                <CardContent className="leading-7 text-muted-foreground">
                  {body}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Value proposition — 2 column */}
        <section aria-labelledby="value-heading">
          <h2
            id="value-heading"
            className="font-heading text-2xl text-balance sm:text-3xl"
          >
            Why it works
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {valueColumns.map(({ title, bullets }) => (
              <Card key={title} className="h-full">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-2">
                    {bullets.map((item) => (
                      <li key={item} className="leading-6 text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/#browse-by-subject">Explore the product</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/branding">See the brand system</Link>
          </Button>
        </div>

        <Separator />

        {/* Story — rendered natively by Next.js MDX */}
        <section aria-labelledby="story-title">
          <h2 id="story-title" className="font-heading text-2xl text-balance sm:text-3xl">
            The story
          </h2>
          <Card className="mt-6">
            <CardContent className="p-6 sm:p-8 [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_li]:leading-7 [&_p]:leading-7 [&_p]:text-muted-foreground sm:p-8">
              {story}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}