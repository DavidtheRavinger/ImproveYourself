const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// statische Dateien (z. B. public Ordner)
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hallo Render!" });
});

app.listen(port, () => {
  console.log(`✅ Server läuft auf Port ${port}`);
});
