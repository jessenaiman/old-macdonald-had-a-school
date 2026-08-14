"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const SLIDES = [
  { assetClass: "home-scene-class-gathering", alt: "Old MacDonald and the farm-school class gathered for outdoor music", label: "Browse curriculum topics", href: "/topics" },
  { assetClass: "home-scene-growing-together", alt: "Farm-school friends observing and caring for a young plant", label: "Choose a ready-to-teach lesson", href: "/lessons" },
  { assetClass: "home-scene-music-landscape", alt: "Old MacDonald and friends discovering music in an imaginative stitched landscape", label: "Find music teaching resources", href: "/search?q=music" },
  { assetClass: "home-scene-schoolhouse", alt: "The welcoming red barn farm school", label: "Plan for a grade", href: "/grade/pre-school" },
] as const;

export function HomeCarousel() {
  const [active, setActive] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const slide = SLIDES[active];

  useEffect(() => {
    if (!api) return;
    const updateActive = () => setActive(api.selectedScrollSnap());
    updateActive();
    api.on("select", updateActive);
    return () => { api.off("select", updateActive); };
  }, [api]);

  return (
    <Carousel className="material-surface material-denim-indigo min-w-0 rotate-[0.6deg] rounded-xl border border-dashed border-current p-4 shadow-[0_0_0_0.45rem_color-mix(in_srgb,var(--theme-denim)_60%,transparent),0_0.75rem_1.5rem_color-mix(in_srgb,var(--theme-navy)_38%,transparent)] motion-reduce:rotate-0" opts={{ loop: true }} setApi={setApi} aria-label="Featured teaching resources">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-heading text-lg">From the farm to your lesson plan</p>
        <p className="text-xs text-primary-foreground/80">Choose a classroom path</p>
      </div>
      <div className="relative aspect-video w-full border-4 border-card bg-primary shadow-sm [&_[data-slot=carousel-content]]:h-full">
        <CarouselContent className="ml-0 h-full">
          {SLIDES.map((item) => (
            <CarouselItem className="relative h-full pl-0" key={item.assetClass}>
              <Link className="absolute inset-0" href={item.href} aria-label={`${item.label}: ${item.alt}`}>
                <span className={`brand-asset ${item.assetClass} !block !size-full`} aria-hidden="true" />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1" role="group" aria-label="Choose a featured scene">
          {SLIDES.map((item, index) => (
            <Button className={index === active ? undefined : "text-primary-foreground hover:text-foreground"} variant={index === active ? "secondary" : "ghost"} size="icon-sm" type="button" aria-label={`Show ${item.label}`} aria-pressed={index === active} onClick={() => api?.scrollTo(index)} key={item.label}>
              <span className="h-1 w-5 rounded-full bg-current" aria-hidden="true" />
            </Button>
          ))}
        </div>
        <Link className="text-sm font-bold text-primary-foreground underline underline-offset-4" href={slide.href}>{slide.label} <span aria-hidden="true">→</span></Link>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">Showing {slide.label}</span>
      </div>
    </Carousel>
  );
}
