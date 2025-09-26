// checkDb.js
import Database from "better-sqlite3";

const db = new Database("./data.db");

// Alle Benutzer anzeigen
const users = db.prepare("SELECT * FROM users").all();
console.log("Users:", users);

// Alle Kontexte anzeigen
const contexts = db.prepare("SELECT * FROM agent_contexts").all();
console.log("Contexts:", contexts);
