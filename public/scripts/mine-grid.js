'use strict';

var dom = React.DOM;
var createEl = React.createElement.bind(React);

/**
 * MineGrid
 *   Represents a grid of mine cells.
 *
 * Properties:
 *   rows: number of rows in the grid
 *   cols: number of columns in the grid
 *   mineController: mine controller
 *   gameState: state of the game
 *
 * Callbacks:
 *   onGameStart: start the game
 *   onRevealSpaces: report how many spaces were revealed
 *   onMineClick: mine was clicked
 */

var MineGrid = React.createClass({

  getInitialState: function() {
    return {
      spacesLeft: this.props.rows * this.props.cols
    };
  },

  handleCellClick: function(row, col) {
    var revealSpaces = function() {
      var spacesRevealed = this.props.mineController.floodFill(row, col);;
      this.props.onRevealSpaces(spacesRevealed);
      this.setState({spacesLeft: this.state.spacesLeft - spacesRevealed});
    }.bind(this);

    if (this.props.gameState == 'new') {
      this.props.mineController.placeMines(row, col);
      this.props.mineController.addMineCount();
      this.props.onGameStart(revealSpaces);
    } else {
      if (this.props.mineController.get(row, col).isMine) {
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
    for (var r = 0; r < rows; r++) {
      var mineCells = new Array(cols);
      for (var c = 0; c < cols; c++) {
        var mine = this.props.mineController.get(r, c);
        mineCells[c] = createEl(MineCell, {key: c,  mine: mine, onCellClick: this.handleCellClick});
      }
      mineRows[r] = createEl(MineRow, {key: r, cells: mineCells});
    }
    return mineRows;
  },

  render: function() {
    return (
      dom.table({className: 'mineGrid'},
        dom.tbody({}, this.renderRows()))
    );
  }
});
