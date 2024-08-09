const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 5000;

// API endpoint to fetch data
app.get('/api/fetch-data', async (req, res) => {
  try {
    const { data } = await axios.get('https://headstarter.co/'); // Replace with your target URL
    const $ = cheerio.load(data);
    const questionsAndAnswers = [];

    // Modify the selectors to match the structure of the website
    $('h2.question').each((index, element) => {
      const question = $(element).text();
      const answer = $(element).next('p').text(); // Assuming the answer is in the next paragraph
      questionsAndAnswers.push({ question, answer });
    });

    res.json(questionsAndAnswers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
