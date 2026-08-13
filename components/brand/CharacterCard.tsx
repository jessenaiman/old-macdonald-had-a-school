import Image from "next/image";
import type { CSSProperties } from "react";
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

type CharacterCardStyle = CSSProperties & {
  "--character-card-color": string;
  "--character-card-ink": string;
  "--character-card-texture": string;
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
  const style: CharacterCardStyle = {
    "--character-card-color": color,
    "--character-card-ink": ink === "dark" ? "#142d42" : "#fffdf7",
    "--character-card-texture": `url("${texture}")`,
  };

  return (
    <article className={`${styles.card} ${variant === "student" ? styles.student : ""}`} style={style} data-character-card data-character-family={family.toLowerCase()}>
      <div className={styles.portrait}>
        <span className={styles.family}>{family}</span>
        <Image src={portrait} alt={name} width={260} height={260} />
      </div>
      <div className={styles.copy}>
        <h3>{name}</h3>
        <p className={styles.role}>{role}</p>
        <p className={styles.meta}>{meta}</p>
        <p className={styles.activities}><strong>{variant === "staff" ? "Teaching contexts" : "Can be shown"}</strong>{activities}</p>
        <div className={styles.recipe}><span>{family} family</span><code>{color}</code></div>
      </div>
    </article>
  );
}
