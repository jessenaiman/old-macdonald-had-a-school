import Image from "next/image";
import type { CSSProperties } from "react";
import type { CastRosterMember } from "@/lib/cast-roster";
import styles from "./CastShowcase.module.css";

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
  return <div className={styles.page}>
    <header className={styles.hero}>
      <div><span>Internal brand reference · source-led</span><h1>The whole school,<br/><em>in character.</em></h1><p>Every portrait, role, grade relationship, colour, and activity below is rendered from <code>public/CAST_AND_ROLES.md</code>. This is the visual roster to check before characters enter lessons, grade pages, or new scenes.</p></div>
      <div className={styles.heroCluster} aria-hidden="true">{staff.slice(0,4).map((member,index)=><Image key={member.name} src={member.portrait} alt="" width={180} height={180} style={{zIndex:4-index}} />)}</div>
    </header>
    <nav className={styles.pageIndex} aria-label="Cast brand reference sections"><a href="#cast-staff">Staff roster</a><a href="#cast-students">Student roster</a><a href="#cast-rule">Brand rule</a><a href="/CAST_AND_ROLES.md">Open source Markdown</a></nav>
    <section className={styles.section} id="cast-staff"><header><span>Eight canonical staff</span><h2>Meet the teaching team</h2><p>Roles and grade ownership remain visible in plain text so this page can function as a practical brand check.</p></header><div className={styles.staffGrid}>{staff.map((member,index)=><CastCard key={member.name} member={member} featured={index < 2}/>)}</div></section>
    <section className={`${styles.section} ${styles.studentSection}`} id="cast-students"><header><span>Eight students · eight learning lenses</span><h2>The learners bring the school to life</h2><p>Students are optional teaching lenses, not substitute subjects. Their approved actions stay scene-dependent.</p></header><div className={styles.studentGrid}>{students.map((member)=><CastCard key={member.name} member={member}/>)}</div></section>
    <aside className={styles.rule} id="cast-rule"><strong>Brand rule</strong><p>Use canonical portraits unchanged. Pair each character with the signature colour, role, grade, and activity listed here. Layout may be playful; identity data may not.</p></aside>
  </div>;
}
