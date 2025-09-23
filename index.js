const express = require("express");
const bodyParser = require("body-parser");

const agent1 = require("./agents/agent1");
const agent2 = require("./agents/agent2");
const agent3 = require("./agents/agent3");
const agent4 = require("./agents/agent4");
const agent5 = require("./agents/agent5");
const agent6 = require("./agents/agent6");

const AGENTS = { agent1, agent2, agent3, agent4, agent5, agent6 };

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // index.html und style.css

app.post("/ask", async (req, res) => {
    const { agent, question } = req.body;
    if (!AGENTS[agent]) return res.status(400).json({ error: "Agent existiert nicht" });

    try {
        const answer = await AGENTS[agent].askAgent(question);
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
