import Image from "next/image";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa6";
import styles from "./SelectedHomePage.module.css";

const CURRICULUM_LINKS = [
  { topic: "Music", character: "Mr Rusty", href: "/search?q=music+rhythm", portrait: "/icons/staff/mr-rusty.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/03-mr-rusty-circle.png" },
  { topic: "Stories", character: "Miss Hayley", href: "/search?q=stories+drama", portrait: "/icons/staff/miss-hayley.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/04-miss-hayley-circle.png" },
  { topic: "Math", character: "Mr Sam", href: "/search?q=math+building", portrait: "/icons/staff/mr-sam.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/05-mr-sam-circle.png" },
  { topic: "Movement", character: "Mr Maisy", href: "/search?q=physical+education+movement", portrait: "/icons/staff/mr-maisy.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/06-mr-maisy-circle.png" },
  { topic: "Art", character: "Mr Puddles", href: "/search?q=art+photography", portrait: "/icons/staff/mr-puddles.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/07-mr-puddles-circle.png" },
  { topic: "Nature", character: "Miss Maisy", href: "/search?q=nature+gardening", portrait: "/icons/staff/miss-maisy.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/08-miss-maisy-circle.png" },
  { topic: "Community", character: "Old MacDonald", href: "/search?q=community+leadership", portrait: "/icons/staff/old-mac.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/01-old-macdonald-circle.png" },
  { topic: "Early Learning", character: "Miss Puddles", href: "/search?q=early+learning+daycare", portrait: "/icons/staff/miss-puddles.png", patch: "/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-circle.png" },
] as const;

export function StudentCastStrip() {
  return (
    <section className={styles.castStrip} aria-label="Explore the curriculum">
      <nav className={styles.castList} aria-label="Curriculum topics">
        {CURRICULUM_LINKS.map((item) => (
          <Link className={styles.castMember} href={item.href} aria-label={`Explore ${item.topic} with ${item.character}`} key={item.topic}>
            <span className={styles.castBadge}>
              <Image className={styles.castPatch} src={item.patch} alt="" fill sizes="72px" loading="eager" />
              <Image className={styles.castPortrait} src={item.portrait} alt="" width={88} height={88} loading="eager" />
            </span>
            <strong>{item.topic}</strong>
            <b aria-hidden="true">→</b>
          </Link>
        ))}
      </nav>
      <Link className={styles.castLink} href="/cast">
        <FaRegHeart aria-hidden="true" />
        <span>Meet everyone<br />at the farm school <b aria-hidden="true">→</b></span>
      </Link>
    </section>
  );
}
