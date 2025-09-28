// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// ✅ Debug: Check if API key is loaded
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "[FOUND]" : "[MISSING]");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ✅ Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Single /ai-chat endpoint
app.post("/ai-chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "No messages provided or invalid format." });
    }

    console.log("Messages received:", messages);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // you can change to "gpt-4" if you want
      messages,
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content.trim();
    console.log("AI reply:", reply);

    res.json({ reply });
  } catch (err) {
    // ✅ Full error logging
    console.error("OpenAI request failed:", err.response?.data || err.message || err);
    res.status(500).json({ reply: "Error connecting to AI server." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ AI backend running at http://localhost:${PORT}`);
});
