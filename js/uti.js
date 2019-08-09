'use strict';

function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function createBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        value: 0,
        bombsNag: 0,
        pos: {
          i: i,
          j: j
        },
        isFlag: false,
        isClicked: false
      };
    }
  }
  return board;
}

function renderBoard() {
  var elBoard = document.querySelector('.board');
  var strHTML = '';
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < gBoard[0].length; j++) {
      var cellClass = getClassName({ i: i, j: j });

      strHTML += `\t<td class="cell ${cellClass}" data-i=${i} data-j=${j} 
      onmousedown="cellClicked(this,event)" >\n
                   \t</td>\n`;
    }
    strHTML += `</tr>\n`;
  }

  elBoard.innerHTML = strHTML;
}

function renderCell(location, value) {
  var cellSelector = '.' + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

function placeBombs(location) {
  var bombsNum = gLevel[currentLevel].mines;
  var bombsPos = bombsPositions(location.pos);

  for (var i = 0; i < bombsNum; i++) {
    var bombPosition = bombsPos.splice(getRandomInt(0, bombsPos.length - 1), 1);
    gBoard[bombPosition[0].pos.i][bombPosition[0].pos.j].value = BOMB;
  }
}

function settingNumbersAndBombsNag() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j];
      countBombsNags(cell.pos);
      if (cell.value !== BOMB) {
        cell.value = cell.bombsNag;
      }
    }
  }
}

function countBombsNags(pos) {
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (i === pos.i && j === pos.j) continue;
      if (i < 0 || i >= gBoard.length) continue;
      if (j < 0 || j >= gBoard.length) continue;
      var cell = gBoard[i][j].value;
      if (cell === BOMB) gBoard[pos.i][pos.j].bombsNag++;
    }
  }
}

function timer() {
  var clockTime = document.querySelector('.time');
  var startTime = Date.now();
  gClockInterval = setInterval(function() {
    var time = (Date.now() - startTime) / 1000;
    time = parseFloat(time).toFixed(3);
    clockTime.innerText = time;
  }, 100);
}

function cellClicked(elTd, ev) {
  if (!isGameOn) return;

  if (ev.button === 2) {
    flagIt(elTd);
    checkGameWin();
    return;
  }

  var locationCords = elTd.dataset;
  var locationValue = gBoard[locationCords.i][locationCords.j].value;
  var locationOnTable = gBoard[locationCords.i][locationCords.j];

  if (ev.button === 0 && locationOnTable.isFlag) return;
  checkHint(locationOnTable.pos, locationOnTable);

  if (locationOnTable.isClicked) return;
  else if (!hintIsClicked) locationOnTable.isClicked = true;

  if (locationOnTable.isFlag) return;

  if (locationValue === 0 && isPlaceBombs && !hintIsClicked)
    expendZerosNags(locationCords);

  if (locationValue === BOMB) {
    updateGameLose(locationCords);
  }

  checkGameWin();

  if (isPlaceBombs) renderCell(locationCords, locationValue);

  checkFirstClick(locationOnTable, locationCords, locationValue);

  colorize();
  colorizeCells(elTd);
  hintIsClicked = false;
}

function checkFirstClick(locationOnTable, locationCords, locationValue) {
  if (!isPlaceBombs) {
    if (hintIsClicked) {
      hintIsClicked = false;
      document.querySelector('.title').innerText =
        'Cant use hints on first turn, Dont worry, its Not a bomb!';
      setTimeout(function() {
        document.querySelector('.title').innerText = 'Mine Sweeper';
        reLoadHints();
      }, 2000);
      return;
    }
    timer();

    placeBombs(locationOnTable);
    settingNumbersAndBombsNag();
    isPlaceBombs = true;
    renderCell(locationCords, locationValue);
    if (locationValue === 0 && isPlaceBombs) expendZerosNags(locationCords);
  }
}

function checkHint(hintPos, location) {
  if (hintIsClicked && !location.isClicked) {
    for (var i = hintPos.i - 1; i <= hintPos.i + 1; i++) {
      for (var j = hintPos.j - 1; j <= hintPos.j + 1; j++) {
        if (i < 0 || i >= gBoard.length) continue;
        if (j < 0 || j >= gBoard.length) continue;
        var cell = gBoard[i][j];
        var cellPos = { i: i, j: j };
        if (cell.isFlag) continue;
        renderCell(cellPos, cell.value);
      }
    }

    setTimeout(function() {
      for (var i = hintPos.i - 1; i <= hintPos.i + 1; i++) {
        for (var j = hintPos.j - 1; j <= hintPos.j + 1; j++) {
          if (i < 0 || i >= gBoard.length) continue;
          if (j < 0 || j >= gBoard.length) continue;
          cellPos = { i: i, j: j };
          cell = gBoard[i][j];
          if (cell.isClicked) continue;
          else if (cell.isFlag || cell.value === BOMB) continue;
          else renderCell(cellPos, '');
        }
      }
      location.isClicked = false;
      if (gBoard[hintPos.i][hintPos.j].value !== BOMB) renderCell(hintPos, '');
    }, 1000);
  }
  document.querySelector('.title').innerText = '💣MINE SWEEPER💣';
}

function expendZerosNags(pos) {
  var posI = +pos.i;
  var posJ = +pos.j;
  var zeros = [];

  for (var i = posI - 1; i <= posI + 1; i++) {
    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (i === posI && j === posJ) continue;
      if (i < 0 || i >= gBoard.length) continue;
      if (j < 0 || j >= gBoard.length) continue;
      var cell = gBoard[i][j];
      if (cell.value === 0 && cell.isClicked === false) {
        var pos = { i: i, j: j };
        zeros.push(pos);
      }
      renderCell(cell.pos, cell.value);
      cell.isClicked = true;
      cell.isFlag = false;
    }
  }
  for (var i = 0; i < zeros.length; i++) {
    expendZerosNags(zeros[i]);
  }
}

function bombsRevel() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j];
      if (cell.value === BOMB) {
        renderCell(cell.pos, BOMB);
        var cellSelector = '.' + getClassName({ i: cell.pos.i, j: cell.pos.j });
        var elCell = document.querySelector(cellSelector);
        elCell.style.backgroundColor = 'red';
      }
    }
  }
}

function flagIt(elCell) {
  var locationDataSet = elCell.dataset;
  var cell = gBoard[locationDataSet.i][locationDataSet.j];
  if (cell.isClicked && cell.value !== BOMB) return;
  if (cell.isFlag) {
    cell.isFlag = false;
    renderCell(locationDataSet, '');
  } else {
    cell.isFlag = true;
    renderCell(locationDataSet, FLAG);
  }
}

function checkOpenCells() {
  var oldGcountOpens = gCountOpens;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j];
      if (cell.isClicked && cell.value !== BOMB) gCountOpens++;
    }
  }
  gCountOpens -= oldGcountOpens;
  return gCountOpens;
}

function checkFlagCells() {
  var countFlags = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j];
      if (cell.isFlag) countFlags++;
    }
  }
  return countFlags;
}

function hints(elHint) {
  if (elHint.style.color === 'white' || !isGameOn) {
    return;
  } else {
    elHint.style.color = 'white';
    document.querySelector('.title').innerText =
      'Click on a cell to reveal him and its neighbors';
    hintIsClicked = true;
  }
}

function colorize() {
  var cells = document.querySelectorAll('td');
  var colors = [
    'rgb(75, 75, 211)',
    'black',
    ' rgb(161, 32, 32)',
    'brown',
    'purple',
    'red',
    'teal',
    'lime',
    'gray'
  ];

  for (var i = 0; i < cells.length; i++) {
    var color = colors[cells[i].innerText];
    cells[i].style.color = color;
  }
}

function changeSmiley(elSmiley) {
  elSmiley.innerHTML = '😆';
  init(currentLevel);

  setTimeout(function() {
    elSmiley.innerHTML = '😃';
  }, 500);
}

function bombsPositions(pos) {
  var bombsPos = [];

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (
        (i === pos.i - 1 && j === pos.j - 1) ||
        (i === pos.i - 1 && j === pos.j) ||
        (i === pos.i - 1 && j === pos.j + 1) ||
        (i === pos.i && j === pos.j - 1) ||
        (i === pos.i && j === pos.j) ||
        (i === pos.i && j === pos.j + 1) ||
        (i === pos.i + 1 && j === pos.j - 1) ||
        (i === pos.i + 1 && j === pos.j) ||
        (i === pos.i + 1 && j === pos.j + 1)
      ) {
        continue;
      }
      var cell = gBoard[i][j];
      bombsPos.push(cell);
    }
  }
  return bombsPos;
}

function colorizeCells(elTd) {
  if (hintIsClicked) return;
  var tds = document.querySelectorAll('td');

  for (var i = 0; i < tds.length; i++) {
    var location = tds[i].dataset;
    var locationI = location.i;
    var locationJ = location.j;
    var cell = gBoard[locationI][locationJ];
    if (tds[i].style.backgroundColor === 'red') continue;
    if (cell.isClicked && cell.value === 0) {
      tds[i].style.backgroundColor = 'rgb(75, 75, 211)';
    } else if (cell.isClicked && cell.value !== 0 && !cell.isFlag) {
      tds[i].style.backgroundColor = 'rgb(75, 75, 211,0.6)';
    }
  }
}
