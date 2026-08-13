import { BrandIdentityCard } from "./BrandIdentityCard";
import styles from "./CharacterCard.module.css";

export type CharacterCardProps = {
  name: string;
  family: "Red" | "Yellow" | "Blue" | "Orange" | "Green" | "Purple" | "Pink / red";
  color: `#${string}`;
  ink?: "light" | "dark";
  portrait: string;
  role: string;
  meta: string;
  activities: string;
  texture: string;
  variant?: "staff" | "student";
};

export function CharacterCard({
  name,
  family,
  color,
  ink = "light",
  portrait,
  role,
  meta,
  activities,
  texture,
  variant = "staff",
}: CharacterCardProps) {
  return (
    <BrandIdentityCard label={family} title={name} color={color} ink={ink} texture={texture} image={portrait} imageAlt={name} variant={variant === "student" ? "student" : "character"}>
      <div className={styles.details} data-character-card data-character-family={family.toLowerCase()}>
        <p className={styles.role}>{role}</p>
        <p className={styles.meta}>{meta}</p>
        <p className={styles.activities}><strong>{variant === "staff" ? "Teaching contexts" : "Can be shown"}</strong>{activities}</p>
        <div className={styles.recipe}><span>{family} family</span><code>{color}</code></div>
      </div>
    </BrandIdentityCard>
  );
}
