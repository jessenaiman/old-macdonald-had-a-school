"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HOME_SUBJECTS } from "./home-data";
import styles from "./HomePage.module.css";

export function TopicCabinet() {
  const [selected, setSelected] = useState(0);
  const subject = HOME_SUBJECTS[selected];

  return (
    <section className={styles.cabinet} aria-labelledby="cabinet-title">
      <header className={styles.sectionHeading}><p>Open a subject</p><h2 id="cabinet-title">Plan from the lesson</h2></header>
      <div className={styles.cabinetTabs} role="tablist" aria-label="Curriculum subjects">
        {HOME_SUBJECTS.map((item, index) => (
          <button role="tab" aria-selected={selected === index} onClick={() => setSelected(index)} key={item.key}>
            {item.earlyYearsLabel} → {item.title}
          </button>
        ))}
      </div>
      <article className={styles.cabinetNote} role="tabpanel">
        <Image src={subject.icon} alt="" width={58} height={58} />
        <h3>{subject.title}</h3>
        <Link className={styles.topicMore} href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}>Explore this subject →</Link>
      </article>
    </section>
  );
}
