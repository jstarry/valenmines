'use strict';

var Mine = function(row, col, inactive) {
  this.row = row;
  this.col = col;
  this.inactive = inactive;
  this.isMine = false;
  this.nearbyMines = 0;
  this.revealed = false;
  this.clicked = false;
};
