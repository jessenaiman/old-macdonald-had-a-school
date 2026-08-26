import type { GradeInteractionConfig } from "./GradeInteractionLane";

export const GRADE_INTERACTION_CONFIGS = {
  daycare: {
    gradeKey: "daycare", grade: "Daycare", age: "Ages 2–3", reminder: "Invite a choice. Notice the story.", eyebrow: "Welcome back, teacher", headline: "Plan for little hands,", accentHeadline: "big feelings.", academicLead: "Early Learning · Movement · SEL", teacher: "miss-puddles", leadQuote: "What will make joining in feel safe today?", variant: "daycare",
  },
  "pre-school": {
    gradeKey: "pre-school", grade: "Preschool", age: "Ages 3–4", reminder: "Leave room for choice and change.", eyebrow: "Welcome back, teacher", headline: "Grow confidence through", accentHeadline: "story and sensation.", academicLead: "Community · Science · Food & Health", teacher: "miss-maisy", leadQuote: "What can they choose, try, and tell us about?",
  },
  kindergarten: {
    gradeKey: "kindergarten", grade: "Kindergarten", age: "Ages 4–6", reminder: "Find the beat and help everyone join in.", eyebrow: "Choose a starting point", headline: "Turn rhythm into", accentHeadline: "a day of discovery.", academicLead: "Music · Rhythm · Counting", teacher: "mr-rusty", leadQuote: "Can you find and keep the steady beat with me?",
  },
  "grade-one": {
    gradeKey: "grade-one", grade: "Grade 1", age: "5–6 yrs", reminder: "Invite a choice. Notice the story.", eyebrow: "Choose a starting point", headline: "Think, create, and", accentHeadline: "share with purpose.", academicLead: "Literacy · Music · Drama", teacher: "miss-hayley", leadQuote: "What can they notice, explain, and share today?",
  },
  "grade-two": {
    gradeKey: "grade-two", grade: "Grade 2", age: "6–7 yrs", reminder: "Ask for evidence and another way.", eyebrow: "Choose a starting point", headline: "Ask deeper, solve bigger,", accentHeadline: "and learn together.", academicLead: "Physical Education · Health", teacher: "mr-maisy", leadQuote: "What evidence will help them explain their thinking?",
  },
} satisfies Record<"daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two", GradeInteractionConfig>;
