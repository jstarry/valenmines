'use strict';

var MineController = function(rows, cols, heartLims, mineCount) {
  this.rows = rows;
  this.cols = cols;
  this.heartLims = heartLims;
  this.mineCount = mineCount;
  this.reset();
};

MineController.prototype.reset = function() {
  this.mines = new Array(this.rows);
  for (var r = 0; r < this.rows; r++) {
    this.mines[r] = new Array(this.cols);
    for (var c = 0; c < this.cols; c++) {
      var inactive = false;
      if (this.heartLims[r]) {
        var leftLim = this.heartLims[r][0];
        var rightLim = this.heartLims[r][1];
        inactive = c < leftLim || c > this.rows - leftLim;
        inactive = inactive || (c > rightLim && c < this.rows - rightLim);
      }
      this.mines[r][c] = new Mine(r, c, inactive)
    }
  }
};

MineController.prototype.get = function(row, col) {
  return this.mines[row][col];
};

MineController.prototype.eligibleMines = function(row, col) {
  var eligibleMines = new Array();
  for (var r = 0; r < this.rows; r++) {
    for (var c = 0; c < this.cols; c++) {
      // Give spacing around the first clicked cell
      if ((r < row - 1 || r > row + 1) || (c < col - 1 || c > col + 1)) {
        var mine = this.mines[r][c];
        if (!mine.inactive) {
          eligibleMines.push(mine);
        }
      }
    }
  }
  return eligibleMines;
};

MineController.prototype.placeMines = function(row, col) {
  var eligibleMines = this.eligibleMines(row, col);
  var permutation = getRandomPermutation(eligibleMines.length);
  for (var i = 0; i < this.mineCount; i++) {
    eligibleMines[permutation[i]].isMine = true;
  }
};

MineController.prototype.floodFill = function(row, col) {
  var mine = this.mines[row][col];
  if (mine.isMine) {
    return -1;
  } else {
    var spacesRevealed = 1;
    mine.revealed = true;
    mine.clicked = true;

    // Recurse if no mines are nearby
    if (mine.nearbyMines == 0) {
      for (var r1 = Math.max(0, row - 1); r1 < Math.min(this.rows, row + 2); r1++) {
        for (var c1 = Math.max(0, col - 1); c1 < Math.min(this.cols, col + 2); c1++) {
          if (r1 != row || c1 != col) {
            var nextMine = this.mines[r1][c1];
            if (!nextMine.inactive && !nextMine.revealed) {
              spacesRevealed += this.floodFill(r1, c1);
            }
          }
        }
      }
    }
    return spacesRevealed;
  }
};

MineController.prototype.addMineCount = function() {
  for (var r = 0; r < this.rows; r++) {
    for (var c = 0; c < this.cols; c++) {
      if (this.mines[r][c].isMine) {
        for (var r1 = Math.max(0, r - 1); r1 < Math.min(this.rows, r + 2); r1++) {
          for (var c1 = Math.max(0, c - 1); c1 < Math.min(this.cols, c + 2); c1++) {
            if (r1 != r || c1 != c) {
              this.mines[r1][c1].nearbyMines++;
            }
          }
        }
      }
    }
  }
};

MineController.prototype.setGameWon = function() {
  for (var r = 0; r < this.rows; r++) {
    for (var c = 0; c < this.cols; c++) {
      if (this.mines[r][c].isMine) {
        this.mines[r][c].revealed = true;
      }
    }
  }
};

MineController.prototype.setGameLost = function() {
  for (var r = 0; r < this.rows; r++) {
    for (var c = 0; c < this.cols; c++) {
      if (this.mines[r][c].isMine) {
        this.mines[r][c].clicked = true;
      }
    }
  }
};

MineController.prototype.inactiveCount = function() {
    var inactiveCount = 0;
    for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.cols; c++) {
        if (this.mines[r][c].inactive) {
          inactiveCount++;
        }
      }
    }
    return inactiveCount;
};
