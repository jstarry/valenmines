'use strict';

/**
 * MineGrid
 *   Represents a grid of mine cells.
 *
 * Properties:
 *   rows: number of rows in the grid
 *   cols: number of columns in the grid
 *   mines: 2D array of mines
 *   mineCount: number of mines to be added to the grid
 *   gameState: state of the game
 *
 * Callbacks:
 *   onGameStart: start the game
 *   onRevealSpaces: report how many spaces were revealed
 *   onMineClick: mine was clicked
 */

var MineGrid = React.createClass({displayName: "MineGrid",

  countMines: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (this.props.mines[r][c].isMine) {
          for (var r1 = Math.max(0, r - 1); r1 < Math.min(rows, r + 2); r1++) {
            for (var c1 = Math.max(0, c - 1); c1 < Math.min(cols, c + 2); c1++) {
              if (r1 != r || c1 != c) {
                this.props.mines[r1][c1].nearbyMines++;
              }
            }
          }
        }
      }
    }
  },

  eligibleMines: function(row, col) {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var eligibleMines = new Array();
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        // Give spacing around the first clicked cell
        if ((r < row - 1 || r > row + 1) || (c < col - 1 || c > col + 1)) {
          var mine = this.props.mines[r][c];
          if (!mine.inactive) {
            eligibleMines.push(mine);
          }
        }
      }
    }
    return eligibleMines;
  },

  placeMines: function(row, col) {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mineCount = this.props.mineCount;
    var eligibleMines = this.eligibleMines(row, col);
    var permutation = getRandomPermutation(eligibleMines.length);
    for (var i = 0; i < mineCount; i++) {
      eligibleMines[permutation[i]].isMine = true;
    }
  },

  revealSpaces: function(row, col) {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mines = this.props.mines;
    var mine = mines[row][col];
    if (mine.isMine) {
      return -1;
    } else {
      var spacesRevealed = 1;
      mine.revealed = true;

      // Recurse if no mines are nearby
      if (mine.nearbyMines == 0) {
        for (var r1 = Math.max(0, row - 1); r1 < Math.min(rows, row + 2); r1++) {
          for (var c1 = Math.max(0, col - 1); c1 < Math.min(cols, col + 2); c1++) {
            if (r1 != row || c1 != col) {
              var nextMine = mines[r1][c1];
              if (!nextMine.inactive && !nextMine.revealed) {
                spacesRevealed += this.revealSpaces(r1, c1);
              }
            }
          }
        }
      }
      return spacesRevealed;
    }
  },

  handleCellClick: function(row, col) {
    var revealSpaces = function() {
      var spacesRevealed = this.revealSpaces(row, col);;
      this.props.onRevealSpaces(spacesRevealed);
      this.forceUpdate();
    }.bind(this);

    if (this.props.gameState == 'new') {
      this.placeMines(row, col);
      this.countMines();
      this.props.onGameStart(revealSpaces);
    } else {
      var mine = this.props.mines[row][col];
      if (mine.isMine) {
        this.props.onMineClick();
      } else {
        revealSpaces();
      }
    }
  },

  renderRows: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mineRows = new Array(rows);
    var gameWon = this.props.gameState == 'won';
    var gameLost = this.props.gameState == 'lost';
    var disabled = gameWon || gameLost;

    for (var r = 0; r < rows; r++) {
      var mineCells = new Array(cols);
      for (var c = 0; c < cols; c++) {
        var mine = this.props.mines[r][c];
        var mineProps = {
          row: r,
          col: c,
          isMine: mine.isMine,
          nearbyMines: mine.nearbyMines,
          inactive: mine.inactive,
          disabled: disabled,
          revealed: mine.revealed || (mine.isMine && disabled),
          clicked: mine.revealed || (mine.isMine && gameLost)
        }
        mineCells[c] = React.createElement(MineCell, React.__spread({key: c},  mineProps, {onCellClick: this.handleCellClick}));
      }
      mineRows[r] = React.createElement(MineRow, {key: r, cells: mineCells})
    }
    return mineRows;
  },

  render: function() {
    return (
      React.createElement("table", {className: "mineGrid"}, 
        React.createElement("tbody", null, 
          this.renderRows()
        )
      )
    );
  }
});
