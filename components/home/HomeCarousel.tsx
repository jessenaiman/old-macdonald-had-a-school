"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./HomePage.module.css";

const SLIDES = [
  { src: "/scenes/old-macs-open-circle-gathering.png", alt: "Old MacDonald and the farm-school class gathered outdoors", label: "Browse topics", href: "/topics" },
  { src: "/scenes/singing-together-on-old-macs-farm.png", alt: "The farm-school class singing together", label: "Music lessons", href: "/search?q=music" },
  { src: "/scenes/plant-your-seeds-with-care.png", alt: "Farm-school friends learning together in the garden", label: "Science lessons", href: "/search?q=science+nature" },
] as const;

export function HomeCarousel() {
  const [active, setActive] = useState(0);
  const slide = SLIDES[active];

  function move(direction: -1 | 1) {
    setActive((current) => (current + direction + SLIDES.length) % SLIDES.length);
  }

  return (
    <div className={styles.carousel} aria-roledescription="carousel" aria-label="Explore the farm school">
      <div className={styles.carouselPhoto} aria-live="polite">
        <Image src={slide.src} alt={slide.alt} fill preload={active === 0} sizes="(max-width: 800px) 78vw, 340px" />
        <Image className={styles.photoPinLeft} src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={36} height={36} aria-hidden="true" />
        <Image className={styles.photoPinRight} src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={36} height={36} aria-hidden="true" />
        <button className={`${styles.carouselArrow} ${styles.carouselPrevious}`} type="button" onClick={() => move(-1)} aria-label="Show previous feature">‹</button>
        <button className={`${styles.carouselArrow} ${styles.carouselNext}`} type="button" onClick={() => move(1)} aria-label="Show next feature">›</button>
      </div>
      <nav className={styles.carouselNav} aria-label="Farm school features">
        {SLIDES.map((item, index) => (
          <Link className={index === active ? styles.carouselLinkActive : undefined} href={item.href} key={item.label} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>
            <span aria-hidden="true" />{item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
