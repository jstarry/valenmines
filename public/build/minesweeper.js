'use strict';

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

var MineSweeper = React.createClass({displayName: "MineSweeper",

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
    }
    this.setState({spaces: this.state.spaces - spaces});
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
    this.setState({gameState: 'lost'});
  },

  handleGameWon:  function() {
    this.props.server.saveScore(this.props.level, this.state.seconds);
    clearInterval(this.interval);
    this.setState({gameState: 'won'});
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
      gameState: this.state.gameState
    };
    var gridCallbacks = {
      onGameStart: this.handleGameStart,
      onRevealSpaces: this.handleRevealSpaces,
      onMineClick: this.handleMineClick
    };
    return (
      React.createElement("div", {className: "mineBoard", key: this.props.key}, 
        React.createElement("div", {className: "mineStatusBar"}, 
          React.createElement(Counter, {count: this.state.spaces}), 
          React.createElement(GameStateButton, {gameState: this.state.gameState, onButtonClick: this.handleGameReset}), 
          React.createElement(Counter, {count: this.state.seconds})
        ), 
        React.createElement(MineGrid, React.__spread({},  gridProps,  gridCallbacks))
      )
    );
  }
});