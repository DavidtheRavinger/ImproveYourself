// index.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Database from "better-sqlite3";

// Agenten importieren (alle so aufgebaut, dass sie (message, contexts) erwarten)
import { runAgent1 } from "./agents/agent1.js";
import { runAgent2 } from "./agents/agent2.js";
import { runAgent3 } from "./agents/agent3.js";
import { runAgent4 } from "./agents/agent4.js";
import { runAgent5 } from "./agents/agent5.js";
import { runAgent6 } from "./agents/agent6.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// SQLite initialisieren (Datei: data.db im root)
const db = new Database("data.db");

// Tabellen anlegen, falls nicht vorhanden
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS agent_contexts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    agent TEXT,
    slot INTEGER, -- 1 oder 2
    message TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(username, agent, slot)
  )
`).run();

// Root route
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

// Endpoint zum Speichern eines Kontextfeldes (slot: 1 oder 2)
app.post("/saveContext", (req, res) => {
  try {
    const { username, agent, slot, message } = req.body;
    if (!username || !agent || !slot || (!message && message !== "")) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Nutzer in users Tabelle anlegen, wenn nicht vorhanden
    const insertUser = db.prepare(
      `INSERT OR IGNORE INTO users (username) VALUES (?)`
    );
    insertUser.run(username);

    const upsert = db.prepare(`
      INSERT INTO agent_contexts (username, agent, slot, message)
      VALUES (@username, @agent, @slot, @message)
      ON CONFLICT(username, agent, slot) DO UPDATE SET
        message = excluded.message,
        created_at = CURRENT_TIMESTAMP
    `);

    upsert.run({ username, agent, slot, message });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// Endpoint zum Abrufen der gespeicherten Kontexte für einen Nutzer+Agent
app.get("/getContexts", (req, res) => {
  try {
    const { username, agent } = req.query;
    if (!username || !agent) return res.status(400).json({ error: "Missing params" });

    const rows = db.prepare(`
      SELECT slot, message FROM agent_contexts
      WHERE username = ? AND agent = ?
      ORDER BY slot ASC
    `).all(username, agent);

    // Rückgabe als {1: "...", 2: "..."} wenn vorhanden
    const result = {};
    for (const r of rows) result[r.slot] = r.message;
    res.json({ contexts: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// Main chat endpoint: liest vorher gespeicherte Kontexte und ruft Agent auf
app.post("/chat/:agent", async (req, res) => {
  const { agent } = req.params;
  const { message, username } = req.body;

  if (!message) return res.status(400).json({ error: "Missing message" });
  if (!username) return res.status(400).json({ error: "Missing username" });

  try {
    // get contexts from DB
    const rows = db.prepare(`
      SELECT slot, message FROM agent_contexts
      WHERE username = ? AND agent = ?
      ORDER BY slot ASC
    `).all(username, agent);

    const contexts = [];
    // Kontext als Array in Slot-Reihenfolge, filtere leere
    rows.sort((a,b) => a.slot - b.slot).forEach(r => {
      if (r.message && r.message.trim() !== "") {
        contexts.push(r.message);
      }
    });

    let response;
    switch (agent) {
      case "agent1":
        response = await runAgent1(message, contexts, username);
        break;
      case "agent2":
        response = await runAgent2(message, contexts, username);
        break;
      case "agent3":
        response = await runAgent3(message, contexts, username);
        break;
      case "agent4":
        response = await runAgent4(message, contexts, username);
        break;
      case "agent5":
        response = await runAgent5(message, contexts, username);
        break;
      case "agent6":
        response = await runAgent6(message, contexts, username);
        break;
      default:
        return res.status(400).json({ error: "Unknown agent" });
    }

    res.json({ reply: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint zum Löschen eines Benutzers und seiner Kontexte
app.post("/deleteUser", (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Missing username" });

    // zuerst Kontexte löschen
    db.prepare(`DELETE FROM agent_contexts WHERE username = ?`).run(username);

    // dann den User selbst löschen
    db.prepare(`DELETE FROM users WHERE username = ?`).run(username);

    return res.json({ ok: true, message: `Benutzer ${username} und alle Kontexte gelöscht.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
