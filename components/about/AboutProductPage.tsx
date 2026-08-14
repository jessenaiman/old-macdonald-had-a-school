import Link from "next/link"
import type { ReactNode } from "react"

import { BrandPatchCard } from "@/components/brand/BrandPatchCard"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const strengths = [
  ["Curriculum thinking", "I organize standards, learning goals, lesson structures, and source material without flattening the educational intent."],
  ["Content systems", "I turn scattered research and editable source files into traceable content models that support real publishing workflows."],
  ["Product design", "I design interfaces around the next useful decision, then build and verify the responsive experience in code."],
] as const

const workflow = [
  ["Understand the source", "Research before decoration.", "Map the curriculum, audience, evidence, constraints, and provenance that the product must preserve."],
  ["Shape the system", "Make the structure teachable.", "Create content boundaries, reusable templates, and workflows that can grow without becoming opaque."],
  ["Prove the experience", "Build, compare, and refine.", "Use real content and assets, responsive browser evidence, accessibility checks, and honest product language."],
] as const

const paths = [
  ["Teacher experience", "Planning-first information architecture", "/"],
  ["Brand system", "Canonical characters, roles, and visual governance", "/branding"],
  ["Content design", "Reusable lesson structures and editorial clarity", "/lessons"],
  ["Resource discovery", "Helping teachers find a useful starting point", "/search"],
] as const

export function AboutProductPage({ story }: { story: ReactNode }) {
  return (
    <div className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-12 px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <BrandPatchCard
        aria-labelledby="about-title"
        className="grid gap-0 p-0 lg:grid-cols-2 lg:grid-rows-[1fr_auto]"
      >
        <CardHeader className="justify-center gap-5 p-6 sm:p-10 lg:row-start-1 lg:p-14">
          <CardDescription className="text-xs font-black uppercase tracking-widest text-primary">
            Educational product design · curriculum systems
          </CardDescription>
          <CardTitle>
            <h1 id="about-title" className="font-heading text-5xl leading-none text-balance sm:text-6xl">
              I make complex learning content <em className="mt-2 block font-hand text-primary">clear enough to use.</em>
            </h1>
          </CardTitle>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Old MacDonald Had a School is both my company&apos;s teacher-resource product and a working demonstration of how I combine curriculum thinking, research, content architecture, visual storytelling, and frontend design.
          </p>
        </CardHeader>

        <CardContent className="relative flex min-w-0 flex-col justify-center gap-5 p-4 sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <span className="brand-hero-media-frame">
            <span className="brand-asset about-classroom-hero brand-hero-media" role="img" aria-label="Old MacDonald and the farm-school class learning together" />
          </span>
          <BrandPatchCard surface="pinned" fastener="pin" className="-mt-16 ml-auto w-[min(100%,22rem)] gap-3 p-0">
            <CardHeader className="gap-2 p-5 pb-0">
              <CardDescription>The work</CardDescription>
              <CardTitle>Research becomes a system.</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 text-sm">A system becomes something teachers can actually use.</CardContent>
          </BrandPatchCard>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3 p-6 pt-0 sm:px-10 sm:pb-10 lg:row-start-2 lg:p-14 lg:pt-0">
          <Button asChild><Link href="/#browse-by-subject">Explore the product</Link></Button>
          <Button asChild variant="outline"><Link href="/branding">See the brand system</Link></Button>
        </CardFooter>
      </BrandPatchCard>

      <section aria-labelledby="strengths-title">
        <p className="text-xs font-black uppercase tracking-widest text-primary">What I bring to a team</p>
        <h2 id="strengths-title" className="mt-2 font-hand text-4xl sm:text-5xl">I connect educational substance with product execution.</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {strengths.map(([title, copy]) => (
            <BrandPatchCard key={title} className="h-full gap-4 p-0">
              <CardHeader className="gap-2 p-6 pb-0">
                <CardDescription>What I bring</CardDescription>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="leading-7 text-muted-foreground">{copy}</CardContent>
              <CardFooter className="px-6 pb-6 pt-0 text-sm font-bold text-primary">Sewn into the system</CardFooter>
            </BrandPatchCard>
          ))}
        </div>
      </section>

      <section className="material-surface material-denim-indigo rounded-2xl p-6 sm:p-10" aria-labelledby="workflow-title">
        <p className="text-xs font-black uppercase tracking-widest">How I work</p>
        <h2 id="workflow-title" className="mt-2 font-hand text-4xl sm:text-5xl">From ambiguity to a usable product</h2>
        <ol className="mt-7 grid gap-5 md:grid-cols-3">
          {workflow.map(([label, title, copy], index) => (
            <li key={label} className="min-w-0">
              <BrandPatchCard surface="pinned" fastener={index === 0 ? "clip" : index === 1 ? "tape" : "pin"} className="h-full gap-4 p-0">
                <CardHeader className="gap-2 p-6 pb-0">
                  <CardDescription>{index + 1}. {label}</CardDescription>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="leading-7 text-muted-foreground">{copy}</CardContent>
                <CardFooter className="px-6 pb-6 pt-0 text-sm font-bold text-primary">A usable next step</CardFooter>
              </BrandPatchCard>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="evidence-title">
        <p className="text-xs font-black uppercase tracking-widest text-primary">Selected work · presentation blocks</p>
        <h2 id="evidence-title" className="mt-2 font-hand text-4xl sm:text-5xl">Show the thinking and the finished system</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <BrandPatchCard surface="pinned" fastener="clip" className="grid gap-0 p-0 lg:col-span-2 lg:grid-cols-2">
            <CardContent className="p-4 lg:row-span-3">
              <span className="brand-hero-media-frame">
                <span className="brand-asset about-classroom-hero brand-hero-media" role="img" aria-label="Old MacDonald Had a School classroom product artwork" />
              </span>
            </CardContent>
            <CardHeader className="self-end p-6 pb-0 sm:p-10 sm:pb-0">
              <CardDescription>Featured case study</CardDescription>
              <CardTitle>Lead with one strong project story.</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-3 text-muted-foreground sm:px-10 sm:pt-3">Replace this with the problem, your contribution, and the outcome you want an employer to remember.</CardContent>
            <CardFooter className="p-6 pt-0 sm:px-10 sm:pb-10"><Button asChild variant="outline"><Link href="/branding">Open the system guide</Link></Button></CardFooter>
          </BrandPatchCard>

          <BrandPatchCard className="h-full gap-4 p-0">
            <CardHeader className="gap-4 p-6 pb-0">
              <div className="flex items-end gap-4">
                <span className="brand-asset about-miss-hayley-profile icon-large" role="img" aria-label="Miss Hayley character artwork" />
                <span className="brand-asset math-building-icon icon-large" role="img" aria-label="Mathematics subject icon" />
              </div>
              <CardDescription>System evidence</CardDescription>
              <CardTitle>Brand and content working together.</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">A compact block for design-system, asset-governance, or curriculum examples.</CardContent>
            <CardFooter className="px-6 pb-6 pt-0 text-sm font-bold text-primary">Identity plus learning signal</CardFooter>
          </BrandPatchCard>

          <BrandPatchCard className="h-full gap-4 p-0">
            <CardHeader className="gap-2 p-6 pb-0"><CardDescription>Process evidence</CardDescription><CardTitle>Show the materials behind the interface.</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">A flexible block for research, prototypes, responsive comparisons, or implementation proof.</CardContent>
            <CardFooter className="px-6 pb-6 pt-0 text-sm font-bold text-primary">Source, system, proof</CardFooter>
          </BrandPatchCard>
        </div>
      </section>

      <section aria-labelledby="paths-title">
        <p className="text-xs font-black uppercase tracking-widest text-primary">Old MacDonald Had a School</p>
        <h2 id="paths-title" className="mt-2 font-hand text-4xl sm:text-5xl">One product, several disciplines working together</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map(([title, copy, href]) => (
            <BrandPatchCard key={href} className="h-full gap-4 p-0">
              <CardHeader className="gap-2 p-6 pb-0"><CardTitle>{title}</CardTitle><CardDescription>{copy}</CardDescription></CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="px-6 pb-6 pt-0"><Button asChild variant="outline"><Link href={href}>Open</Link></Button></CardFooter>
            </BrandPatchCard>
          ))}
        </div>
      </section>

      <Separator />

      <section aria-labelledby="story-title">
        <p className="text-xs font-black uppercase tracking-widest text-primary">About the company and its creator</p>
        <h2 id="story-title" className="mt-2 font-hand text-4xl sm:text-5xl">Research, curriculum thinking, and product design in one system</h2>
        <div className="mt-6 grid items-start gap-5 lg:grid-cols-3">
          <BrandPatchCard surface="pinned" className="gap-0 p-0 lg:col-span-2">
            <CardContent className="p-6 [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_li]:leading-7 [&_p]:leading-7 [&_p]:text-muted-foreground sm:p-8">{story}</CardContent>
            <CardFooter className="border-t border-border px-6 py-4 text-sm font-bold text-primary">The source stays editable.</CardFooter>
          </BrandPatchCard>
          <BrandPatchCard className="gap-4 p-0">
            <CardHeader className="gap-2 p-6 pb-0"><CardDescription>For collaborators and employers</CardDescription><CardTitle>I can carry educational work from messy source material to a coherent product.</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4 text-muted-foreground"><p>I am interested in roles and collaborations where curriculum organization, resource research, content modelling, educational UX, and thoughtful visual design need to work together.</p><Button asChild variant="outline"><Link href="/branding">Explore the brand and asset guide</Link></Button></CardContent>
            <CardFooter className="px-6 pb-6 pt-0 text-sm font-bold text-primary">Ready for the next decision</CardFooter>
          </BrandPatchCard>
        </div>
      </section>
      </div>
    </div>
  )
}
