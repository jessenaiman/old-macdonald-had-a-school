import { STAFF, STUDENTS } from "../lib/cast";
import { CharacterBadge } from "./CharacterBadge";

export function CastGuidePage() {
  return (
    <div className="cast-page">
      <header className="cast-page-header">
        <div className="cast-page-title">
          <p className="eyebrow">The canonical farm-school cast</p>
          <h1>Cast &amp; Character Guide</h1>
          <p>Staff lead broad subjects and specializations. Students model the interests and entry points that help children find their way into a lesson.</p>
        </div>
        <CharacterBadge charKey="old-macdonald" color="#8B5E34" name="Old MacDonald" size={112} shape="square" />
      </header>

      <aside className="cast-use-note" aria-label="How teachers use the cast">
        <strong>For lesson planning</strong>
        <span>Choose the subject through a staff lead. Use a student lens when a familiar interest—movement, stories, building, observation or rhythm—will help the lesson land.</span>
      </aside>

      <section className="cast-roster" aria-labelledby="staff-title">
        <div className="cast-section-heading">
          <div><p className="eyebrow">Broad curriculum leadership</p><h2 id="staff-title">The staff</h2></div>
          <p>Each adult keeps a consistent teaching role across the site.</p>
        </div>
        <div className="cast-profile-grid cast-staff-grid">
          {STAFF.map((staff) => (
            <article className="cast-profile cast-staff-profile" key={staff.key} style={{ borderTopColor: staff.color }}>
              <header className="cast-profile-head">
                <CharacterBadge charKey={staff.key} color={staff.color} name={staff.name} size={76} shape="square" />
                <div><h3>{staff.name}</h3><p>{staff.role}</p><small>{staff.grade}</small></div>
              </header>
              <p className="cast-profile-summary">{staff.worksheetLens}</p>
              <ul className="cast-guide-list" aria-label={`${staff.name} guides`}>
                {staff.guides.map((guide) => <li key={guide}>{guide}</li>)}
              </ul>
              <details className="cast-details">
                <summary>Character details</summary>
                <div className="cast-details-grid"><div><strong>Personality</strong><ul>{staff.personality.map((item) => <li key={item}>{item}</li>)}</ul></div><div><strong>Recognizable by</strong><ul>{staff.recognizable.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
              </details>
            </article>
          ))}
        </div>
      </section>

      <section className="cast-student-board" aria-labelledby="students-title">
        <div className="cast-section-heading cast-section-heading-light">
          <div><p className="eyebrow">Specific curriculum entry lenses</p><h2 id="students-title">The students</h2></div>
          <p>These are identification lenses for planning, not separate subjects or decorative mascots.</p>
        </div>
        <div className="cast-profile-grid cast-student-grid">
          {STUDENTS.map((student, index) => (
            <article className="cast-profile cast-student-profile" key={student.key} style={{ borderTopColor: student.color }}>
              <header className="cast-profile-head">
                <CharacterBadge charKey={student.key} color={student.color} name={student.name} size={72} shape={index % 2 === 0 ? "square" : "circle"} />
                <div><h3>{student.name}</h3><p>{student.note}</p></div>
              </header>
              <ul className="cast-strength-list" aria-label={`${student.name}'s curriculum interests`}>
                {student.learningStrengths.map((strength) => <li key={strength}>{strength}</li>)}
              </ul>
              <details className="cast-details">
                <summary>Learning and character details</summary>
                <div className="cast-details-grid"><div><strong>How they join in</strong><ul>{student.personality.map((item) => <li key={item}>{item}</li>)}</ul></div><div><strong>Pairs well with</strong><ul>{student.pairsWith.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
              </details>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
