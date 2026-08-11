"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import legacyStyles from "./HomePage.module.css";
import selectedStyles from "./BulletinHomePage.module.css";

const SLIDES = [
  { src: "/scenes/home-schoolhouse-classroom-hero-v1.png", alt: "Old MacDonald and the farm-school class learning together indoors", label: "Browse topics", href: "/topics" },
  { src: "/scenes/singing-together-on-old-macs-farm.png", alt: "The farm-school class singing together", label: "Music lessons", href: "/search?q=music" },
  { src: "/scenes/plant-your-seeds-with-care.png", alt: "Farm-school friends learning together in the garden", label: "Science lessons", href: "/search?q=science+nature" },
] as const;

export function HomeCarousel({ selected = false }: { selected?: boolean }) {
  const styles = selected ? selectedStyles : legacyStyles;
  const [active, setActive] = useState(0);
  const slide = SLIDES[active];

  function move(direction: -1 | 1) {
    setActive((current) => (current + direction + SLIDES.length) % SLIDES.length);
  }

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Explore the farm school">
      <div className={styles.carouselPhoto} aria-live="polite">
        <Link className={styles.carouselImageLink} href={slide.href} aria-label={`${slide.label}: ${slide.alt}`}>
          <Image src={slide.src} alt={slide.alt} fill preload={active === 0} sizes="(max-width: 620px) 92vw, (max-width: 1000px) 48vw, 42vw" />
        </Link>
        <Image className={styles.photoPinLeft} src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={36} height={36} aria-hidden="true" />
        <Image className={styles.photoPinRight} src="/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png" alt="" width={36} height={36} aria-hidden="true" />
        <button className={`${styles.carouselArrow} ${styles.carouselPrevious}`} type="button" onClick={() => move(-1)} aria-label="Show previous feature">‹</button>
        <button className={`${styles.carouselArrow} ${styles.carouselNext}`} type="button" onClick={() => move(1)} aria-label="Show next feature">›</button>
      </div>
      {selected ? (
        <div className={styles.carouselNav}>
          <div role="group" aria-label="Choose a featured scene">
            {SLIDES.map((item, index) => (
              <button className={index === active ? styles.carouselLinkActive : undefined} type="button" aria-label={`Show ${item.label}`} aria-pressed={index === active} onClick={() => setActive(index)} key={item.label} />
            ))}
          </div>
          <Link href={slide.href}>{active === 0 ? "Meet the class" : slide.label} <span aria-hidden="true">→</span></Link>
        </div>
      ) : (
        <nav className={styles.carouselNav} aria-label="Farm school features">
          {SLIDES.map((item, index) => (
            <Link className={index === active ? styles.carouselLinkActive : undefined} href={item.href} key={item.label} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>
              <span aria-hidden="true" />{item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
