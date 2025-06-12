document.addEventListener('DOMContentLoaded', () => {
  const statsTable = document.getElementById('stats-table').querySelector('tbody');
  const resetBtn = document.getElementById('reset-btn');

  function loadStatistics() {
    const wordData = JSON.parse(localStorage.getItem('wordData')) || {};
    statsTable.innerHTML = '';

    Object.entries(wordData).forEach(([word, counts]) => {
      const row = document.createElement('tr');
      const accuracy = counts.correct + counts.wrong > 0 
        ? ((counts.correct / (counts.correct + counts.wrong)) * 100).toFixed(1) + '%'
        : 'N/A';
      
      row.innerHTML = `
        <td>${word}</td>
        <td>${counts.correct}</td>
        <td>${counts.wrong}</td>
        <td>${accuracy}</td>
      `;
      statsTable.appendChild(row);
    });
  }

  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all statistics?')) {
      localStorage.removeItem('wordData');
      loadStatistics();
    }
  });

  loadStatistics();
});