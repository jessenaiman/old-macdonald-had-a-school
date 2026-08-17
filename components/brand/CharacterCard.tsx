import { BrandIdentityCard } from "./BrandIdentityCard";
import { CharacterPortrait } from "./CharacterPortrait";
import { Badge } from "@/components/ui/badge";
import { CAST, type CastKey } from "@/data/brand/cast-registry";

export type CharacterCardProps = { character: CastKey; role?: string; meta?: string; activities?: string; variant?: "staff" | "student"; };

export function CharacterCard({ character, role, meta, activities, variant = "staff" }: CharacterCardProps) {
  const identity = CAST[character];
  return <BrandIdentityCard title={identity.name} identityClass={`cast-${character}`} media={<CharacterPortrait character={character} className="h-[6.5rem] w-20 object-contain object-center-bottom drop-shadow-md transition-transform duration-180 group-hover:scale-[1.035] group-focus-within:scale-[1.035] motion-reduce:transform-none" />} variant={variant === "student" ? "student" : "character"}>
    <div className="grid gap-1.5" data-character-card data-character={character}>
      {role ? <p className="m-0 text-base leading-[1.35] font-black">{role}</p> : null}
      {meta ? <p className="m-0 text-sm leading-[1.45] text-muted-foreground">{meta}</p> : null}
      {activities ? <p className="mt-0.5 mb-0 border-t border-dashed pt-2 text-sm leading-[1.5]"><strong className="mb-0.5 block text-xs tracking-[0.08em] uppercase">Use in</strong>{activities}</p> : null}
      <Badge aria-label={`${identity.name} uses the current character theme color`} variant="character">Identity colour</Badge>
    </div>
  </BrandIdentityCard>;
}
