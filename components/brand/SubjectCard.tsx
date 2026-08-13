import Image from "next/image";
import { BrandIdentityCard } from "./BrandIdentityCard";
import styles from "./SubjectCard.module.css";
import { CAST, type CastKey } from "@/lib/cast";

export type SubjectCardProps = {
  title: string;
  href: string;
  character: CastKey;
  iconClass: string;
  highlights: readonly string[];
  lessonCount: number;
  fastenerClass?:
    | "fastener-paperclip"
    | "fastener-push-pin"
    | "fastener-binder-clip"
    | "fastener-masking-tape"
    | "fastener-gingham-tape"
    | "fastener-apple-peg";
};

export function SubjectCard({
  title,
  href,
  character,
  iconClass,
  highlights,
  lessonCount,
  fastenerClass = "fastener-paperclip",
}: SubjectCardProps) {
  const { name: characterName, portrait } = CAST[character];
  return (
    <BrandIdentityCard
      title={title}
      identityClass={`cast-${character}`}
      href={href}
      variant="subject"
      attachment={<span className={`${styles.fastener} brand-asset ${fastenerClass} icon-small`} aria-hidden="true" />}
      media={<span className={`${styles.subjectIcon} brand-asset ${iconClass} icon-large`} aria-hidden="true" />}
      footer={<><span className={styles.guide}>Explore with {characterName}</span><Image className={styles.guidePortrait} src={portrait} alt="" width={52} height={52} /></>}
    >
      <ul className={styles.highlights} aria-label={`${title} learning ideas`}>
        {highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
      </ul>
      <small className={styles.count}>{lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}</small>
      <span className={styles.action}>Explore subject <span aria-hidden="true">→</span></span>
    </BrandIdentityCard>
  );
}
