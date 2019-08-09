'use strict';

function reLoadHints() {
  var hints = document.querySelectorAll('.hint');
  for (var i = 0; i < hints.length; i++) {
    hints[i].style.color = 'rgb(153, 255, 0)';
  }
}

function reLoadLifes() {
  var lifes = document.querySelectorAll('.life');
  for (var i = 0; i < lifes.length; i++) {
    lifes[i].style.color = 'red';
  }
}
