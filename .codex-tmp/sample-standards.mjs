import Database from "better-sqlite3";
const db=new Database("data/omhas.db",{readonly:true});
console.log(JSON.stringify(db.prepare("SELECT framework, code, full_text FROM STANDARDS WHERE code IS NOT NULL AND trim(code) <> '' LIMIT 8").all(),null,2));
db.close();
