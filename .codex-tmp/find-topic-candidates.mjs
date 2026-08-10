import Database from "better-sqlite3";
const db = new Database("data/omhas.db", { readonly: true, fileMustExist: true });
for (const term of ["pony", "horse", "animal", "farm", "rhyme", "lap", "fingerplay", "movement"]) {
  const rows = db.prepare(`
    SELECT t.id, t.lesson_topic, t.category, t.skill_statement,
      group_concat(DISTINCT g.key) grades
    FROM TOPICS t
    LEFT JOIN TOPIC_GRADES tg ON tg.topic_id=t.id
    LEFT JOIN GRADES g ON g.id=tg.grade_id
    WHERE lower(coalesce(t.lesson_topic,'') || ' ' || coalesce(t.category,'') || ' ' || coalesce(t.skill_statement,'')) LIKE ?
    GROUP BY t.id ORDER BY t.lesson_topic LIMIT 40
  `).all(`%${term}%`);
  console.log(`\n[${term}] ${rows.length}`);
  console.log(JSON.stringify(rows, null, 2));
}
db.close();
