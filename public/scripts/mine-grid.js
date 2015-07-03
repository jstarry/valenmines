'use strict';

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

  mineProps: function(mine, row, col, state) {
    var gameWon = this.props.gameState == 'won';
    var gameLost = this.props.gameState == 'lost';
    var disabled = gameWon || gameLost;
    return {
      row: row,
      col: col,
      isMine: mine.isMine,
      nearbyMines: mine.nearbyMines,
      inactive: mine.inactive,
      disabled: disabled,
      revealed: mine.revealed || (mine.isMine && disabled),
      clicked: mine.revealed || (mine.isMine && gameLost)
    };
  },

  renderRows: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mineRows = new Array(rows);
    for (var r = 0; r < rows; r++) {
      var mineCells = new Array(cols);
      for (var c = 0; c < cols; c++) {
        var mine = this.props.mineController.get(r, c);
        var mineProps = this.mineProps(mine, r, c, this.props.gameState);
        mineCells[c] = <MineCell key={c} {...mineProps} onCellClick={this.handleCellClick} />;
      }
      mineRows[r] = <MineRow key={r} cells={mineCells} />
    }
    return mineRows;
  },

  render: function() {
    return (
      <table className="mineGrid">
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    );
  }
});
