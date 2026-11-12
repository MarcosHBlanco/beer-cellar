import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dbPath = fileURLToPath(new URL("./beer-cellar.db", import.meta.url));
const sqlPath = fileURLToPath(new URL("./database-setup.sql", import.meta.url));

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

// exec() runs every statement in the file, in order
db.exec(readFileSync(sqlPath, "utf8"));

console.log("Database rebuilt from database-setup.sql");
db.close();
