import type { Metadata } from "next";
import { CastShowcase } from "@/components/cast/CastShowcase";
import { SiteShell } from "@/components/SiteShell";
import { getCastRoster } from "@/lib/cast-roster";

export const metadata: Metadata = {
  title: "Brand, cast, and asset guide | Old MacDonald Had a School",
  description: "The canonical character roster, governed design assets, and visual usage guidance rendered from CAST_AND_ROLES.md.",
};

export default async function BrandingPage() {
  const roster = await getCastRoster();
  return <SiteShell active="cast-guide"><CastShowcase {...roster} /></SiteShell>;
}
