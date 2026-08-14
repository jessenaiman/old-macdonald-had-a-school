"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const SLIDES = [
  { src: "/scenes/hero/old-macs-open-circle-gathering.png", alt: "Old MacDonald and the farm-school class gathered for outdoor music", label: "Meet the class", href: "/topics" },
  { src: "/scenes/hero/home-journey-reflect-v1.png", alt: "Farm-school friends observing and caring for a young plant", label: "Explore lessons", href: "/lessons" },
  { src: "/scenes/hero/old-mac-branding-where-did-the-folder-go.png", alt: "Old MacDonald and friends discovering music in an imaginative stitched landscape", label: "Music lessons", href: "/search?q=music" },
  { src: "/scenes/hero/oldmac-school.png", alt: "The welcoming red barn farm school", label: "Meet the school", href: "/about" },
] as const;

export function HomeCarousel({ selected = false }: { selected?: boolean }) {
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
    <Carousel className="min-w-0" opts={{ loop: true }} setApi={setApi} aria-label="Explore the farm school">
      <div className="relative aspect-video w-full rotate-[0.35deg] border-8 border-card bg-primary shadow-lg">
        <CarouselContent className="ml-0 h-full">
          {SLIDES.map((item, index) => (
            <CarouselItem className="relative h-full pl-0" key={item.src}>
              <Link className="absolute inset-0" href={item.href} aria-label={`${item.label}: ${item.alt}`}>
                <Image src={item.src} alt={item.alt} fill preload={index === 0} sizes="(max-width: 680px) 86vw, (max-width: 1000px) 44vw, 420px" />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <span className="brand-asset fastener-push-pin icon-small absolute -left-5 -top-5 z-20 drop-shadow-md" aria-hidden="true" />
        <span className="brand-asset fastener-push-pin icon-small absolute -right-5 -top-5 z-20 drop-shadow-md" aria-hidden="true" />
        <CarouselPrevious className="-left-5" />
        <CarouselNext className="-right-5" />
      </div>
      {selected ? (
        <div className="mt-3 grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto]">
          <div className="flex justify-center gap-2" role="group" aria-label="Choose a featured scene">
            {SLIDES.map((item, index) => (
              <Button variant={index === active ? "secondary" : "ghost"} size="icon" type="button" aria-label={`Show ${item.label}`} aria-pressed={index === active} onClick={() => api?.scrollTo(index)} key={item.label}>
                <span className="h-1 w-6 rounded-full bg-current" aria-hidden="true" />
              </Button>
            ))}
          </div>
          <Link className="justify-self-end text-sm font-bold text-primary-foreground" href={slide.href}>{active === 0 ? "Meet the class" : slide.label} <span aria-hidden="true">→</span></Link>
          <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">Showing {slide.label}</span>
        </div>
      ) : (
        <nav className="mt-3 grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto]" aria-label="Farm school features">
          {SLIDES.map((item, index) => (
            <Link className={index === active ? "font-bold text-accent" : "text-primary-foreground"} href={item.href} key={item.label} onMouseEnter={() => api?.scrollTo(index)} onFocus={() => api?.scrollTo(index)}>
              <span aria-hidden="true" />{item.label}
            </Link>
          ))}
        </nav>
      )}
    </Carousel>
  );
}
