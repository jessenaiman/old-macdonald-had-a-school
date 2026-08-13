export type ActivePage =
  | "home" | "topics" | "lessons" | "songs" | "about" | "search" | "cast-guide"
  | "early-years" | "daycare" | "pre-school" | "kindergarten" | "grade-one" | "grade-two";

export type GradeNavigationItem = {
  key: Extract<ActivePage, "early-years" | "kindergarten" | "grade-one" | "grade-two">;
  label: string;
  href: string;
  children?: readonly { key: Extract<ActivePage, "daycare" | "pre-school">; label: string; href: string }[];
};

export const GRADE_NAV_ITEMS: readonly GradeNavigationItem[] = [
  { key: "early-years", label: "Early Years", href: "/grade/daycare", children: [
    { key: "daycare", label: "Daycare", href: "/grade/daycare" },
    { key: "pre-school", label: "Pre-School", href: "/grade/pre-school" },
  ] },
  { key: "kindergarten", label: "Kindergarten", href: "/grade/kindergarten" },
  { key: "grade-one", label: "Grade 1", href: "/grade/grade-one" },
  { key: "grade-two", label: "Grade 2", href: "/grade/grade-two" },
] as const;

export const TEACHER_GRADE_ITEMS = [
  { key: "daycare", label: "Daycare", href: "/grade/daycare" },
  { key: "pre-school", label: "Pre-School", href: "/grade/pre-school" },
  { key: "kindergarten", label: "Kindergarten", href: "/grade/kindergarten" },
  { key: "grade-one", label: "Grade 1", href: "/grade/grade-one" },
  { key: "grade-two", label: "Grade 2", href: "/grade/grade-two" },
] as const;

export function activePageFromPathname(pathname: string): ActivePage {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/grade/daycare")) return "daycare";
  if (pathname.startsWith("/grade/pre-school")) return "pre-school";
  if (pathname.startsWith("/grade/kindergarten")) return "kindergarten";
  if (pathname.startsWith("/grade/grade-one")) return "grade-one";
  if (pathname.startsWith("/grade/grade-two")) return "grade-two";
  if (pathname.startsWith("/lessons")) return "lessons";
  if (pathname.startsWith("/songs")) return "songs";
  if (pathname.startsWith("/topics")) return "topics";
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/branding") || pathname.startsWith("/cast")) return "cast-guide";
  if (pathname.startsWith("/about")) return "about";
  return "home";
}
