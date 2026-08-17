import { BrandIdentityCard } from "./BrandIdentityCard";
import { CharacterPortrait } from "./CharacterPortrait";
import { CAST, type CastKey } from "@/data/brand/cast-registry";

export type SubjectCardProps = { title: string; href: string; character: CastKey; iconClass: string; highlights: readonly string[]; lessonCount: number; fastenerClass?: "fastener-paperclip" | "fastener-push-pin" | "fastener-binder-clip" | "fastener-masking-tape" | "fastener-gingham-tape" | "fastener-apple-peg"; };

export function SubjectCard({ title, href, character, iconClass, highlights, lessonCount, fastenerClass = "fastener-paperclip" }: SubjectCardProps) {
  const { name: characterName } = CAST[character];
  return <BrandIdentityCard title={title} identityClass={`cast-${character}`} href={href} variant="subject" attachment={<span className={`brand-asset ${fastenerClass} icon-small pointer-events-none absolute -top-4 left-1/2 z-10 size-9 -translate-x-1/2 drop-shadow-sm`} aria-hidden="true" />} media={<span className={`brand-asset ${iconClass} icon-large size-28 drop-shadow-sm`} aria-hidden="true" />} footer={<><span className="text-xs font-black">Explore with {characterName}</span><CharacterPortrait character={character} decorative size={52} className="ml-auto size-10 object-contain drop-shadow-sm" /></>}>
    <ul className="mt-0.5 grid list-none justify-items-center gap-0.5 p-0 text-[0.78rem] leading-[1.35]" aria-label={`${title} learning ideas`}>{highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
    <small className="mt-1 text-[0.7rem] font-black opacity-85">{lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}</small>
    <span className="mt-1 flex items-center justify-center gap-2 text-xs font-black">Explore subject <span className="text-base transition-transform duration-180 group-hover:translate-x-1 group-focus-within:translate-x-1 motion-reduce:transform-none" aria-hidden="true">→</span></span>
  </BrandIdentityCard>;
}
