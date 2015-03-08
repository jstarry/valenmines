'use strict';

// Document event handlers
var mouseDown = false;
document.body.onmousedown = function(e) {
  if (!e.ctrlKey) {
    mouseDown = true;
  }
}
document.body.onmouseup = function() {
  mouseDown = false;
}

// DATA
var LARGE_BOARD = {
  mineCount: 110,
  rows: 30,
  cols: 31,
  heartLims: [
    [5, 10],
    [4, 11],
    [3, 12],
    [2, 13],
    [2, 13],
    [1, 14],
    [1, 14],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [0, 15],
    [1, 15],
    [2, 15],
    [3, 15],
    [4, 15],
    [5, 15],
    [6, 15],
    [7, 15],
    [8, 15],
    [9, 15],
    [10, 15],
    [11, 15],
    [12, 15],
    [13, 15],
    [14, 15],
    [15, 15]]
};

var MEDIUM_BOARD = {
  mineCount: 50,
  rows: 20,
  cols: 21,
  heartLims: [
    [3, 7],
    [2, 8],
    [1, 9],
    [1, 9],
    [0, 10],
    [0, 10],
    [0, 10],
    [0, 10],
    [0, 10],
    [1, 10],
    [1, 10],
    [2, 10],
    [3, 10],
    [4, 10],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
    [10, 10]]
};

var SMALL_BOARD = {
  mineCount: 12,
  rows: 10,
  cols: 11,
  heartLims: [
    [2, 3],
    [1, 4],
    [0, 5],
    [0, 5],
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5]]
};

// Utilities
function getRandomInt(max) {
    return Math.floor(max * Math.random());
};

function getRandomPermutation(n) {
  var array = new Array(n);
  for (var i = 0; i < n; i++) {
    array[i] = i;
  }

  for (var i = 0; i < n; i++) {
    var j = getRandomInt(n);
    var swap = array[i];
    array[i] = array[j];
    array[j] = swap;
  };
  return array;
};
