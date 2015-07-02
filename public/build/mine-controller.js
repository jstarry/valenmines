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
      this.mines[r][c] = {
        nearbyMines: 0,
        revealed: false,
        inactive: inactive,
        isMine: false
      };
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
