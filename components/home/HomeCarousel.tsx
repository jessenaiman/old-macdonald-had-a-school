"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type HomeCarouselSlide = {
  assetClass: string;
  alt: string;
  label: string;
  href: string;
};

/** Slight alternating tilt so each scene reads as a photo pinned at a natural angle. */
const TILTS = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"] as const;

/**
 * Home-page composition of the installed shadcn Carousel. It owns only the
 * home-specific slide metadata, the accessible scene picker, and the subtle
 * per-slide tilt that gives the pinned-photo feel.
 */
export function HomeCarousel({
  slides,
  title,
  ariaLabel,
  pickerLabel,
}: {
  slides: readonly HomeCarouselSlide[];
  title: string;
  ariaLabel: string;
  pickerLabel: string;
}) {
  const [active, setActive] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const slide = slides[active] ?? slides[0];

  useEffect(() => {
    if (!api) return;
    const updateActive = () => setActive(api.selectedScrollSnap());
    updateActive();
    api.on("select", updateActive);
    return () => { api.off("select", updateActive); };
  }, [api]);

  return (
    <Carousel
      className="min-w-0 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm"
      opts={{ loop: true }}
      setApi={setApi}
      aria-label={ariaLabel}
    >
      <div className="mb-4">
        <p className="font-heading text-2xl">{title}</p>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted [&_[data-slot=carousel-content]]:h-full">
        <CarouselContent className="ml-0 h-full">
          {slides.map((item, index) => (
            <CarouselItem className="relative h-full pl-0" key={item.assetClass}>
              <div
                className={cn(
                  "absolute inset-0 m-auto h-[90%] w-[86%] overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-transform duration-300 hover:rotate-0",
                  TILTS[index % TILTS.length]
                )}
              >
                <Link className="absolute inset-0" href={item.href} aria-label={`${item.label}: ${item.alt}`}>
                  <span className={`brand-scene ${item.assetClass}`} aria-hidden="true" />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 border-border bg-background shadow-sm" />
        <CarouselNext className="right-3 border-border bg-background shadow-sm" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1" role="group" aria-label={pickerLabel}>
          {slides.map((item, index) => (
            <Button
              className={cn(index !== active && "text-muted-foreground hover:text-foreground")}
              variant={index === active ? "secondary" : "ghost"}
              size="icon-sm"
              type="button"
              aria-label={`Show ${item.label}`}
              aria-pressed={index === active}
              onClick={() => api?.scrollTo(index)}
              key={item.label}
            >
              <span className="h-1 w-5 rounded-full bg-current" aria-hidden="true" />
            </Button>
          ))}
        </div>
        <span aria-hidden="true" />
        {slide ? <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">Showing {slide.label}</span> : null}
      </div>
    </Carousel>
  );
}
