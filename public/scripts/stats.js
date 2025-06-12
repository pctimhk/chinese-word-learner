document.addEventListener('DOMContentLoaded', () => {
  const statsTable = document.getElementById('stats-table').querySelector('tbody');
  const resetBtn = document.getElementById('reset-btn');

  function loadStatistics() {
    const wordData = JSON.parse(sessionStorage.getItem('wordData')) || {};
    statsTable.innerHTML = '';

    // Get all words with data
    const words = Object.keys(wordData).sort();
    
    if (words.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="4">No learning data available</td>';
      statsTable.appendChild(row);
      return;
    }

    words.forEach(word => {
      const counts = wordData[word];
      const row = document.createElement('tr');
      
      // Calculate accuracy
      const total = counts.correct + counts.wrong;
      let accuracy = 'N/A';
      let accuracyClass = '';
      
      if (total > 0) {
        const percent = (counts.correct / total) * 100;
        accuracy = `${percent.toFixed(1)}%`;
        
        // Add color coding based on accuracy
        if (percent >= 80) accuracyClass = 'accuracy-good';
        else if (percent >= 50) accuracyClass = 'accuracy-medium';
        else accuracyClass = 'accuracy-poor';
      }
      
      row.innerHTML = `
        <td>${word}</td>
        <td>${counts.correct}</td>
        <td>${counts.wrong}</td>
        <td class="${accuracyClass}">${accuracy}</td>
      `;
      statsTable.appendChild(row);
    });
  }

  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
      sessionStorage.setItem('wordData', JSON.stringify({}));
      loadStatistics();
    }
  });

  loadStatistics();
});