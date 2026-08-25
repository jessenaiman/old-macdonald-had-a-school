import { GradeHub } from "../../../components/grades/GradeHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kindergarten Lesson Plans (Ages 4–6) | Old MacDonald Had a School",
  description:
    "Turn curiosity into a day of discovery: choose a goal, gather what helps, and shape the lesson around the learners who will meet it.",
};

export default function KindergartenPage() {
  return (
    <GradeHub
      grade="kindergarten"
      tagline="Choose a goal, gather what helps, and shape the lesson around the learners who will meet it."
    />
  );
}
