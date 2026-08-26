import { BRAND_IMAGE_ASSETS, type CharacterPortraitKey } from "./image-registry";

const CHARACTER_ENTRIES = [
  { key: "old-macdonald", name: "Old MacDonald", group: "staff", portrait: "old-macdonald" },
  { key: "miss-puddles", name: "Miss Puddles", group: "staff", portrait: "miss-puddles" },
  { key: "mr-rusty", name: "Mr Rusty", group: "staff", portrait: "mr-rusty" },
  { key: "miss-hayley", name: "Miss Hayley", group: "staff", portrait: "miss-hayley" },
  { key: "mr-sam", name: "Mr Sam", group: "staff", portrait: "mr-sam" },
  { key: "mr-maisy", name: "Mr Maisy", group: "staff", portrait: "mr-maisy" },
  { key: "mr-puddles", name: "Mr Puddles", group: "staff", portrait: "mr-puddles" },
  { key: "miss-maisy", name: "Miss Maisy", group: "staff", portrait: "miss-maisy" },
  { key: "hopper", name: "Hopper", group: "students", portrait: "hopper" },
  { key: "whiskers", name: "Whiskers", group: "students", portrait: "whiskers" },
  { key: "scout", name: "Scout", group: "students", portrait: "scout" },
  { key: "penny", name: "Penny", group: "students", portrait: "penny" },
  { key: "maisy", name: "Maisy", group: "students", portrait: "maisy" },
  { key: "puddles", name: "Puddles", group: "students", portrait: "puddles" },
  { key: "sam", name: "Sam", group: "students", portrait: "sam" },
  { key: "rusty", name: "Rusty", group: "students", portrait: "rusty" },
] as const;

type CharacterRecord = (typeof CHARACTER_ENTRIES)[number];
type CharacterIdentity = { name: CharacterRecord["name"]; portrait: string };

export type CharacterKey = CharacterRecord["key"];

export const CHARACTERS: Record<CharacterKey, CharacterIdentity> = Object.fromEntries(
  CHARACTER_ENTRIES.map((entry) => [entry.key, { name: entry.name, portrait: BRAND_IMAGE_ASSETS.portraits[entry.portrait as CharacterPortraitKey] }]),
) as Record<CharacterKey, CharacterIdentity>;

export const STAFF_KEYS = CHARACTER_ENTRIES.filter((entry) => entry.group === "staff").map((entry) => entry.key) as readonly CharacterKey[];
export const STUDENT_KEYS = CHARACTER_ENTRIES.filter((entry) => entry.group === "students").map((entry) => entry.key) as readonly CharacterKey[];
