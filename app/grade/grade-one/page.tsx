import { GradeHub } from "../../../components/grades/GradeHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grade 1 Lesson Plans | Old MacDonald Had a School",
  description:
    "Teacher-ready Grade 1 lesson plans that build reading and rhythm on familiar songs, with clear teaching sequences and print-and-go resources.",
};

export default function GradeOnePage() {
  return <GradeHub grade="grade-one" tagline="Reading and rhythm" />;
}
