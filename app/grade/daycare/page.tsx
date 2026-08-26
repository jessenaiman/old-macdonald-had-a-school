import { GradeHub } from "../../../components/grades/GradeHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daycare Lesson Plans (Ages 0–2) | Old MacDonald Had a School",
  description:
    "Short, familiar routines that help little learners feel safe, join in, and explore through sound and movement.",
};

export default function DaycarePage() {
  return (
    <GradeHub
      grade="daycare"
      tagline="Short, familiar routines that help little learners feel safe, join in, and explore through sound and movement."
    />
  );
}
