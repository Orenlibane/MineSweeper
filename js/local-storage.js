'use strict';

function updateMaxScore(currentScore) {
  var level = gLevel[currentLevel];
  var levelScore = document.querySelector(`.score-${level.name}`).innerText;
  var levelScore = parseFloat(levelScore);

  if (levelScore > currentScore) {
    document.querySelector(`.score-${level.name}`).innerText = currentScore;
    localStorage.setItem(level.name, currentScore);
  }
  document.querySelector('.time').innerText = 0;
}

function callScores() {
  var levelsNames = ['easy', 'medium', 'hard'];

  for (var i = 0; i < 3; i++) {
    document.querySelector(
      `.score-${levelsNames[i]}`
    ).innerText = localStorage.getItem(`${levelsNames[i]}`);
  }
}

function createLocalStorageBoard() {
  if (
    localStorage.getItem(`easy`) &&
    localStorage.getItem(`medium`) &&
    localStorage.getItem(`hard`)
  )
    return;
  localStorage.setItem('easy', 10000);
  localStorage.setItem('medium', 10000);
  localStorage.setItem('hard', 10000);
}
