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
import styles from "./HomePage.module.css";
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
    <Carousel className={styles.carousel} opts={{ loop: true }} setApi={setApi} aria-label="Explore the farm school">
      <div className={styles.carouselPhoto}>
        <CarouselContent className={styles.carouselTrack}>
          {SLIDES.map((item, index) => (
            <CarouselItem className={styles.carouselSlide} key={item.src}>
              <Link className={styles.carouselImageLink} href={item.href} aria-label={`${item.label}: ${item.alt}`}>
                <Image src={item.src} alt={item.alt} fill preload={index === 0} sizes="(max-width: 680px) 86vw, (max-width: 1000px) 44vw, 420px" />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <span className={`${styles.photoPinLeft} brand-asset fastener-push-pin`} aria-hidden="true" />
        <span className={`${styles.photoPinRight} brand-asset fastener-push-pin`} aria-hidden="true" />
        <CarouselPrevious className={`${styles.carouselArrow} ${styles.carouselPrevious}`} />
        <CarouselNext className={`${styles.carouselArrow} ${styles.carouselNext}`} />
      </div>
      {selected ? (
        <div className={styles.carouselNav}>
          <div role="group" aria-label="Choose a featured scene">
            {SLIDES.map((item, index) => (
              <Button variant="ghost" size="icon" className={index === active ? styles.carouselLinkActive : undefined} type="button" aria-label={`Show ${item.label}`} aria-pressed={index === active} onClick={() => api?.scrollTo(index)} key={item.label}>
                <span aria-hidden="true" />
              </Button>
            ))}
          </div>
          <Link href={slide.href}>{active === 0 ? "Meet the class" : slide.label} <span aria-hidden="true">-&gt;</span></Link>
          <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">Showing {slide.label}</span>
        </div>
      ) : (
        <nav className={styles.carouselNav} aria-label="Farm school features">
          {SLIDES.map((item, index) => (
            <Link className={index === active ? styles.carouselLinkActive : undefined} href={item.href} key={item.label} onMouseEnter={() => api?.scrollTo(index)} onFocus={() => api?.scrollTo(index)}>
              <span aria-hidden="true" />{item.label}
            </Link>
          ))}
        </nav>
      )}
    </Carousel>
  );
}
