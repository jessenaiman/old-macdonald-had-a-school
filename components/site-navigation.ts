export type ActivePage =
  | "home" | "topics" | "lessons" | "songs" | "about" | "search"
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

export type TeacherGradeKey = (typeof TEACHER_GRADE_ITEMS)[number]["key"];

/** Grade tab styles for navigation, keyed by grade key — uses cast.mdx grade tokens
 *  (Daycare=Miss Puddles yellow, Pre-School=Miss Maisy sage, Kindergarten=Mr Rusty blue,
 *   Grade 1=Miss Hayley pink, Grade 2=Mr Maisy red), registered in @theme. */
export const GRADE_TAB_COLORS: Record<TeacherGradeKey, string> = {
  daycare: "bg-grade-daycare hover:bg-grade-daycare/90",
  "pre-school": "bg-grade-pre-school hover:bg-grade-pre-school/90",
  kindergarten: "bg-grade-kindergarten hover:bg-grade-kindergarten/90",
  "grade-one": "bg-grade-one hover:bg-grade-one/90",
  "grade-two": "bg-grade-two hover:bg-grade-two/90",
};

/**
 * Primary navigation shared by SiteHeader (desktop) and MobileNavigation (mobile).
 * Minimal site: Home, Search, About. Grades are reached via sidebar navigation
 * on grade pages, and lesson plans come from Search.
 */
export const NAV_ITEMS: readonly { href: string; label: string; key: ActivePage }[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/search", label: "Search lessons", key: "search" },
  { href: "/about", label: "About", key: "about" },
];

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
  if (pathname.startsWith("/about")) return "about";
  return "home";
}
