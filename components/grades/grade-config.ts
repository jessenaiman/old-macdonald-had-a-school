import type { GradeInteractionConfig } from "./GradeInteractionLane";

export const GRADE_INTERACTION_CONFIGS = {
  daycare: {
    gradeKey: "daycare", grade: "Daycare", age: "Ages 2–3", badge: "/brand-kit-icon-sheets/individual-icons/grade-daycare.png", reminder: "Invite a choice. Notice the story.", eyebrow: "Welcome back, teacher", headline: "Plan for little hands,", accentHeadline: "big feelings.", leadName: "Miss Puddles", leadImage: "/staff_and_students/miss-puddles-transparent-circle.png", leadQuote: "What will make joining in feel safe today?", teacherClass: "cast-miss-puddles", variant: "daycare",
  },
  "pre-school": {
    gradeKey: "pre-school", grade: "Pre-School", age: "Ages 3–4", badge: "/staff_and_students/miss-maisy-transparent-circle.png", reminder: "Leave room for choice and change.", eyebrow: "Welcome back, teacher", headline: "Grow confidence through", accentHeadline: "story and sensation.", leadName: "Miss Maisy", leadImage: "/staff_and_students/miss-maisy-transparent-circle.png", leadQuote: "What can they choose, try, and tell us about?", teacherClass: "cast-miss-maisy",
  },
  kindergarten: {
    gradeKey: "kindergarten", grade: "Kindergarten", age: "Ages 4–6", badge: "/brand-kit-icon-sheets/individual-icons/grade-kindergarten.png", reminder: "Find the beat and help everyone join in.", eyebrow: "Choose a starting point", headline: "Turn rhythm into", accentHeadline: "a day of discovery.", leadName: "Mr Rusty", leadImage: "/staff_and_students/mr-rusty-transparent-circle.png", leadQuote: "Can you find and keep the steady beat with me?", teacherClass: "cast-mr-rusty",
  },
  "grade-one": {
    gradeKey: "grade-one", grade: "Grade 1", age: "5–6 yrs", badge: "/brand-kit-icon-sheets/individual-icons/grade-1.png", reminder: "Invite a choice. Notice the story.", eyebrow: "Choose a starting point", headline: "Think, create, and", accentHeadline: "share with purpose.", leadName: "Miss Hayley", leadImage: "/staff_and_students/miss-hayley-transparent-circle.png", leadQuote: "What can they notice, explain, and share today?", teacherClass: "cast-miss-hayley",
  },
  "grade-two": {
    gradeKey: "grade-two", grade: "Grade 2", age: "6–7 yrs", badge: "/brand-kit-icon-sheets/individual-icons/grade-2.png", reminder: "Ask for evidence and another way.", eyebrow: "Choose a starting point", headline: "Ask deeper, solve bigger,", accentHeadline: "and learn together.", leadName: "Mr Maisy", leadImage: "/staff_and_students/mr-maisy-transparent-circle.png", leadQuote: "What evidence will help them explain their thinking?", teacherClass: "cast-mr-maisy",
  },
} satisfies Record<"daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two", GradeInteractionConfig>;
