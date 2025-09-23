import express from "express";
import dotenv from "dotenv";

import { runAgent1 } from "./agents/agent1.js";
import { runAgent2 } from "./agents/agent2.js";
import { runAgent3 } from "./agents/agent3.js";
import { runAgent4 } from "./agents/agent4.js";
import { runAgent5 } from "./agents/agent5.js";
import { runAgent6 } from "./agents/agent6.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hallo! Willkommen bei ImproveYourself"));

// Routen für alle Agenten
app.get("/agent1", async (req, res) => {
  const prompt = req.query.prompt || "Hallo Agent1!";
  res.send(await runAgent1(prompt));
});
app.get("/agent2", async (req, res) => {
  const prompt = req.query.prompt || "Hallo Agent2!";
  res.send(await runAgent2(prompt));
});
app.get("/agent3", async (req, res) => {
  const prompt = req.query.prompt || "Hallo Agent3!";
  res.send(await runAgent3(prompt));
});
app.get("/agent4", async (req, res) => {
  const prompt = req.query.prompt || "Hallo Agent4!";
  res.send(await runAgent4(prompt));
});
app.get("/agent5", async (req, res) => {
  const prompt = req.query.prompt || "Hallo Agent5!";
  res.send(await runAgent5(prompt));
});
app.get("/agent6", async (req, res) => {
  const prompt = req.query.prompt || "Hallo Agent6!";
  res.send(await runAgent6(prompt));
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
// Beispielaufruf: http://localhost:3000/agent1?prompt=Wie%20ist%20das%20Wetter%20heute?