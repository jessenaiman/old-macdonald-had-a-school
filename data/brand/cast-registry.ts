const CAST_ENTRIES = [
  { key: "old-macdonald", name: "Old MacDonald", group: "staff", portrait: "/staff_and_students/old-macdonald-transparent-circle.webp" },
  { key: "miss-puddles", name: "Miss Puddles", group: "staff", portrait: "/staff_and_students/miss-puddles-transparent-circle.webp" },
  { key: "mr-rusty", name: "Mr Rusty", group: "staff", portrait: "/staff_and_students/mr-rusty-transparent-circle.webp" },
  { key: "miss-hayley", name: "Miss Hayley", group: "staff", portrait: "/staff_and_students/miss-hayley-transparent-circle.webp" },
  { key: "mr-sam", name: "Mr Sam", group: "staff", portrait: "/staff_and_students/mr-sam-clean-v2.webp" },
  { key: "mr-maisy", name: "Mr Maisy", group: "staff", portrait: "/staff_and_students/mr-maisy-transparent-circle.webp" },
  { key: "mr-puddles", name: "Mr Puddles", group: "staff", portrait: "/staff_and_students/mr-puddles-transparent-circle.webp" },
  { key: "miss-maisy", name: "Miss Maisy", group: "staff", portrait: "/staff_and_students/miss-maisy-transparent-circle.webp" },
  { key: "hopper", name: "Hopper", group: "students", portrait: "/staff_and_students/hopper-transparent-circle.webp" },
  { key: "whiskers", name: "Whiskers", group: "students", portrait: "/staff_and_students/whiskers-transparent-circle.webp" },
  { key: "scout", name: "Scout", group: "students", portrait: "/staff_and_students/scout-transparent-circle.webp" },
  { key: "penny", name: "Penny", group: "students", portrait: "/staff_and_students/penny-transparent-circle.webp" },
  { key: "maisy", name: "Maisy", group: "students", portrait: "/staff_and_students/maisy-transparent-circle.webp" },
  { key: "puddles", name: "Puddles", group: "students", portrait: "/staff_and_students/puddles-transparent-circle.webp" },
  { key: "sam", name: "Sam", group: "students", portrait: "/staff_and_students/sam-transparent-circle.webp" },
  { key: "rusty", name: "Rusty", group: "students", portrait: "/staff_and_students/rusty-transparent-circle.webp" },
] as const;

type CastRecord = (typeof CAST_ENTRIES)[number];
type CastIdentity = Pick<CastRecord, "name" | "portrait">;

export type CastKey = CastRecord["key"];

export const CAST: Record<CastKey, CastIdentity> = Object.fromEntries(
  CAST_ENTRIES.map((entry) => [entry.key, { name: entry.name, portrait: entry.portrait }]),
) as Record<CastKey, CastIdentity>;

export const STAFF_KEYS = CAST_ENTRIES.filter((entry) => entry.group === "staff").map((entry) => entry.key) as readonly CastKey[];
export const STUDENT_KEYS = CAST_ENTRIES.filter((entry) => entry.group === "students").map((entry) => entry.key) as readonly CastKey[];
