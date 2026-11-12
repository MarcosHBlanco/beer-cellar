import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

//Paths relative to THIS file, so it works from anyfolder
const dbPATH = fileURLToPath(new URL("./beer-cellar.db", import.meta.url));
const schemaPath = fileURLToPath(new URL("./schema.sql", import.meta.url));

//Opens the database file, creating it if it doesn't exist yet
const db = new Database(dbPATH);

//Enforce FOREIGN KEY rules (including ON DELETE CASCADE)
db.pragma("foreign_keys = ON");

//Create the tables if they aren't there yet
db.exec(readFileSync(schemaPath, "utf8"));

export default db;
