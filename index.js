import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

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
app.use(express.static("public")); // für HTML/CSS/JS

// Route für jeden Agenten
app.post("/chat/:agent", async (req, res) => {
  const { agent } = req.params;
  const { message } = req.body;

  try {
    let response;
    switch(agent) {
      case "agent1":
        response = await runAgent1(message);
        break;
      case "agent2":
        response = await runAgent2(message);
        break;
      case "agent3":
        response = await runAgent3(message);
        break;
      case "agent4":
        response = await runAgent4(message);
        break;
      case "agent5":
        response = await runAgent5(message);
        break;
      case "agent6":
        response = await runAgent6(message);
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

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
