"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./HomePage.module.css";

const SLIDES = [
  { src: "/scenes/home-schoolhouse-classroom-hero-v1.png", alt: "Old MacDonald teaching the farm-school children in a warm classroom", label: "Grades", href: "/grade/daycare" },
  { src: "/scenes/home-journey-spark-v1.png", alt: "Farm-school friends reading a picture book together", label: "Meet the cast", href: "/cast" },
  { src: "/scenes/home-journey-reflect-v1.png", alt: "Farm-school friends observing and caring for a garden plant", label: "Our approach", href: "/about" },
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
        <Image src={slide.src} alt={slide.alt} fill priority={active === 0} sizes="(max-width: 760px) 88vw, 48vw" />
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
