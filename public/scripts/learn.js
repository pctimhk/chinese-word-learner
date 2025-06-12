document.addEventListener('DOMContentLoaded', async () => {
  const wordDisplay = document.getElementById('word-display');
  const correctBtn = document.getElementById('correct-btn');
  const wrongBtn = document.getElementById('wrong-btn');
  const modal = document.getElementById('wrong-modal');
  const modalWord = document.getElementById('modal-word');
  const speakBtn = document.getElementById('speak-btn');
  const nextBtn = document.getElementById('next-btn');

  // Initialize session storage
  if (!sessionStorage.getItem('wordData')) {
    sessionStorage.setItem('wordData', JSON.stringify({}));
  }

  // Fetch words from server
  const words = await fetch('/api/words').then(res => res.json());
  let currentWord = '';
  
  // Get next word with weighted probability
  function getNextWord() {
    const wordData = JSON.parse(sessionStorage.getItem('wordData'));
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

  // Text-to-speech function
  function speakWord(word) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'zh-HK'; // Cantonese
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }

  // Save result to sessionStorage
  function saveResult(isCorrect) {
    const wordData = JSON.parse(sessionStorage.getItem('wordData'));
    
    if (!wordData[currentWord]) {
      wordData[currentWord] = { correct: 0, wrong: 0 };
    }
    
    if (isCorrect) {
      wordData[currentWord].correct++;
      showNewWord();
    } else {
      wordData[currentWord].wrong++;
      modalWord.textContent = currentWord;
      modal.style.display = 'block';
      speakWord(currentWord);
    }
    
    sessionStorage.setItem('wordData', JSON.stringify(wordData));
  }

  // Event listeners
  correctBtn.addEventListener('click', () => saveResult(true));
  wrongBtn.addEventListener('click', () => saveResult(false));
  
  speakBtn.addEventListener('click', () => {
    speakWord(currentWord);
  });
  
  nextBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    showNewWord();
  });

  // Initialize
  showNewWord();
});