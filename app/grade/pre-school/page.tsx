import { GradeHub } from "../../../components/grades/GradeHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preschool Lesson Plans (Ages 3–4) | Old MacDonald Had a School",
  description:
    "The same songs Daycare uses, with more choice and a little more to notice — pick one, walk through the four steps together.",
};

export default function PreSchoolPage() {
  return (
    <GradeHub
      grade="pre-school"
      tagline="The same songs Daycare uses, with more choice and a little more to notice — pick one, walk through the four steps together."
    />
  );
}
