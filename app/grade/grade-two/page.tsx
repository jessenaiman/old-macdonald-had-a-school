import { GradeHub } from "../../../components/grades/GradeHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grade 2 Lesson Plans | Old MacDonald Had a School",
  description:
    "Teacher-ready Grade 2 lesson plans focused on building fluency and proof, with clear teaching sequences and print-and-go resources.",
};

export default function GradeTwoPage() {
  return <GradeHub grade="grade-two" tagline="Building fluency and proof" />;
}
