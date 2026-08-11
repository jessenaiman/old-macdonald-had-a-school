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
import legacyStyles from "./HomePage.module.css";
import selectedStyles from "./BulletinHomePage.module.css";

const SLIDES = [
  { src: "/scenes/home-schoolhouse-classroom-hero-v1.png", alt: "Old MacDonald and the farm-school class learning together indoors", label: "Browse topics", href: "/topics" },
  { src: "/scenes/singing-together-on-old-macs-farm.png", alt: "The farm-school class singing together", label: "Music lessons", href: "/search?q=music" },
  { src: "/scenes/old-mac-and-barnyard-music-circle.png", alt: "Old MacDonald and the farm-school class making music in a circle", label: "Movement and music", href: "/search?q=movement+music" },
  { src: "/scenes/old-macs-open-circle-gathering.png", alt: "The farm-school class gathered in an open circle", label: "Circle-time lessons", href: "/search?q=circle+time" },
  { src: "/scenes/oldmac-school.png", alt: "The welcoming red barn schoolhouse", label: "Meet the school", href: "/about" },
] as const;

export function HomeCarousel({ selected = false }: { selected?: boolean }) {
  const styles = selected ? selectedStyles : legacyStyles;
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
      <div className={styles.carouselPhoto} aria-live="polite">
        <CarouselContent className={styles.carouselTrack}>
          {SLIDES.map((item, index) => (
            <CarouselItem className={styles.carouselSlide} key={item.src}>
              <Link className={styles.carouselImageLink} href={item.href} aria-label={`${item.label}: ${item.alt}`}>
                <Image src={item.src} alt={item.alt} fill preload={index === 0} sizes="(max-width: 680px) 86vw, (max-width: 1000px) 44vw, 420px" />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <Image className={styles.photoPinLeft} src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={36} height={36} aria-hidden="true" />
        <Image className={styles.photoPinRight} src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={36} height={36} aria-hidden="true" />
        <CarouselPrevious className={`${styles.carouselArrow} ${styles.carouselPrevious}`} />
        <CarouselNext className={`${styles.carouselArrow} ${styles.carouselNext}`} />
      </div>
      {selected ? (
        <div className={styles.carouselNav}>
          <div role="group" aria-label="Choose a featured scene">
            {SLIDES.map((item, index) => (
              <button className={index === active ? styles.carouselLinkActive : undefined} type="button" aria-label={`Show ${item.label}`} aria-pressed={index === active} onClick={() => api?.scrollTo(index)} key={item.label} />
            ))}
          </div>
          <Link href={slide.href}>{active === 0 ? "Meet the class" : slide.label} <span aria-hidden="true">→</span></Link>
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
