import { BrandIdentityCard } from "./BrandIdentityCard";
import styles from "./CharacterCard.module.css";
import { CAST, type CastKey } from "@/lib/cast";

export type CharacterCardProps = {
  character: CastKey;
  role: string;
  meta: string;
  activities: string;
  variant?: "staff" | "student";
};

export function CharacterCard({
  character,
  role,
  meta,
  activities,
  variant = "staff",
}: CharacterCardProps) {
  const { name, portrait, family } = CAST[character];
  return (
    <BrandIdentityCard label={family} title={name} identityClass={`cast-${character}`} image={portrait} imageAlt={name} variant={variant === "student" ? "student" : "character"}>
      <div className={styles.details} data-character-card data-character-family={family.toLowerCase()}>
        <p className={styles.role}>{role}</p>
        <p className={styles.meta}>{meta}</p>
        <p className={styles.activities}><strong>{variant === "staff" ? "Teaching contexts" : "Can be shown"}</strong>{activities}</p>
        <div className={styles.recipe}><span>{family} family</span></div>
      </div>
    </BrandIdentityCard>
  );
}
