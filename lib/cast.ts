export const CAST = {
  "old-macdonald": { name: "Old MacDonald", portrait: "/staff_and_students/old-macdonald-transparent-circle.png" },
  "miss-puddles": { name: "Miss Puddles", portrait: "/staff_and_students/miss-puddles-transparent-circle.png" },
  "mr-rusty": { name: "Mr Rusty", portrait: "/staff_and_students/mr-rusty-transparent-circle.png" },
  "miss-hayley": { name: "Miss Hayley", portrait: "/staff_and_students/miss-hayley-transparent-circle.png" },
  "mr-sam": { name: "Mr Sam", portrait: "/staff_and_students/mr-sam-clean-v2.png" },
  "mr-maisy": { name: "Mr Maisy", portrait: "/staff_and_students/mr-maisy-transparent-circle.png" },
  "mr-puddles": { name: "Mr Puddles", portrait: "/staff_and_students/mr-puddles-transparent-circle.png" },
  "miss-maisy": { name: "Miss Maisy", portrait: "/staff_and_students/miss-maisy-transparent-circle.png" },
  hopper: { name: "Hopper", portrait: "/staff_and_students/hopper-transparent-circle.png" },
  whiskers: { name: "Whiskers", portrait: "/staff_and_students/whiskers-transparent-circle.png" },
  scout: { name: "Scout", portrait: "/staff_and_students/scout-transparent-circle.png" },
  penny: { name: "Penny", portrait: "/staff_and_students/penny-transparent-circle.png" },
  maisy: { name: "Maisy", portrait: "/staff_and_students/maisy-transparent-circle.png" },
  puddles: { name: "Puddles", portrait: "/staff_and_students/puddles-transparent-circle.png" },
  sam: { name: "Sam", portrait: "/staff_and_students/sam-transparent-circle.png" },
  rusty: { name: "Rusty", portrait: "/staff_and_students/rusty-transparent-circle.png" },
} as const

export type CastKey = keyof typeof CAST

export const STAFF_KEYS = [
  "old-macdonald", "miss-puddles", "mr-rusty", "miss-hayley",
  "mr-sam", "mr-maisy", "mr-puddles", "miss-maisy",
] as const satisfies readonly CastKey[]

export const STUDENT_KEYS = [
  "hopper", "whiskers", "scout", "penny", "maisy", "puddles", "sam", "rusty",
] as const satisfies readonly CastKey[]
