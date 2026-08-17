import { CAST_ENTRIES } from "@/content/pages/branding/cast.mdx";

type CastRecord = (typeof CAST_ENTRIES)[number];
type CastIdentity = Pick<CastRecord, "name" | "portrait">;

export type CastKey = CastRecord["key"];

export const CAST: Record<CastKey, CastIdentity> = Object.fromEntries(
  CAST_ENTRIES.map((entry) => [entry.key, { name: entry.name, portrait: entry.portrait }]),
) as Record<CastKey, CastIdentity>;

export const STAFF_KEYS = CAST_ENTRIES.filter((entry) => entry.group === "staff").map((entry) => entry.key) as readonly CastKey[];
export const STUDENT_KEYS = CAST_ENTRIES.filter((entry) => entry.group === "students").map((entry) => entry.key) as readonly CastKey[];

