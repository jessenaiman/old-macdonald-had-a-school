import { EarlyYearsHub } from "../../../components/EarlyYearsHub";
import type { Metadata } from "next";

import { EARLY_YEARS } from "../../../lib/early-years";

export const metadata: Metadata = {
  title: "Daycare Lesson Plans (Ages 0–2) | Old MacDonald Had a School",
  description:
    "Short, familiar routines that help little learners feel safe, join in, and explore through sound and movement.",
};

export default function DaycarePage() {
  return <EarlyYearsHub
        grade="daycare"
        title="Daycare"
        tagline="Short, familiar routines that help little learners feel safe, join in, and explore through sound and movement."
        lead={{ patch: "miss-puddles", name: "Miss Puddles" }}
        tier="list"
        topics={EARLY_YEARS.daycare}
      />;
}
