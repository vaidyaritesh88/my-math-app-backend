// server.js
console.log("🟢 Starting server.js...");
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  

app.post('/word-problem', async (req, res) => {
  const { age } = req.body;

  try {
    const prompt = `Generate a fun two-digit word problem in addition or subtraction for a ${age}-year-old. Try to use the name Ivaan, Iraa, Shriyans, Sameeksha, Shaurya, Adira, Grandpa, Aaji, Aai, Aaba, Mumma, Daddy, Aatya, Sameer kaka, Jui Maushi in the word problems. Respond only in this format:
Problem: <question>
Answer: <number>`;

const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;
    const match = text.match(/Problem:\s*(.*)\nAnswer:\s*(\d+)/i);

    if (!match) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    res.json({
      problem: match[1],
      answer: parseInt(match[2], 10),
    });
  } catch (err) {
    console.error('❌ Error generating word problem:', err.message);
    res.status(500).json({ error: 'Failed to generate word problem' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

