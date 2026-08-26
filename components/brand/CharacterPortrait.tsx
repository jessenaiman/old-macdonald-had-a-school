import Image from "next/image";

import { CHARACTERS, type CharacterKey } from "@/data/brand/characters-registry";

type CharacterPortraitProps = {
  character: CharacterKey;
  className?: string;
  size?: number;
  decorative?: boolean;
};

export function CharacterPortrait({ character, className, size = 150, decorative = false }: CharacterPortraitProps) {
  const member = CHARACTERS[character];
  return <Image className={className} src={member.portrait} alt={decorative ? "" : member.name} width={size} height={size} />;
}
