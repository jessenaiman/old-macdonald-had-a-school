import Image from "next/image";
import type { CSSProperties } from "react";
import type { CastRosterMember } from "@/lib/cast-roster";
import styles from "./CastShowcase.module.css";

const MATERIALS = [
  ["Felt", "/design-assets/web-material-library-v1/felt/felt-03-mr-rusty-tile.png", "Buttons, rails, and soft panels"],
  ["Woven fabric", "/design-assets/web-material-library-v1/woven-fabric/woven-fabric-01-old-macdonald-tile.png", "Cloth fields and warm section backgrounds"],
  ["Construction paper", "/design-assets/web-material-library-v1/construction-paper/construction-paper-05-mr-sam-tile.png", "Lesson cards and cut-paper accents"],
  ["Cardboard", "/design-assets/web-material-library-v1/cardboard/cardboard-ivory-tile.png", "Readable notes and planning surfaces"],
  ["Cork", "/design-assets/cork-board-kit-v1/seamless-cork-tile.png", "Pinboards and working walls"],
] as const;

const FASTENERS = [
  ["Push pin", "/design-assets/classroom-fasteners-v1/individual-icons/01-push-pin-rounded.png"],
  ["Paper clip", "/design-assets/classroom-fasteners-v1/individual-icons/03-paperclip-double-loop.png"],
  ["Binder clip", "/design-assets/classroom-fasteners-v1/individual-icons/04-binder-clip.png"],
  ["Masking tape", "/design-assets/classroom-fasteners-v1/individual-icons/05-masking-tape.png"],
  ["Sewing button", "/design-assets/classroom-fasteners-v1/individual-icons/14-sewing-button.png"],
] as const;

const CURRICULUM_ICONS = [
  ["Daycare", "/brand-kit-icon-sheets/individual-icons/grade-daycare.png"],
  ["Kindergarten", "/brand-kit-icon-sheets/individual-icons/grade-kindergarten.png"],
  ["Grade 1", "/brand-kit-icon-sheets/individual-icons/grade-1.png"],
  ["Music & dance", "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png"],
  ["Math & building", "/brand-kit-icon-sheets/individual-icons/subject-math-building.png"],
  ["Drama & storytelling", "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png"],
] as const;

function CastCard({ member, featured = false }: { member: CastRosterMember; featured?: boolean }) {
  const style = { "--cast-color": member.color, "--cast-texture": `url("${member.texture}")` } as CSSProperties;
  return <article className={`${styles.card} ${featured ? styles.featured : ""}`} style={style}>
    <div className={styles.portrait}><Image src={member.portrait} alt={member.name} width={280} height={280} /></div>
    <div className={styles.cardCopy}>
      <span className={styles.species}>{member.species}</span><h3>{member.name}</h3>
      <p className={styles.role}>{member.descriptor}</p>
      {member.grade ? <p><strong>Grade / level:</strong> {member.grade}</p> : null}
      <p><strong>Signature colour:</strong> {member.colorLabel} <code>{member.color}</code></p>
      <p><strong>{member.group === "staff" ? "Activities" : "Can be shown"}:</strong> {member.activities}</p>
      <div className={styles.assetReference}>
        <span><i style={{ backgroundColor: member.color }} />Brand files</span>
        <nav aria-label={`${member.name} asset files`}>
          <a href={member.portrait}>Portrait PNG</a>
          <a href={member.texture}>Felt texture</a>
          <a href="/CAST_AND_ROLES.md">Source details</a>
        </nav>
        <small><strong>Safe visual example:</strong> show {member.name} in scenes involving {member.activities.toLowerCase()}.</small>
      </div>
    </div>
  </article>;
}

export function CastShowcase({ staff, students }: { staff: CastRosterMember[]; students: CastRosterMember[] }) {
  return <div className={`${styles.page} typeset-farm-reading`}>
    <header className={styles.hero}>
      <div><span>Internal brand reference · source-led</span><h1>The whole school,<br/><em>in character.</em></h1><p>Every portrait, role, grade relationship, colour, and activity below is rendered from <code>public/CAST_AND_ROLES.md</code>. This is the visual roster to check before characters enter lessons, grade pages, or new scenes.</p></div>
      <div className={styles.heroCluster} aria-hidden="true">{staff.slice(0,4).map((member,index)=><Image key={member.name} src={member.portrait} alt="" width={180} height={180} sizes="(max-width: 600px) 110px, (max-width: 1050px) 150px, 180px" style={{zIndex:4-index}} />)}</div>
    </header>
    <nav className={styles.pageIndex} aria-label="Cast brand reference sections"><a href="#asset-toolkit">Asset toolkit</a><a href="#badge-recipe">Badge recipe</a><a href="#cast-staff">Staff roster</a><a href="#cast-students">Student roster</a><a href="#cast-rule">Brand rule</a><a href="/CAST_AND_ROLES.md">Open source Markdown</a></nav>
    <section className={`${styles.section} ${styles.toolkit}`} id="asset-toolkit">
      <header><span>Production-ready visual vocabulary</span><h2>Choose from the shelf, not the file tree</h2><p>These governed examples cover the project&apos;s main visual building blocks. Start here, copy the exact path, and inspect only that family when you need a nearby alternative.</p></header>
      <div className={styles.materialGrid}>{MATERIALS.map(([name, src, use])=><article className={styles.materialCard} key={name}><div style={{backgroundImage:`url("${src}")`}} /><h3>{name}</h3><p>{use}</p><code translate="no">{src}</code></article>)}</div>
      <div className={styles.assetRows}>
        <article><header><span>Attachment details</span><h3>Classroom fasteners</h3></header><div className={styles.iconShelf}>{FASTENERS.map(([name,src])=><figure key={name}><Image src={src} alt="" width={72} height={72}/><figcaption>{name}</figcaption><code>{src}</code></figure>)}</div></article>
        <article><header><span>Curriculum signals</span><h3>Grade &amp; subject icons</h3></header><div className={styles.iconShelf}>{CURRICULUM_ICONS.map(([name,src])=><figure key={name}><Image src={src} alt="" width={72} height={72}/><figcaption>{name}</figcaption><code>{src}</code></figure>)}</div></article>
      </div>
    </section>
    <section className={`${styles.section} ${styles.badgeRecipe}`} id="badge-recipe">
      <header><span>Canonical character construction</span><h2>Build badges from 2 authored layers</h2><p>Use the unchanged transparent-circle portrait over the matching authored circle patch. Never recolour either layer or substitute an extracted face patch.</p></header>
      <div className={styles.recipeBody}>
        <div className={styles.badgeLayers} aria-label="Miss Puddles portrait layered over her matching yellow felt patch"><Image src="/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-circle.png" alt="" width={240} height={240}/><Image src="/staff_and_students/miss-puddles-transparent-circle.png" alt="Miss Puddles" width={220} height={220}/></div>
        <ol><li><strong>Patch:</strong><code>/design-assets/blank-felt-patches-v1/individual-patches/02-miss-puddles-circle.png</code></li><li><strong>Portrait:</strong><code>/staff_and_students/miss-puddles-transparent-circle.png</code></li><li><strong>Identity check:</strong><span>Miss Puddles · Daycare · yellow #E8A227</span></li></ol>
      </div>
      <aside className={styles.statusKey}><p><strong>Production:</strong> separated tiles, portraits, circle patches, icons, and fasteners shown here.</p><p><strong>Reference only:</strong> contact sheets, atlases, page composites, design concepts, explorations, and Figma exports.</p><p><strong>Blocked:</strong> every blank-felt rectangle marked DO NOT USE and every extraction-damaged asset awaiting review.</p></aside>
    </section>
    <section className={styles.section} id="cast-staff"><header><span>Eight canonical staff</span><h2>Meet the teaching team</h2><p>Roles and grade ownership remain visible in plain text so this page can function as a practical brand check.</p></header><div className={styles.staffGrid}>{staff.map((member,index)=><CastCard key={member.name} member={member} featured={index < 2}/>)}</div></section>
    <section className={`${styles.section} ${styles.studentSection}`} id="cast-students"><header><span>Eight students · eight learning lenses</span><h2>The learners bring the school to life</h2><p>Students are optional teaching lenses, not substitute subjects. Their approved actions stay scene-dependent.</p></header><div className={styles.studentGrid}>{students.map((member)=><CastCard key={member.name} member={member}/>)}</div></section>
    <aside className={styles.rule} id="cast-rule"><strong>Brand rule</strong><p>Use canonical portraits unchanged. Pair each character with the signature colour, role, grade, and activity listed here. Layout may be playful; identity data may not.</p></aside>
  </div>;
}
