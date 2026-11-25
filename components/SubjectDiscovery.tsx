import { BrandIcon } from "./brand-icon";

export const CLUSTERS = [
  { key: "words", title: "Words & Stories", tone: "words", icon: <BrandIcon icon="acting-theatre-masks" size="small" />, match: /literacy|phonics|language|reading|vocabulary/i },
  { key: "numbers", title: "Numbers & Making", tone: "numbers", icon: <BrandIcon icon="math-abacus-ruler" size="small" />, match: /math|numeracy|fine motor/i },
  { key: "music", title: "Music, Movement & Nature", tone: "music", icon: <BrandIcon icon="music-banjo" size="small" />, match: /music|science|nature|motor|movement/i },
  { key: "heart", title: "Heart & Home", tone: "heart", icon: <BrandIcon icon="health-gingham-lunch" size="small" />, match: /sel|social|emotional|routine|regulation/i },
] as const;

export function clusterFor(subject: string) {
  for (const c of CLUSTERS) {
    if (c.match.test(subject)) return c.key;
  }
  return "heart";
}
