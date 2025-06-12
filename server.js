const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Read words from file
const wordsPath = path.join(__dirname, 'words.txt');
const words = fs.readFileSync(wordsPath, 'utf8')
  .split('\n')
  .filter(word => word.trim());

app.get('/api/words', (req, res) => {
  res.json(words);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});