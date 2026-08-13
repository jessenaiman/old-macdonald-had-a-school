import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import styles from "./BrandIdentityCard.module.css";

export type BrandIdentityCardProps = {
  label?: string;
  title: string;
  color: `#${string}`;
  texture: string;
  image?: string;
  imageAlt?: string;
  children: ReactNode;
  href?: string;
  ink?: "light" | "dark";
  imageSizes?: string;
  badge?: ReactNode;
  media?: ReactNode;
  attachment?: ReactNode;
  footer?: ReactNode;
  variant?: "character" | "student" | "subject";
};

type BrandIdentityCardStyle = CSSProperties & {
  "--identity-card-color": string;
  "--identity-card-ink": string;
  "--identity-card-texture": string;
};

export function BrandIdentityCard({
  label,
  title,
  color,
  texture,
  image,
  imageAlt,
  children,
  href,
  ink = "light",
  imageSizes = "(max-width: 680px) 8rem, 16rem",
  badge,
  media,
  attachment,
  footer,
  variant = "character",
}: BrandIdentityCardProps) {
  const style: BrandIdentityCardStyle = {
    "--identity-card-color": color,
    "--identity-card-ink": ink === "dark" ? "#142d42" : "#fffdf7",
    "--identity-card-texture": `url("${texture}")`,
  };
  const contents = <>
    <div className={styles.media}>
      {label ? <span className={styles.label}>{label}</span> : null}
      {badge}
      {media ?? (image ? <Image src={image} alt={imageAlt ?? ""} width={260} height={260} sizes={imageSizes} /> : null)}
    </div>
    <div className={styles.copy}>
      <h3>{title}</h3>
      {children}
    </div>
    {footer ? <div className={styles.footer}>{footer}</div> : null}
  </>;

  return (
    <article className={`${styles.card} ${styles[variant]}`} style={style} data-brand-identity-card data-card-variant={variant}>
      {attachment}
      {href ? <Link className={styles.body} href={href}>{contents}</Link> : <div className={styles.body}>{contents}</div>}
    </article>
  );
}
