import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import styles from "./BrandIdentityCard.module.css";

export type BrandIdentityCardProps = {
  label?: string;
  title: string;
  identityClass?: string;
  image?: string;
  imageAlt?: string;
  children: ReactNode;
  href?: string;
  imageSizes?: string;
  badge?: ReactNode;
  media?: ReactNode;
  attachment?: ReactNode;
  footer?: ReactNode;
  variant?: "character" | "student" | "subject";
};

export function BrandIdentityCard({
  label,
  title,
  identityClass,
  image,
  imageAlt,
  children,
  href,
  imageSizes = "(max-width: 680px) 8rem, 16rem",
  badge,
  media,
  attachment,
  footer,
  variant = "character",
}: BrandIdentityCardProps) {
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
    <Card className={`${styles.card} ${styles[variant]} ${identityClass ?? ""}`} data-brand-identity-card data-card-variant={variant}>
      {attachment}
      {href ? <Link className={styles.body} href={href}>{contents}</Link> : <div className={styles.body}>{contents}</div>}
    </Card>
  );
}
