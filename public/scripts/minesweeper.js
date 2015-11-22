'use strict';

var dom = React.DOM;
var createEl = React.createElement.bind(React);

/**
 * MineSweeper
 *   Represents a minesweeper game.
 *
 * State:
 *   gameState: current state of game
 *   spaces: spaces left to click
 *   seconds: seconds elapsed
 *
 * Properties:
 *   rows: number of rows
 *   cols: number of columns
 *   mineCount: number of mines to be placed
 *   mines: 2D array of mine cells
 */

var MineSweeper = React.createClass({

  getDefaultProps: function() {
    return {
      key: 1
    };
  },

  getInitialState: function() {
    return {
      gameState: 'new',
      spaces: 0,
      seconds: 0
    };
  },

  handleMineClick: function() {
    this.handleGameLost();
  },

  handleRevealSpaces: function(spaces) {
    if (spaces == this.state.spaces) {
      this.handleGameWon();
    } else {
      this.setState({spaces: this.state.spaces - spaces});
    }
  },

  handleGameStart: function(cb) {
    var that = this;
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mineCount = this.props.mineCount;
    var inactiveCount = this.props.mineController.inactiveCount();
    this.setState({
      gameState: 'start',
      spaces: rows * cols - mineCount - inactiveCount
    }, function() {
      that.interval = setInterval(function() {
        that.setState({seconds: that.state.seconds + 1});
      }, 1000);
      cb();
    });
  },

  handleGameLost: function() {
    clearInterval(this.interval);
    this.props.mineController.setGameLost();
    this.setState({gameState: 'lost'});
  },

  handleGameWon:  function() {
    clearInterval(this.interval);
    this.props.mineController.setGameWon();
    this.setState({spaces: 0, gameState: 'won'});
    this.props.server.saveScore(this.props.level, this.state.seconds);
  },

  handleGameReset: function() {
    clearInterval(this.interval);
    this.props.key++;
    this.props.mineController.reset();
    this.replaceState(this.getInitialState());
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  render: function() {
    var gridProps = {
      rows: this.props.rows,
      cols: this.props.cols,
      mineController: this.props.mineController,
      gameState: this.state.gameState,
      onGameStart: this.handleGameStart,
      onRevealSpaces: this.handleRevealSpaces,
      onMineClick: this.handleMineClick
    };
    return (
      dom.div({className: 'mineBoard', key: this.props.key},
        dom.div({className: 'mineStatusBar'},
          createEl(Counter, {count: this.state.spaces}),
          createEl(GameStateButton, {gameState: this.state.gameState, onButtonClick: this.handleGameReset}),
          createEl(Counter, {count: this.state.seconds})),
        createEl(MineGrid, gridProps))
    );
  }
});
