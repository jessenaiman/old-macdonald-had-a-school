import { EarlyYearsHub } from "../../../components/EarlyYearsHub";
import type { Metadata } from "next";

import { EARLY_YEARS } from "../../../lib/early-years";

export const metadata: Metadata = {
  title: "Pre-School Lesson Plans (Ages 3–4) | Old MacDonald Had a School",
  description:
    "The same songs Daycare uses, with more choice and a little more to notice — pick one, walk through the four steps together.",
};

export default function PreSchoolPage() {
  return <EarlyYearsHub
        grade="pre-school"
        title="Pre-School"
        tagline="The same songs Daycare uses, with more choice and a little more to notice — pick one, walk through the four steps together."
        lead={{ patch: "miss-maisy", name: "Miss Maisy" }}
        tier="detailed"
        topics={EARLY_YEARS["pre-school"]}
      />;
}
