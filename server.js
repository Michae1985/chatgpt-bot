const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/status", (req, res) => {
  res.send("Chatbotten er online og klar!");
});

const path = require("path");

// Server forsiden
const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0].message.content;
res.json({ reply });
  } catch (error) {
    console.error("Fejl:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Chatbotten er online og klar!');
});

app.listen(3000, () => {
  console.log("✅ Server kører på http://localhost:3000");
});