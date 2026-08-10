"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HOME_TOPICS } from "./home-data";
import styles from "./HomePage.module.css";

export function TopicCabinet() {
  const [selected, setSelected] = useState(0);
  const topic = HOME_TOPICS[selected];
  return (
    <section className={styles.cabinet} aria-labelledby="cabinet-title">
      <header className={styles.sectionHeading}><p>Open a topic drawer</p><h2 id="cabinet-title">Plan from curiosity</h2></header>
      <div className={styles.cabinetTabs} role="tablist" aria-label="Curriculum topics">
        {HOME_TOPICS.map((item, index) => <button role="tab" aria-selected={selected === index} onClick={() => setSelected(index)} style={{ "--topic-color": item.color } as React.CSSProperties} key={item.key}><span><Image src={item.patch} alt="" fill sizes="64px" /><Image src={item.portrait} alt="" fill sizes="60px" /></span>{item.title}</button>)}
      </div>
      <article className={styles.cabinetNote} style={{ "--topic-color": topic.color } as React.CSSProperties} role="tabpanel">
        <header><Image src={topic.icon} alt="" width={58} height={58} /><div><p>{topic.prompt}</p><h3>{topic.title}</h3></div></header>
        <ul>{topic.lessonTitles.map((title) => <li key={title}><Link href={`/topics?cluster=${topic.filter}`}>{title}<span>Open lesson →</span></Link></li>)}</ul>
        <Link className={styles.topicMore} href={`/topics?cluster=${topic.filter}`}>Explore every {topic.title.toLowerCase()} resource</Link>
      </article>
    </section>
  );
}
