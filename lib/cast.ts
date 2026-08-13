export const CAST = {
  "old-macdonald": { name: "Old MacDonald", portrait: "/staff_and_students/old-macdonald-transparent-circle.png", family: "Red" },
  "miss-puddles": { name: "Miss Puddles", portrait: "/staff_and_students/miss-puddles-transparent-circle.png", family: "Yellow" },
  "mr-rusty": { name: "Mr Rusty", portrait: "/staff_and_students/mr-rusty-transparent-circle.png", family: "Blue" },
  "miss-hayley": { name: "Miss Hayley", portrait: "/staff_and_students/miss-hayley-transparent-circle.png", family: "Pink / red" },
  "mr-sam": { name: "Mr Sam", portrait: "/staff_and_students/mr-sam-transparent-circle.png", family: "Blue" },
  "mr-maisy": { name: "Mr Maisy", portrait: "/staff_and_students/mr-maisy-transparent-circle.png", family: "Orange" },
  "mr-puddles": { name: "Mr Puddles", portrait: "/staff_and_students/mr-puddles-transparent-circle.png", family: "Purple" },
  "miss-maisy": { name: "Miss Maisy", portrait: "/staff_and_students/miss-maisy-transparent-circle.png", family: "Green" },
  hopper: { name: "Hopper", portrait: "/staff_and_students/hopper-transparent-circle.png", family: "Orange" },
  whiskers: { name: "Whiskers", portrait: "/staff_and_students/whiskers-transparent-circle.png", family: "Purple" },
  scout: { name: "Scout", portrait: "/staff_and_students/scout-transparent-circle.png", family: "Green" },
  penny: { name: "Penny", portrait: "/staff_and_students/penny-transparent-circle.png", family: "Yellow" },
  maisy: { name: "Maisy", portrait: "/staff_and_students/maisy-transparent-circle.png", family: "Blue" },
  puddles: { name: "Puddles", portrait: "/staff_and_students/puddles-transparent-circle.png", family: "Purple" },
  sam: { name: "Sam", portrait: "/staff_and_students/sam-transparent-circle.png", family: "Red" },
  rusty: { name: "Rusty", portrait: "/staff_and_students/rusty-transparent-circle.png", family: "Orange" },
} as const

export type CastKey = keyof typeof CAST

export type CastMember = {
  name: string
  species: string
  personality: string
  character: CastKey
}

export const STUDENTS: readonly CastMember[] = [
  { character: "hopper", name: "Hopper", species: "Rabbit", personality: "Energetic, optimistic, ready to join" },
  { character: "whiskers", name: "Whiskers", species: "Cat", personality: "Curious, gentle, thoughtful" },
  { character: "scout", name: "Scout", species: "Dog", personality: "Adventurous, observant, dependable" },
  { character: "penny", name: "Penny", species: "Chick", personality: "Young, earnest, growing in confidence" },
  { character: "maisy", name: "Maisy", species: "Cow", personality: "Warm, confident, encouraging" },
  { character: "puddles", name: "Puddles", species: "Duck", personality: "Expressive, sociable, enthusiastic" },
  { character: "sam", name: "Sam", species: "Pig", personality: "Thoughtful, inventive, cheerful" },
  { character: "rusty", name: "Rusty", species: "Horse", personality: "Calm, reliable, quietly courageous" },
] as const
