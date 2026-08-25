import type { Metadata } from "next";
import { EarlyYearsHub } from "../../../components/EarlyYearsHub";
import { EARLY_YEARS } from "../../../lib/early-years";

export const metadata: Metadata = {
  title: "Kindergarten Lesson Plans (Ages 4–6) | Old MacDonald Had a School",
  description:
    "Turn curiosity into a day of discovery: choose a goal, gather what helps, and shape the lesson around the learners who will meet it.",
};

export default function KindergartenPage() {
  return <EarlyYearsHub
        grade="kindergarten"
        title="Kindergarten"
        tagline="Choose a goal, gather what helps, and shape the lesson around the learners who will meet it."
        lead={{ patch: "mr-rusty", name: "Mr Rusty" }}
        tier="bridge"
        topics={EARLY_YEARS.kindergarten}
      />;
}
