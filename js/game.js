'use strict';

/*--------------------------💣🔢💣🔢💣MineSweeper GamePlan💣🔢💣🔢💣------------------------------
                                           functions/To do


--------------------------💣🔢💣🔢💣MineSweeper GamePlan💣🔢💣🔢💣---------------------------------
*/

//global Vars

const BOMB = '💣';
const FLAG = '🏴';
var hintIsClicked = false;
var isPlaceBombs = false;
var gLifeLeft;
var gBoard;
var gClockInterval = null;
var bombCount;
var gCountOpens;
var currentLevel;
var isGameOn;
var gLevel = [
  {
    size: 4,
    mines: 2,
    needToWin: 14,
    name: 'easy'
  },
  {
    size: 8,
    mines: 12,
    needToWin: 52,
    name: 'medium'
  },
  {
    size: 12,
    mines: 30,
    needToWin: 114,
    name: 'hard'
  }
];

function init(level) {
  bombCount = 0;
  gCountOpens = 0;
  isGameOn = true;
  currentLevel = level;
  gLifeLeft = 3;
  isPlaceBombs = false;
  reLoadHints();
  reLoadLifes();
  createLocalStorageBoard();
  callScores();
  clearInterval(gClockInterval);
  document.querySelector('.time').innerText = 0;
  setTimeout(function() {
    document.querySelector('.smiley').innerText = '😃';
  }, 1000);

  gBoard = createBoard(gLevel[currentLevel].size);
  document.querySelector('.title').innerText = '💣MINE SWEEPER💣';
  renderBoard(gBoard);
}
