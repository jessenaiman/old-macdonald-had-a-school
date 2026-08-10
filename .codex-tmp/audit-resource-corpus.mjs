import Database from "better-sqlite3";

function inventory(databasePath) {
  const db = new Database(databasePath, { readonly: true, fileMustExist: true });
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
  const rows = tables.map(({ name }) => {
    const safe = name.replaceAll('"', '""');
    return {
      table: name,
      count: db.prepare(`SELECT COUNT(*) AS count FROM "${safe}"`).get().count,
      columns: db.prepare(`PRAGMA table_info("${safe}")`).all().map(({ name: column }) => column),
    };
  });
  db.close();
  return rows;
}

console.log(JSON.stringify({
  canonical: inventory("data/omhas.db"),
  resourceDb: inventory("C:/Users/jesse/OneDrive/Documents/New project/resources/sqlite_mcp_server.db"),
}, null, 2));
