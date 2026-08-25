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

/** Grade tab styles for navigation, keyed by grade key — uses characters.mdx grade tokens
 *  (Daycare=Miss Puddles yellow, Pre-School=Miss Maisy sage, Kindergarten=Mr Rusty blue,
 *   Grade 1=Miss Hayley pink, Grade 2=Mr Maisy red), registered in @theme.
 *  `surface` darkens light hues with the system's 72%-black edge mix so the per-key
 *  character foreground inks meet WCAG AA (>= 4.5:1) at 14px; daycare amber keeps its
 *  raw hue because its navy ink passes there (7.7:1) and fails once darkened.
 *  Grade 1's own character foreground is navy, which fails on its raw AND darkened
 *  pink, so it falls back to the shared cream cast ink (--characters-maisy-foreground,
 *  theme-stable because grade hues never flip). */
export const GRADE_TAB_COLORS: Record<TeacherGradeKey, { surface: string; ink: string }> = {
  daycare: {
    surface: "bg-grade-daycare hover:bg-grade-daycare/90",
    ink: "text-[var(--characters-miss-puddles-foreground)]",
  },
  "pre-school": {
    surface:
      "bg-[color-mix(in_srgb,var(--grade-pre-school-color)_72%,black)] hover:bg-[color-mix(in_srgb,var(--grade-pre-school-color)_64%,black)]",
    ink: "text-[var(--characters-miss-maisy-foreground)]",
  },
  kindergarten: {
    surface:
      "bg-[color-mix(in_srgb,var(--grade-kindergarten-color)_72%,black)] hover:bg-[color-mix(in_srgb,var(--grade-kindergarten-color)_64%,black)]",
    ink: "text-[var(--characters-mr-rusty-foreground)]",
  },
  "grade-one": {
    surface:
      "bg-[color-mix(in_srgb,var(--grade-one-color)_72%,black)] hover:bg-[color-mix(in_srgb,var(--grade-one-color)_64%,black)]",
    ink: "text-[var(--characters-maisy-foreground)]",
  },
  "grade-two": {
    surface:
      "bg-[color-mix(in_srgb,var(--grade-two-color)_72%,black)] hover:bg-[color-mix(in_srgb,var(--grade-two-color)_64%,black)]",
    ink: "text-[var(--characters-mr-maisy-foreground)]",
  },
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
