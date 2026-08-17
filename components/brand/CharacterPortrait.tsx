import Image from "next/image";

import { CAST, type CastKey } from "@/data/brand/cast-registry";

type CharacterPortraitProps = {
  character: CastKey;
  className?: string;
  size?: number;
  decorative?: boolean;
};

export function CharacterPortrait({ character, className, size = 150, decorative = false }: CharacterPortraitProps) {
  const member = CAST[character];
  return <Image className={className} src={member.portrait} alt={decorative ? "" : member.name} width={size} height={size} />;
}
