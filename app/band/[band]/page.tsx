import { notFound } from "next/navigation";
import { SiteShell } from "../../../components/SiteShell";
import { GradeTemplate } from "../../../components/builder/CurriculumTemplates";
import { getAllLessons, isSingleLesson } from "../../../lib/mdx-content";
import { BAND_META, matchesBand, bandMatchesStaff } from "../../../lib/bands";
import { STAFF } from "../../../lib/cast";

function iconForLesson(subject: string, category: string) {
  const label = `${subject} ${category}`;
  if (/math|number|stem/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-math-building.png";
  if (/literacy|phonic|reading|writing|language|story/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-drama-storytelling.png";
  if (/music|movement|dance/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-music-dance.png";
  if (/art|photo|visual/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-art-photography.png";
  if (/garden|health|nature/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-gardening-health.png";
  if (/physical|sport/i.test(label)) return "/brand-kit-icon-sheets/individual-icons/subject-physical-education.png";
  return "/brand-kit-icon-sheets/individual-icons/subject-early-learning.png";
}

export function generateStaticParams() {
  return Object.keys(BAND_META).map((band) => ({ band }));
}

export default async function BandPage({ params }: { params: Promise<{ band: string }> }) {
  const { band } = await params;
  const meta = BAND_META[band];
  if (!meta) notFound();

  const allLessons = getAllLessons();
  const lessons = allLessons
    .filter((l) => matchesBand(l.meta.gradeBand, band))
    .map((l) => ({
      slug: l.meta.slug,
      title: l.meta.title,
      subject: l.meta.subject,
      category: l.meta.category,
      summary: l.meta.summary,
      gradeBand: l.meta.gradeBand,
      ready: isSingleLesson(l),
      hasPrintables: isSingleLesson(l) && l.printables.length > 0,
      hasVideo: isSingleLesson(l) && !!l.watch?.url,
    }));

  const cast = STAFF.filter((s) => bandMatchesStaff(band, s));
  const lead = band === "grade-one"
    ? STAFF.find((staff) => staff.key === "miss-hayley") ?? cast[0] ?? STAFF[0]
    : band === "grade-two"
      ? STAFF.find((staff) => staff.key === "mr-maisy") ?? cast[0] ?? STAFF[0]
      : cast[0] ?? STAFF[0];

  return (
    <SiteShell active={band as "grade-one" | "grade-two"}>
      <GradeTemplate
        grade={meta.label}
        age={meta.ageRange}
        leadName={lead.name}
        leadImage={lead.key === "old-macdonald" ? "/icons/staff/old-mac.png" : `/icons/staff/${lead.key}.png`}
        leadQuote={band === "grade-one" ? "What can they notice, explain, and share today?" : "What evidence will help them explain their thinking?"}
        headline={band === "grade-one" ? "Think, create, and" : "Ask deeper, solve bigger,"}
        accentHeadline={band === "grade-one" ? "share with purpose." : "and learn together."}
        summary={meta.tagline}
        items={lessons.slice(0, 4).map((lesson) => ({
          title: lesson.title,
          kicker: lesson.subject,
          summary: lesson.summary,
          href: `/topics/${lesson.slug}?band=${band}`,
          icon: iconForLesson(lesson.subject, lesson.category),
        }))}
      />
    </SiteShell>
  );
}
