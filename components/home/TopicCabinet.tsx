"use client";

import Link from "next/link";
import { useState } from "react";
import { HOME_SUBJECTS } from "./home-data";
import styles from "./HomePageAlternative.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TopicCabinet() {
  const [selected, setSelected] = useState(0);
  const subject = HOME_SUBJECTS[selected];

  return (
    <Tabs value={subject.key} onValueChange={(value) => setSelected(HOME_SUBJECTS.findIndex((item) => item.key === value))} asChild>
    <section className={styles.cabinet} aria-labelledby="cabinet-title">
      <header className={styles.sectionHeading}><p>Open a subject</p><h2 id="cabinet-title">Plan from the lesson</h2></header>
      <TabsList className={styles.cabinetTabs} aria-label="Curriculum subjects">
        {HOME_SUBJECTS.map((item) => (
          <TabsTrigger value={item.key} key={item.key}>
            {item.earlyYearsLabel} - {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={subject.key} className={styles.cabinetNote} asChild>
      <article>
        <span className={`brand-asset ${subject.iconClass} icon-medium`} aria-hidden="true" />
        <h3>{subject.title}</h3>
        <Link className={styles.topicMore} href={`/search?q=${encodeURIComponent(subject.searchQuery)}`}>{"Explore this subject ->"}</Link>
      </article>
      </TabsContent>
    </section>
    </Tabs>
  );
}
