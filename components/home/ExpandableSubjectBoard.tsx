"use client";

import { useEffect, useState } from "react";
import styles from "./SelectedHomePage.module.css";

export function ExpandableSubjectBoard({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 560px)");
    const setPresentationState = () => setOpen(!mobile.matches);

    setPresentationState();
    mobile.addEventListener("change", setPresentationState);
    return () => mobile.removeEventListener("change", setPresentationState);
  }, []);

  return (
    <section className={styles.subjectDisclosure} aria-label="Subject presentation">
      <header className={styles.subjectBoardHeader}>
        <button type="button" aria-expanded={open} aria-controls="subject-board-panel" onClick={() => setOpen((current) => !current)}>
          {open ? "Roll up subjects" : "Subjects (6)"}
        </button>
      </header>
      <div className={`${styles.subjectBoardReveal}${open ? ` ${styles.subjectBoardOpen}` : ""}`}>
        <div id="subject-board-panel" className={styles.subjectBoard} aria-hidden={!open} inert={open ? undefined : true}>
          {children}
        </div>
      </div>
    </section>
  );
}
