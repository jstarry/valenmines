'use strict';

var MineSweeper = React.createClass({

  getInitialState: function() {
    return {
      mines: this.newMines(),
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
    var inactiveCount = this.inactiveCount();
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
    clearInterval(this.interval);
    this.setState({gameState: 'won'});
  },

  inactiveCount: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var mines = this.state.mines;
    var inactiveCount = 0;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (mines[r][c].inactive) {
          inactiveCount++;
        }
      }
    }
    return inactiveCount;
  },

  newMines: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var heartLims = this.props.heartLims;
    var mines = new Array(rows);
    for (var r = 0; r < rows; r++) {
      mines[r] = new Array(cols);
      for (var c = 0; c < cols; c++) {
        var inactive = false;
        if (heartLims[r]) {
          var leftLim = heartLims[r][0];
          var rightLim = heartLims[r][1];
          inactive = c < leftLim || c > rows - leftLim;
          inactive = inactive || (c > rightLim && c < rows - rightLim);
        }
        mines[r][c] = {
          nearbyMines: 0,
          revealed: false,
          inactive: inactive,
          isMine: false
        };
      }
    }
    return mines;
  },

  handleButtonClick: function() {
    clearInterval(this.interval);
    this.replaceState(this.getInitialState());
  },

  render: function() {
    var gridProps = {
      rows: this.props.rows,
      cols: this.props.cols,
      mines: this.state.mines,
      mineCount: this.props.mineCount,
      gameState: this.state.gameState
    };
    var gridCallbacks = {
      onGameStart: this.handleGameStart,
      onRevealSpaces: this.handleRevealSpaces,
      onMineClick: this.handleMineClick
    };
    return (
      <div className="mineBoard unselectable">
        <div className="mineStatusBar">
          <Counter count={this.state.spaces} />
          <GameStateButton gameState={this.state.gameState} onButtonClick={this.handleButtonClick} />
          <Counter count={this.state.seconds} />
        </div>
        <MineGrid ref="mineGrid" {...gridProps} {...gridCallbacks} />
      </div>
    );
  }
});

var LevelButton = React.createClass({
  getInitialState: function() {
    return {pressed: this.props.initialPressed};
  },
  handleOnClick: function() {
    this.props.onSelect(this.props.level);
  },
  render: function() {
    return (
      <div className="levelButton" onClick={this.handleOnClick}>
        {this.props.level}
      </div>
    );
  }
});

var LevelSelector = React.createClass({
  getInitialState: function() {
    return {level: this.props.initialLevel};
  },
  handleOnSelect: function(level) {
    this.props.onLevelSelect(level);
  },
  render: function() {
    var data = this.props.data;
    var numLevels = data.length;
    var levelButtons = new Array(numLevels);
    for (var i = 0; i < numLevels; i++) {
      var selected = data[i] == this.state.level;
      levelButtons[i] = <LevelButton key={i} level={data[i]} initialPressed={selected} onSelect={this.handleOnSelect} />;
    }
    return (
      <div className="levelSelector">
        {levelButtons}
      </div>
    );
  },
});

var App = React.createClass({
  getInitialState: function() {
    return {
      level: 'S'
    };
  },
  getLevelBoard: function(level) {
    if (level == 'S') return SMALL_BOARD;
    if (level == 'M') return MEDIUM_BOARD;
    if (level == 'L') return LARGE_BOARD;
  },
  handleLevelSelect: function(level) {
    this.setState({level: level});
  },
  render: function() {
    var levels = ['S', 'M', 'L'];
    var levelBoard = this.getLevelBoard(this.state.level);
    return (
      <div className="app">
        <div className="menu">
          <LevelSelector data={levels} initialLevel={this.state.level} onLevelSelect={this.handleLevelSelect} />
        </div>
        <MineSweeper {...levelBoard}/>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
