document.addEventListener('DOMContentLoaded', async () => {
  const wordDisplay = document.getElementById('word-display');
  const correctBtn = document.getElementById('correct-btn');
  const wrongBtn = document.getElementById('wrong-btn');

  // Initialize session storage
  if (!localStorage.getItem('wordData')) {
    localStorage.setItem('wordData', JSON.stringify({}));
  }

  // Fetch words from server
  const words = await fetch('/api/words').then(res => res.json());
  
  // Get next word with weighted probability
  function getNextWord() {
    const wordData = JSON.parse(localStorage.getItem('wordData'));
    const weights = words.map(word => {
      const data = wordData[word] || { correct: 0, wrong: 0 };
      // Higher weight for more mistakes
      return (data.wrong + 1) / (data.correct + 1);
    });
    
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < words.length; i++) {
      random -= weights[i];
      if (random <= 0) return words[i];
    }
    
    return words[0];
  }

  // Update word display
  function showNewWord() {
    currentWord = getNextWord();
    wordDisplay.textContent = currentWord;
  }

  // Save result to localStorage
  function saveResult(isCorrect) {
    const wordData = JSON.parse(localStorage.getItem('wordData'));
    if (!wordData[currentWord]) {
      wordData[currentWord] = { correct: 0, wrong: 0 };
    }
    
    if (isCorrect) {
      wordData[currentWord].correct++;
    } else {
      wordData[currentWord].wrong++;
      // Speak the word (requires browser TTS support)
      speakWord(currentWord);
    }
    
    localStorage.setItem('wordData', JSON.stringify(wordData));
    showNewWord();
  }

  // Text-to-speech function
  function speakWord(word) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'zh-HK'; // Cantonese
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }

  // Event listeners
  correctBtn.addEventListener('click', () => saveResult(true));
  wrongBtn.addEventListener('click', () => saveResult(false));
  
  let currentWord;
  showNewWord();
});