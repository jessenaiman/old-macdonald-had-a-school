export type CastMember = {
  name: string;
  species: string;
  personality: string;
  color: string;
  portrait: string;
  texture: string;
};

export const STUDENTS: readonly CastMember[] = [
  { name: "Hopper", species: "Rabbit", personality: "Energetic, optimistic, ready to join", color: "#D9713C", portrait: "/staff_and_students/hopper-transparent-circle.png", texture: "/design-assets/web-material-library-v1/felt/felt-09-hopper-tile.png" },
  { name: "Whiskers", species: "Cat", personality: "Curious, gentle, thoughtful", color: "#7B4FA8", portrait: "/staff_and_students/whiskers-transparent-circle.png", texture: "/design-assets/web-material-library-v1/felt/felt-10-whiskers-tile.png" },
  { name: "Scout", species: "Dog", personality: "Adventurous, observant, dependable", color: "#4A7A3A", portrait: "/staff_and_students/scout-transparent-circle.png", texture: "/design-assets/web-material-library-v1/felt/felt-11-scout-tile.png" },
  { name: "Penny", species: "Chick", personality: "Young, earnest, growing in confidence", color: "#C9962E", portrait: "/staff_and_students/penny-transparent-circle.png", texture: "/design-assets/web-material-library-v1/felt/felt-12-penny-tile.png" },
  { name: "Maisy", species: "Cow", personality: "Warm, confident, encouraging", color: "#1F4E5F", portrait: "/staff_and_students/maisy-transparent-circle.png", texture: "/design-assets/web-material-library-v1/felt/felt-13-maisy-tile.png" },
  { name: "Puddles", species: "Duck", personality: "Expressive, sociable, enthusiastic", color: "#4FA0C9", portrait: "/staff_and_students/puddles-transparent-circle.png", texture: "/design-assets/web-material-library-v1/felt/felt-14-puddles-tile.png" },
  { name: "Sam", species: "Pig", personality: "Thoughtful, inventive, cheerful", color: "#7A9A3D", portrait: "/staff_and_students/sam-transparent-circle.png", texture: "/design-assets/web-material-library-v1/felt/felt-15-sam-tile.png" },
  { name: "Rusty", species: "Horse", personality: "Calm, reliable, quietly courageous", color: "#8B5030", portrait: "/staff_and_students/rusty-transparent-circle.png", texture: "/design-assets/web-material-library-v1/felt/felt-16-rusty-tile.png" },
] as const;
