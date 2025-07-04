const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = "asst_IYWBmT37ETSuBnWr4d2pLP1P"; // <-- dit assistant-id her

// Vis forsiden
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API-endpoint
app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    // 1. Opret en thread (engangssamtale)
    const thread = await openai.beta.threads.create();

    // 2. Tilføj brugerens besked
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // 3. Kør assistant'en
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    // 4. Vent på, at den er færdig
    let completedRun;
    while (true) {
      completedRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (completedRun.status === "completed") break;
      if (completedRun.status === "failed") throw new Error("Kørsel fejlede.");
      await new Promise(resolve => setTimeout(resolve, 1000)); // vent 1 sekund
    }

    // 5. Hent svaret
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantReply = messages.data[0].content[0].text.value;

    res.json({ reply: assistantReply });
  } catch (error) {
    console.error("Fejl:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Server kører på http://localhost:3000");
});