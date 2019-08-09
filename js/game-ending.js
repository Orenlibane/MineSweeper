'use strict';

function updateGameLose(location) {
  if (hintIsClicked) return;
  var elCell = document.querySelector('.' + getClassName(location));
  if (elCell.style.backgroundColor === 'red') return;
  var bombedCell = getClassName(location);
  if (gLifeLeft === 0) {
    gameOver();
    document.querySelector('.' + bombedCell).style.backgroundColor = 'red';
    document.querySelector('.title').innerText = 'YOU LOSE';
    document.querySelector('.smiley').innerText = '😱';
    bombsRevel();
    console.log('here');
  } else {
    gLifeLeft--;
    var lifes = document.querySelectorAll('.life');
    lifes[gLifeLeft].style.color = 'black';
    gBoard[location.i][location.j].isClicked = false;
    document.querySelector('.title').innerText = `BOOM ${gLifeLeft} Lifes Left`;
    document.querySelector('.smiley').innerText = '😱';
    document.querySelector('.' + bombedCell).style.backgroundColor = 'red';
    setTimeout(function() {
      document.querySelector('.smiley').innerText = '😃';
      document.querySelector('.title').innerText = '💣MINE SWEEPER💣';
    }, 500);
  }
}

function checkGameWin() {
  var openCells = checkOpenCells();
  var flagedCells = checkFlagCells();
  var level = gLevel[currentLevel];

  if (level.needToWin === openCells && level.mines === flagedCells) {
    var time = document.querySelector('.time').innerText; //changed
    gameOver();
    updateMaxScore(time);
    document.querySelector('.title').innerText = 'YOU WIN';
    document.querySelector('.smiley').innerText = '😎';
  }
}

function gameOver() {
  clearInterval(gClockInterval);
  isGameOn = false;

  var time = document.querySelector('.time').innerText;

  document.querySelector('.current-score-points').innerText = time;
}
