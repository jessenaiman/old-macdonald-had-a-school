import { BrandIdentityCard } from "./BrandIdentityCard";
import { CharacterPortrait } from "./CharacterPortrait";
import { CAST, type CastKey } from "@/lib/cast";

export type CharacterCardProps = { character: CastKey; role: string; meta: string; activities: string; variant?: "staff" | "student"; };

export function CharacterCard({ character, role, meta, activities, variant = "staff" }: CharacterCardProps) {
  const { name, family } = CAST[character];
  return <BrandIdentityCard label={family} title={name} identityClass={`cast-${character}`} media={<CharacterPortrait character={character} className="h-[6.5rem] w-20 object-contain object-center-bottom drop-shadow-md transition-transform duration-180 group-hover:scale-[1.035] group-focus-within:scale-[1.035] motion-reduce:transform-none" />} variant={variant === "student" ? "student" : "character"}>
    <div className="grid gap-1.5" data-character-card data-character-family={family.toLowerCase()}>
      <p className="m-0 text-base leading-[1.35] font-black">{role}</p><p className="m-0 text-sm leading-[1.45] text-muted-foreground">{meta}</p>
      <p className="mt-0.5 mb-0 border-t border-dashed pt-2 text-sm leading-[1.5]"><strong className="mb-0.5 block text-xs tracking-[0.08em] uppercase">{variant === "staff" ? "Teaching contexts" : "Can be shown"}</strong>{activities}</p>
      <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"><span>{family} family</span></div>
    </div>
  </BrandIdentityCard>;
}
