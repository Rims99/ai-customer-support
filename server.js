// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/chat', async (req, res) => {
  const { query } = req.body;

  try {
    let chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hello" }] },
        { role: "model", parts: [{ text: "Great to meet you. What would you like to know?" }] },
      ],
    });

    const result = await chat.sendMessage(query);
    res.json(result);
  } catch (error) {
    console.error('Error querying Gemini API:', error); // Log detailed error information
    res.status(500).json({ error: "Failed to retrieve data", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
