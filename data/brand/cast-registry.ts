const CAST_ENTRIES = [
  { key: "old-macdonald", name: "Old MacDonald", group: "staff", portrait: "/staff_and_students/old-macdonald-transparent-circle.png" },
  { key: "miss-puddles", name: "Miss Puddles", group: "staff", portrait: "/staff_and_students/miss-puddles-transparent-circle.png" },
  { key: "mr-rusty", name: "Mr Rusty", group: "staff", portrait: "/staff_and_students/mr-rusty-transparent-circle.png" },
  { key: "miss-hayley", name: "Miss Hayley", group: "staff", portrait: "/staff_and_students/miss-hayley-transparent-circle.png" },
  { key: "mr-sam", name: "Mr Sam", group: "staff", portrait: "/staff_and_students/mr-sam-clean-v2.png" },
  { key: "mr-maisy", name: "Mr Maisy", group: "staff", portrait: "/staff_and_students/mr-maisy-transparent-circle.png" },
  { key: "mr-puddles", name: "Mr Puddles", group: "staff", portrait: "/staff_and_students/mr-puddles-transparent-circle.png" },
  { key: "miss-maisy", name: "Miss Maisy", group: "staff", portrait: "/staff_and_students/miss-maisy-transparent-circle.png" },
  { key: "hopper", name: "Hopper", group: "students", portrait: "/staff_and_students/hopper-transparent-circle.png" },
  { key: "whiskers", name: "Whiskers", group: "students", portrait: "/staff_and_students/whiskers-transparent-circle.png" },
  { key: "scout", name: "Scout", group: "students", portrait: "/staff_and_students/scout-transparent-circle.png" },
  { key: "penny", name: "Penny", group: "students", portrait: "/staff_and_students/penny-transparent-circle.png" },
  { key: "maisy", name: "Maisy", group: "students", portrait: "/staff_and_students/maisy-transparent-circle.png" },
  { key: "puddles", name: "Puddles", group: "students", portrait: "/staff_and_students/puddles-transparent-circle.png" },
  { key: "sam", name: "Sam", group: "students", portrait: "/staff_and_students/sam-transparent-circle.png" },
  { key: "rusty", name: "Rusty", group: "students", portrait: "/staff_and_students/rusty-transparent-circle.png" },
] as const;

type CastRecord = (typeof CAST_ENTRIES)[number];
type CastIdentity = Pick<CastRecord, "name" | "portrait">;

export type CastKey = CastRecord["key"];

export const CAST: Record<CastKey, CastIdentity> = Object.fromEntries(
  CAST_ENTRIES.map((entry) => [entry.key, { name: entry.name, portrait: entry.portrait }]),
) as Record<CastKey, CastIdentity>;

export const STAFF_KEYS = CAST_ENTRIES.filter((entry) => entry.group === "staff").map((entry) => entry.key) as readonly CastKey[];
export const STUDENT_KEYS = CAST_ENTRIES.filter((entry) => entry.group === "students").map((entry) => entry.key) as readonly CastKey[];
